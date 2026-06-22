'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function TransitionBridge() {
  const { phase, setPhase, roomLoaded } = useAppStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (phase !== 'transition') {
      hasTriggered.current = false;
      return;
    }

    // Freeze video on last frame
    const video = document.getElementById('cinematic-video') as HTMLVideoElement;
    if (video) {
      video.pause();
      if (video.duration) {
        video.currentTime = video.duration;
      }
    }

    // Lock scroll during transition
    document.body.style.overflow = 'hidden';

    // Show black overlay immediately to hide canvas compilation
    if (overlayRef.current) {
      overlayRef.current.style.transition = 'opacity 0.06s ease';
      overlayRef.current.style.opacity = '1';
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'transition' || !roomLoaded || hasTriggered.current) return;
    hasTriggered.current = true;

    // Room is loaded! Fade out black overlay
    const fadeOutTimeout = setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        overlayRef.current.style.opacity = '0';
      }
    }, 100);

    const completeTimeout = setTimeout(() => {
      setPhase('room');
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 1300);

    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(completeTimeout);
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
