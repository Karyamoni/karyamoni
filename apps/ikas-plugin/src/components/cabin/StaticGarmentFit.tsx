"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Target body height in world metres (matches male_base_model world height after
// Three.js applies its node matrix). Garments are rescaled to this height so
// arbitrary Sketchfab/USD exports with wrong unit scales still fit the body.
const BODY_HEIGHT_M = 1.8;

type Props = {
  url: string;
};

export function GarmentMesh({ url }: Props) {
  const gltf = useLoader(GLTFLoader, url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const garment = gltf.scene.clone(true);

    // Upgrade materials for PBR photorealism
    garment.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (!m.isMeshStandardMaterial && !m.isMeshPhysicalMaterial) continue;
        const sm = m as THREE.MeshStandardMaterial;
        if (!sm.roughnessMap) sm.roughness = 0.75;
        sm.metalness = 0;
        sm.envMapIntensity = 2.0;
        sm.needsUpdate = true;
      }
    });

    group.add(garment);

    // Compute world-space bbox (accounts for all embedded node transforms)
    const box = new THREE.Box3().setFromObject(garment);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Normalise scale: the tallest axis of the garment maps to BODY_HEIGHT_M.
    // This corrects unit mismatches (e.g. Sketchfab models exported with extra 4x scale).
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = BODY_HEIGHT_M / maxDim;
      garment.scale.setScalar(scale);
    }

    // Re-sample bbox after rescale, then center and floor at y=0
    box.setFromObject(garment);
    const newCenter = box.getCenter(new THREE.Vector3());
    const newSize = box.getSize(new THREE.Vector3());

    garment.position.sub(newCenter);
    garment.position.y += newSize.y / 2;

    return () => { group.remove(garment); };
  }, [gltf]);

  return <group ref={groupRef} />;
}
