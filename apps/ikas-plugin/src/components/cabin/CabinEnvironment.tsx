"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

// Subtle rim light that orbits the avatar for depth
function RimLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.3;
    ref.current.position.set(Math.sin(t) * 2.5, 1.8, Math.cos(t) * 2.5);
  });
  return <pointLight ref={ref} color="#beff5c" intensity={1.2} distance={6} />;
}

export function CabinEnvironment() {
  return (
    <>
      {/* Studio HDRI — image-based lighting for photorealistic fabric shading */}
      <Environment preset="studio" background={false} environmentIntensity={1.5} />

      {/* Ambient — reduced; IBL now handles ambient */}
      <ambientLight intensity={0.08} color="#fafaf9" />

      {/* Key light — slightly warm, front-high */}
      <directionalLight
        position={[1, 3, 2]}
        intensity={1.8}
        color="#faf8f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill — cool blue from behind */}
      <pointLight position={[-2, 1, -3]} color="#3a6bff" intensity={0.6} distance={8} />

      {/* Accent rim — orbiting lime */}
      <RimLight />

      {/* Floor disc — receives shadows */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.98, 0]}>
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Subtle floor glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.97, 0]}>
        <circleGeometry args={[1.2, 64]} />
        <meshStandardMaterial
          color="#beff5c"
          emissive="#beff5c"
          emissiveIntensity={0.06}
          transparent
          opacity={0.3}
          roughness={1}
        />
      </mesh>
    </>
  );
}
