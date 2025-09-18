import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import { FriendlyAvatar } from './FriendlyAvatar';

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

interface MessageProps {
  message: ChatMessage;
  onShowTransparency: (message: ChatMessage) => void;
  onAppeal: (message: ChatMessage) => void;
}

const getConfidenceEmoji = (confidence: number) => {
  if (confidence > 0.8) return '🟢';
  if (confidence > 0.5) return '🟡'; 
  return '🔴';
};

export const Message: React.FC<MessageProps> = ({ message, onShowTransparency, onAppeal }) => {
  return (
    <div 
      className={`flex gap-3 animate-fade-in ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.type === 'bot' && (
        <FriendlyAvatar 
          size="sm" 
          mood={message.confidence && message.confidence > 0.8 ? 'happy' : 'thoughtful'} 
        />
      )}
      
      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg
            ${message.type === 'user' 
              ? 'bg-gradient-primary text-white rounded-br-sm animate-slide-in-right hover:scale-[1.02]' 
              : 'bg-card border border-border/50 rounded-bl-sm animate-slide-in-left hover:border-primary/20'
            }
          `}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        {/* Enhanced metadata for bot messages */}
        {message.type === 'bot' && (message.confidence || message.ethicalFlags?.length) && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {message.confidence !== undefined && (
                <Badge 
                  variant="outline" 
                  className={`text-xs transition-all duration-300 hover:scale-105 ${
                    message.confidence > 0.8 
                      ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                      : message.confidence > 0.5 
                        ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                        : 'border-red-500/30 text-red-400 bg-red-500/10'
                  }`}
                >
                  {getConfidenceEmoji(message.confidence)} {Math.round(message.confidence * 100)}% confident
                </Badge>
              )}

              {message.ethicalFlags?.map((flag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-orange-500/30 text-orange-400 bg-orange-500/10 animate-wiggle"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {flag.replace('-', ' ')}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShowTransparency(message)}
                className="text-xs text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 rounded-lg px-3 py-1"
              >
                <Eye className="w-3 h-3 mr-1" />
                Show Details
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAppeal(message)}
                className="text-xs text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/5 rounded-lg px-3 py-1"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Appeal
              </Button>
            </div>
          </div>
        )}
        
        {/* Friendly timestamp */}
        <div className={`text-xs text-muted-foreground mt-2 ${
          message.type === 'user' ? 'text-right' : 'text-left'
        }`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {message.type === 'user' && (
        <FriendlyAvatar size="sm" mood="calm" className="order-1" />
      )}
    </div>
  );
};