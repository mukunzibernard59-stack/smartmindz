import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import LoginModal from './LoginModal';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupMode, setSignupMode] = useState(false);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/quiz', label: t('nav.quiz') },
    { to: '/pricing', label: t('nav.pricing') },
  ];

  const openLogin = () => {
    setSignupMode(false);
    setLoginModalOpen(true);
  };

  const openSignup = () => {
    setSignupMode(true);
    setLoginModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                Smart<span className="text-primary">Mind</span>
              </span>
            </Link>

            {/* Desktop Navigation - Tab Style */}
            <div className="hidden md:flex items-center bg-secondary/50 rounded-full p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'text-primary-foreground bg-primary shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <Button variant="ghost" size="sm" onClick={openLogin}>
                {t('nav.login')}
              </Button>
              <Button variant="hero" size="sm" className="gap-2" onClick={openSignup}>
                <Sparkles className="h-4 w-4" />
                {t('nav.signup')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      location.pathname === link.to
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 mt-4 px-4">
                  <Button variant="outline" className="flex-1" onClick={openLogin}>
                    {t('nav.login')}
                  </Button>
                  <Button variant="hero" className="flex-1 gap-2" onClick={openSignup}>
                    <Sparkles className="h-4 w-4" />
                    {t('nav.signup')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        defaultTab={signupMode ? 'signup' : 'login'}
      />
    </>
  );
};

export default Navbar;
