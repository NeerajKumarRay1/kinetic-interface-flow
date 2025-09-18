import React from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';

interface FriendlyAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'excited' | 'calm' | 'thoughtful';
  animate?: boolean;
  className?: string;
}

export const FriendlyAvatar: React.FC<FriendlyAvatarProps> = ({
  size = 'md',
  mood = 'happy',
  animate = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const getMoodColor = () => {
    switch (mood) {
      case 'happy': return 'from-yellow-400 to-orange-400';
      case 'excited': return 'from-purple-400 to-pink-400';
      case 'calm': return 'from-blue-400 to-cyan-400';
      case 'thoughtful': return 'from-green-400 to-teal-400';
      default: return 'from-primary to-secondary';
    }
  };

  const getMoodIcon = () => {
    switch (mood) {
      case 'happy': return <Sparkles className={iconSizes[size]} />;
      case 'excited': return <Star className={iconSizes[size]} />;
      case 'calm': return <Heart className={iconSizes[size]} />;
      case 'thoughtful': return <Sparkles className={iconSizes[size]} />;
      default: return <Sparkles className={iconSizes[size]} />;
    }
  };

  const getAnimation = () => {
    if (!animate) return '';
    switch (mood) {
      case 'happy': return 'animate-bounce-gentle';
      case 'excited': return 'animate-wiggle';
      case 'calm': return 'animate-pulse-glow';
      case 'thoughtful': return 'animate-heart-beat';
      default: return 'animate-pulse-glow';
    }
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        bg-gradient-to-br ${getMoodColor()} 
        rounded-full 
        flex items-center justify-center 
        text-white 
        shadow-lg
        ${getAnimation()}
        ${className}
      `}
    >
      {getMoodIcon()}
    </div>
  );
};