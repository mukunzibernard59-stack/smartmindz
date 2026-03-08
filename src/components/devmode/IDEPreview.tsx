import React, { useEffect, useRef, useState } from 'react';
import { Eye, RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IDEPreviewProps {
  html: string;
  css: string;
  js: string;
}

const IDEPreview: React.FC<IDEPreviewProps> = ({ html, css, js }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);

  const generatePreview = () => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #1a1a2e; padding: 16px; }
${css}
</style>
</head>
<body>
${html}
<script>
try {
  // Capture console.log
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => {
    originalLog(...args);
    window.parent.postMessage({ type: 'console-log', data: args.map(String).join(' ') }, '*');
  };
  console.error = (...args) => {
    originalError(...args);
    window.parent.postMessage({ type: 'console-error', data: args.map(String).join(' ') }, '*');
  };
  ${js}
} catch(e) {
  window.parent.postMessage({ type: 'console-error', data: e.message }, '*');
}
</script>
</body>
</html>`;
  };

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generatePreview());
        doc.close();
      }
    }
  }, [html, css, js, key]);

  const widthMap = { desktop: '100%', tablet: '768px', mobile: '375px' };

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e2e] border-b border-border/30">
        <div className="flex items-center gap-2 text-xs">
          <Eye className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-muted-foreground">Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setKey(k => k + 1)} className="p-1 hover:bg-secondary/50 rounded text-muted-foreground hover:text-foreground ml-1">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-start justify-center overflow-auto bg-white/5 p-2">
        <iframe
          ref={iframeRef}
          key={key}
          title="Live Preview"
          sandbox="allow-scripts allow-modals"
          className="bg-white rounded shadow-lg border border-border/20"
          style={{
            width: widthMap[viewMode],
            maxWidth: '100%',
            height: '100%',
            minHeight: '200px',
          }}
        />
      </div>
    </div>
  );
};

export default IDEPreview;
