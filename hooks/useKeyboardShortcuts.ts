'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useKeyboardShortcuts() {
  const { phase, setPhase, setFocusedObject, focusedObject } = useAppStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ESC — close focused object panel
      if (e.key === 'Escape' && focusedObject) {
        setFocusedObject(null);
        return;
      }

      // DEV ONLY: Space to skip cinematic
      if (process.env.NODE_ENV === 'development' && e.key === ' ') {
        if (phase === 'loading' || phase === 'cinematic') {
          e.preventDefault();
          setPhase('transition');
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, focusedObject, setPhase, setFocusedObject]);
}
