import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Download, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ToolPage from '@/components/tools/ToolPage';
import { toast } from 'sonner';

/* -----------------------------------------------------------
 * Design Studio — replaces AI image generation.
 * Pure HTML <canvas>: gradient backgrounds, thumbnails,
 * logos, avatars, icon composer. No external libraries.
 * --------------------------------------------------------- */

type Mode = 'thumbnail' | 'logo' | 'avatar' | 'gradient';

interface Design {
  mode: Mode;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  initials: string;
  fontFamily: string;
  textColor: string;
  gradFrom: string;
  gradTo: string;
  angle: number;
  shape: 'circle' | 'square' | 'hex';
}

const PRESETS = [
  { from: '#6366f1', to: '#06b6d4' },
  { from: '#f43f5e', to: '#f59e0b' },
  { from: '#10b981', to: '#0ea5e9' },
  { from: '#8b5cf6', to: '#ec4899' },
  { from: '#0f172a', to: '#1e293b' },
  { from: '#facc15', to: '#f97316' },
];

const FONTS = ['Inter, sans-serif', 'Georgia, serif', 'Courier New, monospace', 'Impact, sans-serif'];

const SIZES: Record<Mode, { w: number; h: number; label: string }> = {
  thumbnail: { w: 1280, h: 720, label: 'YouTube thumbnail (1280×720)' },
  logo:      { w: 1024, h: 1024, label: 'Logo (1024×1024)' },
  avatar:    { w: 512,  h: 512,  label: 'Avatar (512×512)' },
  gradient:  { w: 1920, h: 1080, label: 'Gradient wallpaper (1920×1080)' },
};

const initialsFrom = (s: string) =>
  s.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'SM';

const GenerateImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [d, setD] = useState<Design>({
    mode: 'thumbnail',
    width: SIZES.thumbnail.w, height: SIZES.thumbnail.h,
    title: 'Your Headline Here', subtitle: 'A clean, modern subtitle',
    initials: 'SM',
    fontFamily: FONTS[0], textColor: '#ffffff',
    gradFrom: PRESETS[0].from, gradTo: PRESETS[0].to, angle: 135,
    shape: 'circle',
  });

  // Draw to canvas whenever the design changes — instant, local.
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    c.width = d.width; c.height = d.height;
    const ctx = c.getContext('2d'); if (!ctx) return;

    // Gradient background
    const rad = (d.angle * Math.PI) / 180;
    const x = Math.cos(rad) * d.width;
    const y = Math.sin(rad) * d.height;
    const grad = ctx.createLinearGradient(0, 0, x, y);
    grad.addColorStop(0, d.gradFrom);
    grad.addColorStop(1, d.gradTo);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, d.width, d.height);

    // Subtle noise/light overlay
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * d.width, Math.random() * d.height, Math.random() * 60 + 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = d.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (d.mode === 'avatar' || d.mode === 'logo') {
      const cx = d.width / 2, cy = d.height / 2;
      const r = Math.min(d.width, d.height) * 0.32;

      // Shape disc
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      if (d.shape === 'circle') ctx.arc(cx, cy, r, 0, Math.PI * 2);
      else if (d.shape === 'square') ctx.rect(cx - r, cy - r, r * 2, r * 2);
      else {
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          const px = cx + r * Math.cos(a);
          const py = cy + r * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
      ctx.fill();

      ctx.fillStyle = d.textColor;
      ctx.font = `bold ${r}px ${d.fontFamily}`;
      ctx.fillText(d.initials || initialsFrom(d.title), cx, cy + r * 0.05);

      if (d.mode === 'logo' && d.title) {
        ctx.font = `600 ${d.height * 0.06}px ${d.fontFamily}`;
        ctx.fillText(d.title, cx, cy + r + d.height * 0.1);
      }
    } else if (d.mode === 'thumbnail') {
      // Title block
      const padding = d.width * 0.06;
      ctx.font = `900 ${d.height * 0.13}px ${d.fontFamily}`;
      wrapText(ctx, d.title, padding, d.height * 0.4, d.width - padding * 2, d.height * 0.15);

      ctx.font = `500 ${d.height * 0.045}px ${d.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.subtitle, padding, d.height - padding);
      ctx.textAlign = 'center';
    } else {
      // gradient wallpaper — optional centered title
      if (d.title) {
        ctx.font = `300 ${d.height * 0.08}px ${d.fontFamily}`;
        ctx.fillText(d.title, d.width / 2, d.height / 2);
      }
    }
  }, [d]);

  const setMode = (mode: Mode) => {
    const s = SIZES[mode];
    setD(prev => ({ ...prev, mode, width: s.w, height: s.h }));
  };

  const randomize = () => {
    const p = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setD(prev => ({ ...prev, gradFrom: p.from, gradTo: p.to, angle: Math.floor(Math.random() * 360) }));
  };

  const download = () => {
    const c = canvasRef.current; if (!c) return;
    c.toBlob(blob => {
      if (!blob) { toast.error('Export failed'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `smartmind-${d.mode}-${Date.now()}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <ToolPage
      title="Design Studio"
      description="Build thumbnails, logos, avatars and gradient wallpapers — instantly, offline."
      icon={<ImagePlus className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Mode</label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(Object.keys(SIZES) as Mode[]).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${d.mode === m ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border'}`}>
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{SIZES[d.mode].label}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <Input value={d.title} onChange={e => setD({ ...d, title: e.target.value })} className="mt-1" />
            </div>
            {d.mode === 'thumbnail' && (
              <div>
                <label className="text-xs text-muted-foreground">Subtitle</label>
                <Input value={d.subtitle} onChange={e => setD({ ...d, subtitle: e.target.value })} className="mt-1" />
              </div>
            )}
            {(d.mode === 'logo' || d.mode === 'avatar') && (
              <>
                <div>
                  <label className="text-xs text-muted-foreground">Initials</label>
                  <Input value={d.initials} onChange={e => setD({ ...d, initials: e.target.value.slice(0, 3).toUpperCase() })} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Shape</label>
                  <select value={d.shape} onChange={e => setD({ ...d, shape: e.target.value as Design['shape'] })}
                    className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                    <option value="circle">Circle</option>
                    <option value="square">Square</option>
                    <option value="hex">Hexagon</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Gradient from</label>
              <input type="color" value={d.gradFrom} onChange={e => setD({ ...d, gradFrom: e.target.value })} className="w-full h-10 mt-1 rounded-lg bg-secondary border border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Gradient to</label>
              <input type="color" value={d.gradTo} onChange={e => setD({ ...d, gradTo: e.target.value })} className="w-full h-10 mt-1 rounded-lg bg-secondary border border-border" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Angle ({d.angle}°)</label>
              <input type="range" min={0} max={360} value={d.angle} onChange={e => setD({ ...d, angle: +e.target.value })} className="w-full mt-2" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Text color</label>
              <input type="color" value={d.textColor} onChange={e => setD({ ...d, textColor: e.target.value })} className="w-full h-10 mt-1 rounded-lg bg-secondary border border-border" />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Font</label>
            <select value={d.fontFamily} onChange={e => setD({ ...d, fontFamily: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
              {FONTS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Color presets</label>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.map((p, i) => (
                <button key={i} onClick={() => setD({ ...d, gradFrom: p.from, gradTo: p.to })}
                  className="w-10 h-10 rounded-lg border border-border" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={randomize} className="flex-1"><Shuffle className="h-4 w-4 mr-1" /> Randomize</Button>
            <Button onClick={download} className="flex-1"><Download className="h-4 w-4 mr-1" /> Download PNG</Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4">
          <h3 className="text-sm font-medium mb-3">Preview</h3>
          <div className="rounded-xl overflow-hidden bg-secondary/40 border border-border">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

// Word-wrap helper for canvas text
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  ctx.textAlign = 'left';
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + ' ';
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, yy);
      line = words[n] + ' ';
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, yy);
  ctx.textAlign = 'center';
}

export default GenerateImage;
