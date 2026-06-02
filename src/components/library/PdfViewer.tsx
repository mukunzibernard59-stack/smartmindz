import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface Props {
  url: string;
}

const PdfViewer: React.FC<Props> = ({ url }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between gap-2 p-2 border-b border-border bg-card/60 backdrop-blur">
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setPageNum(p => Math.max(1, p - 1))} disabled={pageNum <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            {pageNum} / {numPages || '–'}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setPageNum(p => Math.min(numPages, p + 1))} disabled={pageNum >= numPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(scale * 100)}%</span>
          <Button size="sm" variant="ghost" onClick={() => setScale(s => Math.min(2.5, s + 0.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="ghost"><ExternalLink className="h-4 w-4" /></Button>
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex justify-center p-4 bg-secondary/20">
        {error ? (
          <div className="text-center text-sm text-muted-foreground max-w-md">
            <p className="mb-3">Couldn't render this PDF in the app.</p>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="sm" className="gap-2"><ExternalLink className="h-4 w-4" />Open in new tab</Button>
            </a>
          </div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(e) => setError(e.message)}
            loading={<div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Loading PDF…</div>}
          >
            <Page pageNumber={pageNum} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
