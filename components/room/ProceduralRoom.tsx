'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, MeshReflectorMaterial } from '@react-three/drei';

export default function ProceduralRoom() {
  const ambientGridRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    // Subtle grid scroll effect
    if (ambientGridRef.current) {
      ambientGridRef.current.children.forEach((child) => {
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat.map) {
            mat.map.offset.y = (clock.elapsedTime * 0.05) % 1;
          }
        }
      });
    }
  });

  return (
    <group>
      {/* ── FLOOR ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#020408"
          metalness={0.8}
          mirror={0}
        />
      </mesh>

      {/* Floor grid overlay */}
      <Grid
        position={[0, 0.001, 0]}
        args={[16, 12]}
        cellSize={0.6}
        cellThickness={0.3}
        cellColor="#001833"
        sectionSize={3}
        sectionThickness={0.6}
        sectionColor="#002244"
        fadeDistance={10}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* ── BACK WALL ── */}
      <mesh position={[0, 2.5, -4]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#050b14" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Back wall vertical light strips */}
      {[-3.5, -1, 1, 3.5].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -3.98]}>
          <boxGeometry args={[0.02, 4.5, 0.01]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00aaff' : '#b040ff'}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* ── LEFT WALL ── */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#040910" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── RIGHT WALL ── */}
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#040910" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ── CEILING ── */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#020508" roughness={1} />
      </mesh>

      {/* Ceiling light panels */}
      {[[-2, 0], [2, 0], [0, -2], [0, 2]].map(([x, z], i) => (
        <group key={i} position={[x, 4.95, z]}>
          <mesh>
            <boxGeometry args={[0.8, 0.02, 0.4]} />
            <meshBasicMaterial color="#0044aa" transparent opacity={0.9} />
          </mesh>
          {/* Ceiling light emission */}
          <pointLight
            color="#0066cc"
            intensity={1.5}
            distance={4}
            decay={2}
          />
        </group>
      ))}

      {/* ── MAIN DESK ── */}
      <group position={[0, 0, -1.8]}>
        {/* Desk surface */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 0.04, 1.2]} />
          <meshStandardMaterial color="#0a0e18" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Desk legs */}
        {[[-1.6, -1.6], [-1.6, 1.6], [1.6, -1.6], [1.6, 1.6]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx * 0.95, 0.34, lz * 0.44]} castShadow>
            <boxGeometry args={[0.06, 0.68, 0.06]} />
            <meshStandardMaterial color="#0d1117" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Desk RGB strip */}
        <mesh position={[0, 0.67, 0.62]}>
          <boxGeometry args={[3.5, 0.008, 0.004]} />
          <meshBasicMaterial color="#00aaff" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* ── SIDE SHELF (left) ── */}
      <mesh position={[-3.2, 1.2, -0.8]} castShadow>
        <boxGeometry args={[1.2, 0.04, 0.4]} />
        <meshStandardMaterial color="#0a0e18" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* ── SIDE SHELF (right) ── */}
      <mesh position={[3.2, 1.5, -0.8]} castShadow>
        <boxGeometry args={[1.2, 0.04, 0.4]} />
        <meshStandardMaterial color="#0a0e18" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* ── DECOR: Server rack (right wall) ── */}
      <group position={[4.2, 0.9, -1]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 1.8, 0.5]} />
          <meshStandardMaterial color="#080c14" metalness={0.7} roughness={0.3} />
        </mesh>
        {[...Array(6)].map((_, i) => (
          <group key={i} position={[0, -0.6 + i * 0.22, 0.26]}>
            <mesh>
              <boxGeometry args={[0.38, 0.14, 0.02]} />
              <meshStandardMaterial color="#0d1117" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.14, 0, 0.012]}>
              <boxGeometry args={[0.04, 0.04, 0.001]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#00ff41' : '#ff4400'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── AMBIENT ATMOSPHERE: Floating particles ── */}
      <FloatingParticles />

      {/* ── LIGHTING ── */}
      {/* Key light */}
      <directionalLight
        position={[3, 6, 4]}
        intensity={0.8}
        color="#4488ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Fill light */}
      <directionalLight
        position={[-4, 4, 2]}
        intensity={0.4}
        color="#2244aa"
      />
      {/* Purple accent */}
      <pointLight position={[-4, 3, -2]} color="#b040ff" intensity={2} distance={5} decay={2} />
      {/* Green accent (left) */}
      <pointLight position={[-4.5, 1, 1]} color="#00ff41" intensity={1.5} distance={4} decay={2} />
      {/* General ambient */}
      <ambientLight intensity={0.15} color="#080c18" />
    </group>
  );
}

// ── Floating particles ──────────────────────────────────────────────────────
function FloatingParticles() {
  const count = 80;
  const meshRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = Math.random() * 4 + 0.2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      colors[i * 3] = 0; colors[i * 3 + 1] = 0.67; colors[i * 3 + 2] = 1;
    } else if (colorChoice < 0.66) {
      colors[i * 3] = 0; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 0.25;
    } else {
      colors[i * 3] = 0.69; colors[i * 3 + 1] = 0.25; colors[i * 3 + 2] = 1;
    }
  }

  const velocities = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 0.002,
    y: Math.random() * 0.003 + 0.001,
    z: (Math.random() - 0.5) * 0.002,
  }));

  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = 0.2;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
