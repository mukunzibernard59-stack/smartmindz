import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Lock, User, BookOpen, Loader2, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailValid = EMAIL_REGEX.test(email);
  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  }), [password]);
  const passwordValid = passwordChecks.length && passwordChecks.uppercase && passwordChecks.number;
  const nameValid = name.trim().length >= 2;
  const confirmValid = password === confirmPassword && confirmPassword.length > 0;

  const formValid = isLogin
    ? emailValid && password.length >= 6
    : emailValid && passwordValid && nameValid && confirmValid;

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
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
        navigate('/home', { replace: true });
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error.message.includes('already registered') ? 'This email is already registered.' : error.message);
          return;
        }
        toast.success('Account created! Welcome to Smart Mind.');
        navigate('/home', { replace: true });
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const ValidationIcon = ({ valid, show }: { valid: boolean; show: boolean }) => {
    if (!show) return null;
    return valid ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md overflow-hidden border-border/50 shadow-2xl">
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">Smart Mind</span>
          </div>
          <h1 className="text-2xl font-bold">{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {isLogin ? 'Sign in to continue your learning journey' : 'Start your AI-powered learning adventure'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {!isLogin && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} onBlur={() => handleBlur('name')} className="pl-10 pr-8" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={nameValid} show={touched.name} /></div>
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
            {touched.email && email.length > 0 && !emailValid && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Enter a valid email</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onBlur={() => handleBlur('password')} className="pl-10 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
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

          {!isLogin && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onBlur={() => handleBlur('confirmPassword')} className="pl-10 pr-8" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2"><ValidationIcon valid={confirmValid} show={touched.confirmPassword && confirmPassword.length > 0} /></div>
              </div>
              {touched.confirmPassword && confirmPassword.length > 0 && !confirmValid && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />Passwords do not match</p>}
            </div>
          )}

          <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Please wait...</> : isLogin ? 'Log In' : 'Sign Up'}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => { setIsLogin(!isLogin); setTouched({}); }} className="text-primary font-medium hover:underline">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
