import React from 'react';
import { Brain, User, File, Image } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage as ChatMessageType } from '@/hooks/useChatHistory';
import TTSControls from './TTSControls';

interface ChatMessageProps {
  message: ChatMessageType;
  language?: string;
  autoRead?: boolean;
  isLatestAssistant?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, language = 'en', autoRead = false, isLatestAssistant = false }) => {
  const showTTS = message.role === 'assistant' && message.content && isLatestAssistant;

  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Brain className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'bg-secondary rounded-tl-md'
        }`}
      >
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded ${
                  message.role === 'user' ? 'bg-primary-foreground/20' : 'bg-muted'
                }`}
              >
                {file.type.startsWith('image/') ? <Image className="h-3 w-3" /> : <File className="h-3 w-3" />}
                <span className="truncate max-w-24">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className={`text-sm leading-relaxed ${
          message.role === 'assistant' ? 'prose prose-sm max-w-none dark:prose-invert' : ''
        }`}>
          {message.role === 'assistant' ? (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1 py-0.5 rounded text-xs" {...props}>{children}</code>
                  ) : (
                    <code className="block bg-muted p-2 rounded text-xs overflow-x-auto my-2" {...props}>{children}</code>
                  );
                },
                pre: ({ children }) => <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2">{children}</pre>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">{children}</a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {showTTS && (
          <TTSControls text={message.content} language={language} autoRead={autoRead} />
        )}
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-accent" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
