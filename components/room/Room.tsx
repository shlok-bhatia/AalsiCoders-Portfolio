'use client';

// NOTE: This file is always loaded via next/dynamic with ssr:false from page.tsx
// so using @react-three/fiber Canvas here is safe.
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/store/useAppStore';
import Suspense3D from './Suspense3D';

export default function Room() {
  const { phase, setRoomLoaded } = useAppStore();

  if (phase !== 'room') return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.6, 7] }}
        shadows="soft"
        onCreated={() => setRoomLoaded(true)}
        style={{ background: '#020408' }}
      >
        <Suspense fallback={null}>
          <Suspense3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
