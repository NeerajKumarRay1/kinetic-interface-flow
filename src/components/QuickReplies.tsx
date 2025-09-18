import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Lightbulb, HelpCircle, Smile } from 'lucide-react';

interface QuickRepliesProps {
  onReplySelect: (message: string) => void;
  className?: string;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onReplySelect, className = '' }) => {
  const quickReplies = [
    {
      text: "Tell me something inspiring! ✨",
      icon: <Heart className="w-3 h-3" />,
      mood: 'excited'
    },
    {
      text: "How can AI help make the world better?",
      icon: <Lightbulb className="w-3 h-3" />,
      mood: 'thoughtful'
    },
    {
      text: "What's your favorite thing about helping people?",
      icon: <Smile className="w-3 h-3" />,
      mood: 'happy'
    },
    {
      text: "Can you help me brainstorm ideas?",
      icon: <HelpCircle className="w-3 h-3" />,
      mood: 'curious'
    }
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {quickReplies.map((reply, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onReplySelect(reply.text)}
          className="text-xs bg-card/50 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:shadow-glow hover:scale-105 rounded-full"
        >
          <span className="mr-1">{reply.icon}</span>
          {reply.text}
        </Button>
      ))}
    </div>
  );
};