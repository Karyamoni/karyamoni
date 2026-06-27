export const GARMENT_TYPES = [
  "tops",
  "bottoms",
  "dresses",
  "skirts",
  "outerwear",
  "shoes",
  "caps",
  "accessories",
] as const;

export type GarmentType = typeof GARMENT_TYPES[number];

// height + weight on all wearable clothing types — Turkish commerce norm:
// customers ask "I'm 180cm / 76kg, which size?"
export const GARMENT_FIELDS: Record<GarmentType, string[]> = {
  tops:        ["height", "weight", "chest", "waist", "length"],
  bottoms:     ["height", "weight", "waist", "hips", "length"],
  dresses:     ["height", "weight", "chest", "waist", "hips", "length"],
  skirts:      ["height", "weight", "waist", "hips", "length"],
  outerwear:   ["height", "weight", "chest", "waist", "hips", "length"],
  shoes:       ["foot_length"],
  caps:        ["head_circumference"],
  accessories: ["width", "height"],
};

export const GARMENT_LABELS: Record<GarmentType, string> = {
  tops:        "Tops",
  bottoms:     "Bottoms",
  dresses:     "Dresses",
  skirts:      "Skirts",
  outerwear:   "Outerwear",
  shoes:       "Shoes",
  caps:        "Caps",
  accessories: "Accessories",
};

export const FIELD_LABELS: Record<string, string> = {
  height:            "Height / Boy (cm)",
  weight:            "Weight / Kilo (kg)",
  chest:             "Chest / Göğüs (cm)",
  waist:             "Waist / Bel (cm)",
  hips:              "Hips / Basen (cm)",
  length:            "Length / Uzunluk (cm)",
  foot_length:       "Foot / Ayak (cm)",
  head_circumference:"Head / Baş (cm)",
  width:             "Width / Genişlik (cm)",
};

// Fields that map directly to customer body measurement keys
export const CUSTOMER_FIELD_MAP: Record<string, keyof { height: number; weight: number; chest: number; waist: number; hips: number }> = {
  height: "height",
  weight: "weight",
  chest:  "chest",
  waist:  "waist",
  hips:   "hips",
};

// Category name → garment type. Handles Turkish + English.
export function detectGarmentType(categoryName: string): GarmentType {
  const s = categoryName.toLowerCase();
  if (/t-shirt|tee|polo|shirt|blouse|top|sweatshirt|hoodie|üst|bluz/.test(s)) return "tops";
  if (/pant|short|trouser|jean|legging|jogger|şort|pantolon/.test(s)) return "bottoms";
  if (/dress|gown|elbise/.test(s)) return "dresses";
  if (/skirt|etek/.test(s)) return "skirts";
  if (/coat|jacket|blazer|cardigan|mont|ceket|yelek/.test(s)) return "outerwear";
  if (/shoe|boot|sneaker|sandal|ayakkabı/.test(s)) return "shoes";
  if (/cap|hat|beanie|şapka|bere/.test(s)) return "caps";
  return "tops";
}
