import { describe, it, expect } from "vitest";
import { computeProductState } from "../lib/product-sync";

describe("computeProductState — 3D model URL integration", () => {
  const baseNode = {
    id: "prod_1",
    name: "Test Jacket",
    categories: [{ id: "cat_1", name: "Outerwear" }],
    variants: [{ id: "var_1", sku: "TJ-001", images: [{ imageId: "img_1", isMain: true, order: 1 }] }],
  };

  it("scores 100 and state=live when category + variants + modelUrl present", () => {
    const result = computeProductState(
      { ...baseNode, attributes: [{ attributeId: "3d_model_url", value: "https://cdn.example.com/jacket.glb" }] }
    );
    expect(result.state).toBe("live");
    expect(result.readinessScore).toBe(100);
    expect(result.modelUrl).toBe("https://cdn.example.com/jacket.glb");
    expect(result.missingFields).toBeNull();
  });

  it("scores 60 and state=ready when category + variants present but modelUrl missing", () => {
    const result = computeProductState(baseNode);
    expect(result.state).toBe("ready");
    expect(result.readinessScore).toBe(60);
    expect(result.modelUrl).toBeNull();
    expect(result.missingFields).toContain("3D model asset required");
  });

  it("falls through to existingModelUrl when IKAS attribute absent", () => {
    const result = computeProductState(baseNode, "https://cdn.example.com/from-db.glb");
    expect(result.state).toBe("live");
    expect(result.modelUrl).toBe("https://cdn.example.com/from-db.glb");
  });

  it("IKAS attribute takes precedence over existingModelUrl", () => {
    const result = computeProductState(
      { ...baseNode, attributes: [{ attributeId: "3d_model_url", value: "https://cdn.example.com/new.glb" }] },
      "https://cdn.example.com/old.glb"
    );
    expect(result.modelUrl).toBe("https://cdn.example.com/new.glb");
  });

  it("scores 20 and state=missing when category absent", () => {
    const result = computeProductState({ ...baseNode, categories: [] });
    expect(result.state).toBe("missing");
    expect(result.readinessScore).toBe(20);
    expect(result.missingFields).toContain("Category assignment required");
  });
});
