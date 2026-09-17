import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { enablePush, pushAlreadyGranted, pushDecisionMade } from '@/lib/push';

const DISMISS_KEY = 'push-prompt-dismissed';

const PushPermissionPrompt: React.FC = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!user) {
      setVisible(false);
      return;
    }
    if (localStorage.getItem(DISMISS_KEY) === '1') return;
    if (typeof Notification === 'undefined') return;

    if (pushAlreadyGranted()) {
      // Refresh the stored token silently for already-allowed devices.
      enablePush().catch(() => {});
      return;
    }
    if (pushDecisionMade()) return;

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [user]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const handleEnable = async () => {
    setWorking(true);
    try {
      const result = await enablePush();
      if (result.status === 'registered') {
        toast({ title: 'Notifications on', description: 'You will get updates even when the app is closed.' });
        dismiss();
        return;
      }
      const messages: Record<string, string> = {
        'open-in-new-tab': 'Please open the app in its own browser tab, then turn notifications on.',
        denied: 'Notifications are blocked. Allow them for this site in your browser settings.',
        unsupported: 'This browser cannot show notifications.',
        'not-configured': 'Notifications are not set up yet. Please try again later.',
      };
      toast({ title: 'Not turned on', description: messages[result.status], variant: 'destructive' });
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setWorking(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[90] w-[94vw] max-w-md -translate-x-1/2 rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-lg backdrop-blur">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 h-5 w-5 text-primary" />
        <div className="flex-1 space-y-3">
          <p className="text-sm text-foreground">
            Get notified about new notes and updates, even when Smartmindz is closed.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="hero" onClick={handleEnable} disabled={working}>
              {working ? 'Turning on…' : 'Turn on'}
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushPermissionPrompt;
