'use client';

import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import CameraRig from './CameraRig';
import ProceduralRoom from './ProceduralRoom';
import Characters from './Characters';
import InteractiveObject from './InteractiveObject';
import {
  MonitorMesh,
  CoffeeMesh,
  KeyboardMesh,
  PhoneMesh,
  NotebookMesh,
  MouseMesh,
  WallDisplayMesh,
} from './ObjectMeshes';
import { OBJECTS } from '@/lib/objectData';
import type { ObjectId } from '@/store/useAppStore';

const MESH_MAP: Record<ObjectId, React.ReactNode> = {
  monitor: <MonitorMesh />,
  coffee: <CoffeeMesh />,
  keyboard: <KeyboardMesh />,
  phone: <PhoneMesh />,
  notebook: <NotebookMesh />,
  mouse: <MouseMesh />,
  wallDisplay: <WallDisplayMesh />,
};

export default function Suspense3D() {
  return (
    <>
      <CameraRig />
      <ProceduralRoom />
      <Characters />

      {(Object.keys(OBJECTS) as ObjectId[]).map((id) => (
        <InteractiveObject key={id} data={OBJECTS[id]}>
          {MESH_MAP[id]}
        </InteractiveObject>
      ))}

      {/* Post-processing — cinematic but not eye-burning */}
      <EffectComposer multisampling={4}>
        {/* Bloom: only the brightest emissives glow — screens, LEDs, neon strips */}
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.55}    // only genuinely bright things bloom
          luminanceSmoothing={0.9}
          mipmapBlur={true}
          blendFunction={BlendFunction.ADD}
        />
        {/* Very subtle chromatic aberration — just at edges */}
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
          radialModulation={true}
          modulationOffset={0.2}
        />
        {/* Film grain — makes it feel cinematic like the HQ intro */}
        <Noise
          premultiply
          blendFunction={BlendFunction.ADD}
          opacity={0.028}
        />
        {/* Vignette — heavy dark frame, pulls focus inward */}
        <Vignette
          offset={0.18}
          darkness={0.88}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}