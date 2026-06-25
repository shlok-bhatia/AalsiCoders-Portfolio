'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterProps {
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  accentColor: string;
  particleColor: string;
}

function Character({
  modelPath,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  accentColor,
  particleColor,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { scene } = useGLTF(modelPath);

  // Clone so multiple instances don't share the same scene
  const cloned = scene.clone();

  // Breathing idle animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.position.y =
      position[1] + Math.sin(t * 1.2 + position[0]) * 0.015;

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.3;
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.4 + Math.sin(t * 2) * 0.2;
    }
  });

  // Particle cloud around character
  const pCount = 8;
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const angle = (i / pCount) * Math.PI * 2;
    const r = 0.25 + Math.random() * 0.15;
    pPositions[i * 3] = Math.cos(angle) * r;
    pPositions[i * 3 + 1] = Math.random() * 1.2;
    pPositions[i * 3 + 2] = Math.sin(angle) * r;
  }

  const pc = new THREE.Color(particleColor);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* GLB model */}
      <primitive object={cloned} castShadow receiveShadow />

      {/* Particle cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          color={pc}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Per-character accent glow */}
      <pointLight color={accentColor} intensity={1.2} distance={2} decay={2} />
    </group>
  );
}

// Preload all 3 models
useGLTF.preload('assets/models/Meshy_AI_Neon_Knight_0624195415_texture.glb');
useGLTF.preload('assets/models/Meshy_AI_Neon_Shadow_Operative_0624200048_texture.glb');
useGLTF.preload('assets/models/Meshy_AI_Neon_Sentinel_0624200554_texture.glb');

export default function Characters() {
  return (
    <group>
      {/* Neon Knight - left */}
      <Character
        modelPath="assets/models/Meshy_AI_Neon_Knight_0624195415_texture.glb"
        position={[-1.6, 1, 1.8]}
        rotation={[0, 0.4, 0]}
        scale={1}
        accentColor="#d4af37"
        particleColor="#00ff41"
      />

      {/* Neon Shadow Operative - center */}
      <Character
        modelPath="assets/models/Meshy_AI_Neon_Shadow_Operative_0624200048_texture.glb"
        position={[0, 1, 2.2]}
        rotation={[0, 0, 0]}
        scale={1}
        accentColor="#ffffff"
        particleColor="#00aaff"
      />

      {/* Neon Sentinel - right */}
      <Character
        modelPath="assets/models/Meshy_AI_Neon_Sentinel_0624200554_texture.glb"
        position={[1.6, 1, 1.8]}
        rotation={[0, -0.4, 0]}
        scale={1}
        accentColor="#c0c0c0"
        particleColor="#b040ff"
      />
    </group>
  );
}