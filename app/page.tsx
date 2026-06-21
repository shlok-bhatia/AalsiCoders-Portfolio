'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Lazy load heavy components — keeps initial JS bundle tiny
const LoadingScreen   = dynamic(() => import('@/components/cinematic/LoadingScreen'),   { ssr: false });
const ScrollVideo     = dynamic(() => import('@/components/cinematic/ScrollVideo'),      { ssr: false });
const TransitionBridge = dynamic(() => import('@/components/cinematic/TransitionBridge'), { ssr: false });
const Room            = dynamic(() => import('@/components/room/Room'),                  { ssr: false });
const ContentPanel    = dynamic(() => import('@/components/room/ContentPanel'),          { ssr: false });
const RoomHUD         = dynamic(() => import('@/components/ui/RoomHUD'),                 { ssr: false });
const CustomCursor    = dynamic(() => import('@/components/ui/CustomCursor'),            { ssr: false });

export default function HomePage() {
  const { phase, setPhase } = useAppStore();

  // Global keyboard shortcuts (ESC closes panel, SPACE skips in dev)
  useKeyboardShortcuts();

  useEffect(() => {
    setPhase('loading');
  }, [setPhase]);

  return (
    <main style={{ background: '#020408', minHeight: '100vh' }}>
      {/* Always rendered */}
      <CustomCursor />

      {/* PHASE: loading + cinematic */}
      <LoadingScreen />
      <ScrollVideo />

      {/* PHASE: transition cross-fade */}
      <TransitionBridge />

      {/* PHASE: 3D interactive room */}
      <Room />
      <ContentPanel />
      {phase === 'room' && <RoomHUD />}

      {/* DEV: skip button (remove for production) */}
      {process.env.NODE_ENV === 'development' && (phase === 'loading' || phase === 'cinematic') && (
        <button
          onClick={() => setPhase('transition')}
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            background: 'rgba(0,170,255,0.15)',
            border: '1px solid rgba(0,170,255,0.4)',
            color: '#00aaff',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.15em',
            padding: '6px 14px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          DEV: SKIP CINEMATIC →
        </button>
      )}
    </main>
  );
}
