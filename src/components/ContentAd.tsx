import React, { useEffect, useRef } from 'react';

/**
 * ContentAd — AdSense unit that only renders when placed near real page content.
 * Never place this on empty tool screens, loading states, auth, admin, or offline pages.
 * The parent should have visible written content above/below.
 */
interface ContentAdProps {
  slot?: string;
  className?: string;
}

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

const ContentAd: React.FC<ContentAdProps> = ({ slot = '8240576962', className = '' }) => {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not loaded yet — will retry on next mount */
    }
  }, []);

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
