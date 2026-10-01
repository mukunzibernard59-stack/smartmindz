import React, { useState } from 'react';
import { getAdConsent, setAdConsent } from '@/lib/consent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Consent banner for advertising cookies (EEA, UK, Switzerland).
 * Shown once until the visitor chooses Accept or Reject. "Manage" explains
 * what each choice means. Ads never load before a choice is made.
 */
const ConsentBanner: React.FC = () => {
  const [consent, setConsent] = useState(getAdConsent());
  const [manageOpen, setManageOpen] = useState(false);

  if (consent) return null;

  const choose = (value: 'accepted' | 'rejected') => {
    setAdConsent(value);
    setConsent(value);
    setManageOpen(false);
  };

  return (
    <>
      <div
        role="region"
        aria-label="Cookie consent"
        className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur px-4 py-4 sm:px-6"
      >
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-muted-foreground flex-1">
            We use cookies to keep SmartMind free by showing ads, and to understand how the
            app is used. You can accept or reject advertising cookies — the app works the
            same either way. See our{' '}
            <a href="/privacy" className="underline text-foreground">Privacy Policy</a>.
          </p>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => setManageOpen(true)}>
              Manage
            </Button>
            <Button size="sm" variant="outline" onClick={() => choose('rejected')}>
              Reject
            </Button>
            <Button size="sm" onClick={() => choose('accepted')}>
              Accept
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy choices</DialogTitle>
            <DialogDescription>
              Choose how your data is used on SmartMind.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Advertising cookies</p>
              <p>
                If you accept, Google AdSense may use cookies to show and measure ads.
                If you reject, no advertising cookies are set and ads may not appear.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Analytics</p>
              <p>
                We use privacy-respecting analytics to count visits and improve the app.
                No personal profiles are built.
              </p>
            </div>
            <p>
              You can change your choice any time by clearing this site's data in your
              browser. Full details are in the{' '}
              <a href="/privacy" className="underline text-foreground">Privacy Policy</a>.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => choose('rejected')}>Reject all</Button>
              <Button onClick={() => choose('accepted')}>Accept all</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsentBanner;
