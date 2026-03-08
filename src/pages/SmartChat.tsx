import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff, Brain, Sparkles, Volume2, VolumeX, LogIn, Menu, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useFileUpload } from '@/hooks/useFileUpload';
import { sanitizeInput, sanitizeErrorMessage } from '@/lib/security';
import LoginModal from '@/components/LoginModal';
import ChatHistorySidebar from '@/components/chat/ChatHistorySidebar';
import ChatMessage from '@/components/chat/ChatMessage';
import FileUploadMenu from '@/components/chat/FileUploadMenu';
import AITutorMenu from '@/components/chat/AITutorMenu';
import AIImageGenerator from '@/components/chat/AIImageGenerator';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;

const SmartChat: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, getAccessToken } = useAuth();
  const {
    activeSession,
    groupedSessions,
    activeSessionId,
    addMessage,
    updateLastMessage,
    switchSession,
    deleteSession,
    renameSession,
    clearAllHistory,
    startNewChat,
  } = useChatHistory();
  const { files, isProcessing, uploadFiles, removeFile, clearFiles, getFileContext } = useFileUpload();

  const [loginOpen, setLoginOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
    };
  }, []);

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : language === 'rw' ? 'rw-RW' : 'en-US';
      utterance.rate = 1.1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        reject();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const sendMessage = async (userText: string, isVoice: boolean = false) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to chat');
      setLoginOpen(true);
      return;
    }

    // Sanitize user input
    const sanitizedText = sanitizeInput(userText);
    if (!sanitizedText.trim()) {
      toast.error('Please enter a valid message');
      return;
    }

    // Build context with file attachments
    const fileContext = getFileContext();
    const fullMessage = fileContext 
      ? `${fileContext}\n\nUser question: ${sanitizedText}`
      : sanitizedText;

    const userMsg = addMessage({
      role: 'user',
      content: sanitizedText,
      attachments: files.map(f => ({ id: f.id, name: f.name, type: f.type, size: f.size })),
    });

    clearFiles();
    setIsLoading(true);

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        toast.error('Session expired. Please sign in again.');
        setLoginOpen(true);
        setIsLoading(false);
        return;
      }

      const historyMessages = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messages: [...historyMessages, { role: 'user', content: fullMessage }],
          language,
          isVoiceMode: isVoice || voiceMode,
        }),
      });

      if (!resp.ok) {
        const error = await resp.json();

        if (resp.status === 401) {
          setLoginOpen(true);
          throw new Error(error.error || 'Please sign in to continue');
        }

        throw new Error(error.error || 'Failed to get response');
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let assistantContent = '';

      // Add empty assistant message
      addMessage({ role: 'assistant', content: '' });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              updateLastMessage(assistantContent);
            }
          } catch {}
        }
      }

      // TTS is now handled by TTSControls in ChatMessage
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(sanitizeErrorMessage(error));

      if (voiceMode) {
        setVoiceMode(false);
        stopSpeaking();
        recognitionRef.current?.abort();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    stopSpeaking();

    const text = input;
    setInput('');

    await sendMessage(text, false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice not supported on this browser');
      return;
    }

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : language === 'rw' ? 'rw-RW' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);

    let hasResult = false;

    recognition.onresult = async (event: any) => {
      hasResult = true;
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);

      await sendMessage(transcript, true);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);

      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        toast.error('Could not hear you. Try again.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (!hasResult && voiceMode && isAuthenticated) {
        setTimeout(() => startListening(), 300);
      }
    };

    recognition.start();
  };

  const toggleVoiceMode = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to use voice mode');
      setLoginOpen(true);
      return;
    }

    if (!voiceMode) {
      setVoiceMode(true);
      toast.success('Voice mode ON');

      const greeting =
        language === 'sw'
          ? 'Habari! Nikusaidie nini leo?'
          : language === 'fr'
          ? "Bonjour! Comment puis-je vous aider aujourd'hui?"
          : language === 'rw'
          ? 'Muraho! Nakubwire iki uyu munsi?'
          : 'Hi there! What can I help you with today?';

      try {
        await speakText(greeting);
        startListening();
      } catch {
        startListening();
      }
    } else {
      setVoiceMode(false);
      stopSpeaking();
      recognitionRef.current?.abort();
      setIsRecording(false);
      toast.info('Voice mode OFF');
    }
  };

  const handleAIAction = (action: string) => {
    const actionPrompts: Record<string, string> = {
      explain: 'Please explain this in detail: ',
      summarize: 'Please summarize: ',
      translate: 'Please translate to [language]: ',
      solve: 'Please solve this step by step: ',
      brainstorm: 'Please brainstorm ideas for: ',
      rewrite: 'Please rewrite this text to be clearer: ',
      simplify: 'Please simplify this so it is easier to understand: ',
    };

    setInput(actionPrompts[action] || '');
  };

  const handleGenerateImage = async (prompt: string, style: string): Promise<string | null> => {
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const accessToken = await getAccessToken();

        const resp = await fetch(IMAGE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken || ''}`,
          },
          body: JSON.stringify({ prompt, style }),
        });

        if (!resp.ok) {
          const error = await resp.json();
          // Don't retry on 401/402 (auth/billing issues)
          if (resp.status === 401 || resp.status === 402) {
            throw new Error(error.error || 'Failed to generate image');
          }
          throw new Error(error.error || 'Failed to generate image');
        }

        const data = await resp.json();
        return data.imageUrl;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`Image generation attempt ${attempt}/${MAX_RETRIES} failed:`, lastError.message);

        if (attempt < MAX_RETRIES) {
          // Exponential backoff: 1s, 2s
          await new Promise(r => setTimeout(r, attempt * 1000));
          toast.info(`Retrying image generation (${attempt + 1}/${MAX_RETRIES})...`);
        }
      }
    }

    console.error('Image generation failed after all retries');
    throw lastError || new Error('Image generation failed. Please try again.');
  };

  const handlePasteText = (text: string) => {
    const sanitized = sanitizeInput(text);
    uploadFiles([new File([sanitized], 'pasted-text.txt', { type: 'text/plain' })]);
  };

  const popularQuestions = [
    'What is photosynthesis?',
    'Solve x² + 5x + 6 = 0',
    "Explain Newton's laws",
    'Help with essay writing',
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatHistorySidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        groupedSessions={groupedSessions}
        activeSessionId={activeSessionId}
        onSelectSession={switchSession}
        onNewChat={startNewChat}
        onDeleteSession={deleteSession}
        onClearHistory={clearAllHistory}
        onRenameSession={renameSession}
        onOpenImageGenerator={() => setImageGenOpen(true)}
      />

      {/* Main Chat Area */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-72' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Smart Mind AI</h1>
              <p className="text-xs text-muted-foreground">Intelligent learning assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AITutorMenu
              onSelectAction={handleAIAction}
              onOpenImageGenerator={() => setImageGenOpen(true)}
            />

            <button
              onClick={() => setAlwaysReadAloud(!alwaysReadAloud)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                alwaysReadAloud ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
              }`}
              title={alwaysReadAloud ? 'Always read aloud (ON)' : 'Always read aloud (OFF)'}
            >
              {alwaysReadAloud ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            {!isAuthenticated && (
              <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)} className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Smart Mind AI</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Ask me anything about any subject. I can explain, solve problems, translate, and more!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, i) => {
            const isLatestAssistant = message.role === 'assistant' && message.content !== '' &&
              i === messages.map((msg, idx) => msg.role === 'assistant' && msg.content !== '' ? idx : -1).filter(x => x >= 0).pop();
            return <ChatMessage key={message.id} message={message} language={language} autoRead={alwaysReadAloud} isLatestAssistant={!!isLatestAssistant} />;
          })}

          {isLoading && messages.length > 0 && messages[messages.length - 1]?.content === '' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Mode Indicator */}
        {voiceMode && (
          <div className="px-4 py-2 bg-primary/10 border-t border-primary/20 flex items-center justify-center gap-2 text-sm text-primary">
            {isRecording ? (
              <>
                <Mic className="h-4 w-4 animate-pulse" />
                <span>Listening...</span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span>Speaking...</span>
              </>
            ) : isLoading ? (
              <>
                <Brain className="h-4 w-4 animate-pulse" />
                <span>Thinking...</span>
              </>
            ) : null}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <FileUploadMenu
              files={files}
              isProcessing={isProcessing}
              onUpload={(fileList) => uploadFiles(fileList)}
              onRemoveFile={removeFile}
              onPasteText={handlePasteText}
            />

            <Button
              variant={voiceMode ? 'destructive' : isRecording ? 'destructive' : 'secondary'}
              size="icon"
              onClick={toggleVoiceMode}
              className={`flex-shrink-0 ${voiceMode ? 'animate-pulse' : ''}`}
              disabled={isLoading && !voiceMode}
              title={voiceMode ? 'Stop voice conversation' : 'Start voice conversation'}
            >
              {voiceMode ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {isSpeaking && (
              <Button variant="outline" size="icon" onClick={stopSpeaking} className="flex-shrink-0" title="Stop speaking">
                <VolumeX className="h-4 w-4" />
              </Button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (e.target.value && isSpeaking) {
                  stopSpeaking();
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              onFocus={() => isSpeaking && stopSpeaking()}
              placeholder={voiceMode ? 'Voice mode active...' : t('chat.placeholder')}
              disabled={isLoading || voiceMode}
              className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || voiceMode}
              className="flex-shrink-0"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <AIImageGenerator
        isOpen={imageGenOpen}
        onClose={() => setImageGenOpen(false)}
        onGenerate={handleGenerateImage}
      />
    </div>
  );
};

export default SmartChat;
