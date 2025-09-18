import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Message } from './Message';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { TransparencyPanel } from './TransparencyPanel';
import { AppealDialog } from './AppealDialog';

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m an ethical AI assistant committed to providing transparent, unbiased, and helpful responses. How can I assist you today?',
      timestamp: new Date(),
      confidence: 0.95,
      transparencyData: {
        reasoning: 'This is a standard greeting message designed to be welcoming and informative.',
        sources: ['System prompt', 'Ethical guidelines'],
        ethicalConsiderations: ['Transparency', 'User empowerment', 'Clear communication']
      }
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [showTransparency, setShowTransparency] = useState(false);
  const [showAppeal, setShowAppeal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const botResponse = await makeGeminiAPICall(currentInput);
      setMessages(prev => [...prev, botResponse]);
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

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="chat-container w-full max-w-2xl h-[700px] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="chat-header flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          <span>Ethical AI Assistant</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary animate-pulse-glow" />
              </div>
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
        </div>

        {/* Input */}
        <div className="p-6 border-t border-border/50">
          <div className="flex gap-3 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... I'll provide transparent, ethical responses"
              className="flex-1 bg-muted/50 border-border/50 focus:border-primary/50 rounded-2xl px-4 py-3 transition-smooth"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="rounded-2xl px-6 py-3 bg-gradient-primary hover:opacity-90 transition-smooth hover-lift"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-success" />
              <span>Ethical Guidelines Active</span>
            </div>
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 text-primary" />
              <span>Transparent Responses</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Transparency Panel */}
      <TransparencyPanel
        message={selectedMessage}
        open={showTransparency}
        onOpenChange={setShowTransparency}
      />

      {/* Appeal Dialog */}
      <AppealDialog
        message={selectedMessage}
        open={showAppeal}
        onOpenChange={setShowAppeal}
      />
    </div>
  );
};