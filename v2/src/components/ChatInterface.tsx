import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff, Brain, User, Sparkles, Volume2, VolumeX, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatInterface: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, getAccessToken } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('chat.welcome'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup speech synthesis on unmount
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

  const sendAndSpeak = async (userText: string, isVoice: boolean = false) => {
    // Require authentication
    if (!isAuthenticated) {
      toast.error('Please sign in to chat');
      setLoginOpen(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    let assistantContent = '';

    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        toast.error('Session expired. Please sign in again.');
        setLoginOpen(true);
        setIsLoading(false);
        return;
      }

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.id !== '1'), userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          language,
          isVoiceMode: isVoice || voiceMode,
        }),
      });

      if (!resp.ok) {
        const error = await resp.json();
        
        // Handle auth errors
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

      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }]);

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
              setMessages(prev => prev.map(m => 
                m.id === assistantId ? { ...m, content: assistantContent } : m
              ));
            }
          } catch {}
        }
      }

      // Only speak response if this was a voice input AND (autoSpeak is on or in voice mode)
      // Text input should NOT trigger read-aloud
      if (assistantContent && isVoice && (autoSpeak || voiceMode)) {
        await speakText(assistantContent);
        // Continue listening if in voice mode and still has access
        if (voiceMode && isAuthenticated) {
          startListening();
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      setMessages(prev => prev.slice(0, -1));
      
      // Stop voice mode on error
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
    
    // Stop any ongoing speech when user sends text
    stopSpeaking();
    
    const text = input;
    setInput('');
    
    // Send message but don't auto-speak response (text input = no read aloud)
    await sendAndSpeak(text, false);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice not supported on this browser');
      return;
    }

    // Cancel any ongoing speech before listening
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
      
      // Send message and get voice response (access is checked server-side)
      await sendAndSpeak(transcript, true);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      
      // Only show error for non-silence errors
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        toast.error('Could not hear you. Try again.');
      }
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      // If no result was captured and still in voice mode, keep listening
      if (!hasResult && voiceMode && isAuthenticated) {
        setTimeout(() => startListening(), 300);
      }
    };
    
    recognition.start();
  };

  const toggleVoiceMode = async () => {
    // Require authentication for voice mode
    if (!isAuthenticated) {
      toast.error('Please sign in to use voice mode');
      setLoginOpen(true);
      return;
    }

    if (!voiceMode) {
      // Enter voice mode - greet the user first
      setVoiceMode(true);
      toast.success('Voice mode ON');
      
      // Speak greeting first, then start listening
      const greeting = language === 'sw' ? 'Habari! Nikusaidie nini leo?' 
        : language === 'fr' ? 'Bonjour! Comment puis-je vous aider aujourd\'hui?'
        : language === 'rw' ? 'Muraho! Nakubwire iki uyu munsi?'
        : 'Hi there! What can I help you with today?';
      
      try {
        await speakText(greeting);
        startListening();
      } catch {
        startListening();
      }
    } else {
      // Exit voice mode
      setVoiceMode(false);
      stopSpeaking();
      recognitionRef.current?.abort();
      setIsRecording(false);
      toast.info('Voice mode OFF');
    }
  };

  const popularQuestions = [
    "What is photosynthesis?",
    "Solve x² + 5x + 6 = 0",
    "Explain Newton's laws",
    "Help with essay writing",
  ];

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Smart Mind</h3>
            <p className="text-xs text-muted-foreground">Fast AI answers</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-speak toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
              autoSpeak ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
            }`}
            title={autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
          >
            {autoSpeak ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            <span className="hidden sm:inline">{autoSpeak ? 'Speaking' : 'Muted'}</span>
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="hidden sm:inline">Signed in</span>
            </div>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            >
              <LogIn className="h-3 w-3" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Brain className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-tr-md'
                : 'bg-secondary rounded-tl-md'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <User className="h-3.5 w-3.5 text-accent" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <div className="bg-secondary rounded-2xl rounded-tl-md px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {t('popular.title')}
          </p>
          <div className="flex flex-wrap gap-2">
            {popularQuestions.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border">
        {/* Voice mode indicator */}
        {voiceMode && (
          <div className="mb-2 flex items-center justify-center gap-2 text-sm text-primary animate-pulse">
            {isRecording ? (
              <>
                <Mic className="h-4 w-4" />
                <span>Listening...</span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 className="h-4 w-4" />
                <span>Speaking...</span>
              </>
            ) : isLoading ? (
              <>
                <Brain className="h-4 w-4" />
                <span>Thinking...</span>
              </>
            ) : null}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant={voiceMode ? 'destructive' : isRecording ? 'destructive' : 'secondary'}
            size="icon"
            onClick={toggleVoiceMode}
            className={`flex-shrink-0 h-9 w-9 ${voiceMode ? 'animate-pulse' : ''}`}
            disabled={isLoading && !voiceMode}
            title={voiceMode ? 'Stop voice conversation' : 'Start voice conversation'}
          >
            {voiceMode ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          {isSpeaking && (
            <Button
              variant="outline"
              size="icon"
              onClick={stopSpeaking}
              className="flex-shrink-0 h-9 w-9"
              title="Stop speaking"
            >
              <VolumeX className="h-4 w-4" />
            </Button>
          )}
          
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Stop any ongoing speech when user starts typing
              if (e.target.value && isSpeaking) {
                stopSpeaking();
              }
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => {
              // Stop speech when user focuses on input (intends to type)
              if (isSpeaking) {
                stopSpeaking();
              }
            }}
            placeholder={voiceMode ? 'Voice mode active...' : t('chat.placeholder')}
            disabled={isLoading || voiceMode}
            className="flex-1 px-3 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading || voiceMode} className="flex-shrink-0 h-9 w-9" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
};

export default ChatInterface;
