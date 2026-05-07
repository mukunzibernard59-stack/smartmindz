import React, { useMemo, useState } from 'react';
import { Sparkles, Printer, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';

/* -----------------------------------------------------------
 * Smart Template Engine — replaces AI generation.
 * Predefined professional templates + variable substitution.
 * --------------------------------------------------------- */

type Category = 'job' | 'email' | 'blog' | 'caption' | 'cv';
type Style = 'Professional' | 'Friendly' | 'Persuasive' | 'Concise' | 'Inspirational';

interface Template {
  id: string;
  category: Category;
  label: string;
  fields: { key: string; label: string; placeholder?: string; multiline?: boolean }[];
  build: (v: Record<string, string>, style: Style) => string;
}

const intro = (style: Style, who: string) => {
  switch (style) {
    case 'Friendly': return `Hi ${who || 'there'},\n\nHope you're doing well!`;
    case 'Persuasive': return `Dear ${who || 'Sir/Madam'},\n\nI'm writing because I believe this is an opportunity worth your attention.`;
    case 'Concise': return `Dear ${who || 'Sir/Madam'},`;
    case 'Inspirational': return `Dear ${who || 'Friend'},\n\nEvery great journey begins with a single step.`;
    default: return `Dear ${who || 'Sir/Madam'},\n\nI hope this message finds you well.`;
  }
};

const closing = (style: Style, name: string) => {
  const sign = name || 'Your Name';
  switch (style) {
    case 'Friendly': return `\nThanks so much,\n${sign}`;
    case 'Persuasive': return `\nLooking forward to your positive response.\n\nSincerely,\n${sign}`;
    case 'Concise': return `\nRegards,\n${sign}`;
    case 'Inspirational': return `\nWith gratitude,\n${sign}`;
    default: return `\nKind regards,\n${sign}`;
  }
};

const TEMPLATES: Template[] = [
  {
    id: 'job-application',
    category: 'job',
    label: 'Job Application Letter',
    fields: [
      { key: 'name', label: 'Your full name' },
      { key: 'role', label: 'Position you are applying for' },
      { key: 'company', label: 'Company name' },
      { key: 'recipient', label: 'Hiring manager (optional)' },
      { key: 'experience', label: 'Years of experience' },
      { key: 'skills', label: 'Top skills (comma separated)', multiline: true },
    ],
    build: (v, s) =>
`${intro(s, v.recipient)}

I am writing to formally apply for the ${v.role || '[position]'} role at ${v.company || '[company]'}. With ${v.experience || 'several'} years of professional experience and proven expertise in ${v.skills || '[your skills]'}, I am confident I can contribute meaningfully to your team.

Throughout my career I have focused on delivering measurable results, collaborating with cross-functional teams, and continuously improving my craft. I am particularly drawn to ${v.company || 'your company'} because of its reputation for excellence and innovation.

I would welcome the opportunity to discuss how my background aligns with your needs.
${closing(s, v.name)}`,
  },
  {
    id: 'cover-letter',
    category: 'job',
    label: 'Cover Letter',
    fields: [
      { key: 'name', label: 'Your name' },
      { key: 'role', label: 'Role title' },
      { key: 'company', label: 'Company' },
      { key: 'highlight', label: 'One key achievement', multiline: true },
    ],
    build: (v, s) =>
`${intro(s, '')}

I am excited to apply for the ${v.role || '[role]'} position at ${v.company || '[company]'}. ${v.highlight ? `A recent highlight from my career: ${v.highlight}.` : ''}

I believe my skills, drive, and commitment to quality make me a strong fit for this role.
${closing(s, v.name)}`,
  },
  {
    id: 'professional-email',
    category: 'email',
    label: 'Professional Email',
    fields: [
      { key: 'recipient', label: 'Recipient name' },
      { key: 'subject', label: 'Subject / purpose' },
      { key: 'message', label: 'Main message', multiline: true },
      { key: 'name', label: 'Your name' },
    ],
    build: (v, s) =>
`Subject: ${v.subject || '[subject]'}

${intro(s, v.recipient)}

${v.message || '[your message]'}

Please let me know if you need any additional information.
${closing(s, v.name)}`,
  },
  {
    id: 'follow-up-email',
    category: 'email',
    label: 'Follow-up Email',
    fields: [
      { key: 'recipient', label: 'Recipient name' },
      { key: 'topic', label: 'What you are following up on' },
      { key: 'name', label: 'Your name' },
    ],
    build: (v, s) =>
`Subject: Following up — ${v.topic || '[topic]'}

${intro(s, v.recipient)}

I'm following up on our previous discussion regarding ${v.topic || '[topic]'}. I wanted to check in and see if there's any update or anything you need from my side to move things forward.
${closing(s, v.name)}`,
  },
  {
    id: 'blog-outline',
    category: 'blog',
    label: 'Blog Post Outline',
    fields: [
      { key: 'title', label: 'Working title' },
      { key: 'audience', label: 'Target audience' },
      { key: 'points', label: 'Key points (one per line)', multiline: true },
    ],
    build: (v) => {
      const points = (v.points || '').split('\n').filter(Boolean);
      return `# ${v.title || '[Working Title]'}

Audience: ${v.audience || '[target audience]'}

1. Hook
   - Start with a relatable problem or surprising fact.
   - State who this article is for.

2. Introduction
   - Define the topic clearly.
   - Promise the value the reader will get.

3. Main Sections
${points.length ? points.map((p, i) => `   ${i + 1}. ${p}`).join('\n') : '   1. Point one\n   2. Point two\n   3. Point three'}

4. Practical Examples
   - Provide one real-world example for each main point.

5. Common Mistakes
   - List 3 pitfalls and how to avoid them.

6. Conclusion
   - Summarize the takeaways.
   - End with a clear call-to-action.

7. SEO Notes
   - Title under 60 chars.
   - Meta description under 160 chars.
   - Use the primary keyword in H1, intro, and conclusion.`;
    },
  },
  {
    id: 'social-caption',
    category: 'caption',
    label: 'Social Media Caption',
    fields: [
      { key: 'topic', label: 'What is the post about?' },
      { key: 'cta', label: 'Call to action' },
      { key: 'hashtags', label: 'Hashtags (comma separated)' },
    ],
    build: (v, s) => {
      const hooks: Record<Style, string> = {
        Professional: `${v.topic || '[topic]'} — here's what you need to know 👇`,
        Friendly: `Okay, real talk about ${v.topic || '[topic]'} ✨`,
        Persuasive: `Stop scrolling. ${v.topic || '[topic]'} could change your week.`,
        Concise: `${v.topic || '[topic]'}.`,
        Inspirational: `Today's reminder: ${v.topic || '[topic]'} 💫`,
      };
      const tags = (v.hashtags || '').split(',').map(t => t.trim()).filter(Boolean).map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ');
      return `${hooks[s]}\n\n${v.cta || 'Drop a comment and let me know what you think!'}\n\n${tags}`;
    },
  },
  {
    id: 'cv-summary',
    category: 'cv',
    label: 'CV / Resume Summary',
    fields: [
      { key: 'role', label: 'Your professional title' },
      { key: 'years', label: 'Years of experience' },
      { key: 'skills', label: 'Top 3 skills' },
      { key: 'goal', label: 'Career goal', multiline: true },
    ],
    build: (v) =>
`${v.role || '[Professional Title]'} with ${v.years || 'X'}+ years of experience specializing in ${v.skills || '[skills]'}. Proven track record of delivering high-quality results, collaborating with diverse teams, and adapting quickly to new challenges. ${v.goal ? `Currently focused on ${v.goal}.` : ''} Known for strong communication, ownership, and a continuous-learning mindset.`,
  },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'job', label: 'Job Letters' },
  { id: 'email', label: 'Emails' },
  { id: 'blog', label: 'Blog Outlines' },
  { id: 'caption', label: 'Captions' },
  { id: 'cv', label: 'CV Summaries' },
];

const AIWriter: React.FC = () => {
  const [category, setCategory] = useState<Category>('job');
  const [templateId, setTemplateId] = useState<string>(TEMPLATES[0].id);
  const [style, setStyle] = useState<Style>('Professional');
  const [vars, setVars] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const visibleTemplates = useMemo(() => TEMPLATES.filter(t => t.category === category), [category]);
  const template = useMemo(
    () => TEMPLATES.find(t => t.id === templateId) || visibleTemplates[0],
    [templateId, visibleTemplates],
  );

  // Output is generated instantly via the template engine — no API calls.
  const output = useMemo(() => (template ? template.build(vars, style) : ''), [template, vars, style]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error('Copy failed'); }
  };

  const downloadTxt = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${template?.id || 'document'}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const safe = output.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' } as any)[c]);
    w.document.write(`<html><head><title>${template?.label || 'Document'}</title>
      <style>body{font-family:Georgia,serif;color:#111;background:#fff;padding:48px;line-height:1.7;font-size:13pt;white-space:pre-wrap}@page{size:A4;margin:24mm}</style>
      </head><body>${safe}</body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <ToolPage
      title="AI Writer"
      description="Smart templates with instant generation — pick a category, fill the blanks, and copy or export."
      icon={<Sparkles className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3 bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div>
            <label className="text-xs text-muted-foreground">Category</label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c.id);
                    const first = TEMPLATES.find(t => t.category === c.id);
                    if (first) { setTemplateId(first.id); setVars({}); }
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    category === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-foreground/80 hover:text-foreground'
                  }`}
                >{c.label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Template</label>
              <select value={templateId} onChange={e => { setTemplateId(e.target.value); setVars({}); }}
                className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                {visibleTemplates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Style</label>
              <select value={style} onChange={e => setStyle(e.target.value as Style)}
                className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                {['Professional','Friendly','Persuasive','Concise','Inspirational'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {template?.fields.map(f => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground">{f.label}</label>
                {f.multiline ? (
                  <Textarea
                    value={vars[f.key] || ''}
                    onChange={e => setVars(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="mt-1 min-h-[80px]"
                  />
                ) : (
                  <Input
                    value={vars[f.key] || ''}
                    onChange={e => setVars(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="mt-1"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className="text-sm font-medium">Live preview</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadTxt} disabled={!output}>
                <Download className="h-4 w-4 mr-1" /> TXT
              </Button>
              <Button variant="outline" size="sm" onClick={printPdf} disabled={!output}>
                <Printer className="h-4 w-4 mr-1" /> PDF
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-[420px] bg-white text-zinc-900 rounded-xl p-6 sm:p-10 shadow-lg overflow-y-auto whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>
            {output}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default AIWriter;
