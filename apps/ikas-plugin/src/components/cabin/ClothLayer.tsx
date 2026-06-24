"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { VRM } from "@pixiv/three-vrm";
// @ts-ignore — three-simplecloth has no type declarations
import { SimpleCloth } from "three-simplecloth";

type Props = {
  garmentUrl: string;
  vrm: VRM;
  rigRoot: THREE.Object3D;
};

export function ClothLayer({ garmentUrl, vrm, rigRoot }: Props) {
  const gltf = useLoader(GLTFLoader, garmentUrl);
  const clothRef = useRef<InstanceType<typeof SimpleCloth> | null>(null);
  const meshRef = useRef<THREE.SkinnedMesh | null>(null);

  useEffect(() => {
    // Find the first SkinnedMesh in the garment GLTF
    const found: THREE.SkinnedMesh[] = [];
    gltf.scene.traverse((obj) => {
      if (obj instanceof THREE.SkinnedMesh) found.push(obj);
    });

    const garmentMesh = found[0] ?? null;

    if (!garmentMesh) {
      console.warn("[ClothLayer] No SkinnedMesh found in garment:", garmentUrl);
      return;
    }

    meshRef.current = garmentMesh;

    // Bind garment skeleton to avatar rig — shares the VRM skeleton
    const avatarSkinned = vrm.scene.children[0] as THREE.SkinnedMesh | undefined;
    garmentMesh.skeleton = avatarSkinned?.skeleton ?? garmentMesh.skeleton;
    rigRoot.add(garmentMesh);

    // three-simplecloth config (NotebookLM source 6355ceea)
    // red vertex color = cloth simulation; white = pinned to bone
    // @ts-ignore — WebGPU library, no TS declarations; constructor args not typed
    const cloth = new SimpleCloth(garmentMesh, {
      collidersRoot: rigRoot,
      stiffness: 0.8,
      dampening: 0.3,
    });

    clothRef.current = cloth;

    return () => {
      rigRoot.remove(garmentMesh!);
      clothRef.current = null;
    };
  }, [gltf, vrm, rigRoot, garmentUrl]);

  useFrame((_, delta) => {
    // @ts-ignore — update() exists at runtime on WebGPU builds
    clothRef.current?.update(delta);
  });

  return null;
}
