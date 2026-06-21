'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function TransitionBridge() {
  const { phase, setPhase, roomLoaded } = useAppStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (phase !== 'transition' || hasTriggered.current) return;
    hasTriggered.current = true;

    // Freeze video on last frame
    const video = document.getElementById('cinematic-video') as HTMLVideoElement;
    if (video) {
      video.pause();
      video.currentTime = video.duration;
    }

    // Lock scroll during transition
    document.body.style.overflow = 'hidden';

    // Sequence:
    // 1. Black flash (60ms)
    // 2. Fade in 3D room
    // 3. Activate room phase
    const step1 = setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '1';
      }
    }, 0);

    const step2 = setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        overlayRef.current.style.opacity = '0';
      }
    }, 300);

    const step3 = setTimeout(() => {
      setPhase('room');
      document.body.style.overflow = '';
      // Scroll to top after transition
      window.scrollTo(0, 0);
    }, 1400);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [phase, roomLoaded, setPhase]);

  if (phase !== 'transition') return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] pointer-events-none"
      style={{
        background: '#000',
        opacity: 0,
        transition: 'opacity 0.06s ease',
      }}
    />
  );
}
