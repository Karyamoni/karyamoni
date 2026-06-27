"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useBackgroundRemoval } from "./useBackgroundRemoval";

// Body height in world units (metres) — matches BodyMesh world height
const BODY_HEIGHT_M = 1.8;

type Props = {
  imageUrl: string;
  bodyScaleY: number;
};

export function ClothingImagePlane({ imageUrl, bodyScaleY }: Props) {
  const { maskedUrl, isProcessing } = useBackgroundRemoval(imageUrl);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Build material once; swap map when maskedUrl arrives
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      alphaTest: 0.05,
      color: 0xffffff,
    });
    matRef.current = mat;
    return mat;
  }, []);

  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;
    if (!maskedUrl) {
      mat.map = null;
      mat.needsUpdate = true;
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(maskedUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;
      mat.needsUpdate = true;

      // Adjust plane aspect ratio from actual image dimensions
      if (meshRef.current && tex.image) {
        const aspect = tex.image.width / tex.image.height;
        // Height of plane = full body height scaled; width follows aspect
        const planeH = BODY_HEIGHT_M;
        const planeW = planeH * aspect;
        meshRef.current.scale.set(planeW, planeH, 1);
      }
    });
  }, [maskedUrl]);

  // Processing shimmer effect
  useFrame(({ clock }) => {
    if (isProcessing && meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
      mat.needsUpdate = true;
    } else if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat.opacity !== 1) {
        mat.opacity = 1;
        mat.needsUpdate = true;
      }
    }
  });

  // Position: centered on body torso, slight Z offset to appear in front of body
  // bodyScaleY from parent StaticScene (measurements.height / MODEL_BASE.height)
  const posY = (BODY_HEIGHT_M * bodyScaleY) / 2 - BODY_HEIGHT_M * bodyScaleY * 0.08;

  return (
    <mesh
      ref={meshRef}
      material={material}
      // Initial scale — will be updated by texture load callback
      scale={[0.9, BODY_HEIGHT_M, 1]}
      position={[0, posY, 0.06]}
      renderOrder={1}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
