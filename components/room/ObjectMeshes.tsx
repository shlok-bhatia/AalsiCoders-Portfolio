
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
      mat.emissiveIntensity = 1.0 + Math.sin(clock.elapsedTime * 1.5) * 0.2;
    }
  });

  return (
    <group>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.24]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[1.2, 0.72, 0.06]} />
        <meshStandardMaterial color="#0d1117" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Screen — cool cyan tint */}
      <mesh ref={screenRef} position={[0, 0.22, 0.035]}>
        <boxGeometry args={[1.1, 0.62, 0.01]} />
        <meshStandardMaterial
          color="#151515"
          emissive="#ffaa55"
          emissiveIntensity={1.0}
          roughness={0.05}
        />
      </mesh>
      {/* Code lines */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[-0.28 + (i % 2) * 0.04, 0.38 - i * 0.09, 0.042]}>
          <boxGeometry args={[0.25 + (i % 3) * 0.12, 0.013, 0.001]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00cc55' : '#0099cc'} />
        </mesh>
      ))}
      <mesh position={[0, -0.15, 0.034]}>
        <boxGeometry args={[1.0, 0.009, 0.003]} />
        <meshBasicMaterial color="#0099cc" />
      </mesh>
      <pointLight position={[0, 0.22, 0.2]} color="#0044aa" intensity={2} distance={2} decay={2} />
    </group>
  );
}

// ─── Coffee Cup ───────────────────────────────────────────────────────────────
export function CoffeeMesh() {
  const steamRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (steamRef.current) {
      steamRef.current.position.y = 0.18 + Math.sin(clock.elapsedTime * 1.2) * 0.018;
      steamRef.current.children.forEach((c, i) => {
        c.position.y = Math.sin(clock.elapsedTime * 1.8 + i) * 0.04;
        const mat = (c as THREE.Mesh).material as (THREE.Material & { opacity: number }) | null;
        if (mat) mat.opacity = 0.35 + Math.sin(clock.elapsedTime + i) * 0.2;
      });
    }
  });

  return (
    <group scale={1.4}>
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.02, 32]} />
        <meshStandardMaterial color="#c49a5a" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.22, 32]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial color="#3d1c02" roughness={0.8} />
      </mesh>
      <group ref={steamRef} position={[0, 0.18, 0]}>
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[(i - 1) * 0.04, 0, 0]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#aabbcc" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.01, 0.126]}>
        <boxGeometry args={[0.05, 0.05, 0.001]} />
        <meshBasicMaterial color="#ffcc44" />
      </mesh>
    </group>
  );
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────
export function KeyboardMesh() {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + Math.sin(clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <group>
      <mesh>
        <boxGeometry args={[0.8, 0.04, 0.3]} />
        <meshStandardMaterial color="#0d1117" metalness={0.7} roughness={0.3} />
      </mesh>
      {[...Array(4)].map((_, row) =>
        [...Array(10)].map((_, col) => (
          <mesh key={`${row}-${col}`} position={[-0.34 + col * 0.076, 0.028, -0.1 + row * 0.076]}>
            <boxGeometry args={[0.065, 0.022, 0.065]} />
            <meshStandardMaterial
              color={col % 3 === 0 ? '#001830' : '#0a0d14'}
              emissive={col % 5 === 0 ? '#003355' : '#000508'}
              emissiveIntensity={col % 5 === 0 ? 0.7 : 0.3}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        ))
      )}
      <mesh ref={glowRef} position={[0, -0.006, 0]}>
        <boxGeometry args={[0.82, 0.007, 0.32]} />
        <meshBasicMaterial color="#0099cc" transparent opacity={0.35} />
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
        0.9 + Math.sin(clock.elapsedTime * 2.5) * 0.25;
    }
  });

  return (
    <group rotation={[0.15, 0, 0.05]}>
      <mesh>
        <boxGeometry args={[0.14, 0.28, 0.018]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, 0.011]}>
        <boxGeometry args={[0.12, 0.24, 0.001]} />
        <meshStandardMaterial
          color="#000d1a"
          emissive="#004488"
          emissiveIntensity={0.9}
          roughness={0.05}
        />
      </mesh>
      <mesh position={[-0.04, 0.1, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.006, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 0.012]}>
        <boxGeometry args={[0.04, 0.012, 0.001]} />
        <meshBasicMaterial color="#000510" />
      </mesh>
      <mesh position={[0, 0.08, 0.012]}>
        <boxGeometry args={[0.08, 0.007, 0.001]} />
        <meshBasicMaterial color="#00ccee" />
      </mesh>
      <pointLight position={[0, 0, 0.08]} color="#003388" intensity={1.2} distance={1.2} decay={2} />
    </group>
  );
}

// ─── Notebook ─────────────────────────────────────────────────────────────────
export function NotebookMesh() {
  return (
    <group rotation={[0, 0.2, 0]}>
      <mesh>
        <boxGeometry args={[0.26, 0.34, 0.03]} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-0.115, 0, 0]}>
        <boxGeometry args={[0.022, 0.34, 0.033]} />
        <meshStandardMaterial
          color="#1a0030"
          emissive="#7722bb"
          emissiveIntensity={1.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.005, 0, 0.015]}>
        <boxGeometry args={[0.22, 0.32, 0.024]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.9} />
      </mesh>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0.006, 0.1 - i * 0.04, 0.028]}>
          <boxGeometry args={[0.18, 0.004, 0.001]} />
          <meshBasicMaterial color="#ccccdd" />
        </mesh>
      ))}
      <mesh position={[0.09, 0.17, 0.028]}>
        <boxGeometry args={[0.022, 0.055, 0.001]} />
        <meshBasicMaterial color="#8833cc" />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[0.07, 0.022, 0.001]} />
        <meshBasicMaterial color="#8833cc" />
      </mesh>
      <pointLight position={[-0.12, 0, 0.1]} color="#7722bb" intensity={1.2} distance={1.5} decay={2} />
    </group>
  );
}

// ─── Mouse ────────────────────────────────────────────────────────────────────
export function MouseMesh() {
  const scrollRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (scrollRef.current) {
      scrollRef.current.rotation.x = Math.sin(clock.elapsedTime * 1.8) * 0.25;
    }
  });

  return (
    <group>
      <mesh>
        <capsuleGeometry args={[0.055, 0.1, 8, 16]} />
        <meshStandardMaterial color="#0d0d1a" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[-0.028, 0.06, 0.04]}>
        <boxGeometry args={[0.05, 0.022, 0.08]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0.028, 0.06, 0.04]}>
        <boxGeometry args={[0.05, 0.022, 0.08]} />
        <meshStandardMaterial color="#111122" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh ref={scrollRef} position={[0, 0.072, 0.032]}>
        <cylinderGeometry args={[0.013, 0.013, 0.032, 16]} />
        <meshStandardMaterial color="#1a0000" emissive="#cc3333" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.012, 32]} />
        <meshBasicMaterial color="#0099cc" transparent opacity={0.5} />
      </mesh>
      <pointLight position={[0, -0.08, 0]} color="#0077aa" intensity={1} distance={1} decay={2} />
    </group>
  );
}

// ─── Wall Display ─────────────────────────────────────────────────────────────
export function WallDisplayMesh() {
  const screenRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (screenRef.current) {
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + Math.sin(t * 0.5) * 0.2;
    }
    if (scanRef.current) {
      scanRef.current.position.y = -0.55 + ((t * 0.35) % 1.1);
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.14 + Math.sin(t * 3) * 0.07;
    }
  });

  return (
    <group>
      {/* Bezel */}
      <mesh>
        <boxGeometry args={[3.4, 1.6, 0.05]} />
        <meshStandardMaterial color="#050a18" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Screen — warm-cool gradient feel */}
      <mesh ref={screenRef} position={[0, 0, 0.028]}>
        <boxGeometry args={[3.2, 1.4, 0.01]} />
        <meshStandardMaterial
          color="#000810"
          emissive="#001a44"
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      {/* Scan line */}
      <mesh ref={scanRef} position={[0, 0, 0.035]}>
        <planeGeometry args={[3.2, 0.025]} />
        <meshBasicMaterial color="#0099cc" transparent opacity={0.18} />
      </mesh>
      {/* Header */}
      <mesh position={[0, 0.58, 0.036]}>
        <planeGeometry args={[3.0, 0.088]} />
        <meshBasicMaterial color="#001a44" transparent opacity={0.92} />
      </mesh>
      <mesh position={[-0.62, 0.58, 0.037]}>
        <planeGeometry args={[0.9, 0.048]} />
        <meshBasicMaterial color="#0088bb" transparent opacity={0.95} />
      </mesh>
      {/* Status dots */}
      {[0.82, 0.97, 1.12].map((x, i) => (
        <mesh key={i} position={[x, 0.58, 0.037]}>
          <circleGeometry args={[0.019, 16]} />
          <meshBasicMaterial color={['#00cc44', '#ffaa00', '#ff4444'][i]} />
        </mesh>
      ))}
      {/* Data bars — warm accent on top bar */}
      {[0, 1, 2, 3, 4].map((i) => {
        const h = 0.28 + i * 0.1;
        return (
          <group key={i} position={[-0.96 + i * 0.52, -0.22, 0.036]}>
            <mesh>
              <planeGeometry args={[0.2, 0.75]} />
              <meshBasicMaterial color="#001540" transparent opacity={0.65} />
            </mesh>
            <mesh position={[0, -0.375 + h / 2, 0.001]}>
              <planeGeometry args={[0.16, h]} />
              <meshBasicMaterial
                color={['#0099cc', '#00cc66', '#8833cc', '#00bbdd', '#ffaa33'][i]}
                transparent opacity={0.9}
              />
            </mesh>
            <mesh position={[0, -0.375 + h + 0.012, 0.002]}>
              <planeGeometry args={[0.18, 0.018]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
          </group>
        );
      })}
      {/* Bottom ticker */}
      <mesh position={[0, -0.66, 0.036]}>
        <planeGeometry args={[3.0, 0.042]} />
        <meshBasicMaterial color="#000d22" transparent opacity={0.92} />
      </mesh>
      {/* Frame LED borders */}
      <mesh position={[0, 0.805, 0.026]}>
        <boxGeometry args={[3.4, 0.007, 0.01]} />
        <meshBasicMaterial color="#0099cc" transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, -0.805, 0.026]}>
        <boxGeometry args={[3.4, 0.007, 0.01]} />
        <meshBasicMaterial color="#0099cc" transparent opacity={0.7} />
      </mesh>
      {[-1.71, 1.71].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.026]}>
          <boxGeometry args={[0.007, 1.6, 0.01]} />
          <meshBasicMaterial color="#0055aa" transparent opacity={0.6} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0.6]} color="#003388" intensity={4} distance={5} decay={2} />
    </group>
  );
}