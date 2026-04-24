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

  const passwordStrength = [passwordChecks.length, passwordChecks.uppercase, passwordChecks.number].filter(Boolean).length;
  const strengthLabel = passwordStrength === 0 ? '' : passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Medium' : 'Strong';
  const strengthColor = passwordStrength <= 1 ? 'text-destructive' : passwordStrength === 2 ? 'text-yellow-500' : 'text-green-500';

  // Allow submission even with weak password — just warn
  const formValid = isLogin
    ? emailValid && password.length >= 6
    : emailValid && password.length >= 6 && nameValid;

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));


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
              {!isLogin && password.length > 0 && (
                <div className="space-y-1 mt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? (passwordStrength <= 1 ? 'bg-destructive' : passwordStrength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-muted'}`} />
                      ))}
                    </div>
                    <span className={`text-xs ml-2 font-medium ${strengthColor}`}>{strengthLabel}</span>
                  </div>
                  {passwordStrength < 3 && (
                    <p className="text-xs text-muted-foreground">
                      Tip: use 8+ characters, an uppercase letter, and a number for a stronger password (optional).
                    </p>
                  )}
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
