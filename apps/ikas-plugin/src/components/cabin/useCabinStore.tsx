"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

export type UserMeasurements = {
  height: number;  // cm
  chest: number;   // cm
  waist: number;   // cm
  hips: number;    // cm
};

export type CabinState = {
  measurements: UserMeasurements;
  garmentUrl: string | null;
  avatarUrl: string;
  isActive: boolean;
  isLoading: boolean;
};

type CabinAction =
  | { type: "SET_MEASUREMENTS"; payload: Partial<UserMeasurements> }
  | { type: "SET_GARMENT"; payload: string | null }
  | { type: "SET_ACTIVE"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean };

// Supports .vrm (rigged humanoid) or .gltf/.glb (static mesh).
// Set NEXT_PUBLIC_AVATAR_VRM_URL in .env to override. Empty = procedural fallback.
const DEFAULT_AVATAR_URL = process.env.NEXT_PUBLIC_AVATAR_VRM_URL
  ?? "/models/male_base_model/scene.gltf";

// Match MODEL_BASE in StaticBodyRig so the avatar loads undeformed.
// Users adjust sliders from this baseline.
const DEFAULT_MEASUREMENTS: UserMeasurements = {
  height: 170,
  chest: 86,
  waist: 66,
  hips: 92,
};

function cabinReducer(state: CabinState, action: CabinAction): CabinState {
  switch (action.type) {
    case "SET_MEASUREMENTS":
      return { ...state, measurements: { ...state.measurements, ...action.payload } };
    case "SET_GARMENT":
      return { ...state, garmentUrl: action.payload };
    case "SET_ACTIVE":
      return { ...state, isActive: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

type CabinContextValue = {
  state: CabinState;
  setMeasurements: (m: Partial<UserMeasurements>) => void;
  setGarment: (url: string | null) => void;
  setActive: (v: boolean) => void;
};

const CabinContext = createContext<CabinContextValue | null>(null);

export function CabinProvider({
  children,
  initialGarmentUrl,
}: {
  children: ReactNode;
  initialGarmentUrl?: string | null;
}) {
  const [state, dispatch] = useReducer(cabinReducer, {
    measurements: DEFAULT_MEASUREMENTS,
    garmentUrl: initialGarmentUrl ?? null,
    avatarUrl: DEFAULT_AVATAR_URL,
    isActive: false,
    isLoading: false,
  });

  return (
    <CabinContext.Provider
      value={{
        state,
        setMeasurements: (m) => dispatch({ type: "SET_MEASUREMENTS", payload: m }),
        setGarment: (url) => dispatch({ type: "SET_GARMENT", payload: url }),
        setActive: (v) => dispatch({ type: "SET_ACTIVE", payload: v }),
      }}
    >
      {children}
    </CabinContext.Provider>
  );
}

export function useCabinStore() {
  const ctx = useContext(CabinContext);
  if (!ctx) throw new Error("useCabinStore must be inside CabinProvider");
  return ctx;
}
