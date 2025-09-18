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

  const simulateEthicalResponse = (userMessage: string): ChatMessage => {
    // Simulate different types of responses based on content
    const lowercaseMessage = userMessage.toLowerCase();
    let confidence = 0.8;
    let ethicalFlags: string[] = [];
    let reasoning = 'Standard response with factual information';
    
    if (lowercaseMessage.includes('password') || lowercaseMessage.includes('personal')) {
      confidence = 0.3;
      ethicalFlags = ['privacy-concern'];
      reasoning = 'Request involves sensitive information that requires privacy protection';
    } else if (lowercaseMessage.includes('fake') || lowercaseMessage.includes('lie')) {
      confidence = 0.4;
      ethicalFlags = ['misinformation-risk'];
      reasoning = 'Content may involve misinformation concerns';
    } else if (lowercaseMessage.includes('help') || lowercaseMessage.includes('how')) {
      confidence = 0.9;
      reasoning = 'Helpful inquiry with clear educational value';
    }

    const responses = [
      "I understand your question. Based on available information, here's what I can share...",
      "That's an interesting topic. Let me provide you with accurate, unbiased information...",
      "I'll do my best to help you with that. Here's what the evidence suggests...",
      "Thank you for your question. I want to ensure my response is both helpful and accurate..."
    ];

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: responses[Math.floor(Math.random() * responses.length)] + " This is a simulated ethical AI response that demonstrates transparency and responsible information sharing.",
      timestamp: new Date(),
      confidence,
      transparencyData: {
        reasoning,
        sources: ['Knowledge base', 'Ethical guidelines', 'Fact-checking systems'],
        ethicalConsiderations: ['Accuracy verification', 'Bias mitigation', 'User safety']
      },
      ethicalFlags
    };
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
    setInput('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const botResponse = simulateEthicalResponse(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
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