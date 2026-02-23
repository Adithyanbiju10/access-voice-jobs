import { useVoice } from '@/contexts/VoiceContext';
import { Mic } from 'lucide-react';

const VoiceOverlay = () => {
  const { isListening, isSpeaking } = useVoice();

  if (!isListening && !isSpeaking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        <div className={`rounded-full bg-primary p-6 ${isListening ? 'voice-pulse' : 'animate-pulse'}`}>
          <Mic className="h-10 w-10 text-primary-foreground" />
        </div>
        <p className="text-lg font-heading font-semibold text-foreground">
          {isListening ? 'Listening...' : 'Speaking...'}
        </p>
      </div>
    </div>
  );
};

export default VoiceOverlay;
