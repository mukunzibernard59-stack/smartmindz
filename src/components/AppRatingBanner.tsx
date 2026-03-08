import React, { useState } from 'react';
import { Star, X, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppRating } from '@/hooks/useAppRating';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const AppRatingBanner: React.FC = () => {
  const { shouldShow, markRated, markDismissed } = useAppRating();
  const { profile, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  if (!shouldShow) return null;

  const close = (action: () => void) => {
    setAnimateOut(true);
    setTimeout(() => {
      action();
    }, 300);
  };


  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setSending(true);

    try {
      const userName = profile?.full_name || user?.email || 'Anonymous User';
      const device = navigator.userAgent;

      const { error } = await supabase.functions.invoke('submit-rating', {
        body: { rating, comment: comment.trim(), device, userName },
      });

      if (error) {
        console.error('Rating submit error:', error);
      }
    } catch (err) {
      console.error('Rating submit error:', err);
    }

    setSending(false);
    setSubmitted(true);
    
    // Auto close after showing confirmation
    setTimeout(() => {
      close(markRated);
    }, 2500);
  };

  const handleClose = () => close(markDismissed);

  // Submitted confirmation view
  if (submitted) {
    return (
      <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ${
        animateOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}>
        <div className="bg-card border border-border rounded-2xl shadow-xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
          </div>
          <p className="font-semibold text-foreground">Sent! Thank you for your feedback 💙</p>
          <p className="text-xs text-muted-foreground mt-1">Your rating helps us improve</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm transition-all duration-300 ${
      animateOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 animate-fade-in'
    }`}>
      <div className="bg-card border border-border rounded-2xl shadow-xl p-5 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex justify-center gap-0.5 mb-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </div>
          <h3 className="font-semibold text-foreground">Rate Your Experience</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Tap a star to rate the app</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Rating label */}
        {rating > 0 && (
          <p className="text-center text-sm text-muted-foreground mb-3">
            {rating === 1 && '😞 Poor'}
            {rating === 2 && '😕 Fair'}
            {rating === 3 && '😐 Good'}
            {rating === 4 && '😊 Great'}
            {rating === 5 && '🤩 Excellent!'}
          </p>
        )}

        {/* Comment */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1.5 block">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
            maxLength={500}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleSubmit}
            disabled={sending || rating === 0}
          >
            <Send className="h-3.5 w-3.5" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppRatingBanner;
