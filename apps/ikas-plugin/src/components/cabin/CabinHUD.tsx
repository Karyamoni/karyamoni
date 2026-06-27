"use client";

import { useCabinStore, UserMeasurements } from "./useCabinStore";

type SliderProps = {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

function MeasurementSlider({ label, unit, value, min, max, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span
          style={{
            fontSize: "var(--caption)",
            letterSpacing: "var(--caption-tracking)",
            textTransform: "uppercase",
            color: "rgba(250,250,249,0.5)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "var(--cabin-body)",
            color: "var(--cabin-accent)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
          <span style={{ fontSize: "var(--caption)", color: "rgba(250,250,249,0.4)" }}>
            {" "}
            {unit}
          </span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--cabin-accent)] h-0.5 rounded-full cursor-pointer"
        style={{ background: `linear-gradient(to right, var(--cabin-accent) ${((value - min) / (max - min)) * 100}%, rgba(250,250,249,0.1) 0%)` }}
      />
    </div>
  );
}

function SizeBadge({ size }: { size: string }) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px 14px",
        borderRadius: "3px",
        border: "1px solid rgba(190,255,92,0.3)",
        background: "rgba(190,255,92,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontSize: "var(--caption)",
          letterSpacing: "var(--caption-tracking)",
          textTransform: "uppercase",
          color: "rgba(250,250,249,0.4)",
        }}
      >
        Best fit
      </span>
      <span
        style={{
          fontSize: "clamp(18px, 2vw, 24px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--cabin-accent)",
        }}
      >
        {size}
      </span>
    </div>
  );
}

export function CabinHUD() {
  const { state, setMeasurements, setActive } = useCabinStore();
  const { measurements, isLoading, recommendedSize } = state;

  function update(key: keyof UserMeasurements) {
    return (v: number) => setMeasurements({ [key]: v });
  }

  return (
    <aside
      style={{
        width: "var(--cabin-hud-width)",
        background: "var(--cabin-surface)",
        borderRight: "1px solid var(--cabin-border)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 24px",
        flexShrink: 0,
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "var(--caption)",
            letterSpacing: "var(--caption-tracking)",
            textTransform: "uppercase",
            color: "rgba(250,250,249,0.35)",
            marginBottom: "8px",
          }}
        >
          Body Profile
        </p>
        <h2
          style={{
            fontSize: "clamp(28px, 3vw, 48px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            color: "var(--cabin-paper, #fafaf9)",
            marginBottom: "32px",
          }}
        >
          FITTING
          <br />
          ROOM
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <MeasurementSlider
            label="Height / Boy"
            unit="cm"
            value={measurements.height}
            min={140}
            max={210}
            onChange={update("height")}
          />
          <MeasurementSlider
            label="Weight / Kilo"
            unit="kg"
            value={measurements.weight}
            min={40}
            max={150}
            onChange={update("weight")}
          />
          <MeasurementSlider
            label="Chest / Göğüs"
            unit="cm"
            value={measurements.chest}
            min={70}
            max={130}
            onChange={update("chest")}
          />
          <MeasurementSlider
            label="Waist / Bel"
            unit="cm"
            value={measurements.waist}
            min={55}
            max={115}
            onChange={update("waist")}
          />
          <MeasurementSlider
            label="Hips / Basen"
            unit="cm"
            value={measurements.hips}
            min={75}
            max={130}
            onChange={update("hips")}
          />
        </div>

        {recommendedSize && <SizeBadge size={recommendedSize} />}
      </div>

      <button
        onClick={() => setActive(true)}
        disabled={isLoading}
        style={{
          background: isLoading ? "rgba(190,255,92,0.3)" : "var(--cabin-accent)",
          color: "var(--cabin-bg, #0a0a0a)",
          border: "none",
          borderRadius: "4px",
          padding: "14px 20px",
          fontSize: "var(--cabin-body)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          cursor: isLoading ? "wait" : "pointer",
          transition: "background 0.2s var(--cabin-ease)",
          width: "100%",
          marginTop: "32px",
        }}
      >
        {isLoading ? "Loading…" : "Try On"}
      </button>
    </aside>
  );
}
