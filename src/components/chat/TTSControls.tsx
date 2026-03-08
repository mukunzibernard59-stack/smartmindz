import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, Play, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TTSControlsProps {
  text: string;
  language: string;
  autoRead: boolean;
}

type TTSState = 'prompt' | 'playing' | 'paused' | 'dismissed';

const TTSControls: React.FC<TTSControlsProps> = ({ text, language, autoRead }) => {
  const [state, setState] = useState<TTSState>(autoRead ? 'playing' : 'prompt');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getLang = () => {
    switch (language) {
      case 'sw': return 'sw-KE';
      case 'fr': return 'fr-FR';
      case 'rw': return 'rw-RW';
      default: return 'en-US';
    }
  };

  const startSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLang();
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.onend = () => setState('dismissed');
    utterance.onerror = () => setState('dismissed');
    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
    setState('playing');
  };

  const pause = () => {
    window.speechSynthesis?.pause();
    setState('paused');
  };

  const resume = () => {
    window.speechSynthesis?.resume();
    setState('playing');
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setState('dismissed');
  };

  useEffect(() => {
    if (autoRead && text) {
      startSpeaking();
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (state === 'dismissed' || !text) return null;

  if (state === 'prompt') {
    return (
      <div className="flex items-center gap-2 mt-2 p-2 rounded-xl bg-primary/5 border border-primary/10 animate-fade-in">
        <Volume2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        <span className="text-xs text-muted-foreground">Read aloud?</span>
        <Button
          variant="default"
          size="sm"
          className="h-6 px-3 text-xs rounded-lg"
          onClick={startSpeaking}
        >
          Yes
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-3 text-xs rounded-lg"
          onClick={() => setState('dismissed')}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 mt-2 animate-fade-in">
      {state === 'playing' ? (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-primary" onClick={pause}>
          <Pause className="h-3 w-3" /> Pause
        </Button>
      ) : (
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-primary" onClick={resume}>
          <Play className="h-3 w-3" /> Resume
        </Button>
      )}
      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-destructive" onClick={stop}>
        <Square className="h-3 w-3" /> Stop
      </Button>
      {state === 'playing' && (
        <div className="flex gap-0.5 ml-1">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="w-1 bg-primary rounded-full animate-pulse" 
              style={{ height: `${8 + Math.random() * 8}px`, animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TTSControls;
