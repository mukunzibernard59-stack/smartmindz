import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff, Brain, User, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const ChatInterface: React.FC = () => {
  const { t, language } = useLanguage();
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
  const [voiceUsesLeft, setVoiceUsesLeft] = useState(() => {
    const stored = localStorage.getItem('voiceUsesLeft');
    const storedDate = localStorage.getItem('voiceUsesDate');
    const today = new Date().toDateString();
    if (storedDate !== today) {
      localStorage.setItem('voiceUsesDate', today);
      localStorage.setItem('voiceUsesLeft', '5');
      return 5;
    }
    return stored ? parseInt(stored) : 5;
  });
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

  const sendAndSpeak = async (userText: string) => {
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
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.id !== '1'), userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      if (!resp.ok) {
        const error = await resp.json();
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

      // If in voice mode, speak the response then listen again
      if (voiceMode && assistantContent) {
        await speakText(assistantContent);
        // Continue listening after speaking
        if (voiceMode && voiceUsesLeft > 0) {
          startListening();
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput('');
    await sendAndSpeak(text);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice not supported on this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : language === 'rw' ? 'rw-RW' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      
      // Use voice credit
      const newUses = voiceUsesLeft - 1;
      setVoiceUsesLeft(newUses);
      localStorage.setItem('voiceUsesLeft', String(newUses));
      
      if (newUses <= 0) {
        setVoiceMode(false);
        toast.info('Voice limit reached. Switching to text mode.');
      }
      
      // Send message and get voice response
      await sendAndSpeak(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error !== 'no-speech') {
        toast.error('Could not hear you. Try again.');
      }
      // Restart listening if still in voice mode
      if (voiceMode && voiceUsesLeft > 0 && event.error === 'no-speech') {
        setTimeout(() => startListening(), 500);
      }
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
  };

  const toggleVoiceMode = async () => {
    if (voiceUsesLeft <= 0) {
      toast.error('Voice limit reached. Try again in 24 hours or upgrade to Pro.');
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
        // After greeting, start listening
        if (voiceUsesLeft > 0) {
          startListening();
        }
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
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mic className="h-3 w-3" />
          <span>{voiceUsesLeft}/5</span>
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
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={voiceMode ? 'Voice mode active...' : t('chat.placeholder')}
            disabled={isLoading || voiceMode}
            className="flex-1 px-3 py-2 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading || voiceMode} className="flex-shrink-0 h-9 w-9" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
