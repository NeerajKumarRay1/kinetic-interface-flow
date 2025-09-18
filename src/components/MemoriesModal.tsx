import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Trash2, MessageCircle, Sparkles, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatMemory {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
  sentiment: 'happy' | 'thoughtful' | 'excited';
}

interface MemoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadMemory: (memoryId: string) => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({ open, onOpenChange, onLoadMemory }) => {
  const [memories, setMemories] = useState<ChatMemory[]>([
    {
      id: '1',
      title: 'Our First Hello! 👋',
      preview: 'We talked about the meaning of ethical AI...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      messageCount: 12,
      sentiment: 'happy'
    },
    {
      id: '2', 
      title: 'Deep Thoughts About Life 🤔',
      preview: 'You asked about consciousness and I shared my thoughts...',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      messageCount: 8,
      sentiment: 'thoughtful'
    },
    {
      id: '3',
      title: 'Planning Your Dream Project! ✨',
      preview: 'We brainstormed your amazing app idea...',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      messageCount: 24,
      sentiment: 'excited'
    }
  ]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'happy': return '😊';
      case 'thoughtful': return '🤔'; 
      case 'excited': return '🎉';
      default: return '💭';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'happy': return 'bg-green-500/20 text-green-400';
      case 'thoughtful': return 'bg-blue-500/20 text-blue-400';
      case 'excited': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today ✨';
    if (diffInDays === 1) return 'Yesterday 🌙';
    if (diffInDays < 7) return `${diffInDays} days ago 📅`;
    return `A while back 🕰️`;
  };

  const handleDeleteMemory = (memoryId: string, title: string) => {
    const confirmed = window.confirm(`Ready to let "${title}" go? This memory will be lost forever! 🥺`);
    
    if (confirmed) {
      setMemories(prev => prev.filter(m => m.id !== memoryId));
      toast({
        title: "Memory Released 🌙",
        description: "Like a shooting star, it's now part of the cosmic digital void!",
      });
    }
  };

  const handleLoadMemory = (memoryId: string) => {
    onLoadMemory(memoryId);
    onOpenChange(false);
    toast({
      title: "Memory Restored! ✨",
      description: "Welcome back to this wonderful conversation!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl">
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-heart-beat">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gradient flex items-center justify-center gap-2">
            <Star className="w-6 h-6" />
            My Precious Memories
            <Star className="w-6 h-6" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          {memories.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-card border border-border/50">
              <div className="space-y-4">
                <Sparkles className="w-12 h-12 mx-auto text-primary animate-sparkle" />
                <h3 className="text-lg font-medium">No memories yet, but the best ones are yet to be made! 🌟</h3>
                <p className="text-muted-foreground">
                  Start chatting with me, and we'll create beautiful memories together!
                </p>
              </div>
            </Card>
          ) : (
            memories.map((memory) => (
              <Card 
                key={memory.id}
                className="p-4 bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group cursor-pointer"
                onClick={() => handleLoadMemory(memory.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                        {memory.title}
                      </h3>
                      <Badge className={`text-xs ${getSentimentColor(memory.sentiment)}`}>
                        {getSentimentIcon(memory.sentiment)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {memory.preview}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(memory.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {memory.messageCount} messages
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMemory(memory.id, memory.title);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <p className="text-xs text-center text-muted-foreground">
            💡 <strong>Demo Memories:</strong> These are sample conversations! Connect to Supabase to save real chat history.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};