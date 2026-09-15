import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Pending {
  rowId: string;
  message: string;
}

const AnnouncementPopup: React.FC = () => {
  const { user, profile } = useAuth();
  const [pending, setPending] = useState<Pending | null>(null);
  const [dismissing, setDismissing] = useState(false);

  const name = profile?.full_name?.trim() || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    if (!user?.id) {
      setPending(null);
      return;
    }
    let cancelled = false;

    const load = async () => {
      // Track activity so "inactive users" targeting stays accurate.
      supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .then(() => {}, () => {});

      const { data, error } = await supabase
        .from('announcement_recipients')
        .select('id, announcement:announcements(message, created_at)')
        .eq('user_id', user.id)
        .is('seen_at', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (cancelled || error || !data?.length) return;
      const row: any = data[0];
      if (!row.announcement?.message) return;
      setPending({ rowId: row.id, message: row.announcement.message });
    };

    // Keep it off the critical render path so app loading is unaffected.
    const timer = window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [user?.id]);

  if (!pending) return null;

  const text = pending.message.replace(/\{username\}/gi, name);

  const handleDismiss = async () => {
    setDismissing(true);
    await supabase
      .from('announcement_recipients')
      .update({ seen_at: new Date().toISOString() })
      .eq('id', pending.rowId);
    setPending(null);
    setDismissing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-primary/30 bg-card p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Megaphone className="h-5 w-5" />
          </span>
          <h2 className="text-lg font-semibold text-foreground">Announcement</h2>
        </div>
        <p className="mt-4 max-h-[45vh] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
        <Button className="mt-5 w-full" onClick={handleDismiss} disabled={dismissing}>
          {dismissing ? 'Saving…' : 'Got it'}
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementPopup;
