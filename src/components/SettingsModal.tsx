import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Volume2, Moon, Sun, Sparkles, Settings2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState('cosmic');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState([0.8]);
  const [animations, setAnimations] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const themes = [
    { id: 'cosmic', name: 'Cosmic Dreams', colors: ['from-purple-600', 'to-blue-600'], icon: '🌌' },
    { id: 'sunset', name: 'Sunset Glow', colors: ['from-orange-500', 'to-pink-500'], icon: '🌅' },
    { id: 'forest', name: 'Forest Whisper', colors: ['from-green-600', 'to-teal-600'], icon: '🌲' },
    { id: 'ocean', name: 'Ocean Breeze', colors: ['from-blue-500', 'to-cyan-500'], icon: '🌊' },
  ];

  useEffect(() => {
    // Load saved settings
    const savedTheme = localStorage.getItem('chatbot-theme') || 'cosmic';
    const savedVoice = localStorage.getItem('voice-enabled') === 'true';
    const savedVolume = parseFloat(localStorage.getItem('voice-volume') || '0.8');
    const savedAnimations = localStorage.getItem('animations-enabled') !== 'false';
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';

    setTheme(savedTheme);
    setVoiceEnabled(savedVoice);
    setVolume([savedVolume]);
    setAnimations(savedAnimations);
    setDarkMode(savedDarkMode);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    localStorage.setItem('chatbot-theme', themeId);
    
    // Apply theme to document
    const root = document.documentElement;
    const selectedTheme = themes.find(t => t.id === themeId);
    if (selectedTheme) {
      root.style.setProperty('--theme-primary', selectedTheme.colors[0].replace('from-', ''));
      root.style.setProperty('--theme-secondary', selectedTheme.colors[1].replace('to-', ''));
    }
  };

  const handleVoiceToggle = (enabled: boolean) => {
    setVoiceEnabled(enabled);
    localStorage.setItem('voice-enabled', enabled.toString());
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    localStorage.setItem('voice-volume', value[0].toString());
  };

  const handleAnimationsToggle = (enabled: boolean) => {
    setAnimations(enabled);
    localStorage.setItem('animations-enabled', enabled.toString());
    
    // Apply animation preference
    if (enabled) {
      document.body.classList.remove('reduce-motion');
    } else {
      document.body.classList.add('reduce-motion');
    }
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('dark-mode', enabled.toString());
    
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-xl border-2 border-primary/20 shadow-glow rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            <Settings2 className="h-6 w-6 text-primary animate-spin-slow" />
            Make It Yours! ✨
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <span className="font-medium">Choose Your Vibe</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <Button
                  key={t.id}
                  variant={theme === t.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange(t.id)}
                  className="h-auto p-3 flex flex-col gap-1 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-lg">{t.icon}</div>
                  <span className="text-xs">{t.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary" />
              <span className="font-medium">Voice Magic</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Enable voice chat</span>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={handleVoiceToggle}
              />
            </div>
            {voiceEnabled && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Volume: {Math.round(volume[0] * 100)}%</span>
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Display Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium">Display</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Magical animations</span>
                <Switch
                  checked={animations}
                  onCheckedChange={handleAnimationsToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dark mode</span>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
            >
              Perfect! Let's Chat ✨
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};