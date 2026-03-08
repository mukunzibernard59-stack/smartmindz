import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, X, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppRating } from '@/hooks/useAppRating';
import { toast } from 'sonner';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.lovable.eebaf703d71f4cf9913725fe26e56357';
const FEEDBACK_EMAIL = 'mukunzibernard59@gmail.com';

type Step = 'ask' | 'rate' | 'feedback' | 'hidden';

const AppRatingBanner: React.FC = () => {
  const { shouldShow, markRated, markDismissed, markFeedbackSent } = useAppRating();
  const [step, setStep] = useState<Step>('ask');
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  if (!shouldShow || step === 'hidden') return null;

  const close = (action: () => void) => {
    setAnimateOut(true);
    setTimeout(() => {
      action();
      setStep('hidden');
    }, 300);
  };

  const handleYes = () => setStep('rate');
  const handleNo = () => setStep('feedback');

  const handleRate = () => {
    window.open(PLAY_STORE_URL, '_blank');
    close(markRated);
    toast.success('Thank you for rating us! ⭐');
  };

  const handleLater = () => close(markDismissed);

  const handleSendFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    setSending(true);

    const device = navigator.userAgent;
    const time = new Date().toISOString();
    const subject = encodeURIComponent('App Feedback - SmartMind');
    const body = encodeURIComponent(
      `User Feedback:\n"${feedback.trim()}"\n\nTime: ${time}\nDevice: ${device}`
    );

    window.open(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`, '_blank');

    setSending(false);
    close(markFeedbackSent);
    toast.success('Thank you for your feedback! 💙');
  };

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ${
      animateOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 animate-fade-in'
    }`}>
      <div className="bg-card border border-border rounded-2xl shadow-xl p-4 relative">
        {/* Close / Later */}
        <button
          onClick={handleLater}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          title="Ask me later"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step 1: Ask */}
        {step === 'ask' && (
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="font-semibold text-sm">Are you enjoying this app?</p>
            <div className="flex justify-center gap-3">
              <Button size="sm" variant="default" className="gap-1.5" onClick={handleYes}>
                <ThumbsUp className="h-3.5 w-3.5" /> Yes
              </Button>
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleNo}>
                <ThumbsDown className="h-3.5 w-3.5" /> Not really
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Rate */}
        {step === 'rate' && (
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="font-semibold text-sm">Great! Please rate us on the Play Store</p>
            <Button size="sm" className="gap-1.5" onClick={handleRate}>
              <ExternalLink className="h-3.5 w-3.5" /> Rate Now
            </Button>
          </div>
        )}

        {/* Step 3: Feedback */}
        {step === 'feedback' && (
          <div className="space-y-3">
            <p className="font-semibold text-sm text-center">💬 We're sorry to hear that</p>
            <p className="text-xs text-muted-foreground text-center">Tell us what we can improve:</p>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Your feedback helps us improve..."
              className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={500}
            />
            <Button
              size="sm"
              className="w-full gap-1.5"
              onClick={handleSendFeedback}
              disabled={sending || !feedback.trim()}
            >
              <Send className="h-3.5 w-3.5" /> Send Feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppRatingBanner;
