import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const base64ToBytes = (input: string) => {
  const base64 = input.includes(',') ? input.slice(input.indexOf(',') + 1) : input;
  const clean = base64.replace(/\s/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

interface Resource {
  type: 'pdf' | 'note' | 'link' | 'quiz' | 'video';
  title: string;
  content?: string | null;
}

interface Props {
  resource: Resource | null;
  onClose: () => void;
}

const EmbeddedViewer: React.FC<Props> = ({ resource, onClose }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState<string | null>(null);

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

  return (
    <Dialog open={!!resource} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col bg-slate-50/90 border-primary/20">
        <div className="overflow-auto h-full p-6">
          <div className="mx-auto w-full max-w-5xl rounded-[2rem] bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200/70">
            <div className="border-b border-slate-200 px-8 py-6 bg-slate-50 rounded-t-[2rem]">
              <DialogTitle className="text-5xl font-black tracking-tight text-slate-900">
                {resource.title}
              </DialogTitle>
            </div>
            <div className="px-8 py-6">
              {isPdfData && pdfFile ? (
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
