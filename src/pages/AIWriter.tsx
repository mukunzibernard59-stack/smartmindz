import React, { useMemo, useState } from 'react';
import { Sparkles, Copy, Check, Download, FileText, FileType2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import jsPDF from 'jspdf';
import SEO from '@/components/SEO';
import {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
} from 'docx';

/* -----------------------------------------------------------
 * Smart Template Engine — fully local, no AI calls.
 * Categories: Job Letters (full form), Emails, Blog, Captions, CV.
 * Exports: PDF (jsPDF), DOCX (docx), TXT, Copy, Print-friendly preview.
 * --------------------------------------------------------- */

type Category = 'job' | 'personal' | 'email' | 'blog' | 'caption' | 'cv';
type Style = 'Professional' | 'Modern' | 'Concise' | 'Persuasive' | 'Friendly';

interface FieldDef {
  key: string; label: string; placeholder?: string; multiline?: boolean; type?: 'date' | 'text' | 'tel' | 'email';
}
interface Template {
  id: string; category: Category; label: string; fields: FieldDef[];
  build: (v: Record<string, string>, style: Style) => { title: string; body: string; sender?: string };
}

const today = () => new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

/* ---------- Job Letter (full professional form) ---------- */
const JOB_FIELDS: FieldDef[] = [
  { key: 'fullName', label: 'Full name', placeholder: 'Jane Doe' },
  { key: 'email', label: 'Email', placeholder: 'jane@example.com', type: 'email' },
  { key: 'phone', label: 'Phone number', placeholder: '+1 555 010 1234', type: 'tel' },
  { key: 'location', label: 'Current location', placeholder: 'Kigali, Rwanda' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'company', label: 'Company name', placeholder: 'Acme Inc.' },
  { key: 'position', label: 'Job position', placeholder: 'Senior Frontend Engineer' },
  { key: 'experience', label: 'Experience (years / summary)', placeholder: '5 years building web apps' },
  { key: 'skills', label: 'Top skills (comma separated)', multiline: true, placeholder: 'React, TypeScript, UI design' },
];

const buildJobLetter = (v: Record<string, string>, style: Style) => {
  const date = v.date ? new Date(v.date).toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' }) : today();
  const skills = (v.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  const skillsLine = skills.length ? skills.join(', ') : 'a wide range of relevant skills';

  // Style-aware opening line
  const openings: Record<Style, string> = {
    Professional: `I am writing to formally express my interest in the ${v.position || '[position]'} role at ${v.company || '[company]'}.`,
    Modern: `I'd love to be considered for the ${v.position || '[position]'} opening at ${v.company || '[company]'}.`,
    Concise: `I am applying for the ${v.position || '[position]'} role at ${v.company || '[company]'}.`,
    Persuasive: `When I saw the ${v.position || '[position]'} opening at ${v.company || '[company]'}, I knew I had to apply.`,
    Friendly: `I'm excited to apply for the ${v.position || '[position]'} role at ${v.company || '[company]'}.`,
  };

  const body =
`${v.fullName || '[Your Name]'}
${v.location || '[Your Location]'}
${v.phone || '[Your Phone]'}
${v.email || '[Your Email]'}

${date}

Hiring Manager
${v.company || '[Company Name]'}

Subject: Application for the ${v.position || '[Position]'} Role

Dear Hiring Manager,

${openings[style]} With ${v.experience || 'solid hands-on experience'} and proven strengths in ${skillsLine}, I am confident I can make a meaningful contribution to your team from day one.

Throughout my career I have focused on delivering measurable results, collaborating effectively with cross-functional teams, and continuously sharpening my craft. I am particularly drawn to ${v.company || 'your company'} because of its reputation for excellence and the opportunity to work on impactful projects.

I would welcome the chance to discuss how my background in ${skillsLine} aligns with the goals of the ${v.position || 'role'} and your team. Thank you for considering my application — I have attached my resume for your review and look forward to hearing from you.

Sincerely,

${v.fullName || '[Your Name]'}`;

  return { title: `${v.fullName || 'Job'} – ${v.position || 'Application'}`, body, sender: v.fullName };
};

/* ---------- Friendly Letter (casual / personal) ---------- */
const FRIENDLY_FIELDS: FieldDef[] = [
  { key: 'senderName', label: 'Your name', placeholder: 'Alex' },
  { key: 'senderLocation', label: 'Your location', placeholder: 'Kigali, Rwanda' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'recipientName', label: 'Recipient name', placeholder: 'Sam' },
  { key: 'greeting', label: 'Greeting', placeholder: 'Hi Sam,' },
  { key: 'body', label: 'Message', multiline: true, placeholder: 'How are you doing? I wanted to share…' },
  { key: 'closing', label: 'Closing', placeholder: 'With love,' },
  { key: 'signature', label: 'Signature', placeholder: 'Alex' },
];

const buildFriendlyLetter = (v: Record<string, string>) => {
  const date = v.date
    ? new Date(v.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : today();
  const body =
`${v.senderName || '[Your Name]'}
${v.senderLocation || '[Your Location]'}

${date}

${v.greeting || `Dear ${v.recipientName || '[Friend]'},`}

${v.body || '[Write your warm, personal message here. Share what is happening in your life, ask about theirs, and add the small details that make a letter feel real.]'}

${v.closing || 'Warmly,'}
${v.signature || v.senderName || '[Your Name]'}`;
  return { title: `Letter to ${v.recipientName || 'Friend'}`, body, sender: v.senderName };
};

/* ---------- Other templates (kept simple/local) ---------- */
const TEMPLATES: Template[] = [
  { id: 'job-application', category: 'job', label: 'Job Application Letter', fields: JOB_FIELDS, build: buildJobLetter },
  { id: 'friendly-letter', category: 'personal', label: 'Friendly Letter', fields: FRIENDLY_FIELDS, build: (v) => buildFriendlyLetter(v) },
  {
    id: 'cover-letter', category: 'job', label: 'Short Cover Letter',
    fields: [
      { key: 'fullName', label: 'Your name' },
      { key: 'position', label: 'Role title' },
      { key: 'company', label: 'Company' },
      { key: 'highlight', label: 'One key achievement', multiline: true },
    ],
    build: (v) => ({
      title: `${v.fullName || 'Cover'} – ${v.position || 'Letter'}`,
      body:
`${today()}

Dear Hiring Manager,

I am excited to apply for the ${v.position || '[role]'} position at ${v.company || '[company]'}. ${v.highlight ? `A recent highlight from my career: ${v.highlight}.` : ''}

I believe my skills, drive and commitment to quality make me a strong fit for this role and would love the opportunity to discuss it further.

Sincerely,
${v.fullName || '[Your Name]'}`,
      sender: v.fullName,
    }),
  },
  {
    id: 'professional-email', category: 'email', label: 'Professional Email',
    fields: [
      { key: 'recipient', label: 'Recipient name' },
      { key: 'subject', label: 'Subject / purpose' },
      { key: 'message', label: 'Main message', multiline: true },
      { key: 'name', label: 'Your name' },
    ],
    build: (v) => ({
      title: v.subject || 'Email',
      body:
`Subject: ${v.subject || '[subject]'}

Dear ${v.recipient || 'Sir/Madam'},

${v.message || '[your message]'}

Please let me know if you need any additional information.

Kind regards,
${v.name || '[Your Name]'}`,
      sender: v.name,
    }),
  },
  {
    id: 'blog-outline', category: 'blog', label: 'Blog Post Outline',
    fields: [
      { key: 'title', label: 'Working title' },
      { key: 'audience', label: 'Target audience' },
      { key: 'points', label: 'Key points (one per line)', multiline: true },
    ],
    build: (v) => {
      const points = (v.points || '').split('\n').filter(Boolean);
      return {
        title: v.title || 'Blog Outline',
        body:
`${v.title || '[Working Title]'}

Audience: ${v.audience || '[target audience]'}

1. Hook — relatable problem or surprising fact.
2. Introduction — define topic, promise value.
3. Main Sections:
${points.length ? points.map((p, i) => `   ${i + 1}. ${p}`).join('\n') : '   1. Point one\n   2. Point two\n   3. Point three'}
4. Practical Examples for each main point.
5. Common Mistakes — list 3 and how to avoid them.
6. Conclusion + Call to Action.`,
      };
    },
  },
  {
    id: 'social-caption', category: 'caption', label: 'Social Media Caption',
    fields: [
      { key: 'topic', label: 'What is the post about?' },
      { key: 'cta', label: 'Call to action' },
      { key: 'hashtags', label: 'Hashtags (comma separated)' },
    ],
    build: (v) => {
      const tags = (v.hashtags || '').split(',').map(t => t.trim()).filter(Boolean)
        .map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ');
      return {
        title: 'Caption',
        body: `${v.topic || '[topic]'} — here's what you need to know 👇\n\n${v.cta || 'Drop a comment and let me know what you think!'}\n\n${tags}`,
      };
    },
  },
  {
    id: 'cv-summary', category: 'cv', label: 'CV / Resume Summary',
    fields: [
      { key: 'role', label: 'Your professional title' },
      { key: 'years', label: 'Years of experience' },
      { key: 'skills', label: 'Top 3 skills' },
      { key: 'goal', label: 'Career goal', multiline: true },
    ],
    build: (v) => ({
      title: 'CV Summary',
      body:
`${v.role || '[Professional Title]'} with ${v.years || 'X'}+ years of experience specializing in ${v.skills || '[skills]'}. Proven track record of delivering high-quality results and collaborating with diverse teams. ${v.goal ? `Currently focused on ${v.goal}.` : ''} Known for strong communication, ownership and a continuous-learning mindset.`,
    }),
  },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'job', label: 'Job Letters' },
  { id: 'personal', label: 'Friendly Letters' },
  { id: 'email', label: 'Emails' },
  { id: 'blog', label: 'Blog Outlines' },
  { id: 'caption', label: 'Captions' },
  { id: 'cv', label: 'CV Summaries' },
];

const STYLES: Style[] = ['Professional', 'Modern', 'Concise', 'Persuasive', 'Friendly'];

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

  // Instant local generation — no API calls.
  const generated = useMemo(() => (template ? template.build(vars, style) : { title: '', body: '' }), [template, vars, style]);
  const output = generated.body;
  const safeName = (generated.title || 'document').replace(/[^a-z0-9-]+/gi, '_').toLowerCase();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error('Copy failed'); }
  };

  const downloadTxt = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, `${safeName}.txt`);
  };

  // PDF export — A4, professional margins, Times font for letter feel.
  const downloadPdf = () => {
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const marginX = 22;
      const marginTop = 24;
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const usableW = pageW - marginX * 2;

      doc.setFont('times', 'normal');
      doc.setFontSize(12);

      const lines = doc.splitTextToSize(output, usableW) as string[];
      let y = marginTop;
      const lineHeight = 6;
      lines.forEach(line => {
        if (y > pageH - marginTop) { doc.addPage(); y = marginTop; }
        doc.text(line, marginX, y);
        y += lineHeight;
      });
      doc.save(`${safeName}.pdf`);
    } catch (e) {
      toast.error('PDF export failed');
    }
  };

  // DOCX export — clean A4 layout, Times-style heading + body.
  const downloadDocx = async () => {
    try {
      const paragraphs: Paragraph[] = output.split('\n').map(line =>
        new Paragraph({
          children: [new TextRun({ text: line || ' ', font: 'Times New Roman', size: 24 })],
          alignment: AlignmentType.LEFT,
          spacing: { after: 120 },
        })
      );

      const doc = new Document({
        styles: {
          default: { document: { run: { font: 'Times New Roman', size: 24 } } },
        },
        sections: [{
          properties: {
            page: {
              size: { width: 11906, height: 16838 }, // A4 in DXA
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      triggerDownload(blob, `${safeName}.docx`);
    } catch (e) {
      toast.error('DOCX export failed');
    }
  };

  return (
    <ToolPage
      title="AI Writer"
      description="Smart templates with instant generation — fill the blanks, preview, then copy or export to PDF, DOCX or TXT."
      icon={<Sparkles className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Form */}
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
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
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
                    type={f.type || 'text'}
                    value={vars[f.key] || ''}
                    onChange={e => setVars(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="mt-1"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview + actions */}
        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h3 className="text-sm font-medium">Live preview</h3>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadTxt} disabled={!output}>
                <Download className="h-4 w-4 mr-1" /> TXT
              </Button>
              <Button variant="outline" size="sm" onClick={downloadDocx} disabled={!output}>
                <FileType2 className="h-4 w-4 mr-1" /> DOCX
              </Button>
              <Button size="sm" onClick={downloadPdf} disabled={!output}>
                <FileText className="h-4 w-4 mr-1" /> PDF
              </Button>
            </div>
          </div>
          {/* A4-styled paper preview */}
          <div className="flex-1 min-h-[420px] bg-white text-zinc-900 rounded-xl p-8 sm:p-12 shadow-lg overflow-y-auto whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '13.5px' }}>
            {output}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export default AIWriter;
