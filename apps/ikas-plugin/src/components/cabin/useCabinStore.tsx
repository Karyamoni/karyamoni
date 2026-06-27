"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import type { GarmentType } from "@/lib/garment-types";
import { GARMENT_FIELDS } from "@/lib/garment-types";

export type UserMeasurements = {
  height: number;  // cm
  weight: number;  // kg
  chest: number;   // cm
  waist: number;   // cm
  hips: number;    // cm
};

export type MeasurementRange = { min: number | null; max: number | null };

export type SizeChartEntry = {
  size: string;
  measurements: Record<string, MeasurementRange>;
};

export type CabinState = {
  measurements: UserMeasurements;
  garmentUrl: string | null;
  garmentType: GarmentType | null;
  avatarUrl: string;
  isActive: boolean;
  isLoading: boolean;
  viewMode: "front" | "back";
  activeImageIndex: number;
  productImages: string[];
  sizeChart: SizeChartEntry[];
  recommendedSize: string | null;
};

type CabinAction =
  | { type: "SET_MEASUREMENTS"; payload: Partial<UserMeasurements> }
  | { type: "SET_GARMENT"; payload: string | null }
  | { type: "SET_ACTIVE"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_VIEW_MODE"; payload: "front" | "back" }
  | { type: "SET_ACTIVE_IMAGE"; payload: number }
  | { type: "SET_PRODUCT_IMAGES"; payload: string[] }
  | { type: "SET_SIZE_CHART"; payload: SizeChartEntry[] };

const DEFAULT_AVATAR_URL = process.env.NEXT_PUBLIC_AVATAR_VRM_URL
  ?? "/models/male_base_model/scene.gltf";

const DEFAULT_MEASUREMENTS: UserMeasurements = {
  height: 170,
  weight: 70,
  chest: 86,
  waist: 66,
  hips: 92,
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

// Fields that don't map to customer body sliders — skip in recommendation
const NON_BODY_FIELDS = new Set(["length", "foot_length", "head_circumference", "width"]);

export function computeRecommendedSize(
  measurements: UserMeasurements,
  sizeChart: SizeChartEntry[],
  garmentType: GarmentType | null
): string | null {
  if (!sizeChart.length) return null;

  const relevantFields = garmentType ? GARMENT_FIELDS[garmentType] : ["chest", "waist", "hips"];
  const checkableFields = relevantFields.filter((f) => !NON_BODY_FIELDS.has(f));

  if (checkableFields.length === 0) return null;

  const sorted = [...sizeChart].sort(
    (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
  );

  for (const entry of sorted) {
    const fits = checkableFields.every((field) => {
      const range = entry.measurements[field];
      if (!range || (range.min == null && range.max == null)) return true;
      const customerVal = measurements[field as keyof UserMeasurements];
      if (customerVal == null) return true;
      const minOk = range.min == null || customerVal >= range.min;
      const maxOk = range.max == null || customerVal <= range.max;
      return minOk && maxOk;
    });
    if (fits) return entry.size;
  }

  return null;
}

function cabinReducer(state: CabinState, action: CabinAction): CabinState {
  switch (action.type) {
    case "SET_MEASUREMENTS": {
      const measurements = { ...state.measurements, ...action.payload };
      const recommendedSize = computeRecommendedSize(measurements, state.sizeChart, state.garmentType);
      return { ...state, measurements, recommendedSize };
    }
    case "SET_GARMENT":
      return { ...state, garmentUrl: action.payload };
    case "SET_ACTIVE":
      return { ...state, isActive: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_ACTIVE_IMAGE":
      return { ...state, activeImageIndex: action.payload };
    case "SET_PRODUCT_IMAGES":
      return { ...state, productImages: action.payload, activeImageIndex: 0 };
    case "SET_SIZE_CHART": {
      const sizeChart = action.payload;
      const recommendedSize = computeRecommendedSize(state.measurements, sizeChart, state.garmentType);
      return { ...state, sizeChart, recommendedSize };
    }
    default:
      return state;
  }
}

type CabinContextValue = {
  state: CabinState;
  setMeasurements: (m: Partial<UserMeasurements>) => void;
  setGarment: (url: string | null) => void;
  setActive: (v: boolean) => void;
  setViewMode: (v: "front" | "back") => void;
  setActiveImage: (i: number) => void;
  setProductImages: (urls: string[]) => void;
  setSizeChart: (chart: SizeChartEntry[]) => void;
};

const CabinContext = createContext<CabinContextValue | null>(null);

export function CabinProvider({
  children,
  initialGarmentUrl,
  initialProductImages,
  initialSizeChart,
  initialGarmentType,
}: {
  children: ReactNode;
  initialGarmentUrl?: string | null;
  initialProductImages?: string[];
  initialSizeChart?: SizeChartEntry[];
  initialGarmentType?: GarmentType | null;
}) {
  const sizeChart = initialSizeChart ?? [];
  const productImages = initialProductImages ?? [];
  const garmentType = initialGarmentType ?? null;

  const [state, dispatch] = useReducer(cabinReducer, {
    measurements: DEFAULT_MEASUREMENTS,
    garmentUrl: initialGarmentUrl ?? null,
    garmentType,
    avatarUrl: DEFAULT_AVATAR_URL,
    isActive: false,
    isLoading: false,
    viewMode: "front",
    activeImageIndex: 0,
    productImages,
    sizeChart,
    recommendedSize: computeRecommendedSize(DEFAULT_MEASUREMENTS, sizeChart, garmentType),
  });

  return (
    <CabinContext.Provider
      value={{
        state,
        setMeasurements: (m) => dispatch({ type: "SET_MEASUREMENTS", payload: m }),
        setGarment: (url) => dispatch({ type: "SET_GARMENT", payload: url }),
        setActive: (v) => dispatch({ type: "SET_ACTIVE", payload: v }),
        setViewMode: (v) => dispatch({ type: "SET_VIEW_MODE", payload: v }),
        setActiveImage: (i) => dispatch({ type: "SET_ACTIVE_IMAGE", payload: i }),
        setProductImages: (urls) => dispatch({ type: "SET_PRODUCT_IMAGES", payload: urls }),
        setSizeChart: (chart) => dispatch({ type: "SET_SIZE_CHART", payload: chart }),
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
