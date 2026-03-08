import React, { useRef, useEffect, useState } from 'react';
import { Eye, RefreshCw, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IDEPreviewProps {
  html?: string;
  css?: string;
  js?: string;
  visible: boolean;
}

const IDEPreview: React.FC<IDEPreviewProps> = ({ html = '', css = '', js = '', visible }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [key, setKey] = useState(0);

  const buildDocument = () => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #1a1a1a; padding: 16px; }
${css}
</style>
</head>
<body>
${html}
<script>
// Sandbox console
const _log = console.log;
console.log = function(...args) {
  _log(...args);
  try { window.parent.postMessage({ type: 'console', args: args.map(String) }, '*'); } catch(e) {}
};
console.error = function(...args) {
  try { window.parent.postMessage({ type: 'console-error', args: args.map(String) }, '*'); } catch(e) {}
};
window.onerror = function(msg, url, line) {
  try { window.parent.postMessage({ type: 'console-error', args: [msg + ' (line ' + line + ')'] }, '*'); } catch(e) {}
  return true;
};
try {
${js}
} catch(e) {
  console.error(e.message);
}
</script>
</body>
</html>`;
  };

  useEffect(() => {
    if (!visible || !iframeRef.current) return;
    const doc = buildDocument();
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [html, css, js, visible, key]);

  if (!visible) return null;

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--ide-preview-bg,0_0%_100%))]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[hsl(var(--ide-panel-header,220_20%_12%))] border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs font-medium text-zinc-400">Preview</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon"
            className="h-5 w-5 text-zinc-500 hover:text-zinc-300"
            onClick={() => setIsMobile(!isMobile)}
          >
            {isMobile ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost" size="icon"
            className="h-5 w-5 text-zinc-500 hover:text-zinc-300"
            onClick={() => setKey(k => k + 1)}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="flex-1 flex items-start justify-center p-2 overflow-auto bg-zinc-100">
        <iframe
          ref={iframeRef}
          key={key}
          title="Preview"
          sandbox="allow-scripts allow-modals"
          className={`bg-white border border-zinc-200 shadow-sm transition-all ${
            isMobile ? 'w-[375px] h-[667px] rounded-2xl' : 'w-full h-full rounded-md'
          }`}
        />
      </div>
    </div>
  );
};

export default IDEPreview;
