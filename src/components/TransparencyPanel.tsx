import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, BookOpen, Shield, Brain } from 'lucide-react';

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

interface TransparencyPanelProps {
  message: ChatMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransparencyPanel: React.FC<TransparencyPanelProps> = ({
  message,
  open,
  onOpenChange,
}) => {
  if (!message?.transparencyData) return null;

  const { transparencyData } = message;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[600px] sm:max-w-none bg-card/95 backdrop-blur-xl border-border/50">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center gap-2 text-gradient">
            <Info className="w-5 h-5" />
            Response Transparency
          </SheetTitle>
          <SheetDescription>
            Detailed information about how this response was generated and the ethical considerations involved.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Confidence Score */}
          {message.confidence !== undefined && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Confidence Assessment</h3>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <Badge
                    className={
                      message.confidence >= 0.8
                        ? 'bg-success/10 text-success border-success/30'
                        : message.confidence >= 0.5
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : 'bg-destructive/10 text-destructive border-destructive/30'
                    }
                  >
                    {Math.round(message.confidence * 100)}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      message.confidence >= 0.8
                        ? 'bg-gradient-to-r from-success to-success/80'
                        : message.confidence >= 0.5
                        ? 'bg-gradient-to-r from-warning to-warning/80'
                        : 'bg-gradient-to-r from-destructive to-destructive/80'
                    }`}
                    style={{ width: `${message.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Reasoning */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Decision Reasoning</h3>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm leading-relaxed">{transparencyData.reasoning}</p>
            </div>
          </div>

          <Separator />

          {/* Sources */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Information Sources</h3>
            </div>
            <div className="space-y-2">
              {transparencyData.sources.map((source, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-lg p-3 border border-border/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{source}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Ethical Considerations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Ethical Considerations</h3>
            </div>
            <div className="space-y-2">
              {transparencyData.ethicalConsiderations.map((consideration, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-primary/5 rounded-lg p-3 border border-primary/20"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">{consideration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ethical Flags */}
          {message.ethicalFlags && message.ethicalFlags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-warning" />
                  <h3 className="font-semibold">Ethical Flags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {message.ethicalFlags.map((flag, index) => (
                    <Badge
                      key={index}
                      className="bg-warning/10 text-warning border-warning/30"
                    >
                      {flag.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};