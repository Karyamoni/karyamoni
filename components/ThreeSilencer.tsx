"use client";

import { useEffect } from "react";

// R3F 9.x creates THREE.Clock internally (fixed in future R3F); KHR_materials_pbrSpecularGlossiness
// is a deprecated GLTF spec extension embedded in the model — suppressing until model is re-exported.
const SUPPRESSED = [
  "THREE.Clock: This module has been deprecated",
  'THREE.GLTFLoader: Unknown extension "KHR_materials_pbrSpecularGlossiness"',
];

export function ThreeSilencer() {
  useEffect(() => {
    const orig = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      const msg = String(args[0] ?? "");
      if (SUPPRESSED.some((s) => msg.includes(s))) return;
      orig(...args);
    };
    return () => {
      console.warn = orig;
    };
  }, []);
  return null;
}
