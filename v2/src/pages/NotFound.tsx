import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>Page not found — SmartMind</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="max-w-md text-center">
        <h1 className="mb-3 text-4xl font-bold">Page not found</h1>
        <p className="mb-6 text-muted-foreground">
          The page you asked for does not exist or has moved. Here are the places most people are
          looking for.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90">Home</Link>
          <Link to="/library" className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90">TVET Library</Link>
          <Link to="/blog" className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90">Blog</Link>
          <Link to="/how-to" className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90">How-To Guides</Link>
          <Link to="/contact" className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:opacity-90">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
