'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

/**
 * TransitionBridge — smooth cinematic-to-room transition.
 *
 * Sequence:
 * 1. Video freezes on last frame, scroll locks
 * 2. A zoom + blur effect animates on the frozen video
 * 3. A dark overlay fades in with "Initializing HQ" text
 * 4. Once Room canvas is ready (or timeout), overlay fades out → room phase
 *
 * Safety: 5s timeout so we never get stuck if Room fails to mount.
 */
export default function TransitionBridge() {
  const { phase, setPhase, roomLoaded } = useAppStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<'idle' | 'zoom' | 'dark' | 'reveal'>('idle');

  // --- Stage 1: Freeze video & start zoom/blur ---
  useEffect(() => {
    if (phase !== 'transition') {
      setStage('idle');
      return;
    }

    console.log('[TransitionBridge] Phase = transition. Freezing video...');

    // Freeze video on last frame
    const video = document.getElementById('cinematic-video') as HTMLVideoElement;
    if (video) {
      video.pause();
        // if (video.duration) {
        //   video.currentTime = video.duration;
        // }
    }
    

    // Lock scroll during transition
    document.body.style.overflow = 'hidden';

    // Kick off zoom stage on next frame
    requestAnimationFrame(() => {
      setStage('zoom');
    });

    // SAFETY: Force-complete transition after 6s no matter what
    const safetyTimeout = setTimeout(() => {
      console.warn('[TransitionBridge] Safety timeout! Forcing room phase.');
      setPhase('room');
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
    }, 6000);

    return () => clearTimeout(safetyTimeout);
  }, [phase, setPhase]);

  // --- Stage 2: After zoom completes, fade to dark ---
  useEffect(() => {
    if (phase !== 'transition' || stage !== 'zoom') return;
    console.log('[TransitionBridge] Stage = zoom');

    const timer = setTimeout(() => {
      setStage('dark');
    }, 800); // zoom/blur duration

    return () => clearTimeout(timer);
  }, [phase, stage]);

  // --- Stage 3: Once dark & room loaded (or after timeout), reveal ---
  useEffect(() => {
    if (phase !== 'transition' || stage !== 'dark') return;
    console.log('[TransitionBridge] Stage = dark, roomLoaded =', roomLoaded);

    if (roomLoaded) {
      // Room is ready — reveal immediately
      const revealTimer = setTimeout(() => {
        setStage('reveal');
      }, 200);
      return () => clearTimeout(revealTimer);
    }

    // Fallback: If room doesn't load within 3s, reveal anyway
    const fallbackTimer = setTimeout(() => {
      console.warn('[TransitionBridge] Room not loaded after 3s, revealing anyway.');
      setStage('reveal');
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [phase, stage, roomLoaded]);

  // --- Stage 4: After reveal animation, complete transition ---
  useEffect(() => {
    if (phase !== 'transition' || stage !== 'reveal') return;
    console.log('[TransitionBridge] Stage = reveal, completing...');

    const completeTimer = setTimeout(() => {
      setPhase('room');
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      console.log('[TransitionBridge] Transition complete → room phase');
    }, 1000); // reveal fade-out duration

    return () => clearTimeout(completeTimer);
  }, [phase, stage, setPhase]);

  if (phase !== 'transition') return null;

  return (
    <>
      {/* Backdrop blur/brightness overlay on frozen video */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 150,
          backdropFilter:
            stage === 'zoom' || stage === 'dark' || stage === 'reveal'
              ? 'blur(12px) brightness(1.3)'
              : 'blur(0px) brightness(1)',
          WebkitBackdropFilter:
            stage === 'zoom' || stage === 'dark' || stage === 'reveal'
              ? 'blur(12px) brightness(1.3)'
              : 'blur(0px) brightness(1)',
          transition:
            'backdrop-filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), -webkit-backdrop-filter 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />

      {/* Dark overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 300,
          background: '#020408',
          opacity: stage === 'reveal' ? 0 : stage === 'dark' ? 1 : 0,
          transition:
            stage === 'dark'
              ? 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
              : 'opacity 1s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />

      {/* Subtle blue glow during zoom */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 160,
          background:
            'radial-gradient(ellipse at center, rgba(0,170,255,0.06) 0%, transparent 70%)',
          opacity: stage === 'zoom' ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* "Initializing HQ" text during dark stage */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{
          zIndex: 310,
          opacity: stage === 'dark' ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(0, 170, 255, 0.6)',
            textShadow: '0 0 20px rgba(0, 170, 255, 0.3)',
            animation: 'loadingPulse 1.5s ease-in-out infinite',
          }}
        >
          ■ Initializing HQ Interface...
        </div>
      </div>
    </>
  );
}
