import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PdfViewer from './PdfViewer';

interface Resource {
  type: 'pdf' | 'note' | 'link' | 'quiz' | 'video';
  title: string;
  url?: string | null;
  extracted_text?: string | null;
}

interface Props {
  resource: Resource | null;
  onClose: () => void;
}

const EmbeddedViewer: React.FC<Props> = ({ resource, onClose }) => {
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    setIframeFailed(false);
  }, [resource]);

  if (!resource) return null;
  const url = resource.url || '';
  const isPdf = resource.type === 'pdf' || /\.pdf($|\?)/i.test(url);

  return (
    <Dialog open={!!resource} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col bg-card border-primary/20">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
          <DialogTitle className="text-sm font-semibold truncate">{resource.title}</DialogTitle>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="mr-8">
              <Button size="sm" variant="ghost" className="gap-1 text-xs">
                <ExternalLink className="h-3.5 w-3.5" /> New tab
              </Button>
            </a>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          {resource.type === 'note' && resource.extracted_text ? (
            <div className="p-6 overflow-auto h-full prose prose-invert max-w-none whitespace-pre-wrap text-sm">
              {resource.extracted_text}
            </div>
          ) : isPdf && url ? (
            <PdfViewer url={url} />
          ) : url && !iframeFailed ? (
            <iframe
              src={url}
              className="w-full h-full border-0 bg-white"
              onError={() => setIframeFailed(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title={resource.title}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-6">
              <p className="text-muted-foreground">This content can't be embedded directly.</p>
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" className="gap-2"><ExternalLink className="h-4 w-4" />Open in new tab</Button>
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbeddedViewer;
