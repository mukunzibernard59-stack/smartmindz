import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * Interactive tool screens (chat, translator, editors, admin, library viewers) are
 * utilities, not publisher content. Indexing them triggers AdSense "Low value content"
 * reviews, so they are marked noindex,follow while remaining fully usable.
 */
// Public tool pages are indexable (they never show ads). Only private areas stay hidden.
const NOINDEX = [/^\/admin/, /^\/quiz/, /^\/chat/];

const RouteRobotsMeta: React.FC = () => {
  const { pathname } = useLocation();
  const noindex = NOINDEX.some((r) => r.test(pathname));
  if (!noindex) return null;
  return (
    <Helmet>
      <meta name="robots" content="noindex,follow" />
    </Helmet>
  );
};

export default RouteRobotsMeta;
