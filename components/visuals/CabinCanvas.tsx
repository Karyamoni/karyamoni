"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function AvatarForm() {
  const group = useRef<Mesh>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;
    if (group.current) {
      group.current.rotation.y = Math.sin(time.current * 0.55) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={group} position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.52, 1.45, 12, 24]} />
        <meshStandardMaterial color="#d6c3ad" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.25, 0.04]}>
        <boxGeometry args={[1.28, 1.1, 0.12]} />
        <meshStandardMaterial color="#f0441f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.82, 0.08]}>
        <boxGeometry args={[1.04, 0.14, 0.16]} />
        <meshStandardMaterial color="#151512" roughness={0.35} />
      </mesh>
    </group>
  );
}

function Cabin() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 4]} intensity={2} />
      <pointLight position={[-3, 1, 2]} color="#ff6b4a" intensity={1.8} />
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshStandardMaterial color="#f4f0e7" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, -1.05]}>
        <boxGeometry args={[3.3, 2.9, 0.08]} />
        <meshStandardMaterial color="#124534" roughness={0.75} />
      </mesh>
      <mesh position={[-1.45, 0.4, 0]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.08, 2.9, 2]} />
        <meshStandardMaterial color="#f4f0e7" roughness={0.5} />
      </mesh>
      <mesh position={[1.45, 0.4, 0]} rotation={[0, -0.35, 0]}>
        <boxGeometry args={[0.08, 2.9, 2]} />
        <meshStandardMaterial color="#1d28c9" roughness={0.55} />
      </mesh>
      <AvatarForm />
    </>
  );
}

export default function CabinCanvas() {
  return (
    <Canvas camera={{ position: [0, 0.6, 4], fov: 42 }} dpr={[1, 1.8]}>
      <Cabin />
    </Canvas>
  );
}
