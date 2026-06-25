'use client';

// NOTE: This file is always loaded via next/dynamic with ssr:false from page.tsx
// so using @react-three/fiber Canvas here is safe.
import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/store/useAppStore';
import { OBJECTS } from '@/lib/objectData';
import type { ObjectId } from '@/store/useAppStore';
import Suspense3D from './Suspense3D';

export default function Room() {
  const { phase, setRoomLoaded, setFocusedObject } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);
  const roomLoadedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, set roomLoaded to true instantly during transition so the bridge doesn't stall
  useEffect(() => {
    if (isMobile && phase === 'transition') {
      setRoomLoaded(true);
      roomLoadedRef.current = true;
    }
  }, [isMobile, phase, setRoomLoaded]);

  // Safety fallback: if Canvas doesn't report ready within 4s of transition, force it
  useEffect(() => {
    if (phase !== 'transition' || roomLoadedRef.current) return;

    const fallback = setTimeout(() => {
      if (!roomLoadedRef.current) {
        console.warn('[Room] Canvas did not report ready in 4s, forcing roomLoaded.');
        setRoomLoaded(true);
        roomLoadedRef.current = true;
      }
    }, 4000);

    return () => clearTimeout(fallback);
  }, [phase, setRoomLoaded]);

  // Allow Room to mount during 'cinematic' so 3D assets preload in background
  if (phase !== 'room' && phase !== 'transition' && phase !== 'cinematic') return null;

  if (isMobile) {
    if (phase !== 'room') return null;

    return (
      <div
        className="fixed inset-0 z-10 flex flex-col items-center justify-start overflow-y-auto px-6 py-20"
        // style={{ background: '#020408' }}
        style={{
          background:
            'radial-gradient(circle at center, #081a2f 0%, #040812 45%, #020408 100%)'
        }}
      >
        {/* Mobile Header */}
        <div className="w-full max-w-md mb-8 text-center mt-6">
          <div className="text-[10px] font-mono tracking-[0.25em] text-gray-500 uppercase mb-2">
            AalsiCoders HQ // Mobile Interface
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">
            CONTROL CENTER
          </h1>
          <p className="text-[11px] text-gray-400 font-mono mt-1">
            2D headquarters active. Select a node to query.
          </p>
        </div>

        {/* 2D Grid of Objects */}
        <div className="w-full max-w-md flex flex-col gap-3">
          {(Object.keys(OBJECTS) as ObjectId[]).map((id) => {
            const obj = OBJECTS[id];
            return (
              <button
                key={id}
                onClick={() => setFocusedObject(id)}
                className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 active:scale-95"
                style={{
                  background: 'rgba(2, 8, 20, 0.88)',
                  border: `1px solid ${obj.color}25`,
                  boxShadow: `0 0 15px ${obj.color}05`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{obj.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white tracking-wider uppercase">
                      {obj.label}
                    </div>
                    <div className="text-[9px] font-mono text-gray-500 mt-0.5">
                      {obj.content.subtitle || 'System data node'}
                    </div>
                  </div>
                </div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: obj.color,
                    boxShadow: `0 0 6px ${obj.color}`,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="w-full max-w-md mt-10 text-center mb-8">
          <div className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">
            AALSICODERS // WE BUILD THE FUTURE
          </div>
        </div>
      </div>
    );
  }

  // During cinematic: mount offscreen so WebGL compiles in background
  const isPreloading = phase === 'cinematic';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: isPreloading ? -1 : 10,
      opacity: isPreloading ? 0 : 1,
      pointerEvents: isPreloading ? 'none' : 'auto',
    }}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={isPreloading ? 'demand' : 'always'}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        // camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.6, 7] }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 1.8, 4.8]
        }}
        shadows="soft"
        onCreated={() => {
          console.log('[Room] Canvas created, setting roomLoaded = true');
          setRoomLoaded(true);
          roomLoadedRef.current = true;
        }}
        style={{ background: '#020408' }}
      >
        <Suspense fallback={null}>
          <Suspense3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
