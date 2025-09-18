import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertTriangle, CheckCircle, Info, Heart, Star, User, LogOut, Mic, MicOff, Volume2, VolumeX, Settings2, Download, Keyboard, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Message } from './Message';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { TransparencyPanel } from './TransparencyPanel';
import { AppealDialog } from './AppealDialog';
import { AuthModal } from './AuthModal';
import { MemoriesModal } from './MemoriesModal';
import { FriendlyAvatar } from './FriendlyAvatar';
import { QuickReplies } from './QuickReplies';
import { SettingsModal } from './SettingsModal';
import { MessageExport } from './MessageExport';
import { ShortcutsHelp } from './ShortcutsHelp';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const GEMINI_API_KEY = 'AIzaSyBbcf0U9HHNEDtkgDpj6ASx7FRfDRkONNI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY;

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  confidence?: number;
  transparencyData?: {
    reasoning: string;
    sources: string[];
    ethicalConsiderations: string[];
  };
  ethicalFlags?: string[];
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [showTransparency, setShowTransparency] = useState(false);
  const [showAppeal, setShowAppeal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice chat functionality
  const voiceChat = useVoiceChat({
    volume: parseFloat(localStorage.getItem('voice-volume') || '0.8')
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts({
    onSendMessage: () => handleSendMessage(),
    onNewChat: () => {
      setMessages([]);
      toast({
        title: "Fresh Start! 🌟",
        description: "Ready for a new conversation!",
        duration: 2000,
      });
    },
    onToggleHistory: () => setShowMemories(!showMemories),
    onToggleSettings: () => setShowSettings(!showSettings),
    onToggleVoice: () => {
      if (voiceChat.isListening) {
        voiceChat.stopListening();
      } else {
        voiceChat.startListening();
      }
    },
    onFocusInput: () => textareaRef.current?.focus(),
    onEscape: () => {
      setShowMemories(false);
      setShowSettings(false);
      setShowExport(false);
      setShowShortcuts(false);
      setShowAuth(false);
      setShowTransparency(false);
      setShowAppeal(false);
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle voice transcript
  useEffect(() => {
    if (voiceChat.transcript) {
      setInput(voiceChat.transcript);
    }
  }, [voiceChat.transcript]);

  // Auto-speak AI responses if enabled
  useEffect(() => {
    const isVoiceEnabled = localStorage.getItem('voice-enabled') === 'true';
    if (isVoiceEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'bot' && !voiceChat.isSpeaking) {
        // Add a small delay before speaking
        setTimeout(() => {
          voiceChat.speak(lastMessage.content);
        }, 500);
      }
    }
  }, [messages, voiceChat.speak, voiceChat.isSpeaking]);

  // Initialize with welcome message after user logs in
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `Hello ${user.name}! 🌟 I'm your friendly ethical AI assistant, and I'm absolutely delighted to meet you! I'm here to provide transparent, caring, and helpful responses. What wonderful conversation shall we have today?`,
        timestamp: new Date(),
        confidence: 0.95,
        transparencyData: {
          reasoning: 'Personalized welcome message designed to be warm and inviting.',
          sources: ['User profile', 'Ethical guidelines', 'Welcoming protocols'],
          ethicalConsiderations: ['Personal connection', 'Transparency', 'Positive user experience']
        }
      };
      setMessages([welcomeMessage]);
      
      // Show celebration for first login
      toast({
        title: "You've made your mark! 🎉",
        description: "Welcome to our magical conversation space!",
      });
    }
  }, [user, messages.length]);

  const makeGeminiAPICall = async (userMessage: string): Promise<ChatMessage> => {
    try {
      const systemPrompt = `You are an ethical AI assistant committed to providing transparent, unbiased, and helpful responses. Always prioritize user safety and well-being. Be transparent about limitations and provide factual information.`;
      
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: systemPrompt }], role: 'user' },
            { parts: [{ text: "I understand and will follow these ethical guidelines." }], role: 'model' },
            { parts: [{ text: userMessage }], role: 'user' }
          ]
        })
      });

      const data = await response.json();
      let botReply = '';
      let confidence = 0.8;
      
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
        botReply = data.candidates[0].content.parts[0].text;
      } else {
        botReply = "I'm sorry, I couldn't process your request at the moment. Please try again.";
        confidence = 0.3;
      }

      // Simple ethical analysis
      const lowercaseMessage = userMessage.toLowerCase();
      const lowercaseReply = botReply.toLowerCase();
      let ethicalFlags: string[] = [];
      let reasoning = 'Standard response with factual information';
      
      if (lowercaseMessage.includes('password') || lowercaseMessage.includes('personal')) {
        confidence = Math.min(confidence, 0.4);
        ethicalFlags = ['privacy-concern'];
        reasoning = 'Request involves sensitive information that requires privacy protection';
      } else if (lowercaseMessage.includes('fake') || lowercaseMessage.includes('lie')) {
        confidence = Math.min(confidence, 0.5);
        ethicalFlags = ['misinformation-risk'];
        reasoning = 'Content may involve misinformation concerns';
      } else if (lowercaseReply.includes('according to') || lowercaseReply.includes('research shows')) {
        confidence = Math.min(confidence + 0.1, 1.0);
        reasoning = 'Response includes factual references and citations';
      }

      return {
        id: Date.now().toString(),
        type: 'bot',
        content: botReply,
        timestamp: new Date(),
        confidence,
        transparencyData: {
          reasoning,
          sources: ['Gemini AI', 'Ethical guidelines', 'Knowledge base'],
          ethicalConsiderations: ['Accuracy verification', 'Bias mitigation', 'User safety']
        },
        ethicalFlags
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI service. Please try again.",
        variant: "destructive",
      });
      
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        confidence: 0.2,
        transparencyData: {
          reasoning: 'Technical error occurred during processing',
          sources: ['Error handling system'],
          ethicalConsiderations: ['User notification', 'Transparency about limitations']
        },
        ethicalFlags: ['technical-error']
      };
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    // Celebrate milestones
    if (messageCount === 0) {
      toast({
        title: "Your first message! ✨",
        description: "This is the beginning of something wonderful!",
      });
    } else if (messageCount === 9) {
      toast({
        title: "10 messages! 🎉", 
        description: "You're on a roll! I love our conversation!",
      });
    }

    try {
      const botResponse = await makeGeminiAPICall(messageToSend);
      setMessages(prev => [...prev, botResponse]);
      
      // Show motivational message occasionally
      if (Math.random() < 0.15) {
        setTimeout(() => {
          toast({
            title: "💫 AI Sparkle Fact",
            description: "Did you know? Every conversation teaches me to be more helpful and understanding!",
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleShowTransparency = (message: ChatMessage) => {
    setSelectedMessage(message);
    setShowTransparency(true);
  };

  const handleAppeal = (message: ChatMessage) => {
    setSelectedMessage(message);
    setShowAppeal(true);
  };

  const handleAuth = () => {
    setShowAuth(true);
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setMessageCount(0);
    toast({
      title: "See you soon, friend! 👋",
      description: "Thanks for the wonderful conversations!",
    });
  };

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const handleLoadMemory = (memoryId: string) => {
    // In a real app, this would load the actual conversation
    toast({
      title: "Memory loaded! 📖",
      description: "This is where the saved conversation would appear!",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="chat-container w-full max-w-2xl h-[700px] flex flex-col animate-scale-in">
        {/* Enhanced Header */}
        <div className="chat-header flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <FriendlyAvatar 
              size="md" 
              mood={voiceChat.isListening ? "excited" : voiceChat.isSpeaking ? "happy" : "thoughtful"} 
              animate={voiceChat.isListening || voiceChat.isSpeaking}
            />
            <div>
              <h1 className="font-bold text-lg">Ethical AI Assistant</h1>
              <p className="text-sm opacity-90">
                {voiceChat.isListening ? 'Listening... 👂' : 
                 voiceChat.isSpeaking ? 'Speaking... 🗣️' : 
                 'Making every interaction joyful! ✨'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(true)}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              title="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              title="Settings (Ctrl+,)"
            >
              <Settings2 className="w-4 h-4" />
            </Button>
            
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExport(true)}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                title="Export conversation"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMemories(true)}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  My Memories
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAuth}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <User className="w-4 h-4 mr-1" />
                Log In
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!user ? (
            <Card className="p-8 text-center bg-gradient-card border border-border/50 animate-fade-in">
              <FriendlyAvatar size="xl" mood="excited" className="mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-gradient">
                Welcome to Our Magical Space! 🌟
              </h2>
              <p className="text-muted-foreground mb-6">
                Ready to have the most delightful AI conversations? Log in to start creating wonderful memories together!
              </p>
              <Button 
                onClick={handleAuth}
                className="bg-gradient-primary hover:opacity-90 text-white font-medium px-6 py-3 rounded-xl hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-4 h-4 mr-2" />
                Join the Magic! ✨
              </Button>
            </Card>
          ) : (
            <>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  onShowTransparency={handleShowTransparency}
                  onAppeal={handleAppeal}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-3 animate-fade-in">
                  <FriendlyAvatar size="sm" mood="thoughtful" />
                  <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 border border-border/50">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-typing" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-typing" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-typing" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Enhanced Input Area */}
        {user && (
          <div className="p-6 border-t border-border/50 space-y-4">
            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="animate-fade-in">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  ✨ Try these conversation starters:
                </p>
                <QuickReplies onReplySelect={(message) => handleSendMessage(message)} />
              </div>
            )}
            
            {/* Input with Voice Controls */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts... I'm here to help make your day brighter! 💫"
                  className="min-h-[44px] max-h-32 resize-none bg-muted/50 border-border/50 focus:border-primary/50 rounded-2xl px-4 py-3 transition-smooth"
                  disabled={isTyping}
                  rows={1}
                />
              </div>
              
              {/* Voice Controls */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (voiceChat.isListening) {
                      voiceChat.stopListening();
                    } else {
                      voiceChat.startListening();
                    }
                  }}
                  disabled={!voiceChat.isSupported}
                  className={`h-[44px] w-[44px] transition-all duration-300 ${
                    voiceChat.isListening 
                      ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 animate-pulse' 
                      : 'hover:scale-105'
                  }`}
                  title={voiceChat.isListening ? 'Stop listening (Shift+Space)' : 'Start voice input (Shift+Space)'}
                >
                  {voiceChat.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (voiceChat.isSpeaking) {
                      voiceChat.stopSpeaking();
                    } else {
                      const lastMessage = messages[messages.length - 1];
                      if (lastMessage && lastMessage.type === 'bot') {
                        voiceChat.speak(lastMessage.content);
                      }
                    }
                  }}
                  disabled={!voiceChat.isSupported}
                  className={`h-[44px] w-[44px] transition-all duration-300 ${
                    voiceChat.isSpeaking 
                      ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30 animate-pulse' 
                      : 'hover:scale-105'
                  }`}
                  title={voiceChat.isSpeaking ? 'Stop speaking' : 'Repeat last message'}
                >
                  {voiceChat.isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
              
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isTyping}
                className="rounded-2xl px-6 py-3 h-[44px] bg-gradient-primary hover:opacity-90 transition-smooth hover-lift"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-success animate-pulse-glow" />
                <span>Ethical Guidelines Active</span>
              </div>
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3 text-primary animate-sparkle" />
                <span>Transparent & Caring</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-pink-400 animate-heart-beat" />
                <span>Made with Love</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <AuthModal
        open={showAuth}
        onOpenChange={setShowAuth}
        onAuthSuccess={handleAuthSuccess}
      />
      
      <MemoriesModal
        open={showMemories}
        onOpenChange={setShowMemories}
        onLoadMemory={handleLoadMemory}
      />

      <TransparencyPanel
        message={selectedMessage}
        open={showTransparency}
        onOpenChange={setShowTransparency}
      />

      <AppealDialog
        message={selectedMessage}
        open={showAppeal}
        onOpenChange={setShowAppeal}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <MessageExport
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        messages={messages}
        chatTitle={`Chat with AI - ${new Date().toLocaleDateString()}`}
      />

      <ShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={shortcuts}
      />
    </div>
  );
};