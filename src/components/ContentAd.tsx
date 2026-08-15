import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ContentAd — policy-safe AdSense unit.
 *
 * Google's "Google-served ads on screens without publisher-content" policy means an ad
 * must never render on a screen that lacks substantial publisher content (tool screens,
 * loading states, auth, admin, offline, empty results, behind-app shells).
 *
 * This component therefore refuses to render unless ALL of these hold:
 *  1. The current route is an editorial/content route (allowlist below).
 *  2. The page actually contains a meaningful amount of rendered text.
 *  3. The viewport is wide/tall enough for content + ad to coexist.
 *
 * If any check fails the component renders nothing at all — no empty <ins>, no
 * ad request, no reserved space.
 */
interface ContentAdProps {
  slot?: string;
  className?: string;
}

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

/** Routes that are genuine publisher content (articles, guides, editorial pages). */
const CONTENT_ROUTES = [/^\/$/, /^\/about$/, /^\/faq$/, /^\/how-to$/, /^\/blog$/, /^\/blog\/[^/]+$/];

/** Minimum rendered characters of publisher text required before any ad request. */
const MIN_TEXT_CHARS = 1200;
const MIN_VIEWPORT_WIDTH = 360;

const isContentRoute = (path: string) => CONTENT_ROUTES.some((r) => r.test(path));

const countPageText = () => {
  const main = document.querySelector('main') ?? document.body;
  if (!main) return 0;
  return (main.innerText || '').replace(/\s+/g, ' ').trim().length;
};

const ContentAd: React.FC<ContentAdProps> = ({ slot = '8240576962', className = '' }) => {
  const { pathname } = useLocation();
  const [eligible, setEligible] = useState(false);
  const pushed = useRef(false);

  // Re-evaluate eligibility whenever the route changes; content may still be mounting.
  useEffect(() => {
    setEligible(false);
    pushed.current = false;

    if (!isContentRoute(pathname)) return;
    if (typeof window === 'undefined') return;
    if (window.innerWidth < MIN_VIEWPORT_WIDTH) return;
    if (!navigator.onLine) return;

    let attempts = 0;
    const check = () => {
      attempts += 1;
      if (countPageText() >= MIN_TEXT_CHARS) {
        setEligible(true);
        return;
      }
      if (attempts < 12) timer = window.setTimeout(check, 400);
    };
    let timer = window.setTimeout(check, 300);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Only request an ad once the surrounding content is confirmed present.
  useEffect(() => {
    if (!eligible || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense script blocked or not loaded — leave the slot empty */
    }
  }, [eligible]);

  if (!eligible) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 w-full flex justify-center ${className}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: 100 }}
        data-ad-client="ca-pub-4985844054229933"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

export default ContentAd;
