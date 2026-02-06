import { useState, useCallback } from 'react';
import { sanitizeFileName, isValidFileType, isValidFileSize } from '@/lib/security';
import { toast } from 'sonner';

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  preview?: string;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE_MB = 10;
const MAX_TEXT_LENGTH = 50000;

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const readFileContent = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else if (result instanceof ArrayBuffer) {
          // For binary files, convert to base64
          const bytes = new Uint8Array(result);
          let binary = '';
          bytes.forEach(byte => binary += String.fromCharCode(byte));
          resolve(btoa(binary));
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }, []);

  const processFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    // Validate file type
    if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
      toast.error(`Invalid file type: ${file.type}`);
      return null;
    }

    // Validate file size
    if (!isValidFileSize(file, MAX_FILE_SIZE_MB)) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`);
      return null;
    }

    try {
      const content = await readFileContent(file);
      const safeName = sanitizeFileName(file.name);
      
      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: safeName,
        type: file.type,
        size: file.size,
        content: file.type.startsWith('text/') ? content.substring(0, MAX_TEXT_LENGTH) : content,
        preview: file.type.startsWith('image/') ? content : undefined,
      };

      return uploadedFile;
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file');
      return null;
    }
  }, [readFileContent]);

  const uploadFiles = useCallback(async (fileList: FileList | File[]): Promise<UploadedFile[]> => {
    setIsProcessing(true);
    const uploaded: UploadedFile[] = [];

    try {
      const filesArray = Array.from(fileList);
      
      for (const file of filesArray) {
        const processed = await processFile(file);
        if (processed) {
          uploaded.push(processed);
        }
      }

      setFiles(prev => [...prev, ...uploaded]);
      
      if (uploaded.length > 0) {
        toast.success(`${uploaded.length} file(s) uploaded successfully`);
      }
    } finally {
      setIsProcessing(false);
    }

    return uploaded;
  }, [processFile]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const getFileContext = useCallback((): string => {
    if (files.length === 0) return '';

    return files.map(file => {
      if (file.type.startsWith('text/')) {
        return `[File: ${file.name}]\n${file.content}\n[End of file]`;
      }
      if (file.type.startsWith('image/')) {
        return `[Image attached: ${file.name}]`;
      }
      return `[File attached: ${file.name}, type: ${file.type}]`;
    }).join('\n\n');
  }, [files]);

  return {
    files,
    isProcessing,
    uploadFiles,
    removeFile,
    clearFiles,
    getFileContext,
  };
}
