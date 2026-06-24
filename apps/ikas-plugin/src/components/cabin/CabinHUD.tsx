"use client";

import { useCabinStore, UserMeasurements } from "./useCabinStore";

const GARMENTS = [
  { label: "Demo Dress", url: "/models/renomowana_hurtownia_wysokiej_jakosci/scene.gltf" },
  { label: "Bikini",     url: "/models/leopard_print_bikini_model/scene.gltf" },
];

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

export function CabinHUD() {
  const { state, setMeasurements, setGarment, setActive } = useCabinStore();
  const { measurements, garmentUrl, isLoading } = state;

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
      {/* Headline */}
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

        {/* Garment picker */}
        <div style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontSize: "var(--caption)",
              letterSpacing: "var(--caption-tracking)",
              textTransform: "uppercase",
              color: "rgba(250,250,249,0.35)",
              marginBottom: "10px",
            }}
          >
            Garment
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {GARMENTS.map((g) => {
              const active = garmentUrl === g.url;
              return (
                <button
                  key={g.url}
                  onClick={() => setGarment(g.url)}
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: "3px",
                    border: active
                      ? "1px solid var(--cabin-accent)"
                      : "1px solid rgba(250,250,249,0.1)",
                    background: active ? "rgba(190,255,92,0.08)" : "transparent",
                    color: active ? "var(--cabin-accent)" : "rgba(250,250,249,0.55)",
                    fontSize: "var(--cabin-body)",
                    fontWeight: active ? 600 : 400,
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                    transition: "all 0.15s ease",
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <MeasurementSlider
            label="Height"
            unit="cm"
            value={measurements.height}
            min={140}
            max={210}
            onChange={update("height")}
          />
          <MeasurementSlider
            label="Chest"
            unit="cm"
            value={measurements.chest}
            min={70}
            max={130}
            onChange={update("chest")}
          />
          <MeasurementSlider
            label="Waist"
            unit="cm"
            value={measurements.waist}
            min={55}
            max={115}
            onChange={update("waist")}
          />
          <MeasurementSlider
            label="Hips"
            unit="cm"
            value={measurements.hips}
            min={75}
            max={130}
            onChange={update("hips")}
          />
        </div>
      </div>

      {/* CTA */}
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
        }}
      >
        {isLoading ? "Loading…" : "Try On"}
      </button>
    </aside>
  );
}
