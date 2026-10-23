import React, { useState } from 'react';
import {
  File, Folder, FolderOpen, Plus, Trash2, Edit2, Check, X,
  FileCode, FileText, FileJson, FileType, ChevronRight, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator,
} from '@/components/ui/context-menu';

export interface VirtualFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: VirtualFile[];
  parentId?: string;
}

interface IDEFileExplorerProps {
  files: VirtualFile[];
  activeFileId: string | null;
  onSelectFile: (file: VirtualFile) => void;
  onCreateFile: (name: string, parentId?: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
}

const getFileIcon = (name: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': case 'jsx': case 'ts': case 'tsx': return <FileCode className="h-3.5 w-3.5 text-yellow-400" />;
    case 'py': return <FileCode className="h-3.5 w-3.5 text-blue-400" />;
    case 'java': return <FileCode className="h-3.5 w-3.5 text-orange-400" />;
    case 'c': case 'cpp': case 'h': return <FileCode className="h-3.5 w-3.5 text-cyan-400" />;
    case 'html': return <FileCode className="h-3.5 w-3.5 text-red-400" />;
    case 'css': return <FileCode className="h-3.5 w-3.5 text-blue-300" />;
    case 'json': return <FileJson className="h-3.5 w-3.5 text-yellow-300" />;
    case 'md': case 'txt': return <FileText className="h-3.5 w-3.5 text-zinc-400" />;
    case 'sh': case 'bash': return <FileType className="h-3.5 w-3.5 text-green-400" />;
    default: return <File className="h-3.5 w-3.5 text-zinc-500" />;
  }
};

const getLanguageFromFile = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', java: 'java', c: 'c', cpp: 'cpp', h: 'c',
    html: 'html', css: 'css', json: 'json', sh: 'bash', bash: 'bash',
    md: 'markdown', txt: 'text',
  };
  return map[ext || ''] || 'text';
};

const FileNode: React.FC<{
  file: VirtualFile;
  depth: number;
  activeFileId: string | null;
  onSelect: (f: VirtualFile) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onCreateFile: (name: string, parentId?: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
}> = ({ file, depth, activeFileId, onSelect, onDelete, onRename, onCreateFile, onCreateFolder }) => {
  const [expanded, setExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);

  const handleRename = () => {
    if (renameValue.trim() && renameValue !== file.name) {
      onRename(file.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  const isActive = file.id === activeFileId;

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <button
            onClick={() => {
              if (file.type === 'folder') setExpanded(!expanded);
              else onSelect(file);
            }}
            className={`w-full flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-zinc-800/60 transition-colors ${
              isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-zinc-400'
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {file.type === 'folder' ? (
              <>
                {expanded ? <ChevronDown className="h-3 w-3 text-zinc-600" /> : <ChevronRight className="h-3 w-3 text-zinc-600" />}
                {expanded ? <FolderOpen className="h-3.5 w-3.5 text-cyan-500" /> : <Folder className="h-3.5 w-3.5 text-cyan-700" />}
              </>
            ) : (
              <>
                <span className="w-3" />
                {getFileIcon(file.name)}
              </>
            )}
            {isRenaming ? (
              <form onSubmit={(e) => { e.preventDefault(); handleRename(); }} className="flex-1 flex items-center gap-1">
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleRename}
                  autoFocus
                  className="h-5 text-xs bg-zinc-800 border-zinc-700 px-1 py-0"
                />
              </form>
            ) : (
              <span className="truncate">{file.name}</span>
            )}
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-zinc-900 border-zinc-700 text-zinc-300 text-xs">
          {file.type === 'folder' && (
            <>
              <ContextMenuItem onClick={() => {
                const name = prompt('File name:');
                if (name) onCreateFile(name, file.id);
              }}>
                <Plus className="h-3 w-3 mr-2" />New File
              </ContextMenuItem>
              <ContextMenuItem onClick={() => {
                const name = prompt('Folder name:');
                if (name) onCreateFolder(name, file.id);
              }}>
                <Folder className="h-3 w-3 mr-2" />New Folder
              </ContextMenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <ContextMenuItem onClick={() => { setIsRenaming(true); setRenameValue(file.name); }}>
            <Edit2 className="h-3 w-3 mr-2" />Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDelete(file.id)} className="text-red-400 focus:text-red-400">
            <Trash2 className="h-3 w-3 mr-2" />Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {file.type === 'folder' && expanded && file.children?.map((child) => (
        <FileNode
          key={child.id}
          file={child}
          depth={depth + 1}
          activeFileId={activeFileId}
          onSelect={onSelect}
          onDelete={onDelete}
          onRename={onRename}
          onCreateFile={onCreateFile}
          onCreateFolder={onCreateFolder}
        />
      ))}
    </div>
  );
};

const IDEFileExplorer: React.FC<IDEFileExplorerProps> = ({
  files, activeFileId, onSelectFile, onCreateFile, onCreateFolder, onDeleteFile, onRenameFile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--ide-sidebar-bg,220_20%_10%))] text-zinc-400 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Explorer</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon"
            className="h-5 w-5 text-zinc-500 hover:text-zinc-300"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* New file input */}
      {isCreating && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newFileName.trim()) {
              onCreateFile(newFileName.trim());
              setNewFileName('');
              setIsCreating(false);
            }
          }}
          className="px-2 py-1 border-b border-zinc-800"
        >
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onBlur={() => { if (!newFileName.trim()) setIsCreating(false); }}
            placeholder="filename.ext"
            autoFocus
            className="h-6 text-xs bg-zinc-800 border-zinc-700 px-2 py-0"
          />
        </form>
      )}

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {files.map((file) => (
            <FileNode
              key={file.id}
              file={file}
              depth={0}
              activeFileId={activeFileId}
              onSelect={onSelectFile}
              onDelete={onDeleteFile}
              onRename={onRenameFile}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export { getLanguageFromFile };
export default IDEFileExplorer;
