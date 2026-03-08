import React, { useState } from 'react';
import {
  File, FolderOpen, FolderClosed, Plus, Trash2, Edit3, ChevronRight, ChevronDown,
  FileCode, FileText, FileJson, FileCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface IDEFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isFolder?: boolean;
  children?: IDEFile[];
  parentId?: string;
}

interface IDEFileExplorerProps {
  files: IDEFile[];
  activeFileId: string | null;
  onSelectFile: (file: IDEFile) => void;
  onCreateFile: (name: string, language: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': case 'jsx': case 'ts': case 'tsx': return <FileCode className="h-4 w-4 text-yellow-400" />;
    case 'py': return <FileCode className="h-4 w-4 text-blue-400" />;
    case 'html': return <FileCode className="h-4 w-4 text-orange-400" />;
    case 'css': return <FileCode className="h-4 w-4 text-sky-400" />;
    case 'json': return <FileJson className="h-4 w-4 text-yellow-300" />;
    case 'java': return <FileCode className="h-4 w-4 text-red-400" />;
    case 'cpp': case 'c': return <FileCode className="h-4 w-4 text-blue-300" />;
    case 'md': return <FileText className="h-4 w-4 text-muted-foreground" />;
    case 'sh': case 'bash': return <FileCog className="h-4 w-4 text-green-400" />;
    default: return <File className="h-4 w-4 text-muted-foreground" />;
  }
};

const getLanguageFromName = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', html: 'html', css: 'css', json: 'json',
    java: 'java', cpp: 'cpp', c: 'c', cs: 'csharp',
    sh: 'bash', bash: 'bash', md: 'markdown',
  };
  return map[ext || ''] || 'plaintext';
};

const IDEFileExplorer: React.FC<IDEFileExplorerProps> = ({
  files, activeFileId, onSelectFile, onCreateFile, onDeleteFile, onRenameFile
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(folderId) ? next.delete(folderId) : next.add(folderId);
      return next;
    });
  };

  const handleCreate = () => {
    if (!newFileName.trim()) return;
    const lang = getLanguageFromName(newFileName);
    onCreateFile(newFileName.trim(), lang);
    setNewFileName('');
    setIsCreating(false);
  };

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return;
    onRenameFile(id, renameValue.trim());
    setRenamingId(null);
    setRenameValue('');
  };

  const renderFile = (file: IDEFile, depth: number = 0) => {
    const isActive = file.id === activeFileId;
    const isExpanded = expandedFolders.has(file.id);

    if (file.isFolder) {
      return (
        <div key={file.id}>
          <button
            onClick={() => toggleFolder(file.id)}
            className="w-full flex items-center gap-1.5 px-2 py-1 text-sm hover:bg-secondary/80 rounded transition-colors group"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            {isExpanded ? <FolderOpen className="h-4 w-4 text-primary" /> : <FolderClosed className="h-4 w-4 text-primary" />}
            <span className="truncate text-muted-foreground">{file.name}</span>
          </button>
          {isExpanded && file.children?.map(child => renderFile(child, depth + 1))}
        </div>
      );
    }

    return (
      <div key={file.id} className="group relative">
        {renamingId === file.id ? (
          <div className="flex items-center px-2 py-1" style={{ paddingLeft: `${depth * 12 + 20}px` }}>
            <input
              autoFocus
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(file.id); if (e.key === 'Escape') setRenamingId(null); }}
              onBlur={() => handleRename(file.id)}
              className="flex-1 bg-secondary border border-primary/50 rounded px-1.5 py-0.5 text-xs outline-none"
            />
          </div>
        ) : (
          <button
            onClick={() => onSelectFile(file)}
            onDoubleClick={() => { setRenamingId(file.id); setRenameValue(file.name); }}
            className={`w-full flex items-center gap-1.5 px-2 py-1 text-sm rounded transition-colors ${
              isActive
                ? 'bg-primary/15 text-primary border-l-2 border-primary'
                : 'hover:bg-secondary/80 text-muted-foreground'
            }`}
            style={{ paddingLeft: `${depth * 12 + 20}px` }}
          >
            {getFileIcon(file.name)}
            <span className="truncate">{file.name}</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
              <button
                onClick={e => { e.stopPropagation(); setRenamingId(file.id); setRenameValue(file.name); }}
                className="p-0.5 hover:text-primary"
              >
                <Edit3 className="h-3 w-3" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDeleteFile(file.id); }}
                className="p-0.5 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-1">
          {/* New file input */}
          {isCreating && (
            <div className="flex items-center gap-1 px-2 py-1">
              <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={newFileName}
                onChange={e => setNewFileName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') { setIsCreating(false); setNewFileName(''); } }}
                onBlur={() => { if (newFileName.trim()) handleCreate(); else setIsCreating(false); }}
                placeholder="filename.js"
                className="flex-1 bg-secondary border border-primary/50 rounded px-1.5 py-0.5 text-xs outline-none"
              />
            </div>
          )}
          {files.map(f => renderFile(f))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default IDEFileExplorer;
