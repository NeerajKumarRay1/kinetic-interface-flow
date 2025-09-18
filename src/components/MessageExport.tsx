import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Mail, Copy, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  confidence?: number;
  ethicalFlags?: string[];
}

interface MessageExportProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  chatTitle?: string;
}

export const MessageExport: React.FC<MessageExportProps> = ({ 
  isOpen, 
  onClose, 
  messages, 
  chatTitle = 'AI Chat' 
}) => {

  const formatChatAsText = () => {
    const header = `${chatTitle}\nGenerated on: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`;
    
    const formattedMessages = messages.map((msg, index) => {
      const timestamp = msg.timestamp.toLocaleTimeString();
      const sender = msg.type === 'user' ? 'You' : 'AI Assistant';
      const confidence = msg.confidence ? ` (Confidence: ${Math.round(msg.confidence * 100)}%)` : '';
      const flags = msg.ethicalFlags?.length ? ` [Flags: ${msg.ethicalFlags.join(', ')}]` : '';
      
      return `[${timestamp}] ${sender}${confidence}${flags}:\n${msg.content}\n`;
    }).join('\n');
    
    return header + formattedMessages;
  };

  const formatChatAsHTML = () => {
    const styles = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
        .message { margin-bottom: 20px; padding: 15px; border-radius: 12px; }
        .user { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin-left: 20%; }
        .bot { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; margin-right: 20%; }
        .meta { font-size: 0.8em; opacity: 0.8; margin-bottom: 8px; }
        .confidence { background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; margin-left: 8px; }
        .flags { background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; margin-left: 8px; color: #fbbf24; }
      </style>
    `;
    
    const header = `
      <div class="header">
        <h1>${chatTitle}</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
    `;
    
    const messagesHTML = messages.map(msg => {
      const timestamp = msg.timestamp.toLocaleTimeString();
      const sender = msg.type === 'user' ? 'You' : 'AI Assistant';
      const confidence = msg.confidence ? `<span class="confidence">Confidence: ${Math.round(msg.confidence * 100)}%</span>` : '';
      const flags = msg.ethicalFlags?.length ? `<span class="flags">Flags: ${msg.ethicalFlags.join(', ')}</span>` : '';
      
      return `
        <div class="message ${msg.type}">
          <div class="meta">${timestamp} - ${sender}${confidence}${flags}</div>
          <div>${msg.content.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }).join('');
    
    return `<!DOCTYPE html><html><head><title>${chatTitle}</title>${styles}</head><body>${header}${messagesHTML}</body></html>`;
  };

  const downloadAsText = () => {
    const content = formatChatAsText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded! 📄",
      description: "Your chat has been saved as a text file.",
      duration: 3000,
    });
  };

  const downloadAsHTML = () => {
    const content = formatChatAsHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded! 🌟",
      description: "Your beautifully formatted chat is ready!",
      duration: 3000,
    });
  };

  const copyToClipboard = async () => {
    try {
      const content = formatChatAsText();
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied! 📋",
        description: "Your conversation is now in your clipboard!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Copy Failed 😔",
        description: "Couldn't copy to clipboard. Try downloading instead!",
        duration: 3000,
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Shared Chat: ${chatTitle}`);
    const body = encodeURIComponent(`Hi! I wanted to share this interesting AI conversation with you:\n\n${formatChatAsText()}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-xl border-2 border-primary/20 shadow-glow rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            <Share2 className="h-6 w-6 text-primary animate-bounce-gentle" />
            Share Your Chat! ✨
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Ready to save or share this amazing conversation?
            </p>
            <Badge variant="secondary" className="animate-pulse">
              {messages.length} messages
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={downloadAsText}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4 hover:scale-105 transition-transform"
            >
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-xs">Text File</span>
            </Button>

            <Button
              onClick={downloadAsHTML}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4 hover:scale-105 transition-transform"
            >
              <Download className="h-5 w-5 text-primary" />
              <span className="text-xs">Pretty HTML</span>
            </Button>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4 hover:scale-105 transition-transform"
            >
              <Copy className="h-5 w-5 text-primary" />
              <span className="text-xs">Copy Text</span>
            </Button>

            <Button
              onClick={shareViaEmail}
              variant="outline"
              className="flex flex-col gap-2 h-auto py-4 hover:scale-105 transition-transform"
            >
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-xs">Email</span>
            </Button>
          </div>

          <div className="pt-4">
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
            >
              Done! Let's Keep Chatting 💬
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};