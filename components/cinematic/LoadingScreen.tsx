'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function LoadingScreen() {
  const { phase, videoReady } = useAppStore();
  const barRef = useRef<HTMLDivElement>(null);
  const isVisible = phase === 'loading';

  useEffect(() => {
    if (!barRef.current) return;
    // Simulate loading progress
    let width = 0;
    const interval = setInterval(() => {
      width = Math.min(width + Math.random() * 8, videoReady ? 100 : 85);
      if (barRef.current) barRef.current.style.width = `${width}%`;
      if (width >= 100) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [videoReady]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center"
      style={{ background: '#020408' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,170,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,170,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="text-center">
          <div
            className="text-5xl font-bold tracking-wider mb-2"
            style={{
              color: '#00aaff',
              textShadow: '0 0 20px #00aaff, 0 0 40px #00aaff',
              fontFamily: 'monospace',
            }}
          >
            AALSI<span style={{ color: '#00ff41' }}>CODERS</span>
          </div>
          <div className="text-xs tracking-[0.4em] text-gray-500 uppercase">
            Initializing Headquarters
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-px bg-gray-800 relative">
          <div
            ref={barRef}
            className="h-full transition-all duration-100"
            style={{
              background: 'linear-gradient(90deg, #00aaff, #00ff41)',
              boxShadow: '0 0 8px #00aaff',
              width: '0%',
            }}
          />
        </div>

        {/* Status text */}
        <div className="text-xs text-gray-600 tracking-widest font-mono">
          LOADING CINEMATIC ASSETS...
        </div>

        {/* Spinning ring */}
        <div
          className="w-12 h-12 rounded-full border border-transparent"
          style={{
            borderTopColor: '#00aaff',
            borderRightColor: 'rgba(0,170,255,0.3)',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
