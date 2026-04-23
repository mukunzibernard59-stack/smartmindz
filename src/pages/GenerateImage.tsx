import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Download, Wand2, Upload, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import { supabase } from '@/integrations/supabase/client';

const STYLES = [
  'Photorealistic', 'Cinematic', '3D Render', 'Anime', 'Digital Art',
  'Oil Painting', 'Watercolor', 'Pixel Art', 'Minimalist', 'Cyberpunk',
];

const EDIT_PRESETS = [
  'Professional balanced enhancement: clean, sharp, well-lit, natural skin tones',
  'Smooth skin naturally, remove blemishes, keep realistic texture',
  'Cinematic color grading with warm tones and soft contrast',
  'Brighten the photo, fix shadows and highlights, true white balance',
  'Blur the background softly (portrait bokeh) keeping subject sharp',
  'Sharpen details, reduce noise, 4k quality',
];

type Mode = 'generate' | 'edit';

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

const GenerateImage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePickFile = async (f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast.error('Please select an image.'); return; }
    if (f.size > 8 * 1024 * 1024) { toast.error('Image too large (max 8MB).'); return; }
    try {
      const url = await fileToDataUrl(f);
      setSourceImage(url);
      setImageUrl(null);
    } catch {
      toast.error('Could not read image.');
    }
  };

  const run = async () => {
    if (!prompt.trim()) { toast.error('Describe what you want.'); return; }
    if (mode === 'edit' && !sourceImage) { toast.error('Upload a photo to edit.'); return; }
    setLoading(true); setImageUrl(null);
    try {
      for (let i = 1; i <= 3; i++) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-image', {
            body: {
              prompt,
              style,
              mode,
              imageUrl: mode === 'edit' ? sourceImage : undefined,
            },
          });
          if (error) throw error;
          if (!data?.imageUrl) throw new Error('No image returned');
          setImageUrl(data.imageUrl);
          break;
        } catch (e) {
          if (i === 3) throw e;
          await new Promise(r => setTimeout(r, i * 800));
        }
      }
    } catch (e: any) {
      toast.error(e?.message || (mode === 'edit' ? 'Photo edit failed.' : 'Image generation failed.'));
    } finally { setLoading(false); }
  };

  const download = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `smartmind-${mode}-${Date.now()}.png`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <ToolPage
      title={mode === 'edit' ? 'AI Photo Editor' : 'Generate Image'}
      description={
        mode === 'edit'
          ? 'Upload a photo and describe edits — natural, professional, realistic results.'
          : 'Describe what you want, pick a style, and get a pro-quality image.'
      }
      icon={mode === 'edit' ? <Wand2 className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
    >
      {/* Mode switch */}
      <div className="inline-flex p-1 mb-4 rounded-xl bg-secondary border border-border">
        <button
          onClick={() => { setMode('generate'); setImageUrl(null); }}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'generate' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 inline mr-1.5" /> Generate
        </button>
        <button
          onClick={() => { setMode('edit'); setImageUrl(null); }}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'edit' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Wand2 className="h-3.5 w-3.5 inline mr-1.5" /> Edit Photo
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
          {mode === 'edit' && (
            <div>
              <label className="text-sm font-medium">Your photo</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePickFile(e.target.files?.[0])}
              />
              {sourceImage ? (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-border">
                  <img src={sourceImage} alt="Source" className="w-full max-h-64 object-contain bg-secondary/40" />
                  <button
                    onClick={() => { setSourceImage(null); if (fileRef.current) fileRef.current.value = ''; }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-secondary/40 transition-colors"
                >
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload a photo</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 8MB</p>
                </button>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">
              {mode === 'edit' ? 'Describe the edits' : 'Image description'}
            </label>
            <Textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={
                mode === 'edit'
                  ? 'e.g. Smooth skin naturally, brighten the face, cinematic warm tones, blur background...'
                  : 'e.g. A futuristic city skyline at sunset with flying cars and neon lights...'
              }
              className="min-h-[120px] resize-y mt-1"
            />
          </div>

          {mode === 'edit' ? (
            <div>
              <label className="text-xs text-muted-foreground">Quick presets</label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {EDIT_PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="text-xs px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-foreground/80 hover:text-foreground"
                  >
                    {p.split(':')[0].split(',')[0].slice(0, 32)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-muted-foreground">Style</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}

          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{mode === 'edit' ? 'Editing…' : 'Generating…'}</>
            ) : mode === 'edit' ? (
              <><Wand2 className="h-4 w-4 mr-2" />Enhance Photo</>
            ) : (
              <><ImagePlus className="h-4 w-4 mr-2" />Generate Image</>
            )}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Preview</h3>
            <Button variant="outline" size="sm" onClick={download} disabled={!imageUrl}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
          <div className="aspect-square rounded-xl bg-secondary/40 border border-border flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
            ) : loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <p className="text-sm text-muted-foreground p-4 text-center">
                {mode === 'edit' ? 'Your edited photo will appear here.' : 'Your image will appear here.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default GenerateImage;
