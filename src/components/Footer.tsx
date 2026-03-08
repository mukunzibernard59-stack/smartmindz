import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Instagram } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border/50">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.02] to-transparent" />
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_-3px_hsl(187_85%_53%/0.4)]">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Smart<span className="text-primary">Mind</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">Fast AI learning - direct answers for all subjects.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Subjects', 'Voice Mode', 'Mobile App'].map((item) => (
                <li key={item}><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                <li key={item}><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Help Center</a></li>
              <li><a href="mailto:mukunzibernard59@gmail.com" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Us</a></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">mukunzibernard59@gmail.com</p>
            <a
              href="https://instagram.com/m.berndev"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex"
            >
              <Badge variant="secondary" className="gap-1.5 hover:bg-secondary/80 transition-colors cursor-pointer">
                <Instagram className="h-3.5 w-3.5" />
                @m.berndev
              </Badge>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2025 Smart Mind. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">Available in:</span>
            <div className="flex gap-2">
              {['🇬🇧', '🇫🇷', '🇷🇼', '🇰🇪'].map((flag) => (
                <span key={flag} className="text-lg">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
