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
  const { setFocusedObject, focusedObject, setCursorVariant } = useAppStore();

  const [hovered, setHovered] = useState(false);
  const isFocused = focusedObject === data.id;

  useCursor(hovered);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Float animation
    const t = Date.now() * 0.001;
    groupRef.current.position.y =
      data.position[1] + Math.sin(t + data.position[0]) * 0.04;

    // Scale pulse on hover
    const targetScale = hovered ? 1.06 : isFocused ? 1.04 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      8 * delta
    );

    // Glow intensity
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = hovered ? 0.5 : isFocused ? 0.35 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 6 * delta);
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
      {/* Object geometry (passed as children) */}
      {children}

      {/* Glow ground plane */}
      <mesh
        ref={glowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.36, 0]}
      >
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Hover label */}
      {hovered && !isFocused && (
        <Text
          position={[0, 0.7, 0]}
          fontSize={0.1}
          color={data.color}
          anchorX="center"
          anchorY="middle"
        >
          {data.label}
          <meshBasicMaterial color={data.color} />
        </Text>
      )}

      {/* Focus ring */}
      {isFocused && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}>
          <ringGeometry args={[0.45, 0.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
