import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface VoiceContextType {
  isVoiceMode: boolean;
  setIsVoiceMode: (v: boolean) => void;
  speak: (text: string) => Promise<void>;
  listen: () => Promise<string>;
  isListening: boolean;
  isSpeaking: boolean;
  hasAsked: boolean;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const useVoice = () => {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be inside VoiceProvider');
  return ctx;
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const hasAskedRef = useRef(false);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) { resolve(); return; }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      setIsSpeaking(true);
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const listen = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) { reject('Speech recognition not supported'); return; }
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        resolve(transcript);
      };
      recognition.onerror = () => { setIsListening(false); resolve(''); };
      recognition.onend = () => { setIsListening(false); };
      recognition.start();
    });
  }, []);

  // Ask on first load
  useEffect(() => {
    if (hasAskedRef.current) return;
    hasAskedRef.current = true;
    
    const timer = setTimeout(async () => {
      try {
        await speak('Welcome to Ability Jobs. Do you need voice assistant?');
        const response = await listen();
        const lower = response.toLowerCase();
        if (lower.includes('yes') || lower.includes('yeah') || lower.includes('sure')) {
          setIsVoiceMode(true);
          await speak('Voice mode activated. I will guide you through the website.');
        } else {
          await speak('Okay, you can browse normally. You can enable voice mode anytime from the menu.');
        }
      } catch {
        // Speech not supported, continue normally
      }
      setHasAsked(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak, listen]);

  return (
    <VoiceContext.Provider value={{ isVoiceMode, setIsVoiceMode, speak, listen, isListening, isSpeaking, hasAsked }}>
      {children}
    </VoiceContext.Provider>
  );
};
