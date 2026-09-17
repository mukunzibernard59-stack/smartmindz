import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Megaphone, Send, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Audience = 'all' | 'new' | 'inactive';

const AUDIENCE_LABEL: Record<Audience, string> = {
  all: 'All Users',
  new: 'New Users (last 7 days)',
  inactive: 'Inactive Users (14+ days)',
};

interface Sent {
  id: string;
  message: string;
  audience: string;
  recipient_count: number;
  created_at: string;
}

const AnnouncementsAdmin: React.FC = () => {
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<Sent[]>([]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('id, message, audience, recipient_count, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    setHistory((data as Sent[]) || []);
  };

  useEffect(() => { loadHistory(); }, []);

  const insertPlaceholder = () => setMessage((prev) => `${prev}{username}`);

  const handleSend = async () => {
    if (!message.trim()) {
      toast({ title: 'Write a message first', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-announcement', {
        body: { message: message.trim(), audience },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({
        title: 'Announcement sent',
        description: `${data.recipients} people will see the popup · ${data.emailsSent} emails · ${data.pushSent ?? 0} phone notifications.`,
      });
      setMessage('');
      loadHistory();
    } catch (e: any) {
      toast({ title: 'Could not send', description: e.message || String(e), variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4 border-primary/20">
      <h2 className="font-semibold flex items-center gap-2">
        <Megaphone className="h-4 w-4" /> Announcements
      </h2>
      <p className="text-xs text-muted-foreground">
        Use <code>{'{username}'}</code> anywhere in the message — it becomes each person&apos;s name.
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={'Hi {username}, new TVET notes were just added to the library!'}
        className="w-full min-h-32 p-4 rounded-2xl border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <Button type="button" variant="outline" size="sm" onClick={insertPlaceholder}>
          Insert {'{username}'}
        </Button>
        <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
          <SelectTrigger className="sm:w-64"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">{AUDIENCE_LABEL.all}</SelectItem>
            <SelectItem value="new">{AUDIENCE_LABEL.new}</SelectItem>
            <SelectItem value="inactive">{AUDIENCE_LABEL.inactive}</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSend} disabled={sending} variant="hero" className="sm:ml-auto">
          {sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</> : <><Send className="h-4 w-4 mr-2" /> Send</>}
        </Button>
      </div>

      <div className="pt-2 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sent announcements</h3>
          <Button size="sm" variant="ghost" onClick={loadHistory}>
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
        </div>
        {history.length === 0 && <p className="text-sm text-muted-foreground">Nothing sent yet.</p>}
        {history.map((a) => (
          <div key={a.id} className="rounded-xl border border-border/50 p-3 text-xs space-y-1">
            <p className="whitespace-pre-wrap text-foreground break-words">{a.message}</p>
            <p className="text-muted-foreground">
              {AUDIENCE_LABEL[(a.audience as Audience)] || a.audience} · {a.recipient_count} recipients ·{' '}
              {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AnnouncementsAdmin;
