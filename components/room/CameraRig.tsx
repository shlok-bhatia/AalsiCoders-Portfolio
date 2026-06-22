'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';
import { OBJECTS } from '@/lib/objectData';
import type { ObjectId } from '@/store/useAppStore';

// Default camera pose for room overview
const DEFAULT_CAM = {
  position: new THREE.Vector3(0, 2.5, 5.5),
  target: new THREE.Vector3(0, 1, 0),
};

// Entry pose — matches video final frame (inside HQ, looking at room)
const ENTRY_CAM = {
  position: new THREE.Vector3(0, 1.6, 7),
  target: new THREE.Vector3(0, 1.2, 0),
};

export default function CameraRig() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const { focusedObject, phase } = useAppStore();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const isAnimating = useRef(false);

  // Set initial camera to entry position
  useEffect(() => {
    camera.position.copy(ENTRY_CAM.position);
    targetPos.current.copy(DEFAULT_CAM.position);
    targetLook.current.copy(DEFAULT_CAM.target);
  }, [camera]);

  // Handle focus changes
  useEffect(() => {
    if (focusedObject) {
      const obj = OBJECTS[focusedObject as ObjectId];
      targetPos.current.set(...obj.camPosition);
      targetLook.current.set(...obj.camTarget);
      isAnimating.current = true;

      // Disable orbit controls while zoomed in
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    } else {
      // Return to default orbit view
      targetPos.current.copy(DEFAULT_CAM.position);
      targetLook.current.copy(DEFAULT_CAM.target);
      isAnimating.current = true;

      setTimeout(() => {
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
          controlsRef.current.target.copy(DEFAULT_CAM.target);
        }
      }, 1200);
    }
  }, [focusedObject]);

  // Smooth camera lerp on every frame
  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    const lerpSpeed = 3.5 * delta;

    camera.position.lerp(targetPos.current, lerpSpeed);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLook.current, lerpSpeed);
      controlsRef.current.update();
    }

    // Stop animating when close enough
    if (camera.position.distanceTo(targetPos.current) < 0.01) {
      camera.position.copy(targetPos.current);
      isAnimating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.5}
      maxDistance={10}
      maxPolarAngle={Math.PI * 0.75}
      minPolarAngle={0.1}
      target={DEFAULT_CAM.target}
      enablePan={false}
    />
  );
}
