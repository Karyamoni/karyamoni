"use client";

import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { VRM } from "@pixiv/three-vrm";
import { CabinProvider, useCabinStore, type SizeChartEntry } from "./useCabinStore";
import type { GarmentType } from "@/lib/garment-types";
import { CabinEnvironment } from "./CabinEnvironment";
import { AvatarRig } from "./AvatarRig";
import { ClothLayer } from "./ClothLayer";
import { BodyMesh, MODEL_BASE } from "./StaticBodyRig";
import { ClothingImagePlane } from "./ClothingImagePlane";
import { ProceduralAvatar } from "./ProceduralAvatar";
import { CabinHUD } from "./CabinHUD";

// ── Error boundary ─────────────────────────────────────────────────────────────
type EBState = { failed: boolean };
class AvatarErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, EBState> {
  state: EBState = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// ── Camera controller — flips Z position for back view ────────────────────────
function CameraController() {
  const { state } = useCabinStore();
  const { camera } = useThree();
  const targetZRef = useRef(2.8);

  useEffect(() => {
    targetZRef.current = state.viewMode === "back" ? -2.8 : 2.8;
  }, [state.viewMode]);

  useFrame(() => {
    const pos = camera.position;
    const targetZ = targetZRef.current;
    if (Math.abs(pos.z - targetZ) > 0.01) {
      pos.z += (targetZ - pos.z) * 0.08;
      camera.lookAt(0, 0.2, 0);
    }
  });

  return null;
}

// ── Static GLTF scene — body + 2.5D clothing overlay ──────────────────────────
function StaticScene() {
  const { state } = useCabinStore();
  const { avatarUrl, measurements, productImages, activeImageIndex } = state;
  const swayRef = useRef<THREE.Group>(null);

  const scaleY = measurements.height / MODEL_BASE.height;
  const activeImage = productImages[activeImageIndex] ?? null;

  useFrame(({ clock }) => {
    if (swayRef.current) {
      swayRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.35) * 0.06;
    }
  });

  return (
    <group ref={swayRef} position={[0, -1, 0]} scale={[1, scaleY, 1]}>
      <Suspense fallback={null}>
        <BodyMesh url={avatarUrl} measurements={measurements} />
      </Suspense>
      {activeImage && (
        <AvatarErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <ClothingImagePlane imageUrl={activeImage} bodyScaleY={scaleY} />
          </Suspense>
        </AvatarErrorBoundary>
      )}
    </group>
  );
}

// ── VRM scene ──────────────────────────────────────────────────────────────────
function VrmScene() {
  const { state, setActive } = useCabinStore();
  const { avatarUrl, measurements, isActive, garmentUrl } = state;
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [rigRoot, setRigRoot] = useState<THREE.Object3D | null>(null);

  const handleLoad = useCallback((loadedVrm: VRM, root: THREE.Object3D) => {
    setVrm(loadedVrm);
    setRigRoot(root);
    setActive(true);
  }, [setActive]);

  return (
    <>
      <AvatarRig url={avatarUrl} measurements={measurements} onLoad={handleLoad} />
      {isActive && vrm && rigRoot && garmentUrl && (
        <ClothLayer garmentUrl={garmentUrl} vrm={vrm} rigRoot={rigRoot} />
      )}
    </>
  );
}

// ── Procedural fallback ────────────────────────────────────────────────────────
function ProceduralScene() {
  const { state } = useCabinStore();
  return <ProceduralAvatar measurements={state.measurements} />;
}

// ── Determine avatar mode from file extension ──────────────────────────────────
function getAvatarMode(url: string): "vrm" | "gltf" | "none" {
  if (!url) return "none";
  if (url.endsWith(".vrm")) return "vrm";
  return "gltf";
}

// ── Full scene graph ───────────────────────────────────────────────────────────
function Scene() {
  const { state } = useCabinStore();
  const mode = getAvatarMode(state.avatarUrl);

  return (
    <>
      <CabinEnvironment />
      <CameraController />

      {mode === "gltf" && (
        <AvatarErrorBoundary fallback={<ProceduralScene />}>
          <Suspense fallback={<ProceduralScene />}>
            <StaticScene />
          </Suspense>
        </AvatarErrorBoundary>
      )}

      {mode === "vrm" && (
        <AvatarErrorBoundary fallback={<ProceduralScene />}>
          <Suspense fallback={<ProceduralScene />}>
            <VrmScene />
          </Suspense>
        </AvatarErrorBoundary>
      )}

      {mode === "none" && <ProceduralScene />}

      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 0.75}
        minDistance={1.5}
        maxDistance={4}
        target={[0, 0.2, 0]}
        enablePan={false}
      />
    </>
  );
}

// ── Canvas loading spinner ─────────────────────────────────────────────────────
function CanvasSpinner() {
  return (
    <mesh>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color="#beff5c" wireframe />
    </mesh>
  );
}

// ── 2D status badge ────────────────────────────────────────────────────────────
function AvatarBadge({ mode }: { mode: "vrm" | "gltf" | "none" }) {
  if (mode !== "none") return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 20,
        padding: "4px 10px",
        borderRadius: "2px",
        border: "1px solid rgba(255,107,91,0.3)",
        background: "rgba(255,107,91,0.08)",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--coral, #ff6b5b)",
        pointerEvents: "none",
      }}
    >
      Placeholder avatar
    </div>
  );
}

// ── Front / Back view toggle overlay ──────────────────────────────────────────
function ViewToggle() {
  const { state, setViewMode, setActiveImage } = useCabinStore();
  const { viewMode, productImages, activeImageIndex } = state;

  if (productImages.length < 2) return null;

  const frontIdx = 0;
  const backIdx = Math.min(1, productImages.length - 1);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        display: "flex",
        gap: "4px",
      }}
    >
      {(["front", "back"] as const).map((v, i) => {
        const active = viewMode === v;
        const imgIdx = i === 0 ? frontIdx : backIdx;
        return (
          <button
            key={v}
            onClick={() => {
              setViewMode(v);
              setActiveImage(imgIdx);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: "2px",
              border: active ? "1px solid var(--cabin-accent)" : "1px solid rgba(250,250,249,0.15)",
              background: active ? "rgba(190,255,92,0.12)" : "rgba(10,10,10,0.6)",
              color: active ? "var(--cabin-accent)" : "rgba(250,250,249,0.5)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.15s ease",
            }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

// ── Image thumbnail strip ──────────────────────────────────────────────────────
function ThumbnailStrip() {
  const { state, setActiveImage } = useCabinStore();
  const { productImages, activeImageIndex } = state;

  if (productImages.length <= 2) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        display: "flex",
        gap: "4px",
      }}
    >
      {productImages.map((url, i) => (
        <button
          key={url}
          onClick={() => setActiveImage(i)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "2px",
            border: i === activeImageIndex ? "1px solid var(--cabin-accent)" : "1px solid rgba(250,250,249,0.15)",
            overflow: "hidden",
            padding: 0,
            cursor: "pointer",
            opacity: i === activeImageIndex ? 1 : 0.6,
            transition: "opacity 0.15s ease",
          }}
        >
          <img src={url} alt={`View ${i + 1}`} width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </button>
      ))}
    </div>
  );
}

// ── Public component ───────────────────────────────────────────────────────────
type Props = {
  garmentUrl?: string | null;
  productImages?: string[];
  sizeChart?: SizeChartEntry[];
  garmentType?: GarmentType | null;
  className?: string;
};

export function ThreeCabinetViewer({ garmentUrl, productImages, sizeChart, garmentType, className }: Props) {
  const avatarUrl = process.env.NEXT_PUBLIC_AVATAR_VRM_URL ?? "";
  const mode = getAvatarMode(avatarUrl);

  return (
    <CabinProvider
      initialGarmentUrl={garmentUrl}
      initialProductImages={productImages}
      initialSizeChart={sizeChart}
      initialGarmentType={garmentType}
    >
      <div
        className={className}
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          minHeight: "var(--cabin-canvas-min-height)",
          background: "var(--cabin-bg, #0a0a0a)",
          overflow: "hidden",
        }}
      >
        <CabinHUD />

        <div style={{ flex: 1, position: "relative" }}>
          {/* Monumental ghosted headline */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: "8.33%",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <h1
              style={{
                fontSize: "var(--cabin-display)",
                letterSpacing: "var(--cabin-display-tracking)",
                lineHeight: "var(--cabin-display-leading)",
                color: "rgba(250,250,249,0.07)",
                fontWeight: 900,
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              VIRTUAL
              <br />
              CABIN
            </h1>
          </div>

          <Canvas
            shadows={{ type: THREE.PCFShadowMap }}
            dpr={[1, 2]}
            camera={{ position: [0, 0.5, 2.8], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
            frameloop="always"
            gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          >
            <Suspense fallback={<CanvasSpinner />}>
              <Scene />
            </Suspense>
          </Canvas>

          <ViewToggle />
          <ThumbnailStrip />
          <AvatarBadge mode={mode} />
        </div>
      </div>
    </CabinProvider>
  );
}
