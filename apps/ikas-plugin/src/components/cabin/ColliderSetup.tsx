"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { VRM } from "@pixiv/three-vrm";

// Bone names and collider radii calibrated for VRoid-standard VRM avatars.
// Sphere Scale.x = radius (three-simplecloth spec: userData.stickto + userData.clothCollider).
const COLLIDER_DEFS: Array<{ bone: string; radius: number; offset: [number, number, number] }> = [
  { bone: "hips",            radius: 0.18, offset: [0, 0, 0] },
  { bone: "spine",           radius: 0.15, offset: [0, 0.05, 0] },
  { bone: "chest",           radius: 0.14, offset: [0, 0.05, 0] },
  { bone: "upperChest",      radius: 0.13, offset: [0, 0, 0] },
  { bone: "leftUpperArm",    radius: 0.07, offset: [0, 0, 0] },
  { bone: "rightUpperArm",   radius: 0.07, offset: [0, 0, 0] },
  { bone: "leftLowerArm",    radius: 0.055, offset: [0, 0, 0] },
  { bone: "rightLowerArm",   radius: 0.055, offset: [0, 0, 0] },
  { bone: "leftUpperLeg",    radius: 0.09, offset: [0, 0, 0] },
  { bone: "rightUpperLeg",   radius: 0.09, offset: [0, 0, 0] },
];

type Props = {
  vrm: VRM;
  rigRoot: THREE.Object3D;
};

export function ColliderSetup({ vrm, rigRoot }: Props) {
  const colliders = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const added: THREE.Mesh[] = [];

    for (const def of COLLIDER_DEFS) {
      const bone = vrm.humanoid.getRawBoneNode(def.bone as any);
      if (!bone) continue;

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );

      // three-simplecloth reads Scale.x as the collider radius
      sphere.scale.setScalar(def.radius);
      sphere.position.set(...def.offset);

      // three-simplecloth attachment spec (NotebookLM source 6355ceea)
      sphere.userData.stickto = def.bone;
      sphere.userData.clothCollider = true;

      bone.add(sphere);
      rigRoot.add(sphere);
      added.push(sphere);
    }

    colliders.current = added;

    return () => {
      for (const s of added) {
        s.parent?.remove(s);
        s.geometry.dispose();
      }
    };
  }, [vrm, rigRoot]);

  return null;
}
