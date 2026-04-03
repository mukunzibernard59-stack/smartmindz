import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Copy, Download, Loader2, PenLine, Check, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LetterData {
  senderName: string;
  senderAddress: string;
  date: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  greeting: string;
  body: string[];
  closing: string;
  signatureName: string;
}

const LETTER_TYPES = [
  'Job Application', 'Formal Request', 'Complaint Letter', 'Business Proposal',
  'Cover Letter', 'Resignation Letter', 'Recommendation Letter', 'Thank You Letter',
  'Apology Letter', 'Permission Letter', 'Inquiry Letter', 'Custom',
];

const DesignLetters: React.FC = () => {
  const { toast } = useToast();
  const letterRef = useRef<HTMLDivElement>(null);

  const [letterType, setLetterType] = useState('');
  const [details, setDetails] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [subject, setSubject] = useState('');

  const [letter, setLetter] = useState<LetterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState<LetterData | null>(null);
  const [copied, setCopied] = useState(false);

  const currentLetter = editing ? editedLetter : letter;

  const generateLetter = async () => {
    if (!letterType || !details.trim()) {
      toast({ title: 'Missing info', description: 'Please select a letter type and provide details.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Sign in required', description: 'Please sign in to generate letters.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const response = await supabase.functions.invoke('generate-letter', {
        body: { letterType, details, senderName, senderAddress, recipientName, recipientAddress, subject },
      });
      if (response.error) throw new Error(response.error.message);
      const letterData = response.data.letter as LetterData;
      setLetter(letterData);
      setEditedLetter({ ...letterData });
      setEditing(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to generate letter.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getLetterText = (): string => {
    const l = currentLetter;
    if (!l) return '';
    return [l.senderName, l.senderAddress, '', l.date, '', l.recipientName, l.recipientAddress, '', `Subject: ${l.subject}`, '', l.greeting, '', ...l.body.map(p => p + '\n'), l.closing, l.signatureName].join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getLetterText());
      setCopied(true);
      toast({ title: 'Copied!', description: 'Letter copied to clipboard.' });
      setTimeout(() => setCopied(false), 2000);
    } catch { toast({ title: 'Error', description: 'Failed to copy.', variant: 'destructive' }); }
  };

  const handleDownloadPDF = () => {
    const l = currentLetter;
    if (!l) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast({ title: 'Error', description: 'Please allow popups to download PDF.', variant: 'destructive' }); return; }
    const bodyParagraphs = l.body.map(p => `<p style="margin:0 0 14px 0;line-height:1.7;">${p}</p>`).join('');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${l.subject}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');
@page { size: A4; margin: 25mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Crimson Text', 'Times New Roman', serif; font-size: 12pt; color: #1a1a1a; line-height: 1.6; }
.letter { max-width: 210mm; margin: 0 auto; }
.sender { margin-bottom: 24px; }
.sender-name { font-weight: 700; font-size: 14pt; }
.date { margin-bottom: 24px; }
.recipient { margin-bottom: 24px; }
.subject { font-weight: 700; margin-bottom: 20px; }
.greeting { margin-bottom: 16px; }
.body { margin-bottom: 24px; }
.closing { margin-bottom: 40px; }
.signature { font-weight: 600; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<div class="letter">
  <div class="sender"><div class="sender-name">${l.senderName}</div><div>${l.senderAddress.replace(/\n/g, '<br>')}</div></div>
  <div class="date">${l.date}</div>
  <div class="recipient"><div style="font-weight:600">${l.recipientName}</div><div>${l.recipientAddress.replace(/\n/g, '<br>')}</div></div>
  <div class="subject">Subject: ${l.subject}</div>
  <div class="greeting">${l.greeting}</div>
  <div class="body">${bodyParagraphs}</div>
  <div class="closing">${l.closing}</div>
  <div class="signature">${l.signatureName}</div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\/script>
</body></html>`);
    printWindow.document.close();
  };

  const handleEditField = (field: keyof LetterData, value: string | string[]) => {
    if (!editedLetter) return;
    setEditedLetter({ ...editedLetter, [field]: value });
  };

  // Editable field component
  const EditableField = ({ value, field, className = '', multiline = false }: { value: string; field: keyof LetterData; className?: string; multiline?: boolean }) => {
    if (!editing) return <span>{value}</span>;
    if (multiline) return (
      <textarea
        value={(editedLetter as any)?.[field] || ''}
        onChange={e => handleEditField(field, e.target.value)}
        className={`w-full bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y ${className}`}
        style={{ fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
      />
    );
    return (
      <input
        value={(editedLetter as any)?.[field] || ''}
        onChange={e => handleEditField(field, e.target.value)}
        className={`w-full bg-primary/5 border border-primary/20 rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
        style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-10 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Design Letters
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Create professional letters instantly</p>
            </div>
          </div>

          {/* Form */}
          {!letter && (
            <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Letter Type *</label>
                  <Select value={letterType} onValueChange={setLetterType}>
                    <SelectTrigger><SelectValue placeholder="Select letter type" /></SelectTrigger>
                    <SelectContent>{LETTER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Subject (optional)</label>
                  <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Letter subject" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Name</label>
                  <Input value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Your Address</label>
                  <Input value={senderAddress} onChange={e => setSenderAddress(e.target.value)} placeholder="123 Main St, City" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Recipient Name</label>
                  <Input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Jane Smith" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Recipient Address</label>
                  <Input value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} placeholder="456 Corp Ave, City" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Details / Purpose *</label>
                <Textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe what the letter is about..." className="min-h-[100px]" />
              </div>
              <Button onClick={generateLetter} disabled={loading} variant="hero" size="lg" className="w-full gap-2">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</> : <><ArrowRight className="h-5 w-5" /> Generate Letter</>}
              </Button>
            </div>
          )}

          {/* Generated Letter */}
          {currentLetter && (
            <div className="space-y-4">
              {/* Action bar */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button onClick={() => { setLetter(null); setEditedLetter(null); setEditing(false); }} variant="outline" size="sm" className="gap-1.5">
                  <FileText className="h-4 w-4" /> New
                </Button>
                <Button onClick={() => setEditing(!editing)} variant={editing ? 'default' : 'secondary'} size="sm" className="gap-1.5">
                  <PenLine className="h-4 w-4" /> {editing ? 'Done' : 'Edit'}
                </Button>
                <Button onClick={handleCopy} variant="secondary" size="sm" className="gap-1.5">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button onClick={handleDownloadPDF} variant="hero" size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" /> PDF
                </Button>
              </div>

              {/* A4 Paper */}
              <div className="flex justify-center overflow-x-auto">
                <div
                  ref={letterRef}
                  className="w-full max-w-[210mm] bg-white rounded-xl shadow-[0_4px_40px_rgba(0,0,0,0.15)] overflow-hidden"
                  style={{
                    minHeight: 'min(297mm, 80vh)',
                    padding: 'clamp(16px, 5vw, 25mm)',
                    fontFamily: "'Crimson Text', 'Times New Roman', serif",
                    fontSize: 'clamp(11px, 2.5vw, 12pt)',
                    lineHeight: '1.7',
                    color: '#1a1a1a',
                  }}
                >
                  {/* Sender */}
                  <div style={{ marginBottom: '20px' }}>
                    {editing ? (
                      <div className="space-y-1">
                        <EditableField value={currentLetter.senderName} field="senderName" className="font-bold text-lg" />
                        <EditableField value={currentLetter.senderAddress} field="senderAddress" />
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 700, fontSize: '1.15em' }}>{currentLetter.senderName}</div>
                        <div>{currentLetter.senderAddress}</div>
                      </>
                    )}
                  </div>

                  {/* Date */}
                  <div style={{ marginBottom: '20px' }}>
                    {editing ? <EditableField value={currentLetter.date} field="date" /> : currentLetter.date}
                  </div>

                  {/* Recipient */}
                  <div style={{ marginBottom: '20px' }}>
                    {editing ? (
                      <div className="space-y-1">
                        <EditableField value={currentLetter.recipientName} field="recipientName" className="font-semibold" />
                        <EditableField value={currentLetter.recipientAddress} field="recipientAddress" />
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 600 }}>{currentLetter.recipientName}</div>
                        <div>{currentLetter.recipientAddress}</div>
                      </>
                    )}
                  </div>

                  {/* Subject */}
                  <div style={{ fontWeight: 700, marginBottom: '18px' }}>
                    {editing ? <EditableField value={currentLetter.subject} field="subject" className="font-bold" /> : `Subject: ${currentLetter.subject}`}
                  </div>

                  {/* Greeting */}
                  <div style={{ marginBottom: '14px' }}>
                    {editing ? <EditableField value={currentLetter.greeting} field="greeting" /> : currentLetter.greeting}
                  </div>

                  {/* Body */}
                  <div style={{ marginBottom: '22px' }}>
                    {editing ? (
                      <div className="space-y-2">
                        {(editedLetter?.body || []).map((para, i) => (
                          <textarea
                            key={i}
                            value={para}
                            onChange={e => {
                              const newBody = [...(editedLetter?.body || [])];
                              newBody[i] = e.target.value;
                              handleEditField('body', newBody);
                            }}
                            className="w-full min-h-[70px] bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-[#1a1a1a] resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                            style={{ fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
                          />
                        ))}
                      </div>
                    ) : (
                      currentLetter.body.map((para, i) => <p key={i} style={{ marginBottom: '12px' }}>{para}</p>)
                    )}
                  </div>

                  {/* Closing */}
                  <div style={{ marginBottom: '36px' }}>
                    {editing ? <EditableField value={currentLetter.closing} field="closing" /> : currentLetter.closing}
                  </div>

                  {/* Signature */}
                  <div style={{ fontWeight: 600 }}>
                    {editing ? <EditableField value={currentLetter.signatureName} field="signatureName" className="font-semibold" /> : currentLetter.signatureName}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DesignLetters;
