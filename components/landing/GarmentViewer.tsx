"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const MODEL_PATH =
  "/models/renomowana_hurtownia_wysokiej_jakosci/scene.gltf";

export type ViewerMode = "product" | "profile" | "cabin";

const SIGNAL = new THREE.Color(0xf0441f);

const SPEEDS: Record<ViewerMode, number> = {
  product: 0.22,
  profile: 0.16,
  cabin: 0.38,
};

const CAMERAS: Record<
  ViewerMode,
  { position: [number, number, number]; fov: number }
> = {
  product: { position: [0, 0.2, 4.5], fov: 34 },
  profile: { position: [0.4, 0.1, 4.2], fov: 38 },
  cabin: { position: [0, 0, 5], fov: 38 },
};

// Each viewer gets its own clone — useLoader result is shared/cached
function GarmentMesh({ mode }: { mode: ViewerMode }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, MODEL_PATH);

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const s = 2.4 / Math.max(size.x, size.y, size.z);
    cloned.scale.setScalar(s);
    cloned.position.set(-center.x * s, -center.y * s, -center.z * s);
    return cloned;
  }, [gltf]);

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * SPEEDS[mode];
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Cabin: signal-colored light that sweeps up/down
function ScanBeam() {
  const ref = useRef<THREE.PointLight>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current)
      ref.current.position.y = Math.sin(t.current * 0.7) * 1.5;
  });
  return (
    <pointLight
      ref={ref}
      color={SIGNAL}
      intensity={8}
      distance={5}
      decay={2}
      position={[0, 0, 1.5]}
    />
  );
}

// Cabin: slow orbiting rim light for depth
function RimLight() {
  const ref = useRef<THREE.SpotLight>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      const angle = t.current * 0.25;
      ref.current.position.set(Math.sin(angle) * 4, 1, Math.cos(angle) * 4);
    }
  });
  return (
    <spotLight
      ref={ref}
      color="#aaccbb"
      intensity={2}
      angle={0.5}
      penumbra={0.8}
    />
  );
}

function Lighting({ mode }: { mode: ViewerMode }) {
  if (mode === "product") {
    return (
      <>
        <ambientLight intensity={1.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.6} />
        <directionalLight position={[-2, 1, 2]} intensity={0.8} color="#f8f4ee" />
        <directionalLight position={[0, -3, 2]} intensity={0.35} color="#f0ece6" />
      </>
    );
  }
  if (mode === "profile") {
    return (
      <>
        <ambientLight intensity={0.45} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <pointLight color={SIGNAL} intensity={3.5} distance={4.5} position={[-2, 0.5, 2]} />
      </>
    );
  }
  // cabin
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 5, 4]} intensity={1.0} />
      <ScanBeam />
      <RimLight />
    </>
  );
}

export function GarmentViewer({ mode }: { mode: ViewerMode }) {
  const cam = CAMERAS[mode];
  return (
    <Canvas
      camera={{ position: cam.position, fov: cam.fov }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <Lighting mode={mode} />
      <Suspense fallback={null}>
        <GarmentMesh mode={mode} />
      </Suspense>
    </Canvas>
  );
}
