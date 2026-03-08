import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  isActive: boolean;
  onCancel: () => void;
  onSend: (transcript: string) => void;
  language: string;
}

const BAR_COUNT = 40;

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ isActive, onCancel, onSend, language }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [bars, setBars] = useState<number[]>(new Array(BAR_COUNT).fill(4));

  const recognitionRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const finalTranscriptRef = useRef('');

  const getLang = () => {
    switch (language) {
      case 'sw': return 'sw-KE';
      case 'fr': return 'fr-FR';
      case 'rw': return 'rw-RW';
      default: return 'en-US';
    }
  };

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const newBars: number[] = [];
        const step = Math.floor(dataArray.length / BAR_COUNT);
        for (let i = 0; i < BAR_COUNT; i++) {
          const idx = Math.min(i * step, dataArray.length - 1);
          const val = dataArray[idx] / 255;
          // Map to height between 4 and 48px, with some smoothing
          newBars.push(4 + val * 44);
        }
        setBars(newBars);
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();
    } catch {
      // Mic permission denied — bars stay flat
    }
  }, []);

  const startRecognition = useCallback(() => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = getLang();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e: any) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      finalTranscriptRef.current = final;
      setTranscript((final + interim).trim());
    };

    recognition.onerror = (e: any) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.warn('Speech recognition error:', e.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if still active
      if (recognitionRef.current) {
        try { recognition.start(); } catch {}
      }
    };

    recognition.start();
  }, [language]);

  useEffect(() => {
    if (isActive) {
      setTranscript('');
      finalTranscriptRef.current = '';
      startAudio();
      startRecognition();
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
      setBars(new Array(BAR_COUNT).fill(4));
    };
  }, [isActive, startAudio, startRecognition]);

  const handleCancel = () => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    onCancel();
  };

  const handleSend = () => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    const text = transcript.trim();
    if (text) onSend(text);
    else onCancel();
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl animate-fade-in">
      {/* Top transcript area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* Listening indicator */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isListening ? "bg-destructive animate-pulse" : "bg-muted-foreground"
          )} />
          <span className="text-sm font-medium text-muted-foreground">
            {isListening ? 'Listening...' : 'Starting...'}
          </span>
        </div>

        {/* Mic icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <Mic className={cn(
            "h-8 w-8 text-primary transition-transform",
            isListening && "scale-110"
          )} />
        </div>

        {/* Transcript preview */}
        <div className="w-full max-w-lg min-h-[60px] text-center">
          {transcript ? (
            <p className="text-base text-foreground leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Speak now...</p>
          )}
        </div>
      </div>

      {/* Waveform + controls */}
      <div className="px-4 pb-6 space-y-4">
        {/* Waveform visualization */}
        <div className="flex items-center justify-center gap-[2px] h-14 px-2">
          {bars.map((height, i) => (
            <div
              key={i}
              className="rounded-full bg-primary transition-[height] duration-75 ease-out"
              style={{
                width: '3px',
                height: `${height}px`,
                opacity: 0.4 + (height / 48) * 0.6,
              }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCancel}
            className="rounded-full w-14 h-14 p-0 border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
          >
            <X className="h-6 w-6 text-destructive" />
          </Button>

          <Button
            size="lg"
            onClick={handleSend}
            disabled={!transcript.trim()}
            className="rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90 shadow-primary"
          >
            <Check className="h-6 w-6 text-primary-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
