"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { UserMeasurements } from "./useCabinStore";

const BASE = { height: 170, chest: 90, waist: 72 };

type Props = { measurements: UserMeasurements };

export function ProceduralAvatar({ measurements }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const scaleY = measurements.height / BASE.height;
  const scaleX = measurements.chest / BASE.chest;

  // Subtle idle sway
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.08;
  });

  const mat = <meshStandardMaterial color="#1a1a1a" roughness={0.85} metalness={0.1} />;

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 1.72 * scaleY, 0]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        {mat}
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.54 * scaleY, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.18 * scaleY, 16]} />
        {mat}
      </mesh>

      {/* Torso — shoulder width from chest measurement */}
      <mesh position={[0, 1.15 * scaleY, 0]} castShadow>
        <capsuleGeometry args={[0.17 * scaleX, 0.52 * scaleY, 8, 16]} />
        {mat}
      </mesh>

      {/* Hips */}
      <mesh position={[0, 0.72 * scaleY, 0]} castShadow>
        <capsuleGeometry args={[0.155 * scaleX, 0.22 * scaleY, 8, 16]} />
        {mat}
      </mesh>

      {/* Left upper arm */}
      <mesh position={[-0.28 * scaleX, 1.32 * scaleY, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.055, 0.28 * scaleY, 8, 12]} />
        {mat}
      </mesh>
      {/* Left forearm */}
      <mesh position={[-0.38 * scaleX, 1.05 * scaleY, 0.04]} rotation={[0.15, 0, 0.18]} castShadow>
        <capsuleGeometry args={[0.045, 0.26 * scaleY, 8, 12]} />
        {mat}
      </mesh>

      {/* Right upper arm */}
      <mesh position={[0.28 * scaleX, 1.32 * scaleY, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.055, 0.28 * scaleY, 8, 12]} />
        {mat}
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.38 * scaleX, 1.05 * scaleY, 0.04]} rotation={[0.15, 0, -0.18]} castShadow>
        <capsuleGeometry args={[0.045, 0.26 * scaleY, 8, 12]} />
        {mat}
      </mesh>

      {/* Left thigh */}
      <mesh position={[-0.1 * scaleX, 0.44 * scaleY, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.34 * scaleY, 8, 12]} />
        {mat}
      </mesh>
      {/* Left shin */}
      <mesh position={[-0.1 * scaleX, 0.1 * scaleY, 0]} castShadow>
        <capsuleGeometry args={[0.062, 0.3 * scaleY, 8, 12]} />
        {mat}
      </mesh>

      {/* Right thigh */}
      <mesh position={[0.1 * scaleX, 0.44 * scaleY, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.34 * scaleY, 8, 12]} />
        {mat}
      </mesh>
      {/* Right shin */}
      <mesh position={[0.1 * scaleX, 0.1 * scaleY, 0]} castShadow>
        <capsuleGeometry args={[0.062, 0.3 * scaleY, 8, 12]} />
        {mat}
      </mesh>

      {/* "No VRM" label — faint indicator in 3D space */}
      <mesh position={[0, 2.1 * scaleY, 0]}>
        <planeGeometry args={[0.001, 0.001]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
