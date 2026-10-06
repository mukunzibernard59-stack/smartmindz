/** Routes that are genuine publisher/editorial content (ads allowed, no popups). */
export const CONTENT_ROUTE_PATTERNS = [
  /^\/$/,
  /^\/about$/,
  /^\/faq$/,
  /^\/how-to$/,
  /^\/blog$/,
  /^\/blog\/[^/]+$/,
  /^\/guides$/,
  /^\/guides\/[^/]+$/,
];

export const isContentRoute = (path: string) =>
  CONTENT_ROUTE_PATTERNS.some((r) => r.test(path));
