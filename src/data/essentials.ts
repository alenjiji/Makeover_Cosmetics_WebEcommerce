export type EssentialGroup = {
  title: string;
  description: string;
  items: string[];
};

// Consumables and small devices, taken from the supplier price list in assets/source/pricing.
// Names only: prices there are supplier tiers in INR, so quotes go through the sales team.
export const essentials: EssentialGroup[] = [
  {
    title: "Facial Masks & Skincare",
    description: "Sheet and jelly masks for post-treatment care and retail.",
    items: [
      "Collagen",
      "Vitamin C",
      "Retinol",
      "Hyaluronic Acid",
      "24K Gold",
      "Snail Serum",
      "Bamboo Charcoal",
      "Mooyam Brightening Set",
    ],
  },
  {
    title: "Oxygeneo & Meso Solutions",
    description: "Treatment kits and mesotherapy solutions for in-clinic facials.",
    items: [
      "Pologen Revive",
      "Pologen Balance",
      "Pologen Illuminate",
      "NeeBright",
      "NeeRevive",
      "Dermaheal HSR / SR / SB / HL",
    ],
  },
  {
    title: "Microneedling",
    description: "Pens, cartridges and rollers for collagen induction therapy.",
    items: [
      "Dr. Pen A6, M8 & A11",
      "Dr. Pen needle cartridges",
      "ZGTS derma rollers 0.5–2.5mm",
      "PMU needles",
    ],
  },
  {
    title: "LED & Light Therapy",
    description: "PDT devices for skin rejuvenation and scalp care.",
    items: ["Face LED mask with neck", "Omega light", "Double steam light", "Hair growth helmet"],
  },
  {
    title: "Clinic Devices",
    description: "Everyday tools for consultation, diagnosis and treatment.",
    items: [
      "Mesotherapy meso gun",
      "Diamond microdermabrasion",
      "Wood lamp",
      "USB derma scope",
      "High frequency",
      "Cautery pen",
      "Skin scrubber",
    ],
  },
  {
    title: "Hydra Facial & Laser Consumables",
    description: "Keep your machines running between treatments.",
    items: [
      "Hydra facial serums",
      "Bubble foam liquid",
      "Hydra gel",
      "Carbon gel",
      "Laser gel (5kg)",
      "Cryo membrane",
      "PRP tubes",
      "BB Glow kit",
    ],
  },
];
