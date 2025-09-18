import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: number;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ confidence }) => {
  const getConfidenceData = (conf: number) => {
    if (conf >= 0.8) {
      return {
        level: 'High',
        color: 'confidence-high',
        icon: CheckCircle,
        className: 'bg-success/10 text-success border-success/30'
      };
    } else if (conf >= 0.5) {
      return {
        level: 'Medium',
        color: 'confidence-medium',
        icon: AlertCircle,
        className: 'bg-warning/10 text-warning border-warning/30'
      };
    } else {
      return {
        level: 'Low',
        color: 'confidence-low',
        icon: XCircle,
        className: 'bg-destructive/10 text-destructive border-destructive/30'
      };
    }
  };

  const confidenceData = getConfidenceData(confidence);
  const Icon = confidenceData.icon;

  return (
    <Badge
      variant="outline"
      className={`text-xs ${confidenceData.className} hover-lift transition-all`}
      title={`Confidence: ${Math.round(confidence * 100)}%`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {confidenceData.level}
    </Badge>
  );
};