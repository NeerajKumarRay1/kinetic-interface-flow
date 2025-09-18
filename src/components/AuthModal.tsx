import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Heart, Sparkles, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful authentication
    const user = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email
    };

    toast({
      title: isLogin ? "Welcome back, friend! 🎉" : "Yay! You're all set! ✨",
      description: isLogin ? "Ready for another brilliant conversation?" : "Let's make your day brighter together!",
    });

    onAuthSuccess(user);
    setIsLoading(false);
    onOpenChange(false);
    
    // Reset form
    setFormData({ name: '', email: '', password: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-gentle">
            <Sparkles className="w-8 h-8 text-white animate-sparkle" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gradient">
            {isLogin ? "Welcome Back, Friend! 👋" : "Join Our Happy Community! 🌟"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isLogin ? "Ready for another brilliant conversation?" : "Let's create magical memories together!"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                What should we call you?
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your lovely name..."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-muted/50 border-border/50 focus:border-primary/50 rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-glow"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Your email, please!
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@awesome.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-muted/50 border-border/50 focus:border-primary/50 rounded-xl px-4 py-3 transition-all duration-300 focus:shadow-glow"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Pick a password you'll remember
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your secret key..."
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-muted/50 border-border/50 focus:border-primary/50 rounded-xl px-4 py-3 pr-12 transition-all duration-300 focus:shadow-glow"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all duration-300 hover:shadow-glow hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isLogin ? "Warming up our circuits for you..." : "Creating your magical space..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {isLogin ? "Let's Chat!" : "Join the Magic!"}
              </div>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-primary hover:text-primary-light transition-colors duration-300 hover:underline"
            >
              {isLogin ? "New here? Create an account!" : "Already have an account? Welcome back!"}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <p className="text-xs text-center text-muted-foreground">
            💡 <strong>Demo Mode:</strong> This is a beautiful UI preview! For real authentication, connect to Supabase for secure user management.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};