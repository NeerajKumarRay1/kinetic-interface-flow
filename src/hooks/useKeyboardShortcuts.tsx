import { useEffect, useCallback } from 'react';

interface KeyboardShortcutHandlers {
  onSendMessage?: () => void;
  onNewChat?: () => void;
  onToggleHistory?: () => void;
  onToggleSettings?: () => void;
  onToggleVoice?: () => void;
  onFocusInput?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      // Only allow Ctrl+Enter for sending messages in input fields
      if (event.ctrlKey && event.key === 'Enter' && handlers.onSendMessage) {
        event.preventDefault();
        handlers.onSendMessage();
      }
      return;
    }

    // Global shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'enter':
          if (handlers.onSendMessage) {
            event.preventDefault();
            handlers.onSendMessage();
          }
          break;
        case 'n':
          if (handlers.onNewChat) {
            event.preventDefault();
            handlers.onNewChat();
          }
          break;
        case 'h':
          if (handlers.onToggleHistory) {
            event.preventDefault();
            handlers.onToggleHistory();
          }
          break;
        case ',':
          if (handlers.onToggleSettings) {
            event.preventDefault();
            handlers.onToggleSettings();
          }
          break;
        case 'k':
          if (handlers.onFocusInput) {
            event.preventDefault();
            handlers.onFocusInput();
          }
          break;
      }
    } else {
      // Non-modifier shortcuts
      switch (event.key) {
        case '/':
          if (handlers.onFocusInput) {
            event.preventDefault();
            handlers.onFocusInput();
          }
          break;
        case 'Escape':
          if (handlers.onEscape) {
            event.preventDefault();
            handlers.onEscape();
          }
          break;
        case ' ':
          // Spacebar for voice toggle (when not in input)
          if (event.shiftKey && handlers.onToggleVoice) {
            event.preventDefault();
            handlers.onToggleVoice();
          }
          break;
      }
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return the shortcuts for display in UI
  const shortcuts = [
    { key: 'Ctrl + Enter', description: 'Send message' },
    { key: 'Ctrl + N', description: 'New chat' },
    { key: 'Ctrl + H', description: 'Toggle history' },
    { key: 'Ctrl + ,', description: 'Settings' },
    { key: 'Ctrl + K', description: 'Focus input' },
    { key: 'Shift + Space', description: 'Voice toggle' },
    { key: '/', description: 'Focus input' },
    { key: 'Esc', description: 'Close modals' },
  ];

  return { shortcuts };
};