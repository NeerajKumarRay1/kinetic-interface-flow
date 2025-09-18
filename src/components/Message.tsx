import React from 'react';
import { User, Sparkles, Info, Flag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfidenceIndicator } from './ConfidenceIndicator';

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

export const Message: React.FC<MessageProps> = ({ message, onShowTransparency, onAppeal }) => {
  const isUser = message.type === 'user';
  const hasEthicalFlags = message.ethicalFlags && message.ethicalFlags.length > 0;

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-primary shadow-glow' 
          : 'bg-primary/20 border border-primary/30'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Sparkles className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`${isUser ? 'message-user' : 'message-bot'} group relative`}>
          {message.content}
          
          {/* Ethical Flags */}
          {hasEthicalFlags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.ethicalFlags?.map((flag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-warning/10 text-warning border-warning/30"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {flag.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bot Message Controls */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Confidence Indicator */}
            {message.confidence !== undefined && (
              <ConfidenceIndicator confidence={message.confidence} />
            )}
            
            {/* Transparency Button */}
            {message.transparencyData && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShowTransparency(message)}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Info className="w-3 h-3 mr-1" />
                Details
              </Button>
            )}
            
            {/* Appeal Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAppeal(message)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <Flag className="w-3 h-3 mr-1" />
              Appeal
            </Button>
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};