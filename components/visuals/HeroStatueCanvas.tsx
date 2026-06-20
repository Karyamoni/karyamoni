"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Box3, Color, MeshStandardMaterial, Vector3 } from "three";
import type { Group, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function StatueModel() {
  const gltf = useLoader(GLTFLoader, "/models/female_statue/scene.gltf");
  const group = useRef<Group>(null);
  const time = useRef(0);
  const statue = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = size.y > 0 ? 3.35 / size.y : 1;

    clone.position.sub(center);
    clone.scale.setScalar(scale);
    clone.traverse((object) => {
      const mesh = object as Mesh;

      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (mesh.material instanceof MeshStandardMaterial) {
        const material = mesh.material.clone();
        material.color.lerp(new Color("#f7efe7"), 0.16);
        material.roughness = 0.96;
        material.metalness = 0;
        mesh.material = material;
      }
    });

    return clone;
  }, [gltf.scene]);

  useFrame((_, delta) => {
    time.current += delta;
    if (group.current) {
      group.current.rotation.y = -0.36 + Math.sin(time.current * 0.32) * 0.1;
      group.current.position.y = -0.08 + Math.sin(time.current * 0.48) * 0.025;
    }
  });

  return (
    <group ref={group} position={[0.05, -0.94, 0]} rotation={[0, -0.18, 0]}>
      <primitive object={statue} />
    </group>
  );
}

function GalleryScene() {
  return (
    <>
      <color attach="background" args={["#f4f0e7"]} />
      <ambientLight intensity={0.82} />
      <directionalLight position={[2.6, 4.8, 4]} intensity={3.4} castShadow />
      <pointLight position={[-2.8, 1.4, 2.2]} color="#f0441f" intensity={1.2} />
      <pointLight position={[2.6, -0.2, 1.6]} color="#1d28c9" intensity={0.74} />
      <mesh position={[0, -1.16, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.1, 96]} />
        <meshStandardMaterial color="#151512" roughness={0.82} />
      </mesh>
      <mesh position={[0.08, -0.73, -0.06]} rotation={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.78, 0.92, 0.86, 4]} />
        <meshStandardMaterial color="#f0441f" roughness={0.62} />
      </mesh>
      <mesh position={[1.17, 0.35, -0.9]} rotation={[0, -0.16, 0.18]}>
        <boxGeometry args={[0.08, 2.9, 0.08]} />
        <meshStandardMaterial color="#1d28c9" roughness={0.45} />
      </mesh>
      <mesh position={[-1.12, 0.55, -0.88]} rotation={[0, 0.2, -0.12]}>
        <boxGeometry args={[0.08, 2.35, 0.08]} />
        <meshStandardMaterial color="#151512" roughness={0.45} />
      </mesh>
      <StatueModel />
    </>
  );
}

function LoadingStatue() {
  return (
    <>
      <ambientLight intensity={1} />
      <mesh position={[0, -0.24, 0]}>
        <capsuleGeometry args={[0.42, 1.7, 12, 24]} />
        <meshStandardMaterial color="#ded1c4" roughness={0.85} />
      </mesh>
    </>
  );
}

export function HeroStatueCanvas() {
  return (
    <Canvas camera={{ position: [0, 0.42, 4.7], fov: 33 }} dpr={[1, 1.8]} shadows>
      <Suspense fallback={<LoadingStatue />}>
        <GalleryScene />
      </Suspense>
    </Canvas>
  );
}
