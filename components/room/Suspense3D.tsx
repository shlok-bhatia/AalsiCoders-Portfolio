'use client';

import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
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
      {/* Camera */}
      <CameraRig />

      {/* Environment */}
      <ProceduralRoom />

      {/* Characters */}
      <Characters />

      {/* All 7 interactive objects */}
      {(Object.keys(OBJECTS) as ObjectId[]).map((id) => (
        <InteractiveObject key={id} data={OBJECTS[id]}>
          {MESH_MAP[id]}
        </InteractiveObject>
      ))}

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}
