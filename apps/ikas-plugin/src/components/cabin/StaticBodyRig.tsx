"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { UserMeasurements } from "./useCabinStore";

// Approximate real-world measurements of this specific model at rest (cm)
export const MODEL_BASE = { height: 170, chest: 86, waist: 66, hips: 92 };

// Y-position (0=feet, 1=head) and sigma for each body region.
// These fractions are correct: 42% = hip height, 55% = navel, 72% = nipple.
const REGIONS = {
  chest: { center: 0.72, sigma: 0.09 },
  waist: { center: 0.55, sigma: 0.06 },
  hips:  { center: 0.42, sigma: 0.08 },
};

// Dampens all morph deltas — prevents extreme shapes at slider extremes.
const MORPH_STRENGTH = 0.6;

function gaussian(x: number, mu: number, sigma: number): number {
  const d = (x - mu) / sigma;
  return Math.exp(-0.5 * d * d);
}

// ── AXIS NOTE ──────────────────────────────────────────────────────────────────
// This GLTF was exported Z-up (Sketchfab). Node 0 has a -90° X rotation matrix
// that Three.js applies at render time, but geo.attributes.position holds
// the RAW local (Z-up) coordinates:
//   local X = world X = left/right (±0.471m)
//   local Y = world -Z = front/back depth (−0.154→+0.162m = 31.6cm)
//   local Z = world Y = height (−0.002→+1.803m)
//
// All height-based calculations MUST use `oz` (local Z), not `oy` (local Y).
// Depth-based calculations MUST use `oy` (local Y).
// ──────────────────────────────────────────────────────────────────────────────

type GeoData = {
  orig: Float32Array;
  zMin: number;    // local Z minimum = feet level
  zRange: number;  // local Z range ≈ 1.805m = model height
  yCenter: number; // local Y center ≈ 0.004m = depth pivot for symmetric expansion
  xSigma: number;  // arm suppression sigma = 0.4 × local Y range ≈ 0.126m
};

function applyRegionMorph(
  geometry: THREE.BufferGeometry,
  data: GeoData,
  measurements: UserMeasurements,
): void {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const count = pos.count;
  const { orig, zMin, zRange, yCenter, xSigma } = data;

  // Apply MORPH_STRENGTH to keep deformations visually proportional
  const chestDelta = (measurements.chest / MODEL_BASE.chest - 1) * MORPH_STRENGTH;
  const waistDelta = (measurements.waist / MODEL_BASE.waist - 1) * MORPH_STRENGTH;
  const hipDelta   = (measurements.hips  / MODEL_BASE.hips  - 1) * MORPH_STRENGTH;

  const xSig2 = xSigma > 0 ? 2 * xSigma * xSigma : 1;

  for (let i = 0; i < count; i++) {
    const ox = orig[i * 3];
    const oy = orig[i * 3 + 1]; // local Y = depth (world -Z)
    const oz = orig[i * 3 + 2]; // local Z = height (world Y)

    // Height normalization [0=feet, 1=head] — use local Z (actual height axis)
    const yNorm = zRange > 0 ? (oz - zMin) / zRange : 0.5;

    const wChest = gaussian(yNorm, REGIONS.chest.center, REGIONS.chest.sigma);
    const wWaist = gaussian(yNorm, REGIONS.waist.center, REGIONS.waist.sigma);
    const wHips  = gaussian(yNorm, REGIONS.hips.center,  REGIONS.hips.sigma);

    // Radial mask on X: suppresses arm vertices.
    // xSigma ≈ 0.126m → arm root (ox=0.20m) gets ~29% weight, hand gets <1%.
    const xRadialW = Math.exp(-(ox * ox) / xSig2);

    // X (width): scale from spine center (ox=0, symmetric)
    const xScale = 1 + (chestDelta * wChest + waistDelta * wWaist + hipDelta * wHips) * xRadialW;

    // Depth (local Y = front/back): scale around yCenter so model expands
    // symmetrically front AND back — not pushed forward from the back plane
    const depthDelta = chestDelta * wChest * 0.6 + waistDelta * wWaist + hipDelta * wHips;
    const newOy = yCenter + (oy - yCenter) * (1 + depthDelta);

    // Height (local Z): never touched — height slider uses group.scale.y in StaticScene
    pos.setXYZ(i, ox * xScale, newOy, oz);
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

function useRegionMorph(
  meshesRef: React.RefObject<THREE.Mesh[]>,
  meshesCountRef: React.RefObject<number>,
  measurements: UserMeasurements
) {
  const geoDataRef = useRef<Map<THREE.BufferGeometry, GeoData>>(new Map());

  useEffect(() => {
    const meshes = meshesRef.current;
    if (!meshes || meshes.length === 0) return;

    for (const mesh of meshes) {
      const geo = mesh.geometry;
      if (!geoDataRef.current.has(geo)) {
        const arr = (geo.attributes.position as THREE.BufferAttribute).array;
        const orig = new Float32Array(arr);

        let zMin = Infinity, zMax = -Infinity;
        let yMin = Infinity, yMax = -Infinity;
        for (let i = 0; i < orig.length; i += 3) {
          const y = orig[i + 1], z = orig[i + 2];
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
          if (z < zMin) zMin = z;
          if (z > zMax) zMax = z;
        }

        const zRange  = zMax - zMin;           // ≈ 1.805m (model height in local Z)
        const yCenter = (yMin + yMax) / 2;     // ≈ 0.004m (depth center)
        const xSigma  = (yMax - yMin) * 0.4;   // 0.316m × 0.4 = 0.126m

        geoDataRef.current.set(geo, { orig, zMin, zRange, yCenter, xSigma });
      }
      const data = geoDataRef.current.get(geo)!;
      applyRegionMorph(geo, data, measurements);
    }
  // meshesCountRef.current is a primitive — changes when model loads, re-triggers morph
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurements, meshesCountRef.current]);
}

type Props = {
  url: string;
  measurements: UserMeasurements;
};

export function BodyMesh({ url, measurements }: Props) {
  const gltf = useLoader(GLTFLoader, url);
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const meshesCountRef = useRef<number>(0);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const scene = gltf.scene.clone(true);

    // Center at origin, floor at y=0 (world Y = local Z via the node matrix)
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    scene.position.sub(center);
    scene.position.y += size.y / 2;

    group.add(scene);

    const meshes: THREE.Mesh[] = [];
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) meshes.push(obj);
    });
    meshesRef.current = meshes;
    meshesCountRef.current = meshes.length;

    return () => {
      group.remove(scene);
      meshesRef.current = [];
      meshesCountRef.current = 0;
    };
  }, [gltf]);

  useRegionMorph(meshesRef, meshesCountRef, measurements);

  return <group ref={groupRef} />;
}
