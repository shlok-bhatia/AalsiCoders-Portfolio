// 'use client';

// import * as THREE from 'three';
// import { useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { Grid, MeshReflectorMaterial } from '@react-three/drei';
// import { Text } from "@react-three/drei";

// export default function ProceduralRoom() {
//   const ambientGridRef = useRef<THREE.Group>(null);

//   useFrame(({ clock }) => {
//     // Subtle grid scroll effect
//     if (ambientGridRef.current) {
//       ambientGridRef.current.children.forEach((child) => {
//         if ((child as THREE.Mesh).material) {
//           const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
//           if (mat.map) {
//             mat.map.offset.y = (clock.elapsedTime * 0.05) % 1;
//           }
//         }
//       });
//     }
//   });

//   return (
//     <group>
//       {/* ── FLOOR ── */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
//         <planeGeometry args={[16, 12]} />
//         <MeshReflectorMaterial
//           blur={[300, 100]}
//           resolution={512}
//           mixBlur={1}
//           mixStrength={40}
//           roughness={1}
//           depthScale={1.2}
//           minDepthThreshold={0.4}
//           maxDepthThreshold={1.4}
//           color="#020408"
//           metalness={0.8}
//           mirror={0}
//         />
//       </mesh>

//       {/* Floor grid overlay */}
//       <Grid
//         position={[0, 0.001, 0]}
//         args={[16, 12]}
//         cellSize={0.6}
//         cellThickness={0.3}
//         cellColor="#0077ff"
//         sectionSize={3}
//         sectionThickness={0.6}
//         sectionColor="#00e5ff"
//         fadeDistance={10}
//         fadeStrength={1}
//         infiniteGrid={false}
//       />

//       {/* ── BACK WALL ── */}
//       <mesh position={[0, 2.5, -4]} receiveShadow>
//         <planeGeometry args={[10, 5]} />
//         <meshStandardMaterial color="#050b14" roughness={0.9} metalness={0.1} />
//       </mesh>

//       {/* Back wall vertical light strips */}
//       {[-3.5, -1, 1, 3.5].map((x, i) => (
//         <mesh key={i} position={[x, 2.5, -3.98]}>
//           <boxGeometry args={[0.02, 4.5, 0.01]} />
//           <meshBasicMaterial
//             color={i % 2 === 0 ? '#00aaff' : '#b040ff'}
//             transparent
//             opacity={0.6}
//           />
//         </mesh>
//       ))}

//       {/* ── LEFT WALL ── */}
//       <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
//         <planeGeometry args={[8, 5]} />
//         <meshStandardMaterial color="#040910" roughness={0.9} metalness={0.1} />
//       </mesh>

//       {/* ── RIGHT WALL ── */}
//       <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
//         <planeGeometry args={[8, 5]} />
//         <meshStandardMaterial color="#040910" roughness={0.9} metalness={0.1} />
//       </mesh>

//       {/* ── CEILING ── */}
//       <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
//         <planeGeometry args={[16, 12]} />
//         <meshStandardMaterial color="#020508" roughness={1} />
//       </mesh>

//       {/* Ceiling light panels */}
//       {[[-2, 0], [2, 0], [0, -2], [0, 2]].map(([x, z], i) => (
//         <group key={i} position={[x, 4.95, z]}>
//           <mesh>
//             <boxGeometry args={[0.8, 0.02, 0.4]} />
//             <meshBasicMaterial color="#0044aa" transparent opacity={0.9} />
//           </mesh>
//           {/* Ceiling light emission */}
//           <pointLight
//             color="#0066cc"
//             intensity={1.5}
//             distance={4}
//             decay={2}
//           />
//         </group>
//       ))}

//       {/* ── MAIN DESK ── */}
//       <group position={[0, 0, -1.8]}>
//         {/* Desk surface */}
//         <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
//           <boxGeometry args={[3.5, 0.04, 1.2]} />
//           <meshStandardMaterial color="#0a0e18" metalness={0.6} roughness={0.4} />
//         </mesh>
//         {/* Desk legs */}
//         {[[-1.6, -1.6], [-1.6, 1.6], [1.6, -1.6], [1.6, 1.6]].map(([lx, lz], i) => (
//           <mesh key={i} position={[lx * 0.95, 0.34, lz * 0.44]} castShadow>
//             <boxGeometry args={[0.06, 0.68, 0.06]} />
//             <meshStandardMaterial color="#0d1117" metalness={0.8} roughness={0.2} />
//           </mesh>
//         ))}
//         {/* Desk RGB strip */}
//         <mesh position={[0, 0.67, 0.62]}>
//           <boxGeometry args={[3.5, 0.008, 0.004]} />
//           <meshBasicMaterial color="#00aaff" transparent opacity={0.7} />
//         </mesh>
//       </group>

//       {/* ── SIDE SHELF (left) ── */}
//       <mesh position={[-3.2, 1.2, -0.8]} castShadow>
//         <boxGeometry args={[1.2, 0.04, 0.4]} />
//         <meshStandardMaterial color="#0a0e18" metalness={0.5} roughness={0.5} />
//       </mesh>

//       {/* ── SIDE SHELF (right) ── */}
//       <mesh position={[3.2, 1.5, -0.8]} castShadow>
//         <boxGeometry args={[1.2, 0.04, 0.4]} />
//         <meshStandardMaterial color="#0a0e18" metalness={0.5} roughness={0.5} />
//       </mesh>

//       {/* ── DECOR: Server rack (right wall) ── */}
//       <group position={[4.2, 0.9, -1]}>
//         <mesh castShadow>
//           <boxGeometry args={[0.5, 1.8, 0.5]} />
//           <meshStandardMaterial color="#080c14" metalness={0.7} roughness={0.3} />
//         </mesh>
//         {[...Array(6)].map((_, i) => (
//           <group key={i} position={[0, -0.6 + i * 0.22, 0.26]}>
//             <mesh>
//               <boxGeometry args={[0.38, 0.14, 0.02]} />
//               <meshStandardMaterial color="#0d1117" metalness={0.6} roughness={0.4} />
//             </mesh>
//             <mesh position={[0.14, 0, 0.012]}>
//               <boxGeometry args={[0.04, 0.04, 0.001]} />
//               <meshBasicMaterial color={i % 2 === 0 ? '#00ff41' : '#ff4400'} />
//             </mesh>
//           </group>
//         ))}
//       </group>

//       {/* ── AMBIENT ATMOSPHERE: Floating particles ── */}
//       <FloatingParticles />

//       {/* ── LIGHTING ── */}
//       {/* Key light */}

//       <pointLight
//         position={[0, 3, 2]}
//         color="#66ccff"
//         intensity={6}
//         distance={20}
//         decay={2}
//       />
//       <directionalLight
//         position={[3, 6, 4]}
//         intensity={1.4}
//         color="#9ed0ff"
//         castShadow
//         shadow-mapSize={[2048, 2048]}
//       />
//       {/* Fill light */}
//       <directionalLight
//         position={[-4, 4, 2]}
//         intensity={0.9}
//         color="#5c8cff"
//       />
//       {/* Purple accent */}
//       <pointLight
//         position={[-2, 2, 1]}
//         color="#00ff41"
//         intensity={3}
//         distance={8}
//       />
//       <pointLight
//         position={[2, 2, 1]}
//         color="#b040ff"
//         intensity={3}
//         distance={8}
//       />
//       <pointLight
//         position={[-4, 3, -2]}
//         color="#b040ff"
//         intensity={4}
//         distance={10}
//       />
//       <pointLight
//         position={[4, 2, -1]}
//         color="#00ff41"
//         intensity={2}
//         distance={8}
//       />
//       {/* Green accent (left) */}
//       <pointLight position={[-4.5, 1, 1]} color="#00ff41" intensity={1.5} distance={4} decay={2} />
//       {/* General ambient */}
//       <ambientLight intensity={0.85} color="#d6ecff" />
//     </group>
//   );
// }

// // ── Floating particles ──────────────────────────────────────────────────────
// function FloatingParticles() {
//   const count = 80;
//   const meshRef = useRef<THREE.Points>(null);

//   const positions = new Float32Array(count * 3);
//   const colors = new Float32Array(count * 3);

//   for (let i = 0; i < count; i++) {
//     positions[i * 3] = (Math.random() - 0.5) * 14;
//     positions[i * 3 + 1] = Math.random() * 4 + 0.2;
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

//     const colorChoice = Math.random();
//     if (colorChoice < 0.33) {
//       colors[i * 3] = 0; colors[i * 3 + 1] = 0.67; colors[i * 3 + 2] = 1;
//     } else if (colorChoice < 0.66) {
//       colors[i * 3] = 0; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 0.25;
//     } else {
//       colors[i * 3] = 0.69; colors[i * 3 + 1] = 0.25; colors[i * 3 + 2] = 1;
//     }
//   }

//   const velocities = Array.from({ length: count }, () => ({
//     x: (Math.random() - 0.5) * 0.002,
//     y: Math.random() * 0.003 + 0.001,
//     z: (Math.random() - 0.5) * 0.002,
//   }));

//   useFrame(() => {
//     if (!meshRef.current) return;
//     const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
//     for (let i = 0; i < count; i++) {
//       pos[i * 3] += velocities[i].x;
//       pos[i * 3 + 1] += velocities[i].y;
//       pos[i * 3 + 2] += velocities[i].z;
//       if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = 0.2;
//     }
//     meshRef.current.geometry.attributes.position.needsUpdate = true;
//   });

//   return (
//     <points ref={meshRef}>
//       <bufferGeometry>
//         <bufferAttribute attach="attributes-position" args={[positions, 3]} />
//         <bufferAttribute attach="attributes-color" args={[colors, 3]} />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.025}
//         vertexColors
//         transparent
//         opacity={0.7}
//         sizeAttenuation
//         depthWrite={false}
//       />
//     </points>
//   );
// }
'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, MeshReflectorMaterial } from '@react-three/drei';

export default function ProceduralRoom() {
  const holoRingRef = useRef<THREE.Mesh>(null);
  const holoRing2Ref = useRef<THREE.Mesh>(null);
  const energyRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (holoRingRef.current) {
      holoRingRef.current.rotation.z = t * 0.25;
      const mat = holoRingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(t * 0.8) * 0.1;
    }
    if (holoRing2Ref.current) {
      holoRing2Ref.current.rotation.z = -t * 0.18;
      const mat = holoRing2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 1.1) * 0.08;
    }
    if (energyRef.current) {
      energyRef.current.children.forEach((child, i) => {
        child.position.y = 0.5 + Math.sin(t * 0.6 + i * 1.2) * 0.06;
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat?.opacity !== undefined)
          mat.opacity = 0.35 + Math.sin(t * 1.5 + i) * 0.2;
      });
    }
  });

  return (
    <group>
      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <MeshReflectorMaterial
          blur={[500, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.85}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050810"
          metalness={0.9}
          mirror={0}
        />
      </mesh>

      {/* Floor grid - subtle */}
      <Grid
        position={[0, 0.002, 0]}
        args={[20, 16]}
        cellSize={0.5}
        cellThickness={0.3}
        cellColor="#1a3a6a"
        sectionSize={2.5}
        sectionThickness={0.6}
        sectionColor="#1a5580"
        fadeDistance={12}
        fadeStrength={2}
        infiniteGrid={false}
      />

      {/* BACK WALL */}
      <mesh position={[0, 2.75, -5]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#0a0c12" roughness={0.98} metalness={0.02} />
      </mesh>

      {/* Back wall thin neon strips */}
      {[-5.5, -3.5, -1.5, 0, 1.5, 3.5, 5.5].map((x, i) => (
        <mesh key={i} position={[x, 2.75, -4.97]}>
          <boxGeometry args={[0.012, 5.2, 0.008]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#003366' : i % 3 === 1 ? '#004455' : '#2a0044'}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}

      <ScanBar />

      {/* LEFT WALL */}
      <mesh position={[-7, 2.75, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#08090f" roughness={0.98} metalness={0.02} />
      </mesh>

      {/* RIGHT WALL */}
      <mesh position={[7, 2.75, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#08090f" roughness={0.98} metalness={0.02} />
      </mesh>

      {/* CEILING */}
      <mesh position={[0, 5.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial color="#060710" roughness={1} />
      </mesh>

      {/* Ceiling recessed warm amber light strips */}
      {[[-3.5, -1.5], [-3.5, 1.5], [3.5, -1.5], [3.5, 1.5]].map(([x, z], i) => (
        <group key={i} position={[x, 5.45, z]}>
          <mesh>
            <boxGeometry args={[2.5, 0.012, 0.06]} />
            <meshBasicMaterial color="#ffcc77" transparent opacity={0.9} />
          </mesh>
          <pointLight color="#ff9944" intensity={4} distance={5} decay={2} />
        </group>
      ))}

      {/* Central ceiling cool cyan strip */}
      <group position={[0, 5.45, 0]}>
        <mesh>
          <boxGeometry args={[4, 0.012, 0.06]} />
          <meshBasicMaterial color="#44ccff" transparent opacity={0.8} />
        </mesh>
        <pointLight color="#22aaee" intensity={5} distance={6} decay={2} />
      </group>

      {/* MAIN DESK */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.5, 0.05, 1.5]} />
          <meshStandardMaterial color="#080c14" metalness={0.8} roughness={0.25} />
        </mesh>
        {[[-2.1, -2.1], [-2.1, 2.1], [2.1, -2.1], [2.1, 2.1]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx * 0.95, 0.35, lz * 0.44]} castShadow>
            <boxGeometry args={[0.06, 0.7, 0.06]} />
            <meshStandardMaterial color="#0a0d16" metalness={0.9} roughness={0.15} />
          </mesh>
        ))}
        {/* Subtle cyan desk edge */}
        <mesh position={[0, 0.698, 0.76]}>
          <boxGeometry args={[4.5, 0.006, 0.003]} />
          <meshBasicMaterial color="#0099cc" transparent opacity={0.7} />
        </mesh>
        <pointLight position={[0, 1.2, -0.5]} color="#ffaa44" intensity={2} distance={3} decay={2} />
        <pointLight position={[0, 0.1, 0]} color="#003366" intensity={1.5} distance={3} decay={2} />
      </group>

      {/* SIDE SHELF left */}
      <group position={[-4.2, 1.6, -1.8]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.04, 0.5]} />
          <meshStandardMaterial color="#080c14" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.022, 0.26]}>
          <boxGeometry args={[1.5, 0.004, 0.002]} />
          <meshBasicMaterial color="#00aa55" transparent opacity={0.6} />
        </mesh>
        <pointLight position={[0, 0.3, 0]} color="#00aa55" intensity={0.8} distance={2} decay={2} />
      </group>

      {/* SERVER RACK right */}
      <group position={[5.8, 1.2, -2]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 2.4, 0.6]} />
          <meshStandardMaterial color="#06090f" metalness={0.8} roughness={0.3} />
        </mesh>
        {[...Array(9)].map((_, i) => (
          <group key={i} position={[0, -0.9 + i * 0.22, 0.31]}>
            <mesh>
              <boxGeometry args={[0.48, 0.17, 0.018]} />
              <meshStandardMaterial color="#09101e" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.18, 0, 0.011]}>
              <boxGeometry args={[0.04, 0.04, 0.001]} />
              <meshBasicMaterial color={i % 3 === 0 ? '#00cc44' : i % 3 === 1 ? '#ff4400' : '#0088cc'} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 0, 0.5]} color="#00cc44" intensity={1.2} distance={3} decay={2} />
      </group>

      {/* HOLOGRAPHIC RING floor center */}
      <group position={[0, 0.003, 0]}>
        <mesh ref={holoRingRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.85, 3.0, 64]} />
          <meshBasicMaterial color="#0044aa" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={holoRing2Ref} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.6, 64]} />
          <meshBasicMaterial color="#006688" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.0, 64]} />
          <meshBasicMaterial color="#001133" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ENERGY COLUMNS corners */}
      <group ref={energyRef}>
        {[[-5, 0.5, -3.5], [5, 0.5, -3.5]].map(([x, y, z], i) => (
          <group key={i} position={[x as number, y as number, z as number]}>
            <mesh>
              <cylinderGeometry args={[0.025, 0.025, 1, 8]} />
              <meshBasicMaterial
                color={i === 0 ? '#00aa44' : '#8833cc'}
                transparent opacity={0.5}
              />
            </mesh>
            <pointLight color={i === 0 ? '#00aa44' : '#8833cc'} intensity={2} distance={4} decay={2} />
          </group>
        ))}
      </group>

      <FloatingParticles />
      <DataStreams />

      {/* ── LIGHTING — HQ Cinematic: warm amber overhead + cool cyan accents ── */}

      {/* Base ambient - just fills shadows, not bright */}
      <ambientLight intensity={0.55} color="#b8c8e0" />

      {/* Warm amber overhead — like interior HQ lighting from image 2 */}
      <pointLight position={[-3, 5, -1]} color="#ff9944" intensity={8} distance={10} decay={2} />
      <pointLight position={[3, 5, -1]} color="#ffaa55" intensity={8} distance={10} decay={2} />
      <pointLight position={[0, 5, 1]} color="#ff8833" intensity={6} distance={9} decay={2} />

      {/* Cool cyan tech accents at mid-height */}
      <pointLight position={[0, 2.5, -1.5]} color="#0099cc" intensity={6} distance={8} decay={2} />
      <pointLight position={[-3, 1.5, 0]} color="#0077aa" intensity={3} distance={5} decay={2} />
      <pointLight position={[3, 1.5, 0]} color="#0077aa" intensity={3} distance={5} decay={2} />

      {/* Directional for crisp warm shadows */}
      <directionalLight
        position={[2, 7, 4]}
        intensity={1.8}
        color="#ffe0bb"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />

      {/* Front fill so characters are lit facing camera */}
      <pointLight position={[0, 1.8, 5]} color="#cc8833" intensity={4} distance={10} decay={2} />

      {/* Green left accent — server rack side */}
      <pointLight position={[-5.5, 2, -2]} color="#00aa44" intensity={4} distance={7} decay={2} />

      {/* Purple right accent */}
      <pointLight position={[5.5, 2, -2]} color="#7722bb" intensity={4} distance={7} decay={2} />

      {/* Desk warm pool */}
      <pointLight position={[0, 2, -3]} color="#ffbb66" intensity={3} distance={4} decay={2} />

      {/* Floor dim bounce */}
      <pointLight position={[0, 0.2, 0]} color="#001a33" intensity={2} distance={5} decay={2} />
    </group>
  );
}

function ScanBar() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.3 + ((clock.elapsedTime * 0.45) % 5);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(clock.elapsedTime * 2.5) * 0.02;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.3, -4.96]}>
      <planeGeometry args={[16, 0.04]} />
      <meshBasicMaterial color="#0099cc" transparent opacity={0.05} />
    </mesh>
  );
}

function FloatingParticles() {
  const count = 60;
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 4 + 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = Math.random();
      if (c < 0.4) { colors[i*3]=1; colors[i*3+1]=0.75; colors[i*3+2]=0.3; }
      else if (c < 0.7) { colors[i*3]=0; colors[i*3+1]=0.7; colors[i*3+2]=1; }
      else { colors[i*3]=1; colors[i*3+1]=1; colors[i*3+2]=1; }
    }
    return { positions, colors };
  }, []);

  const velocities = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.001,
      y: Math.random() * 0.0012 + 0.0003,
      z: (Math.random() - 0.5) * 0.001,
      wobble: Math.random() * Math.PI * 2,
    })), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i].x + Math.sin(t * 0.3 + velocities[i].wobble) * 0.0002;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = 0.2;
      if (Math.abs(pos[i * 3]) > 8) pos[i * 3] *= -0.95;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.016} vertexColors transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function DataStreams() {
  const ref = useRef<THREE.Group>(null);
  const streams = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      x: (Math.random() - 0.5) * 12,
      z: -2.5 - Math.random() * 2,
      speed: 0.5 + Math.random() * 0.8,
      offset: Math.random() * Math.PI * 2,
      color: ['#003366', '#004422', '#220033', '#003344'][i % 4],
      height: 0.2 + Math.random() * 0.4,
    })), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const s = streams[i];
      child.position.y = ((t * s.speed + s.offset) % 5);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat?.opacity !== undefined)
        mat.opacity = 0.12 + Math.sin(t * 2 + s.offset) * 0.08;
    });
  });

  return (
    <group ref={ref}>
      {streams.map((s, i) => (
        <mesh key={i} position={[s.x, 0, s.z]}>
          <boxGeometry args={[0.01, s.height, 0.01]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}