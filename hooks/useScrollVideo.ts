'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseScrollVideoOptions {
  containerId: string;
  onProgress: (progress: number) => void;
  onComplete: () => void;
  threshold?: number; // 0–1, default 0.98
  enabled?: boolean;
}

export function useScrollVideo({
  containerId,
  onProgress,
  onComplete,
  threshold = 0.98,
  enabled = true,
}: UseScrollVideoOptions) {
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const maxScroll = container.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      onProgress(progress);

      if (progress >= threshold && !completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    });
  }, [containerId, onProgress, onComplete, threshold]);

  useEffect(() => {
    if (!enabled) return;
    completedRef.current = false;

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, handleScroll]);
}
