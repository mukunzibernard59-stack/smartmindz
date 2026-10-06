import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAdConsent, onAdConsentChange } from '@/lib/consent';
import { useAuth } from '@/hooks/useAuth';
import { useAdminStatus } from '@/hooks/useAdminStatus';

/**
 * ContentAd (AdSlot) — policy-safe AdSense unit.
 *
 * Renders only when ALL hold:
 *  1. Route is an editorial/content route (allowlist below).
 *  2. The page contains a meaningful amount of rendered text.
 *  3. The visitor has accepted advertising cookies (consent banner).
 *  4. The visitor is not the site admin (no ads while testing).
 *  5. Viewport is wide enough and the browser is online.
 *
 * One push per slot per route change, reserved min-height to avoid layout
 * shift, and a visible "Advertisement" label.
 */
interface ContentAdProps {
  slot?: string;
  className?: string;
}

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

import { isContentRoute } from '@/lib/contentRoutes';

/** Minimum rendered characters of publisher text required before any ad request. */
const MIN_TEXT_CHARS = 1200;
const MIN_VIEWPORT_WIDTH = 360;

const countPageText = () => {
  const main = document.querySelector('main') ?? document.body;
  if (!main) return 0;
  return (main.innerText || '').replace(/\s+/g, ' ').trim().length;
};

const ContentAd: React.FC<ContentAdProps> = ({ slot = '8240576962', className = '' }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { data: isAdmin = false } = useAdminStatus(user);
  const [eligible, setEligible] = useState(false);
  const [consent, setConsent] = useState(getAdConsent());
  const pushed = useRef(false);

  useEffect(() => onAdConsentChange(setConsent), []);

  // Re-evaluate eligibility whenever the route changes; content may still be mounting.
  useEffect(() => {
    setEligible(false);
    pushed.current = false;

    if (!isContentRoute(pathname)) return;
    if (consent !== 'accepted') return;
    if (isAdmin) return;
    if (typeof window === 'undefined') return;
    if (window.innerWidth < MIN_VIEWPORT_WIDTH) return;
    if (!navigator.onLine) return;

    let attempts = 0;
    let timer: number;
    const check = () => {
      attempts += 1;
      if (countPageText() >= MIN_TEXT_CHARS) {
        setEligible(true);
        return;
      }
      if (attempts < 12) timer = window.setTimeout(check, 400);
    };
    timer = window.setTimeout(check, 300);
    return () => window.clearTimeout(timer);
  }, [pathname, consent, isAdmin]);

  // Only load the AdSense library + request an ad once content is confirmed present.
  // Loading it lazily also prevents Auto ads from injecting units on tool/app screens.
  useEffect(() => {
    if (!eligible || pushed.current) return;
    pushed.current = true;

    const CLIENT = 'ca-pub-4985844054229933';
    const SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }
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
      className={`my-8 w-full flex flex-col items-center ${className}`}
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: 250 }}
        data-ad-client="ca-pub-4985844054229933"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

export default ContentAd;
