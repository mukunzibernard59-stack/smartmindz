import React, { useMemo, useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import SEO from '@/components/SEO';

/* -----------------------------------------------------------
 * App Planner — replaces AI prompt generator.
 * Deterministic logic that turns user inputs into a feature
 * checklist, page structure, schema suggestion, and roadmap.
 * --------------------------------------------------------- */

type AppType = 'SaaS' | 'Marketplace' | 'Social' | 'E-commerce' | 'Education' | 'Productivity';

interface Plan {
  features: string[];
  pages: string[];
  schema: { table: string; columns: string[] }[];
  roadmap: { phase: string; items: string[] }[];
}

const buildPlan = (input: {
  type: AppType; name: string; features: string;
  auth: boolean; payments: boolean; admin: boolean;
}): Plan => {
  const userFeatures = input.features.split(/[,\n]/).map(f => f.trim()).filter(Boolean);

  const features: string[] = ['Responsive UI', 'Dark mode', 'SEO meta tags'];
  if (input.auth) features.push('Email/Password auth', 'Google OAuth', 'Password reset', 'Profile management');
  if (input.payments) features.push('Subscription plans', 'Checkout flow', 'Receipts & invoices', 'Webhook handling');
  if (input.admin) features.push('Admin dashboard', 'User management', 'Analytics overview', 'Audit logs');
  features.push(...userFeatures);

  const pages: string[] = ['Landing / Home', 'About', 'Pricing', 'Contact'];
  if (input.auth) pages.push('Sign in', 'Sign up', 'Forgot password', 'Account settings');
  pages.push('Main app dashboard');
  if (input.admin) pages.push('Admin · Users', 'Admin · Analytics');
  if (input.payments) pages.push('Billing', 'Checkout success');
  pages.push('Privacy', 'Terms', '404');

  const schema: { table: string; columns: string[] }[] = [];
  if (input.auth) {
    schema.push(
      { table: 'profiles', columns: ['id (uuid pk)', 'user_id (uuid fk → auth.users)', 'display_name', 'avatar_url', 'created_at'] },
      { table: 'user_roles', columns: ['id (uuid pk)', 'user_id (uuid)', 'role (enum: admin, user)', 'created_at'] },
    );
  }
  // Per-app-type tables
  if (input.type === 'SaaS' || input.type === 'Productivity') {
    schema.push({ table: 'projects', columns: ['id (uuid pk)', 'owner_id (uuid)', 'name', 'description', 'created_at'] });
    schema.push({ table: 'tasks', columns: ['id (uuid pk)', 'project_id (uuid fk → projects)', 'title', 'status', 'due_date', 'created_at'] });
  }
  if (input.type === 'Marketplace' || input.type === 'E-commerce') {
    schema.push({ table: 'products', columns: ['id (uuid pk)', 'seller_id (uuid)', 'title', 'price_cents', 'currency', 'inventory', 'created_at'] });
    schema.push({ table: 'orders', columns: ['id (uuid pk)', 'buyer_id (uuid)', 'product_id (uuid fk → products)', 'amount_cents', 'status', 'created_at'] });
  }
  if (input.type === 'Social') {
    schema.push({ table: 'posts', columns: ['id (uuid pk)', 'author_id (uuid)', 'content', 'media_url', 'created_at'] });
    schema.push({ table: 'follows', columns: ['follower_id (uuid)', 'followee_id (uuid)', 'created_at'] });
  }
  if (input.type === 'Education') {
    schema.push({ table: 'courses', columns: ['id (uuid pk)', 'title', 'description', 'level', 'created_at'] });
    schema.push({ table: 'enrollments', columns: ['id (uuid pk)', 'user_id (uuid)', 'course_id (uuid)', 'progress', 'created_at'] });
  }
  if (input.payments) {
    schema.push({ table: 'subscriptions', columns: ['id (uuid pk)', 'user_id (uuid)', 'plan', 'status', 'current_period_end', 'created_at'] });
  }

  const roadmap = [
    { phase: 'Week 1 — Foundations', items: ['Set up repo, CI, design tokens', 'Build landing & marketing pages', 'Wire up routing and base layout'] },
    { phase: 'Week 2 — Core data', items: ['Create database schema & RLS', input.auth ? 'Implement authentication & profiles' : 'Skip auth (public-only app)', 'Seed demo data'] },
    { phase: 'Week 3 — Main features', items: [`Build core ${input.type.toLowerCase()} features`, 'Forms, validation, error handling', 'Empty states and loading skeletons'] },
    { phase: 'Week 4 — Extras', items: [
      input.payments ? 'Integrate payments & webhooks' : 'Add analytics tracking',
      input.admin ? 'Build admin dashboard' : 'Polish settings pages',
      'Mobile QA, lighthouse audit, accessibility pass',
    ] },
    { phase: 'Launch week', items: ['SEO meta + sitemap', 'Beta test with 10 users', 'Public launch + announce', 'Set up support inbox'] },
  ];

  return { features, pages, schema, roadmap };
};

const renderPlanText = (name: string, type: AppType, plan: Plan) => {
  const lines: string[] = [];
  lines.push(`# ${name || 'My App'} — Build Plan (${type})\n`);
  lines.push('## Feature Checklist'); plan.features.forEach(f => lines.push(`- [ ] ${f}`));
  lines.push('\n## Page Structure'); plan.pages.forEach(p => lines.push(`- ${p}`));
  lines.push('\n## Database Schema');
  plan.schema.forEach(t => {
    lines.push(`\n### ${t.table}`);
    t.columns.forEach(c => lines.push(`- ${c}`));
  });
  lines.push('\n## Development Roadmap');
  plan.roadmap.forEach(r => { lines.push(`\n### ${r.phase}`); r.items.forEach(i => lines.push(`- ${i}`)); });
  return lines.join('\n');
};

const BuildAppPrompt: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<AppType>('SaaS');
  const [features, setFeatures] = useState('');
  const [auth, setAuth] = useState(true);
  const [payments, setPayments] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [copied, setCopied] = useState(false);

  const plan = useMemo(() => buildPlan({ type, name, features, auth, payments, admin }),
    [type, name, features, auth, payments, admin]);
  const text = useMemo(() => renderPlanText(name, type, plan), [name, type, plan]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); toast.success('Plan copied'); setTimeout(() => setCopied(false), 1500); }
    catch { toast.error('Copy failed'); }
  };

  return (
    <ToolPage
      title="App Planner"
      description="Describe your app — get a feature checklist, page structure, schema and roadmap, instantly."
      icon={<Wand2 className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">App name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. TaskFlow" className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">App type</label>
            <select value={type} onChange={e => setType(e.target.value as AppType)}
              className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
              {(['SaaS','Marketplace','Social','E-commerce','Education','Productivity'] as AppType[]).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Custom features (one per line or comma separated)</label>
            <Textarea value={features} onChange={e => setFeatures(e.target.value)}
              placeholder="Real-time chat&#10;File uploads&#10;Notifications" className="mt-1 min-h-[100px]" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Toggle label="Auth" checked={auth} onChange={setAuth} />
            <Toggle label="Payments" checked={payments} onChange={setPayments} />
            <Toggle label="Admin" checked={admin} onChange={setAdmin} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Generated plan</h3>
            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
            </Button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-4 rounded-xl bg-secondary/40 text-xs whitespace-pre-wrap font-mono">
            {text}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (b: boolean) => void }) => (
  <button onClick={() => onChange(!checked)}
    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
      checked ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground'
    }`}>{label}: {checked ? 'On' : 'Off'}</button>
);

export default BuildAppPrompt;
