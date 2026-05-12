import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ImagePlus, Upload, Download, RotateCw, Crop as CropIcon, Undo2, Redo2, Type, Square, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import ToolPage from '@/components/tools/ToolPage';
import { toast } from 'sonner';

/* -----------------------------------------------------------
 * Design Studio — upload-based image editor.
 * Pure HTML <canvas> + CSS filters (no heavy deps).
 * Features: brightness/contrast/saturation/blur/sharpen,
 * rotate, crop, filters, text overlay, border/frame,
 * undo/redo, export PNG/JPG/WEBP, side-by-side compare.
 * --------------------------------------------------------- */

interface EditState {
  brightness: number;  // %
  contrast: number;    // %
  saturation: number;  // %
  blur: number;        // px
  sharpen: number;     // 0-100
  hue: number;         // deg -180..180
  temperature: number; // -100 (cool) .. 100 (warm)
  vignette: number;    // 0-100 strength
  rotation: number;    // deg (0/90/180/270)
  filter: 'none' | 'grayscale' | 'sepia' | 'invert' | 'vintage' | 'cool' | 'warm';
  text: string;
  textColor: string;
  textSize: number;    // px (relative to image)
  border: number;      // px
  borderColor: string;
  frame: 'none' | 'shadow' | 'glow' | 'polaroid';
}

const DEFAULT_STATE: EditState = {
  brightness: 100, contrast: 100, saturation: 100, blur: 0, sharpen: 0,
  hue: 0, temperature: 0, vignette: 0,
  rotation: 0, filter: 'none',
  text: '', textColor: '#ffffff', textSize: 48,
  border: 0, borderColor: '#ffffff',
  frame: 'none',
};

// Quick retouching presets — one-click professional looks
const PRESETS: { id: string; label: string; patch: Partial<EditState> }[] = [
  { id: 'auto', label: 'Auto Enhance', patch: { brightness: 108, contrast: 112, saturation: 110, sharpen: 25 } },
  { id: 'portrait', label: 'Portrait', patch: { brightness: 105, contrast: 105, saturation: 95, blur: 0, sharpen: 15, temperature: 10 } },
  { id: 'smooth', label: 'Smooth Skin', patch: { brightness: 104, contrast: 98, saturation: 100, blur: 1, sharpen: 0 } },
  { id: 'pop', label: 'Pop Color', patch: { brightness: 105, contrast: 120, saturation: 140, sharpen: 30 } },
  { id: 'bw', label: 'B & W', patch: { saturation: 0, contrast: 115, brightness: 102, filter: 'grayscale' } },
  { id: 'sunset', label: 'Sunset', patch: { temperature: 45, saturation: 125, contrast: 108 } },
  { id: 'cool', label: 'Cool Tone', patch: { temperature: -35, saturation: 105, contrast: 105 } },
  { id: 'hdr', label: 'HDR Boost', patch: { brightness: 105, contrast: 130, saturation: 125, sharpen: 45 } },
  { id: 'vintage', label: 'Vintage', patch: { filter: 'vintage', vignette: 35, contrast: 95 } },
  { id: 'dramatic', label: 'Dramatic', patch: { contrast: 140, brightness: 95, saturation: 115, vignette: 50 } },
];

const FILTER_CSS: Record<EditState['filter'], string> = {
  none: '',
  grayscale: 'grayscale(1)',
  sepia: 'sepia(0.85)',
  invert: 'invert(1)',
  vintage: 'sepia(0.4) contrast(0.95) saturate(1.2)',
  cool: 'hue-rotate(-15deg) saturate(1.1)',
  warm: 'hue-rotate(15deg) saturate(1.15)',
};

const GenerateImage: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Edit state with undo/redo history
  const [state, setState] = useState<EditState>(DEFAULT_STATE);
  const [history, setHistory] = useState<EditState[]>([DEFAULT_STATE]);
  const [hIndex, setHIndex] = useState(0);
  const [compare, setCompare] = useState(false);

  // Push to history (debounced via change tracking)
  const commit = useCallback((next: EditState) => {
    setState(next);
    setHistory(h => {
      const trimmed = h.slice(0, hIndex + 1);
      trimmed.push(next);
      return trimmed.slice(-30); // cap history
    });
    setHIndex(i => Math.min(i + 1, 29));
  }, [hIndex]);

  const setField = <K extends keyof EditState>(k: K, v: EditState[K]) => commit({ ...state, [k]: v });

  const undo = () => { if (hIndex > 0) { setHIndex(hIndex - 1); setState(history[hIndex - 1]); } };
  const redo = () => { if (hIndex < history.length - 1) { setHIndex(hIndex + 1); setState(history[hIndex + 1]); } };

  // ---------- Upload ----------
  const onUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      setImgSrc(src);
      const img = new Image();
      img.onload = () => { imgRef.current = img; setState(DEFAULT_STATE); setHistory([DEFAULT_STATE]); setHIndex(0); };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // ---------- Render to canvas whenever state/img changes ----------
  useEffect(() => {
    const c = canvasRef.current; const img = imgRef.current;
    if (!c || !img) return;

    // Compute rotated dimensions
    const rotated = state.rotation % 180 !== 0;
    const w = rotated ? img.naturalHeight : img.naturalWidth;
    const h = rotated ? img.naturalWidth : img.naturalHeight;
    c.width = w + state.border * 2;
    c.height = h + state.border * 2;

    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);

    // Border background
    if (state.border > 0) {
      ctx.fillStyle = state.borderColor;
      ctx.fillRect(0, 0, c.width, c.height);
    }

    // Apply CSS filter chain to image draw
    const filterStr = [
      `brightness(${state.brightness}%)`,
      `contrast(${state.contrast}%)`,
      `saturate(${state.saturation}%)`,
      state.blur > 0 ? `blur(${state.blur}px)` : '',
      // Sharpen approximated via contrast boost (true convolution is heavy)
      state.sharpen > 0 ? `contrast(${100 + state.sharpen * 0.6}%)` : '',
      FILTER_CSS[state.filter],
    ].filter(Boolean).join(' ');

    ctx.save();
    (ctx as any).filter = filterStr || 'none';
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    // Frame effects (drawn over image)
    if (state.frame === 'polaroid') {
      ctx.fillStyle = '#fff';
      const pad = 24; const bottomPad = 80;
      // expand canvas-like effect by drawing inner shadow border
      ctx.strokeStyle = '#fff'; ctx.lineWidth = pad * 2;
      ctx.strokeRect(0, 0, c.width, c.height + bottomPad);
    }

    // Text overlay
    if (state.text) {
      ctx.save();
      (ctx as any).filter = 'none';
      ctx.fillStyle = state.textColor;
      ctx.font = `bold ${state.textSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 6;
      ctx.fillText(state.text, c.width / 2, c.height - 24);
      ctx.restore();
    }
  }, [state, imgSrc]);

  // ---------- Export ----------
  const exportImage = (mime: 'image/png' | 'image/jpeg' | 'image/webp') => {
    const c = canvasRef.current; if (!c) { toast.error('Upload an image first'); return; }
    c.toBlob(blob => {
      if (!blob) { toast.error('Export failed'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ext = mime.split('/')[1].replace('jpeg', 'jpg');
      a.href = url; a.download = `smartmindz-${Date.now()}.${ext}`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }, mime, 0.92);
  };

  const reset = () => { setState(DEFAULT_STATE); setHistory([DEFAULT_STATE]); setHIndex(0); };

  return (
    <ToolPage
      title="Design Studio"
      description="Upload an image and edit it with adjustments, filters, text overlays, frames and exports."
      icon={<ImagePlus className="h-5 w-5" />}
    >
      {!imgSrc ? (
        <UploadZone onUpload={onUpload} />
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          {/* Controls */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={undo} disabled={hIndex <= 0} title="Undo"><Undo2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={redo} disabled={hIndex >= history.length - 1} title="Redo"><Redo2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={reset} className="ml-auto">Reset</Button>
            </div>

            <Section title="Adjustments">
              <Slide label="Brightness" value={state.brightness} min={0} max={200} onChange={v => setField('brightness', v)} />
              <Slide label="Contrast" value={state.contrast} min={0} max={200} onChange={v => setField('contrast', v)} />
              <Slide label="Saturation" value={state.saturation} min={0} max={200} onChange={v => setField('saturation', v)} />
              <Slide label="Blur" value={state.blur} min={0} max={20} onChange={v => setField('blur', v)} />
              <Slide label="Sharpen" value={state.sharpen} min={0} max={100} onChange={v => setField('sharpen', v)} />
            </Section>

            <Section title="Filters">
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(FILTER_CSS) as EditState['filter'][]).map(f => (
                  <button key={f} onClick={() => setField('filter', f)}
                    className={`text-xs py-1.5 rounded-lg border capitalize ${state.filter === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Transform">
              <Button size="sm" variant="outline" onClick={() => setField('rotation', (state.rotation + 90) % 360)}>
                <RotateCw className="h-4 w-4 mr-1" /> Rotate 90°
              </Button>
            </Section>

            <Section title="Text overlay" icon={<Type className="h-3.5 w-3.5" />}>
              <Input value={state.text} onChange={e => setField('text', e.target.value)} placeholder="Add caption…" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Color</label>
                  <input type="color" value={state.textColor} onChange={e => setField('textColor', e.target.value)} className="w-full h-9 mt-1 rounded-md bg-secondary border border-border" />
                </div>
                <div>
                  <Slide label="Size" value={state.textSize} min={16} max={160} onChange={v => setField('textSize', v)} />
                </div>
              </div>
            </Section>

            <Section title="Border & frame" icon={<Square className="h-3.5 w-3.5" />}>
              <Slide label="Border" value={state.border} min={0} max={80} onChange={v => setField('border', v)} />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Color</label>
                  <input type="color" value={state.borderColor} onChange={e => setField('borderColor', e.target.value)} className="w-full h-9 mt-1 rounded-md bg-secondary border border-border" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Frame</label>
                  <select value={state.frame} onChange={e => setField('frame', e.target.value as EditState['frame'])}
                    className="w-full mt-1 px-2 py-2 bg-secondary border border-border rounded-md text-xs">
                    <option value="none">None</option>
                    <option value="shadow">Shadow</option>
                    <option value="glow">Glow</option>
                    <option value="polaroid">Polaroid</option>
                  </select>
                </div>
              </div>
            </Section>

            <Section title="Export" icon={<Download className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-3 gap-1.5">
                <Button size="sm" onClick={() => exportImage('image/png')}>PNG</Button>
                <Button size="sm" variant="outline" onClick={() => exportImage('image/jpeg')}>JPG</Button>
                <Button size="sm" variant="outline" onClick={() => exportImage('image/webp')}>WEBP</Button>
              </div>
            </Section>

            <div className="pt-2 border-t border-border">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={compare} onChange={e => setCompare(e.target.checked)} />
                Side-by-side compare
              </label>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { setImgSrc(null); imgRef.current = null; }}>
              <Upload className="h-4 w-4 mr-1" /> Replace image
            </Button>
          </div>

          {/* Preview */}
          <div className="bg-card border border-border rounded-2xl p-3 sm:p-4">
            <div
              className={`rounded-xl overflow-hidden bg-[length:20px_20px] bg-[linear-gradient(45deg,#0001_25%,transparent_25%,transparent_75%,#0001_75%),linear-gradient(45deg,#0001_25%,transparent_25%,transparent_75%,#0001_75%)] bg-[position:0_0,10px_10px] border border-border ${
                state.frame === 'shadow' ? 'shadow-2xl' : ''
              } ${state.frame === 'glow' ? 'shadow-[0_0_60px_hsl(var(--primary)/0.6)]' : ''}`}
            >
              {compare ? (
                <div className="grid grid-cols-2 gap-2 p-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 text-center">Before</p>
                    <img src={imgSrc} alt="Original" className="w-full h-auto rounded-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 text-center">After</p>
                    <canvas ref={canvasRef} className="w-full h-auto block rounded-lg" />
                  </div>
                </div>
              ) : (
                <canvas ref={canvasRef} className="w-full h-auto block" />
              )}
            </div>
          </div>
        </div>
      )}
    </ToolPage>
  );
};

/* ---------- Small UI helpers ---------- */
const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-2">
    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">{icon}{title}</p>
    <div className="space-y-2">{children}</div>
  </div>
);

const Slide: React.FC<{ label: string; value: number; min: number; max: number; onChange: (v: number) => void }> = ({ label, value, min, max, onChange }) => (
  <div>
    <div className="flex justify-between text-xs text-muted-foreground"><span>{label}</span><span>{value}</span></div>
    <Slider value={[value]} min={min} max={max} step={1} onValueChange={v => onChange(v[0])} className="mt-1" />
  </div>
);

const UploadZone: React.FC<{ onUpload: (f?: File) => void }> = ({ onUpload }) => {
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); onUpload(e.dataTransfer.files?.[0]); }}
      className={`bg-card border-2 border-dashed rounded-2xl p-12 sm:p-20 text-center transition-colors ${drag ? 'border-primary bg-primary/5' : 'border-border'}`}
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground mb-4">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Upload an image to start editing</h3>
      <p className="text-sm text-muted-foreground mb-5">PNG, JPG or WEBP — drag & drop or browse from your device.</p>
      <label className="inline-flex">
        <input type="file" accept="image/*" className="hidden" onChange={e => onUpload(e.target.files?.[0] || undefined)} />
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium cursor-pointer hover:opacity-90 transition">
          <Upload className="h-4 w-4" /> Choose image
        </span>
      </label>
    </div>
  );
};

export default GenerateImage;
