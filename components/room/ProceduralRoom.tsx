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
import { Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, MeshReflectorMaterial } from '@react-three/drei';
import { useTexture } from "@react-three/drei";
export default function ProceduralRoom() {
  const holoRingRef = useRef<THREE.Mesh>(null);
  const holoRing2Ref = useRef<THREE.Mesh>(null);
  const energyRef = useRef<THREE.Group>(null);
  const backdrop = useTexture("assets/images/mountain-sunset.jpeg");
  const groundTex = useTexture("assets/images/ground.png");
  useMemo(() => {
    groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(8, 8);
    groundTex.needsUpdate = true;
  }, [groundTex]);
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
        <planeGeometry args={[20, 10.4]} />
        <MeshReflectorMaterial
          blur={[500, 200]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.25}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a1a1a"
          metalness={0.4}
          mirror={0}
        />
      </mesh>



      {/* BACK WALL */}
      <mesh position={[0, 2.75, -5]} receiveShadow>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color="#2b2f36" roughness={0.98} metalness={0.02} />
      </mesh>

      {/* GLASS FRONT WALL - Realistic Architectural Glass */}

      <group position={[0, 0, 5]}>

        {/* Left Glass - Premium architectural glass */}
        <mesh position={[-5.5, 2.75, 0]}>
          <planeGeometry args={[6, 5.5]} />
          <meshPhysicalMaterial
            color="#dfefff"
            transmission={1}
            transparent
            opacity={0.35}
            roughness={0.12}
            metalness={0}
            thickness={0.4}
            ior={1.5}
            envMapIntensity={2}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Left Glass Frame */}
        <mesh position={[-5.5, 2.75, 0.15]}>
          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.PlaneGeometry(6, 5.5)
              ]}
            />
            <lineBasicMaterial
              color="#8aa0b3"
            />
          </lineSegments>
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Right Glass - Premium architectural glass */}
        <mesh position={[5.5, 2.75, 0]}>
          <planeGeometry args={[6, 5.5]} />
          <meshPhysicalMaterial
            color="#dfefff"
            transmission={1}
            transparent
            opacity={0.35}
            roughness={0.12}
            metalness={0}
            thickness={0.4}
            ior={1.5}
            envMapIntensity={2}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Right Glass Frame */}
        <mesh position={[5.5, 2.75, 0.15]}>
          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.PlaneGeometry(6, 5.5)
              ]}
            />
            <lineBasicMaterial
              color="#8aa0b3"
            />
          </lineSegments>
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Top Glass - Premium architectural glass */}
        <mesh position={[0, 5, 0]}>
          <planeGeometry args={[16, 1]} />
          <meshPhysicalMaterial
            color="#dfefff"
            transmission={1}
            transparent
            opacity={0.35}
            roughness={0.12}
            metalness={0}
            thickness={0.4}
            ior={1.5}
            envMapIntensity={2}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Top Glass Frame */}
        <mesh position={[0, 5, 0.15]}>
          <boxGeometry args={[16.2, 1.2, 0.15]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
        </mesh>

        {/* Exterior light strips along entrance */}
        {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
          <group key={i} position={[x, 0.05, 0.5]}>
            <mesh>
              <boxGeometry args={[0.6, 0.01, 0.02]} />
              <meshBasicMaterial color="#ffcc88" transparent opacity={0.8} />
            </mesh>
            <pointLight color="#ffaa66" intensity={1.2} distance={2.5} decay={2} />
          </group>
        ))}

      </group>

      {/* MAIN GLASS DOOR - Premium entrance doors */}

      <group position={[0, 0, 4.98]}>

        {/* Left Door Glass */}
        <mesh position={[-1.35, 2.2, 0]}>
          <planeGeometry args={[2.5, 4.4]} />
          <meshPhysicalMaterial
            color="#dfefff"
            transmission={1}
            transparent
            opacity={0.35}
            roughness={0.12}
            metalness={0}
            thickness={0.4}
            ior={1.5}
            envMapIntensity={2}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Left Door Frame */}
        <mesh position={[-1.35, 2.2, 0.12]}>

          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.PlaneGeometry(2.5, 4.4)
              ]}
            />
            <lineBasicMaterial
              color="#8aa0b3"
            />
          </lineSegments>
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Right Door Glass */}
        <mesh position={[1.35, 2.2, 0]}>
          <planeGeometry args={[2.5, 4.4]} />
          <meshPhysicalMaterial
            color="#dfefff"
            transmission={1}
            transparent
            opacity={0.35}
            roughness={0.12}
            metalness={0}
            thickness={0.4}
            ior={1.5}
            envMapIntensity={2}
            clearcoat={0.3}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Right Door Frame */}
        <mesh position={[1.35, 2.2, 0.12]}>

          <lineSegments>
            <edgesGeometry
              args={[
                new THREE.PlaneGeometry(2.5, 4.4)
              ]}
            />
            <lineBasicMaterial
              color="#8aa0b3"
            />
          </lineSegments>
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
        </mesh>

      </group>

      {/* DOOR FRAME - thin borders only */}

      <group position={[0, 0, 4.97]}>
        <mesh position={[-2.4, 2.2, 0]}>
          <boxGeometry args={[0.08, 4.5, 0.08]} />
          <meshStandardMaterial
            color="#1f1f1f"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[2.4, 2.2, 0]}>
          <boxGeometry args={[0.08, 4.5, 0.08]} />
          <meshStandardMaterial
            color="#1f1f1f"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 4.45, 0]}>
          <boxGeometry args={[4.9, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#1f1f1f"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* EXTERIOR ENVIRONMENT - Premium HQ Campus */}

      {/* Massive ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 20]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial map={groundTex} roughness={0.95} metalness={0} />
      </mesh>

      {/* MAIN EXTERIOR BUILDING - Luxury HQ with Glass Facade */}
      {/* ─────────────────────────────────────────────────────────────────────────────── */}


      {/* external scenery */}


      {/* LANDSCAPE - Premium campus trees */}

      {/* Pine trees - distant left cluster
      {[[-20, 35], [-15, 38], [-25, 32], [-10, 40]].map(([x, z], i) => (
        <group key={`tree-left-${i}`} position={[x, 0, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.7, 8, 8]} />
            <meshStandardMaterial color="#4a3820" roughness={0.85} />
          </mesh>
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[4.5, 10, 10]} />
            <meshStandardMaterial color="#2d5a2d" roughness={0.9} />
          </mesh>
        </group>
      ))} */}

      {/* Pine trees - distant right cluster
      {[[20, 36], [15, 39], [25, 33], [10, 41]].map(([x, z], i) => (
        <group key={`tree-right-${i}`} position={[x, 0, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.5, 0.7, 8, 8]} />
            <meshStandardMaterial color="#4a3820" roughness={0.85} />
          </mesh>
          <mesh position={[0, 5, 0]} castShadow>
            <coneGeometry args={[4.5, 10, 10]} />
            <meshStandardMaterial color="#2d5a2d" roughness={0.9} />
          </mesh>
        </group>
      ))} */}

      {/* Mountain backdrop - distant silhouettes
      <mesh position={[-35, 8, 100]} castShadow>
        <coneGeometry args={[40, 35, 6]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.95} metalness={0} />
      </mesh>

      <mesh position={[0, 10, 105]} castShadow>
        <coneGeometry args={[50, 45, 6]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.95} metalness={0} />
      </mesh>

      <mesh position={[35, 7, 102]} castShadow>
        <coneGeometry args={[38, 32, 6]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.95} metalness={0} />
      </mesh> */}

      {/* Sky backdrop plane */}
      {/* <mesh position={[0, 15, 150]}>
        <planeGeometry args={[200, 100]} />
        <meshBasicMaterial color="#ffd9a3" />
      </mesh> */}

      {/* LEFT WALL - interior */}
      <mesh position={[-7, 2.75, -1]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12.2, 6]} />
        <meshStandardMaterial color="#f5f1eb" roughness={0.98} metalness={0.02} />
      </mesh>

      {/* RIGHT WALL - interior */}
      <mesh position={[7, 2.75, -1]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12.2, 6]} />
        <meshStandardMaterial color="#f5f1eb" roughness={0.98} metalness={0.02} />
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


      {/* EXTERIOR BACKDROP - Mountain sunset image */}

      <mesh position={[0, 13, 35]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[160, 45]} />
        <meshBasicMaterial map={backdrop} toneMapped={false} />
      </mesh>



      {/* TEXTURED GROUND - right outside glass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 64]} receiveShadow>
        <planeGeometry args={[80, 8]} />
        <meshStandardMaterial map={groundTex} roughness={0.98} metalness={0} />
      </mesh>

      {/* TEXTURED GROUND - mid zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 64]} receiveShadow>
        <planeGeometry args={[100, 12]} />
        <meshStandardMaterial map={groundTex} roughness={0.97} metalness={0} />
      </mesh>

      {/* TEXTURED GROUND - far zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 64]} receiveShadow>
        <planeGeometry args={[120, 20]} />
        <meshStandardMaterial map={groundTex} roughness={0.96} metalness={0} />
      </mesh>

      {/* TEXTURED GROUND - left fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-30, -0.1, 64]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial map={groundTex} roughness={0.97} metalness={0} />
      </mesh>

      {/* TEXTURED GROUND - right fill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, -0.1, 64]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial map={groundTex} roughness={0.97} metalness={0} />
      </mesh>







      {/* Left backdrop side wing */}
      <mesh position={[-55, 9, 30]} rotation={[0, Math.PI * 0.65, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial map={backdrop} toneMapped={false} opacity={0.5} transparent />
      </mesh>

      {/* Right backdrop side wing */}
      <mesh position={[55, 9, 30]} rotation={[0, -Math.PI * 0.65, 0]}>
        <planeGeometry args={[60, 30]} />
        <meshBasicMaterial map={backdrop} toneMapped={false} opacity={0.5} transparent />
      </mesh>





      {/* FIX 7: Floor reflector color tweak - change the existing floor color */}
      {/* On your existing floor MeshReflectorMaterial, change color from "#2a2a2a" to "#9a9080" */}
      {/* Interior floor base - prevents ground texture bleeding inside */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -3]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* PROCEDURAL SKY - Dynamic golden hour sunset */}
      <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.49} azimuth={0.25} />

      {/* ENVIRONMENT - Premium sunset HDRI reflections */}
      <Environment preset="sunset" background={false} />

      {/* Exterior sun glow */}
      <pointLight position={[80, 50, 150]} color="#ffcc99" intensity={1.5} distance={300} decay={2} />

      {/* Ambient exterior fill - warm */}
      <pointLight position={[0, 25, 80]} color="#ffaa66" intensity={0.4} distance={200} decay={2} />

      {/* Floating particles */}
      <FloatingParticles />



      {/* LIGHTING - Interior + Exterior Balance */}

      {/* Base ambient - subtle fill */}
      <ambientLight intensity={0.16} color="#fffaf0" />

      {/* Main interior overhead warm light */}
      <pointLight position={[0, 4.5, 0]} intensity={0.8} color="#ffcc88" distance={18} decay={2} />
      <pointLight position={[-3, 5, -1]} color="#ff9944" intensity={0.4} distance={8} decay={2} />
      <pointLight position={[3, 5, -1]} color="#ffaa55" intensity={1.8} distance={12} decay={2} />

      {/* Warm exterior sunset directional light */}
      <directionalLight
        position={[15, 18, 50]}
        intensity={0.9}
        color="#ffcc99"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      {/* Exterior warm ambient fill */}
      <pointLight position={[0, 20, 60]} color="#ffb366" intensity={0.6} distance={150} decay={2} />

      {/* Front entrance fill light - prevents dark silhouette */}
      <pointLight position={[0, 2, 6]} color="#dd9955" intensity={0.5} distance={12} decay={2} />

      {/* Desk accent warm light */}
      <pointLight position={[0, 2.2, -3]} color="#ffbb77" intensity={2.5} distance={5} decay={2} />

      {/* Cool accent - minimal */}
      <pointLight position={[-3, 3, 2]} color="#0088cc" intensity={0.8} distance={6} decay={2} />
    </group>
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
      if (c < 0.4) { colors[i * 3] = 1; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 0.3; }
      else if (c < 0.7) { colors[i * 3] = 0; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1; }
      else { colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1; }
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

