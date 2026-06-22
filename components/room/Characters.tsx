'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  accentColor: string;
  particleColor: string;
  name: string;
}

function Character({ position, rotation = [0, 0, 0], accentColor, particleColor }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const accent = new THREE.Color(accentColor);

  // Breathing + idle animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.015;

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.3;
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.4 + Math.sin(t * 2) * 0.2;
    }
  });

  // Particle cloud around character
  const pCount = 30;
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const angle = (i / pCount) * Math.PI * 2;
    const r = 0.2 + Math.random() * 0.15;
    pPositions[i * 3] = Math.cos(angle) * r;
    pPositions[i * 3 + 1] = Math.random() * 0.8;
    pPositions[i * 3 + 2] = Math.sin(angle) * r;
  }

  const pc = new THREE.Color(particleColor);

  return (
    // <group ref={groupRef} position={position} rotation={rotation}>
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={1.35}
    >

      {/* ── Boots ── */}
      <mesh position={[-0.07, 0.07, 0]} castShadow>
        <boxGeometry args={[0.1, 0.14, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0.07, 0.07, 0]} castShadow>
        <boxGeometry args={[0.1, 0.14, 0.12]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* ── Legs ── */}
      <mesh position={[-0.07, 0.28, 0]} castShadow>
        <boxGeometry args={[0.1, 0.28, 0.1]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.07, 0.28, 0]} castShadow>
        <boxGeometry args={[0.1, 0.28, 0.1]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* ── Torso ── */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.26, 0.3, 0.16]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Chest accent stripe */}
      <mesh position={[0, 0.62, 0.082]}>
        <boxGeometry args={[0.06, 0.18, 0.004]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      {/* Shoulder epaulette L */}
      <mesh position={[-0.145, 0.72, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.18]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
      </mesh>
      {/* Shoulder epaulette R */}
      <mesh position={[0.145, 0.72, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.18]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
      </mesh>

      {/* ── Arms ── */}
      <mesh position={[-0.19, 0.56, 0]} castShadow>
        <boxGeometry args={[0.09, 0.26, 0.09]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.19, 0.56, 0]} castShadow>
        <boxGeometry args={[0.09, 0.26, 0.09]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Hands */}
      <mesh position={[-0.19, 0.4, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.07]} />
        <meshStandardMaterial color="#c8a882" roughness={0.8} />
      </mesh>
      <mesh position={[0.19, 0.4, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.07]} />
        <meshStandardMaterial color="#c8a882" roughness={0.8} />
      </mesh>

      {/* ── Neck ── */}
      <mesh position={[0, 0.79, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
        <meshStandardMaterial color="#c8a882" roughness={0.8} />
      </mesh>

      {/* ── Head ── */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <boxGeometry args={[0.22, 0.24, 0.2]} />
        <meshStandardMaterial color="#c8a882" roughness={0.7} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.055, 0.96, 0.101]}>
        <boxGeometry args={[0.04, 0.03, 0.002]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      <mesh position={[0.055, 0.96, 0.101]}>
        <boxGeometry args={[0.04, 0.03, 0.002]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      {/* Mouth */}
      <mesh position={[0, 0.88, 0.101]}>
        <boxGeometry args={[0.04, 0.008, 0.002]} />
        <meshBasicMaterial color="#2a1a1a" />
      </mesh>

      {/* ── Hair ── */}
      <mesh position={[0, 1.06, -0.02]}>
        <boxGeometry args={[0.24, 0.1, 0.22]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.02, 0.1]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.06]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>

      {/* ── Specialty particles ── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color={pc}
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Character accent light */}
      <pointLight color={accentColor} intensity={0.8} distance={1.5} decay={2} />
    </group>
  );
}

export default function Characters() {
  return (
    <group>
      {/* Cyber Security Engineer — green */}
      <Character
        name="Arjun"
        position={[-1.6, 0, 1.8]}
        rotation={[0, 0.4, 0]}
        accentColor="#00ff41"
        particleColor="#00ff41"
      />
      {/* Full Stack Developer — blue */}
      <Character
        name="Tanmay"
        position={[0, 0, 2.2]}
        rotation={[0, 0, 0]}
        accentColor="#00aaff"
        particleColor="#00aaff"
      />
      {/* ML Engineer — purple */}
      <Character
        name="Priya"
        position={[1.6, 0, 1.8]}
        rotation={[0, -0.4, 0]}
        accentColor="#b040ff"
        particleColor="#b040ff"
      />
    </group>
  );
}
