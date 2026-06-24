"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";
import type { UserMeasurements } from "./useCabinStore";
import { ColliderSetup } from "./ColliderSetup";

const BASE = { height: 170, chest: 90, waist: 72 };

function applyMeasurements(vrm: VRM, m: UserMeasurements) {
  const bones = vrm.humanoid;
  const scaleY = m.height / BASE.height;
  const scaleX = m.chest / BASE.chest;
  const hips = bones.getRawBoneNode("hips");
  const spine = bones.getRawBoneNode("spine");
  if (hips) hips.scale.set(scaleX, scaleY, scaleX);
  if (spine) spine.scale.set(1, scaleY, 1);
}

type Props = {
  url: string;
  measurements: UserMeasurements;
  onLoad?: (vrm: VRM, root: THREE.Object3D) => void;
};

// Inner component — useLoader must always be called (no early returns before hooks)
function VrmLoader({ url, measurements, onLoad }: Props) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.register((parser) => new VRMLoaderPlugin(parser));
  });

  const vrmRef = useRef<VRM | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const vrm = gltf.userData.vrm as VRM | undefined;
    if (!vrm || !groupRef.current) return;

    vrmRef.current = vrm;
    vrm.scene.rotation.y = Math.PI; // VRM default faces -Z, flip to face camera
    groupRef.current.add(vrm.scene);

    applyMeasurements(vrm, measurements);
    onLoad?.(vrm, groupRef.current);

    return () => {
      groupRef.current?.remove(vrm.scene);
    };
  }, [gltf]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (vrmRef.current) applyMeasurements(vrmRef.current, measurements);
  }, [measurements]);

  useFrame((_, delta) => {
    vrmRef.current?.update(delta);
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {vrmRef.current && groupRef.current && (
        <ColliderSetup vrm={vrmRef.current} rigRoot={groupRef.current} />
      )}
    </group>
  );
}

// Public component — renders nothing when url is empty (caller decides fallback)
export function AvatarRig(props: Props) {
  if (!props.url) return null;
  return <VrmLoader {...props} />;
}
