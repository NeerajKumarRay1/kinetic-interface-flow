import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Zap } from 'lucide-react';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: { key: string; description: string; }[];
}

export const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ 
  isOpen, 
  onClose, 
  shortcuts 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-xl border-2 border-primary/20 shadow-glow rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            <Keyboard className="h-6 w-6 text-primary animate-bounce-gentle" />
            Keyboard Magic! ⚡
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Become a power user with these magical shortcuts!
            </p>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {shortcuts.map((shortcut, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <Badge 
                  variant="secondary" 
                  className="font-mono text-xs bg-primary/10 text-primary border-primary/20"
                >
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-card/30 rounded-lg p-3">
            <Zap className="h-3 w-3" />
            Pro tip: Use shortcuts to chat like a wizard! ✨
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};