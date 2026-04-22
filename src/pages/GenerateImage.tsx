import React, { useState } from 'react';
import { ImagePlus, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import { supabase } from '@/integrations/supabase/client';

const STYLES = [
  'Photorealistic', 'Cinematic', '3D Render', 'Anime', 'Digital Art',
  'Oil Painting', 'Watercolor', 'Pixel Art', 'Minimalist', 'Cyberpunk',
];

const GenerateImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) { toast.error('Describe the image you want.'); return; }
    setLoading(true); setImageUrl(null);
    try {
      for (let i = 1; i <= 3; i++) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-image', {
            body: { prompt, style },
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
      toast.error(e?.message || 'Image generation failed.');
    } finally { setLoading(false); }
  };

  const download = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `smartmind-${Date.now()}.png`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <ToolPage
      title="Generate Image"
      description="Describe what you want, pick a style, and get a pro-quality image."
      icon={<ImagePlus className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
          <label className="text-sm font-medium">Image description</label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. A futuristic city skyline at sunset with flying cars and neon lights..."
            className="min-h-[140px] resize-y" />
          <div>
            <label className="text-xs text-muted-foreground">Style</label>
            <select value={style} onChange={e => setStyle(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
              {STYLES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating…</> : <><ImagePlus className="h-4 w-4 mr-2" />Generate Image</>}
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
              <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />
            ) : loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <p className="text-sm text-muted-foreground p-4 text-center">Your image will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default GenerateImage;
