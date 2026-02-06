import React, { useRef } from 'react';
import { Plus, Upload, FileText, Image, X, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import type { UploadedFile } from '@/hooks/useFileUpload';

interface FileUploadMenuProps {
  files: UploadedFile[];
  isProcessing: boolean;
  onUpload: (files: FileList) => void;
  onRemoveFile: (fileId: string) => void;
  onPasteText: (text: string) => void;
}

const FileUploadMenu: React.FC<FileUploadMenuProps> = ({
  files,
  isProcessing,
  onUpload,
  onRemoveFile,
  onPasteText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteMode, setPasteMode] = React.useState(false);
  const [pastedText, setPastedText] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      setIsOpen(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasteSubmit = () => {
    if (pastedText.trim()) {
      onPasteText(pastedText.trim());
      setPastedText('');
      setPasteMode(false);
      setIsOpen(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4 text-primary" />;
    if (type.includes('pdf')) return <FileText className="h-4 w-4 text-destructive" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Attached Files Display */}
      {files.length > 0 && (
        <div className="flex gap-1 flex-wrap max-w-xs">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-1 bg-secondary rounded-lg px-2 py-1 text-xs"
            >
              {getFileIcon(file.type)}
              <span className="truncate max-w-20">{file.name}</span>
              <button
                onClick={() => onRemoveFile(file.id)}
                className="hover:bg-destructive/20 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-secondary"
            disabled={isProcessing}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="start">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.webp,.gif"
            multiple
          />

          {pasteMode ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Paste Text</span>
                <Button variant="ghost" size="sm" onClick={() => setPasteMode(false)}>
                  Cancel
                </Button>
              </div>
              <Textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your text here..."
                className="min-h-24 text-sm"
                autoFocus
              />
              <Button
                onClick={handlePasteSubmit}
                className="w-full"
                disabled={!pastedText.trim()}
              >
                Add Text
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Upload File</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, TXT, Images</p>
                </div>
              </button>

              <button
                onClick={() => setPasteMode(true)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-4 w-4 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Paste Text</p>
                  <p className="text-xs text-muted-foreground">Paste content directly</p>
                </div>
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FileUploadMenu;
