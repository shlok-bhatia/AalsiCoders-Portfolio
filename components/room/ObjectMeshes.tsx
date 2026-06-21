'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';


// ─── Monitor ──────────────────────────────────────────────────────────────────
export function MonitorMesh() {
  const screenRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group>
      {/* Stand base */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.24]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Monitor body */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[1.2, 0.72, 0.06]} />
        <meshStandardMaterial color="#0d1117" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.22, 0.035]}>
        <boxGeometry args={[1.1, 0.62, 0.01]} />
        <meshStandardMaterial
          color="#001020"
          emissive="#0044aa"
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>
      {/* Screen code lines (decorative) */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[-0.3 + Math.random() * 0.1, 0.35 - i * 0.1, 0.042]}>
          <boxGeometry args={[0.3 + Math.random() * 0.4, 0.012, 0.001]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00ff41' : '#00aaff'} />
        </mesh>
      ))}
      {/* Blue LED strip on bottom */}
      <mesh position={[0, -0.15, 0.034]}>
        <boxGeometry args={[1.0, 0.008, 0.002]} />
        <meshBasicMaterial color="#0088ff" />
      </mesh>
    </group>
  );
}

// ─── Coffee Cup ───────────────────────────────────────────────────────────────
export function CoffeeMesh() {
  const steamRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (steamRef.current) {
      steamRef.current.position.y = 0.18 + Math.sin(clock.elapsedTime * 1.5) * 0.02;
      steamRef.current.children.forEach((c, i) => {
        c.position.y = Math.sin(clock.elapsedTime * 2 + i) * 0.05;
        const mat = (c as THREE.Mesh).material as (THREE.Material & { opacity: number }) | null;
        if (mat) mat.opacity = 0.3 + Math.sin(clock.elapsedTime + i) * 0.2;
      });
    }
  });

  return (
    <group scale={1.4}>
      {/* Saucer */}
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.02, 32]} />
        <meshStandardMaterial color="#d4a96a" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Cup body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.22, 32]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.4} />
      </mesh>
      {/* Coffee liquid */}
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="#3d1c02" roughness={0.8} />
      </mesh>
      {/* Steam */}
      <group ref={steamRef} position={[0, 0.18, 0]}>
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[(i - 1) * 0.04, 0, 0]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
      {/* AA logo on cup */}
      <mesh position={[0, 0.01, 0.125]}>
        <boxGeometry args={[0.05, 0.05, 0.001]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
    </group>
  );
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────
export function KeyboardMesh() {

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.3]} />
        <meshStandardMaterial color="#0d1117" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Key rows */}
      {[...Array(4)].map((_, row) =>
        [...Array(10)].map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[-0.34 + col * 0.076, 0.028, -0.1 + row * 0.076]}
          >
            <boxGeometry args={[0.065, 0.02, 0.065]} />
            <meshStandardMaterial
              color={col === 4 && row === 1 ? '#00ff41' : col % 3 === 0 ? '#001a33' : '#0d1117'}
              emissive={col === 4 && row === 1 ? '#00ff41' : col % 5 === 0 ? '#001133' : '#000'}
              emissiveIntensity={col === 4 && row === 1 ? 0.8 : 0.3}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        ))
      )}
      {/* RGB underglow */}
      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[0.82, 0.006, 0.32]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ─── Phone ────────────────────────────────────────────────────────────────────
export function PhoneMesh() {
  const screenRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (screenRef.current) {
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(clock.elapsedTime * 3) * 0.15;
    }
  });

  return (
    <group rotation={[0.15, 0, 0.05]}>
      {/* Phone body */}
      <mesh>
        <boxGeometry args={[0.14, 0.28, 0.018]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.011]}>
        <boxGeometry args={[0.12, 0.24, 0.001]} />
        <meshStandardMaterial
          color="#000d1a"
          emissive="#0055aa"
          emissiveIntensity={0.5}
          roughness={0.05}
        />
      </mesh>
      {/* Camera bump */}
      <mesh position={[-0.04, 0.1, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.006, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Notch */}
      <mesh position={[0, 0.1, 0.012]}>
        <boxGeometry args={[0.04, 0.012, 0.001]} />
        <meshBasicMaterial color="#000510" />
      </mesh>
      {/* Status bar dots */}
      <mesh position={[0, 0.08, 0.012]}>
        <boxGeometry args={[0.08, 0.006, 0.001]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
    </group>
  );
}

// ─── Notebook ─────────────────────────────────────────────────────────────────
export function NotebookMesh() {
  return (
    <group rotation={[0, 0.2, 0]}>
      {/* Cover */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.26, 0.34, 0.03]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Spine */}
      <mesh position={[-0.115, 0, 0]}>
        <boxGeometry args={[0.02, 0.34, 0.032]} />
        <meshStandardMaterial color="#b040ff" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Pages */}
      <mesh position={[0.005, 0, 0.015]}>
        <boxGeometry args={[0.22, 0.32, 0.024]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.9} />
      </mesh>
      {/* Page lines */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0.006, 0.1 - i * 0.04, 0.028]}>
          <boxGeometry args={[0.18, 0.004, 0.001]} />
          <meshBasicMaterial color="#ccccdd" />
        </mesh>
      ))}
      {/* Purple bookmark */}
      <mesh position={[0.09, 0.17, 0.028]}>
        <boxGeometry args={[0.02, 0.05, 0.001]} />
        <meshBasicMaterial color="#b040ff" />
      </mesh>
      {/* Logo on cover */}
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[0.06, 0.02, 0.001]} />
        <meshBasicMaterial color="#b040ff" />
      </mesh>
    </group>
  );
}

// ─── Mouse ────────────────────────────────────────────────────────────────────
export function MouseMesh() {
  const scrollRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (scrollRef.current) {
      scrollRef.current.rotation.x = Math.sin(clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group>
      {/* Mouse body */}
      <mesh>
        <capsuleGeometry args={[0.055, 0.1, 8, 16]} />
        <meshStandardMaterial color="#0d0d1a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Left button */}
      <mesh position={[-0.028, 0.06, 0.04]}>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Right button */}
      <mesh position={[0.028, 0.06, 0.04]}>
        <boxGeometry args={[0.05, 0.02, 0.08]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Scroll wheel */}
      <mesh ref={scrollRef} position={[0, 0.072, 0.032]}>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 16]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.4} />
      </mesh>
      {/* RGB strip */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.057, 0.057, 0.01, 32]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ─── Wall Display ─────────────────────────────────────────────────────────────
export function WallDisplayMesh() {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.sin(clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <group>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[3.2, 1.4, 0.08]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Screen */}
      <mesh ref={glowRef} position={[0, 0, 0.045]}>
        <boxGeometry args={[3.0, 1.2, 0.01]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.4} />
      </mesh>
      {/* Inner screen glow */}
      <mesh position={[0, 0, 0.046]}>
        <boxGeometry args={[2.9, 1.1, 0.005]} />
        <meshStandardMaterial
          color="#001a00"
          emissive="#ffd700"
          emissiveIntensity={0.3}
          roughness={0.1}
        />
      </mesh>
      {/* Stat bars */}
      {[...Array(4)].map((_, i) => (
        <group key={i} position={[-1.1 + i * 0.74, -0.1, 0.052]}>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.14, 0.6, 0.001]} />
            <meshBasicMaterial color="#ffd70020" />
          </mesh>
          <mesh position={[0, -0.2 + (0.3 + i * 0.08) / 2, 0]}>
            <boxGeometry args={[0.12, 0.3 + i * 0.08, 0.001]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
        </group>
      ))}
      {/* ACHIEVEMENTS text strip */}
      <mesh position={[0, 0.42, 0.052]}>
        <boxGeometry args={[1.2, 0.06, 0.001]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      {/* LED strip border */}
      <mesh position={[0, -0.72, 0.04]}>
        <boxGeometry args={[3.2, 0.012, 0.01]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
