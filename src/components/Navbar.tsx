import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import LoginModal from './LoginModal';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, LogOut, MonitorDown, Code2, MessageSquare, Camera, Loader2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { user, profile, isAuthenticated, signOut, uploadAvatar, refreshProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupMode, setSignupMode] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { isInstallable, install } = usePWAInstall();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleInstall = async () => {
    const installed = await install();
    if (installed) {
      toast.success('App installed successfully!');
    }
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/dev', label: 'Dev Mode', icon: Code2 },
  ];

  const openLogin = () => { setSignupMode(false); setLoginModalOpen(true); };
  const openSignup = () => { setSignupMode(true); setLoginModalOpen(true); };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) { toast.error('Failed to sign out'); }
    else { toast.success('Signed out successfully'); }
  };

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setIsUploadingAvatar(true);
    try {
      const { error } = await uploadAvatar(file);
      if (error) { toast.error('Failed to upload photo'); }
      else { toast.success('Profile photo updated!'); refreshProfile(); }
    } catch { toast.error('Upload failed'); }
    finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  }, [uploadAvatar, refreshProfile]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo + sidebar trigger */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground hover:text-primary" />
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_-3px_hsl(187_85%_53%/0.5)] animate-glow-pulse">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Smart<span className="text-primary">Mind</span>
                </span>
              </Link>
            </div>

            {/* Top nav links removed — now in left sidebar */}
            <div className="hidden md:block" />

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {isInstallable && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleInstall} className="text-muted-foreground hover:text-primary">
                        <MonitorDown className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Install Smart Mind</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <LanguageSelector />
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10 border-2 border-primary/30">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(profile?.full_name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-strong bg-card" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => avatarInputRef.current?.click()} className="cursor-pointer" disabled={isUploadingAvatar}>
                      {isUploadingAvatar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                      <span>{isUploadingAvatar ? 'Uploading...' : 'Change Photo'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /><span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={openLogin} className="text-muted-foreground hover:text-foreground">
                    {t('nav.login')}
                  </Button>
                  <Button size="sm" onClick={openSignup} className="gradient-primary text-primary-foreground glow-cyan hover:scale-105 transition-transform">
                    {t('nav.signup')}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSelector />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      location.pathname === link.to
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-2 mt-4 px-4">
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/30">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(profile?.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile?.full_name || 'User'}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleSignOut}><LogOut className="h-5 w-5" /></Button>
                    </div>
                  ) : (
                    <>
                      <Button variant="outline" className="flex-1 border-primary/20" onClick={openLogin}>{t('nav.login')}</Button>
                      <Button className="flex-1 gradient-primary text-primary-foreground" onClick={openSignup}>{t('nav.signup')}</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Hidden file input for avatar upload */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />

      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen}
        defaultTab={signupMode ? 'signup' : 'login'}
      />
    </>
  );
};

export default Navbar;
