import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Mic, Brain, Sparkles, Volume2, VolumeX, LogIn, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useFileUpload } from '@/hooks/useFileUpload';
import { sanitizeInput, sanitizeErrorMessage } from '@/lib/security';
import LoginModal from '@/components/LoginModal';
import ChatHistorySidebar from '@/components/chat/ChatHistorySidebar';
import ChatMessage from '@/components/chat/ChatMessage';
import FileUploadMenu from '@/components/chat/FileUploadMenu';
import AIImageGenerator from '@/components/chat/AIImageGenerator';
import VoiceRecorder from '@/components/chat/VoiceRecorder';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const AIAssistantTab: React.FC = () => {
  const { language } = useLanguage();
  const { user, profile, isAuthenticated, getAccessToken } = useAuth();
  const {
    activeSession, groupedSessions, activeSessionId,
    addMessage, updateLastMessage, switchSession,
    deleteSession, renameSession, clearAllHistory, startNewChat,
  } = useChatHistory();
  const { files, isProcessing, uploadFiles, removeFile, clearFiles, getFileContext } = useFileUpload();

  const [loginOpen, setLoginOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try { return localStorage.getItem('smartmind_sidebar_open') === 'true'; } catch { return false; }
  });
  const [imageGenOpen, setImageGenOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [alwaysReadAloud, setAlwaysReadAloud] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messages = activeSession?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Persist sidebar state
  useEffect(() => {
    try { localStorage.setItem('smartmind_sidebar_open', String(sidebarOpen)); } catch {}
  }, [sidebarOpen]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
    };
  }, []);

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) { reject(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : language === 'rw' ? 'rw-RW' : 'en-US';
      utterance.rate = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); reject(); };
      window.speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setIsSpeaking(false); };

  const sendMessage = async (userText: string, isVoice = false) => {
    if (!isAuthenticated) { toast.error('Please sign in to chat'); setLoginOpen(true); return; }
    const sanitizedText = sanitizeInput(userText);
    if (!sanitizedText.trim()) { toast.error('Please enter a valid message'); return; }

    const fileContext = getFileContext();
    const fullMessage = fileContext ? `${fileContext}\n\nUser question: ${sanitizedText}` : sanitizedText;

    addMessage({ role: 'user', content: sanitizedText, attachments: files.map(f => ({ id: f.id, name: f.name, type: f.type, size: f.size })) });
    clearFiles();
    setIsLoading(true);

    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) { toast.error('Session expired.'); setLoginOpen(true); setIsLoading(false); return; }

        const historyMessages = messages.map(m => ({ role: m.role, content: m.content }));
        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ messages: [...historyMessages, { role: 'user', content: fullMessage }], language, isVoiceMode: isVoice || voiceMode }),
        });

        if (!resp.ok) {
          const error = await resp.json();
          if (resp.status === 401) { setLoginOpen(true); throw new Error(error.error || 'Please sign in'); }
          if (resp.status === 429) { toast.error('Rate limited. Please wait.'); break; }
          if (resp.status === 402) { toast.error('Usage limit reached.'); break; }
          throw new Error(error.error || 'Failed');
        }

        const reader = resp.body?.getReader();
        if (!reader) throw new Error('No response body');
        const decoder = new TextDecoder();
        let buffer = '';
        let assistantContent = '';
        addMessage({ role: 'assistant', content: '' });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf('\n')) !== -1) {
            let line = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 1);
            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (!line.startsWith('data: ')) continue;
            const json = line.slice(6).trim();
            if (json === '[DONE]') break;
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) { assistantContent += content; updateLastMessage(assistantContent); }
            } catch {}
          }
        }

        // TTS is now handled by TTSControls in ChatMessage
        break; // success
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, attempt * 1000));
          toast.info(`Retrying (${attempt + 1}/${MAX_RETRIES})...`);
        } else {
          console.error('Chat error:', error);
          toast.error(sanitizeErrorMessage(error));
          if (voiceMode) { setVoiceMode(false); stopSpeaking(); recognitionRef.current?.abort(); }
        }
      }
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    stopSpeaking();
    const text = input;
    setInput('');
    await sendMessage(text, false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { toast.error('Voice not supported'); return; }
    window.speechSynthesis?.cancel(); setIsSpeaking(false);
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : language === 'rw' ? 'rw-RW' : 'en-US';
    recognition.continuous = false; recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    let hasResult = false;
    recognition.onresult = async (e: any) => { hasResult = true; setIsRecording(false); await sendMessage(e.results[0][0].transcript, true); };
    recognition.onerror = (e: any) => { setIsRecording(false); if (e.error !== 'no-speech' && e.error !== 'aborted') toast.error('Could not hear you.'); };
    recognition.onend = () => { setIsRecording(false); if (!hasResult && voiceMode && isAuthenticated) setTimeout(() => startListening(), 300); };
    recognition.start();
  };

  const toggleVoiceMode = () => {
    if (!isAuthenticated) { toast.error('Please sign in'); setLoginOpen(true); return; }
    setVoiceMode(true);
  };

  const handleVoiceCancel = () => {
    setVoiceMode(false);
    stopSpeaking();
    recognitionRef.current?.abort();
    setIsRecording(false);
  };

  const handleVoiceSend = async (text: string) => {
    setVoiceMode(false);
    setIsRecording(false);
    await sendMessage(text, true);
  };

  const handleAIAction = (action: string) => {
    const prompts: Record<string, string> = {
      explain: 'Please explain this in detail: ', summarize: 'Please summarize: ',
      translate: 'Please translate to [language]: ', solve: 'Please solve step by step: ',
      brainstorm: 'Please brainstorm ideas for: ', rewrite: 'Please rewrite clearly: ',
      simplify: 'Please simplify: ',
      'build-app': 'Generate a detailed app-building prompt for: ',
      'design-letter': 'Write a professional letter for: ',
      'video-text': 'Create a text-to-video prompt for: ',
      'video-image': 'Describe an image-to-video animation for: ',
      'video-animation': 'Create an AI animation concept for: ',
      'video-script': 'Write a detailed video script for: ',
      'video-cinematic': 'Create a cinematic video production plan for: ',
    };
    setInput(prompts[action] || '');
  };

  const handleGenerateImage = async (prompt: string, style: string): Promise<string | null> => {
    const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const token = await getAccessToken();
        const resp = await fetch(IMAGE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` }, body: JSON.stringify({ prompt, style }) });
        if (!resp.ok) throw new Error('Failed');
        const data = await resp.json();
        return data.imageUrl;
      } catch (e) {
        if (attempt < 3) await new Promise(r => setTimeout(r, attempt * 1000));
        else throw e;
      }
    }
    return null;
  };

  const handlePasteText = (text: string) => {
    uploadFiles([new File([sanitizeInput(text)], 'pasted-text.txt', { type: 'text/plain' })]);
  };

  const popularQuestions = [
    'Build me a SaaS app idea', 'Write a business letter', 'Generate a startup plan',
    'Design a mobile app UI', 'Create an image prompt', 'Explain machine learning',
  ];

  return (
    <div className="relative flex h-full bg-background rounded-2xl overflow-hidden">
      <ChatHistorySidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}
        groupedSessions={groupedSessions} activeSessionId={activeSessionId}
        onSelectSession={switchSession} onNewChat={startNewChat}
        onDeleteSession={deleteSession} onClearHistory={clearAllHistory}
        onRenameSession={renameSession} onOpenImageGenerator={() => setImageGenOpen(true)}
        onOpenTool={(tool) => {
          const toolPrompts: Record<string, string> = {
            writer: 'Write a well-structured article about: ',
            detector: 'Analyze the following text and tell me if it was written by AI or a human:\n\n',
            youtube: 'Act as my YouTube tutor and teach me about: ',
            'build-app': 'Generate a detailed app-building prompt for: ',
            translate: 'Translate the following text to [target language]:\n\n',
          };
          if (toolPrompts[tool]) {
            startNewChat();
            setInput(toolPrompts[tool]);
          }
        }} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Apps, docs, ideas & more</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAlwaysReadAloud(!alwaysReadAloud)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${alwaysReadAloud ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}
              title={alwaysReadAloud ? 'Always read aloud (ON)' : 'Always read aloud (OFF)'}>
              {alwaysReadAloud ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {!isAuthenticated && (
              <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)} className="gap-1.5 h-7 text-xs">
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10 text-sm text-muted-foreground">
              Start a conversation — ask anything.
            </div>
          )}
          {messages.map((m, i) => {
            const isLatestAssistant = m.role === 'assistant' && m.content !== '' && 
              i === messages.map((msg, idx) => msg.role === 'assistant' && msg.content !== '' ? idx : -1).filter(x => x >= 0).pop();
            return <ChatMessage key={m.id} message={m} language={language} autoRead={alwaysReadAloud} isLatestAssistant={!!isLatestAssistant} userAvatarUrl={profile?.avatar_url} userInitials={profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'} />;
          })}
          {isLoading && messages.length > 0 && messages[messages.length - 1]?.content === '' && (
            <div className="flex gap-3 animate-fade-in">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-30" />
                <div className="relative w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary animate-pulse" />
                </div>
              </div>
              <div className="bg-secondary/80 backdrop-blur-sm rounded-2xl rounded-tl-md px-5 py-3.5 border border-border/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
                    <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.15s' }} />
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.3s' }} />
                  </div>
                  <span className="text-xs text-muted-foreground animate-pulse">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File uploads */}
        {files.length > 0 && (
          <div className="px-4 py-2 border-t border-border/30 flex gap-2 flex-wrap">
            {files.map(f => (
              <span key={f.id} className="text-xs bg-secondary px-2 py-1 rounded-lg flex items-center gap-1">
                {f.name}
                <button onClick={() => removeFile(f.id)} className="text-muted-foreground hover:text-destructive">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-border/30">
          <div className="flex gap-2">
            <FileUploadMenu files={files} isProcessing={isProcessing} onUpload={(fl) => uploadFiles(fl)} onRemoveFile={removeFile} onPasteText={handlePasteText} />
            <Button variant="secondary" size="icon"
              onClick={toggleVoiceMode} className="h-9 w-9"
              disabled={isLoading}>
              <Mic className="h-4 w-4" />
            </Button>
            <input type="text" value={input} onChange={(e) => { setInput(e.target.value); stopSpeaking(); }}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="h-9 w-9">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <VoiceRecorder isActive={voiceMode} onCancel={handleVoiceCancel} onSend={handleVoiceSend} language={language} />
      <AIImageGenerator isOpen={imageGenOpen} onClose={() => setImageGenOpen(false)} onGenerate={handleGenerateImage} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} defaultTab="login" />
    </div>
  );
};

export default AIAssistantTab;
