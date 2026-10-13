import type { ProductCategory } from "@/data/products";

/** "Product Interest" options, in the order the legacy form listed them. */
export const interestOptions = [
  { value: "diode", label: "Diode Laser Hair Removal" },
  { value: "picosecond", label: "Picosecond Laser" },
  { value: "co2", label: "CO2 Fractional Laser" },
  { value: "ndyag", label: "Q-Switch ND YAG" },
  { value: "hifu", label: "HIFU Machine" },
  { value: "ems", label: "EMS Body Sculpting" },
  { value: "dental", label: "Dental Products" },
  { value: "other", label: "Other Products" },
] as const;

export type Interest = (typeof interestOptions)[number]["value"];

export const interestValues = interestOptions.map((o) => o.value) as [Interest, ...Interest[]];

export const interestLabel = (value: string) =>
  interestOptions.find((o) => o.value === value)?.label ?? value;

const interestByCategory: Record<ProductCategory, Interest> = {
  "Diode Laser": "diode",
  "Picosecond Laser": "picosecond",
  "CO2 Laser": "co2",
  "Q Switch Laser": "ndyag",
  "ND YAG Laser": "other",
  "HIFU Machine": "hifu",
  "RF Microneedling": "other",
  "Cold Plasma": "other",
  "EMS Machine": "ems",
  "Slimming Machine": "other",
  "IPL Machine": "other",
  "LED Machine": "other",
  "Cooling System": "other",
  "Hydra Facial": "other",
  "Dental Chair": "dental",
  "High Speed": "dental",
  "Low Speed": "dental",
  Surgical: "dental",
};

export const interestForCategory = (category: ProductCategory) => interestByCategory[category];

export type InquiryFields = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  /** Exact product title when the visitor came from a product page. */
  product?: string;
};

/** Same prefilled message format the legacy site sent to WhatsApp. */
export function inquiryWhatsappMessage(fields: InquiryFields) {
  const interest = fields.product ?? interestLabel(fields.interest);
  return `*New Inquiry*\n\n*Name:* ${fields.name}\n*Email:* ${fields.email}\n*Phone:* ${fields.phone}\n*Product Interest:* ${interest}\n\n*Message:*\n${fields.message}`;
}
