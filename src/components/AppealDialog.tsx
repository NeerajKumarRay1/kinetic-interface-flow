import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flag, Send, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface AppealDialogProps {
  message: ChatMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const appealTypes = [
  {
    id: 'factual',
    label: 'Factual Dispute',
    description: 'The information provided appears to be incorrect or outdated',
    icon: AlertTriangle,
    color: 'text-warning'
  },
  {
    id: 'bias',
    label: 'Bias Concern',
    description: 'The response seems biased or unfair in some way',
    icon: Flag,
    color: 'text-destructive'
  },
  {
    id: 'clarification',
    label: 'Need Clarification',
    description: 'The response is unclear or needs more detailed explanation',
    icon: MessageSquare,
    color: 'text-primary'
  }
];

export const AppealDialog: React.FC<AppealDialogProps> = ({
  message,
  open,
  onOpenChange,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [appealText, setAppealText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAppeal = async () => {
    if (!selectedType || !appealText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an appeal type and provide details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate appeal submission
    setTimeout(() => {
      toast({
        title: "Appeal Submitted",
        description: "Your appeal has been recorded and will be reviewed by our ethics team.",
      });
      
      setSelectedType(null);
      setAppealText('');
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedType(null);
    setAppealText('');
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) handleReset();
    }}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient">
            <Flag className="w-5 h-5" />
            Appeal Response
          </DialogTitle>
          <DialogDescription>
            Help us improve by providing feedback about this response. Your appeal will be reviewed by our ethics team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Original Message */}
          {message && (
            <Card className="p-4 bg-muted/30 border-border/30">
              <div className="text-sm text-muted-foreground mb-2">Response being appealed:</div>
              <div className="text-sm leading-relaxed">{message.content}</div>
              {message.confidence !== undefined && (
                <div className="flex items-center gap-2 mt-3">
                  <Badge
                    className={
                      message.confidence >= 0.8
                        ? 'bg-success/10 text-success border-success/30'
                        : message.confidence >= 0.5
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : 'bg-destructive/10 text-destructive border-destructive/30'
                    }
                  >
                    {Math.round(message.confidence * 100)}% Confidence
                  </Badge>
                </div>
              )}
            </Card>
          )}

          {/* Appeal Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">What type of concern do you have?</label>
            <div className="grid gap-3">
              {appealTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={`p-4 cursor-pointer transition-all hover:bg-card-hover border-2 ${
                      selectedType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border/30'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${type.color}`} />
                      <div className="flex-1">
                        <div className="font-medium mb-1">{type.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                      {selectedType === type.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Appeal Details */}
          <div className="space-y-3">
            <label htmlFor="appeal-details" className="text-sm font-medium">
              Please provide specific details about your concern:
            </label>
            <Textarea
              id="appeal-details"
              value={appealText}
              onChange={(e) => setAppealText(e.target.value)}
              placeholder="Describe your concern in detail. Include any specific examples or references that support your appeal."
              className="min-h-[120px] bg-muted/50 border-border/50 focus:border-primary/50 rounded-lg resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAppeal}
              disabled={!selectedType || !appealText.trim() || isSubmitting}
              className="rounded-lg bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Appeal
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};