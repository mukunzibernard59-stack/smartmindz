import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

/**
 * Interactive tool screens (chat, translator, editors, admin, library viewers) are
 * utilities, not publisher content. Indexing them triggers AdSense "Low value content"
 * reviews, so they are marked noindex,follow while remaining fully usable.
 */
const NOINDEX = [
  /^\/learn/, /^\/quiz/, /^\/chat/, /^\/dev/, /^\/ai-detector/, /^\/generate-image/,
  /^\/translate/, /^\/youtube-tutor/, /^\/ai-homework-helper/, /^\/ai-writer/,
  /^\/build-app-prompt/, /^\/admin/,
];

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
