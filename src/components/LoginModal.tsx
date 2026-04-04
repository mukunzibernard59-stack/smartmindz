import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock, User, BookOpen, Loader2, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { lovable } from '@/integrations/lovable/index';

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'login' | 'signup';
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LoginModal: React.FC<LoginModalProps> = ({ open, onOpenChange, defaultTab = 'login' }) => {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultTab === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation
  const emailValid = EMAIL_REGEX.test(email);
  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  }), [password]);
  const passwordValid = passwordChecks.length && passwordChecks.uppercase && passwordChecks.number;
  const nameValid = name.trim().length >= 2;

  const formValid = isLogin
    ? emailValid && password.length >= 6
    : emailValid && passwordValid && nameValid;

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error('Google sign-in failed. Please try again.');
        return;
      }
      if (result.redirected) return;
      toast.success('Welcome!');
      onOpenChange(false);
    } catch {
      toast.error('Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      setTouched({ email: true, password: true, name: true });
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message.includes('Invalid login credentials') ? 'Invalid email or password' : error.message);
          return;
        }
        toast.success('Welcome back!');
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error.message.includes('already registered') ? 'This email is already registered.' : error.message);
          return;
        }
        toast.success('Account created! Check your email to verify.');
      }
      onOpenChange(false);
      setEmail(''); setPassword(''); setName(''); setTouched({});
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const ValidationIcon = ({ valid, show }: { valid: boolean; show: boolean }) => {
    if (!show) return null;
    return valid
      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
      : <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border/50">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">Smart Mind</span>
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary-foreground">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {isLogin ? 'Sign in to continue your learning journey' : 'Start your AI-powered learning adventure'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Google Sign-In */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 h-11 border-border/50 hover:bg-secondary/50"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
          >
            {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-primary" />}
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or continue with email</span></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} onBlur={() => handleBlur('name')} className="pl-10 pr-8" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={nameValid} show={touched.name && !isLogin} /></div>
                </div>
                {touched.name && !nameValid && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Name must be at least 2 characters</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => handleBlur('email')} className="pl-10 pr-8" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={emailValid} show={touched.email && email.length > 0} /></div>
              </div>
              {touched.email && email.length > 0 && !emailValid && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Enter a valid email (e.g. user@example.com)</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onBlur={() => handleBlur('password')} className="pl-10 pr-16" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground p-0.5">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {!isLogin && touched.password && password.length > 0 && (
                <div className="space-y-1 mt-1">
                  {[
                    { check: passwordChecks.length, label: 'At least 8 characters' },
                    { check: passwordChecks.uppercase, label: 'One uppercase letter' },
                    { check: passwordChecks.number, label: 'One number' },
                  ].map(rule => (
                    <p key={rule.label} className={`text-xs flex items-center gap-1 ${rule.check ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {rule.check ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {rule.label}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs text-primary hover:underline" onClick={() => toast.info('Password reset feature coming soon!')}>
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading || !formValid}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Please wait...</> : <>{isLogin ? 'Sign In' : 'Create Account'}</>}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setTouched({}); }} className="text-primary font-medium hover:underline">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
