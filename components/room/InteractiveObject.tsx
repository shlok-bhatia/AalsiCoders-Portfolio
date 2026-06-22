'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';
import type { ObjectId } from '@/store/useAppStore';
import type { ObjectData } from '@/lib/objectData';

interface Props {
  data: ObjectData;
  children: React.ReactNode;
}

export default function InteractiveObject({ data, children }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { setFocusedObject, focusedObject, setCursorVariant } = useAppStore();

  const [hovered, setHovered] = useState(false);
  const isFocused = focusedObject === data.id;

  useCursor(hovered);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Float animation
    const t = Date.now() * 0.001;
    groupRef.current.position.y =
      data.position[1] + Math.sin(t + data.position[0]) * 0.05;

    // Scale pulse on hover
    const targetScale = hovered ? 1.1 : isFocused ? 1.06 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      8 * delta
    );

    // Glow ground plane — much more visible
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = hovered ? 0.7 : isFocused ? 0.5 : 0.15;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 6 * delta);
    }

    // Focus ring pulse
    if (ringRef.current && isFocused) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.7 + Math.sin(t * 4) * 0.25;
      ringRef.current.rotation.z = t * 0.8;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isFocused) {
      setFocusedObject(null);
    } else {
      setFocusedObject(data.id as ObjectId);
    }
  };

  const color = new THREE.Color(data.color);

  return (
    <group
      ref={groupRef}
      position={data.position}
      rotation={data.rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setCursorVariant('hover');
      }}
      onPointerOut={() => {
        setHovered(false);
        setCursorVariant('default');
      }}
    >
      {/* Object geometry */}
      {children}

      {/* Always-visible subtle glow ground plane */}
      <mesh
        ref={glowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.36, 0]}
      >
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Hover label — bigger and more visible */}
      {hovered && !isFocused && (
        <group position={[0, 0.85, 0]}>
          {/* Label background */}
          <mesh position={[0, 0, -0.001]}>
            <planeGeometry args={[0.7, 0.16]} />
            <meshBasicMaterial color="#000d1a" transparent opacity={0.85} depthWrite={false} />
          </mesh>
          {/* Border */}
          <mesh position={[0, 0, -0.0005]}>
            <planeGeometry args={[0.72, 0.18]} />
            <meshBasicMaterial color={data.color} transparent opacity={0.6} depthWrite={false} />
          </mesh>
          <Text
            position={[0, 0, 0]}
            fontSize={0.11}
            color={data.color}
            anchorX="center"
            anchorY="middle"
            font={undefined}
            letterSpacing={0.08}
          >
            {data.label.toUpperCase()}
          </Text>
        </group>
      )}

      {/* Focus ring — animated */}
      {isFocused && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}>
          <ringGeometry args={[0.52, 0.6, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.85} depthWrite={false} />
        </mesh>
      )}

      {/* Focused: outer glow ring */}
      {isFocused && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
          <ringGeometry args={[0.68, 0.72, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      )}

      {/* Point light that appears on hover to light up the object */}
      {(hovered || isFocused) && (
        <pointLight
          color={data.color}
          intensity={hovered ? 6 : 4}
          distance={2.5}
          decay={2}
          position={[0, 0.5, 0]}
        />
      )}
    </group>
  );
}