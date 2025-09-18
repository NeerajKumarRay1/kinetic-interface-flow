import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

// Simple type declarations for Web Speech API
interface SpeechRecognitionEvent {
  results: any;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface VoiceChatOptions {
  language?: string;
  voiceURI?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useVoiceChat = (options: VoiceChatOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const hasSynthesis = 'speechSynthesis' in window;
    
    setIsSupported(hasRecognition && hasSynthesis);
    
    if (hasRecognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = options.language || 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Voice input failed. Please try again! 🎤';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Try speaking a bit louder! 📢';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access needed for voice chat! 🎤';
        }
        
        toast({
          title: 'Voice Input Issue',
          description: errorMessage,
          duration: 3000,
        });
      };
    }
    
    if (hasSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
  }, [options.language]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      toast({
        title: 'Voice Not Available',
        description: 'Your browser doesn\'t support voice input! 😔',
        duration: 3000,
      });
      return;
    }
    
    if (isListening) return;
    
    setTranscript('');
    try {
      recognitionRef.current.start();
      toast({
        title: 'Listening... 👂',
        description: 'Speak your message now!',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast({
        title: 'Voice Input Failed',
        description: 'Couldn\'t start listening. Try again! 🎤',
        duration: 3000,
      });
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !synthRef.current || !text.trim()) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.8;
    
    // Try to use a nice voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: 'Speech Failed',
        description: 'Couldn\'t read the message aloud! 🔇',
        duration: 2000,
      });
    };
    
    synthRef.current.speak(utterance);
  }, [isSupported, options.rate, options.pitch, options.volume]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSupported,
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
};