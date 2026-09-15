import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const base64ToBytes = (input: string) => {
  const base64 = input.includes(',') ? input.slice(input.indexOf(',') + 1) : input;
  const clean = base64.replace(/\s/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const base64ToBlob = (input: string, mime: string) => {
  const bytes = base64ToBytes(input);
  return new Blob([bytes], { type: mime });
};


interface Resource {
  type: 'pdf' | 'note' | 'link' | 'quiz' | 'video';
  title: string;
  content?: string | null;
}

interface Props {
  resource: Resource | null;
  loading?: boolean;
  loadError?: string | null;
  onRetry?: () => void;
  onClose: () => void;
}

const EmbeddedViewer: React.FC<Props> = ({ resource, loading = false, loadError = null, onRetry, onClose }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const content = resource?.content || '';
  const isPdfData = resource?.type === 'pdf' && content.length > 0;

  // Decode once into bytes so pdf.js never re-parses a huge data URL on every render.
  const pdfFile = useMemo(() => {
    if (!isPdfData) return null;
    if (/^https?:\/\//i.test(content.trim())) return content.trim();
    try {
      return { data: base64ToBytes(content) };
    } catch {
      return null;
    }
  }, [content, isPdfData]);

  if (!resource) return null;

  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  };

  const safeFileName = (title: string, ext: string) => {
    const sanitized = title.replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF_\-\s]/gi, '_').trim() || 'document';
    return `${sanitized}.${ext}`;
  };

  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!resource) return;
    setDownloading(true);
    try {
      if (resource.type === 'pdf' && content) {
        if (/^https?:\/\//i.test(content.trim())) {
          const res = await fetch(content.trim());
          if (!res.ok) throw new Error('Download failed');
          const blob = await res.blob();
          triggerDownload(blob, safeFileName(resource.title, 'pdf'));
        } else {
          const blob = base64ToBlob(content, 'application/pdf');
          triggerDownload(blob, safeFileName(resource.title, 'pdf'));
        }
      } else {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        triggerDownload(blob, safeFileName(resource.title, 'txt'));
      }
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };


  return (
    <Dialog open={!!resource} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[97vw] h-[92vh] sm:h-[90vh] p-0 flex flex-col bg-slate-50/90 border-primary/20">
        <div className="overflow-auto h-full p-2 sm:p-6">
          <div className="mx-auto w-full max-w-5xl rounded-2xl sm:rounded-[2rem] bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200/70">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-8 sm:py-6 bg-slate-50 rounded-t-2xl sm:rounded-t-[2rem]">
              <DialogTitle className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-slate-900 break-words">
                {resource.title}
              </DialogTitle>
            </div>
            <div className="px-8 py-6">
              {loading ? (
                <p className="text-sm text-slate-600 py-10 text-center">Loading document…</p>
              ) : loadError ? (
                <div className="py-10 text-center space-y-4">
                  <p className="text-sm text-slate-600">{loadError}</p>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
                    >
                      Try again
                    </button>
                  )}
                </div>
              ) : !content ? (
                <p className="text-sm text-slate-600 py-10 text-center">
                  This document is empty or no longer available.
                </p>
              ) : isPdfData && pdfFile ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <span className="text-sm text-slate-600">PDF preview</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                        className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900"
                        disabled={pageNumber <= 1}
                      >
                        Prev
                      </button>
                      <span className="text-sm text-slate-700">Page {pageNumber} / {numPages || '–'}</span>
                      <button
                        type="button"
                        onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
                        className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900"
                        disabled={pageNumber >= numPages}
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={handleDownload}
                        disabled={downloading}
                        className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover:bg-primary/20 disabled:opacity-60 inline-flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {downloading ? 'Saving…' : 'Download'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    {pdfError ? (
                      <p className="text-sm text-slate-600">{pdfError}</p>
                    ) : (
                      <Document
                        file={pdfFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(e) => setPdfError(e?.message || 'Could not open this document.')}
                        loading="Loading PDF..."
                      >
                        <Page pageNumber={pageNumber} width={840} renderTextLayer={false} renderAnnotationLayer={false} />
                      </Document>
                    )}
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate prose-lg prose-headings:font-semibold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-800 prose-li:text-slate-800 prose-strong:text-slate-900 prose-a:text-primary hover:prose-a:text-primary-dark prose-blockquote:border-l-slate-300 prose-blockquote:text-slate-600 prose-pre:bg-slate-100 prose-code:text-slate-900 prose-code:bg-slate-100 prose-img:rounded-xl max-w-none break-words">
                  {isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, { USE_PROFILES: { html: true } }) }} />
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbeddedViewer;
