export type CategoryId = "laptop" | "phone" | "monitor" | "tablet" | "desktop" | "tv" | "console" | "printer";

export interface Category { id: CategoryId; label: string; emoji: string; blurb: string; baseMarket: number; brands: string[]; specLabel: string; }

export const CATEGORIES: Category[] = [
  { id: "laptop", label: "Laptop", emoji: "💻", blurb: "Working, faulty or dead", baseMarket: 48000, brands: ["Apple","HP","Dell","Lenovo","Asus","Acer","MSI","Toshiba","Other"], specLabel: "RAM / Storage e.g. 16GB / 512GB SSD" },
  { id: "phone", label: "Phone", emoji: "📱", blurb: "All brands & conditions", baseMarket: 26000, brands: ["Apple","Samsung","Tecno","Infinix","Xiaomi","Oppo","Vivo","Huawei","Other"], specLabel: "Storage e.g. 128GB" },
  { id: "monitor", label: "Monitor", emoji: "🖥️", blurb: "Any size, any condition", baseMarket: 13000, brands: ["Samsung","LG","HP","Dell","Lenovo","Acer","Other"], specLabel: "Size e.g. 24 inch" },
  { id: "tablet", label: "Tablet / iPad", emoji: "📲", blurb: "iPads & Android tablets", baseMarket: 22000, brands: ["Apple","Samsung","Lenovo","Huawei","Other"], specLabel: "Storage e.g. 64GB" },
  { id: "desktop", label: "Desktop PC", emoji: "🖲️", blurb: "Full towers & parts", baseMarket: 36000, brands: ["HP","Dell","Lenovo","Apple","Custom Build","Other"], specLabel: "RAM / Storage e.g. 8GB / 256GB" },
  { id: "tv", label: "TV", emoji: "📺", blurb: "Smart & digital TVs", baseMarket: 32000, brands: ["Samsung","LG","Sony","TCL","Hisense","Other"], specLabel: "Size e.g. 43 inch" },
  { id: "console", label: "Game Console", emoji: "🎮", blurb: "PS, Xbox, Nintendo", baseMarket: 38000, brands: ["Sony PlayStation","Microsoft Xbox","Nintendo","Other"], specLabel: "Model e.g. PS5 / PS4 Slim" },
  { id: "printer", label: "Printer", emoji: "🖨️", blurb: "Office & home printers", baseMarket: 14000, brands: ["HP","Epson","Canon","Brother","Other"], specLabel: "Type e.g. Laser / Inkjet" },
];

export const CONDITIONS = [
  { id: "like-new", label: "Like New", desc: "Barely used, no marks", mult: 1.0 },
  { id: "good", label: "Good / Working", desc: "Works perfectly, light wear", mult: 0.85 },
  { id: "fair", label: "Fair", desc: "Works, visible wear / minor issues", mult: 0.65 },
  { id: "faulty", label: "Faulty", desc: "Has a fault but powers on", mult: 0.35 },
  { id: "dead", label: "Not Working", desc: "Dead / for parts only", mult: 0.18 },
] as const;

export const AGES = [
  { id: "0-1", label: "Under 1 year", mult: 1.0 },
  { id: "1-2", label: "1 – 2 years", mult: 0.85 },
  { id: "3-4", label: "3 – 4 years", mult: 0.65 },
  { id: "5+", label: "5+ years", mult: 0.45 },
] as const;

const BRAND_MULT: Record<string, number> = {
  Apple: 1.6, "Sony PlayStation": 1.3, Samsung: 1.25, Sony: 1.2, LG: 1.1, Dell: 1.05, HP: 1.0, Lenovo: 1.0, Asus: 1.0, MSI: 1.1, Other: 0.85,
};

export interface QuoteInput { category: CategoryId; brand: string; condition: string; age: string; working: boolean; }
export interface Quote { marketEstimate: number; low: number; high: number; mid: number; rateLabel: string; breakdown: { label: string; value: string }[]; }

export function calculateQuote(input: QuoteInput): Quote {
  const cat = CATEGORIES.find(c => c.id === input.category) ?? CATEGORIES[0];
  const cond = CONDITIONS.find(c => c.id === input.condition) ?? CONDITIONS[1];
  const age = AGES.find(a => a.id === input.age) ?? AGES[1];
  const brandMult = BRAND_MULT[input.brand] ?? 0.95;
  // If user says not working, cap condition effect
  const workingMult = input.working ? 1 : 0.5;
  const marketEstimate = Math.max(300, cat.baseMarket * brandMult * cond.mult * age.mult * (input.working ? 1 : Math.min(1, workingMult + 0.3)));
  const low = marketEstimate * 0.20;
  const high = marketEstimate * 0.30;
  return {
    marketEstimate: Math.round(marketEstimate / 100) * 100,
    low: Math.round(low / 100) * 100,
    high: Math.round(high / 100) * 100,
    mid: Math.round(((low + high) / 2) / 100) * 100,
    rateLabel: "20% – 30% of estimated market value",
    breakdown: [
      { label: "Category base", value: cat.label },
      { label: "Brand factor", value: `× ${brandMult.toFixed(2)} (${input.brand || "Other"})` },
      { label: "Condition", value: `${cond.label} (× ${cond.mult})` },
      { label: "Age", value: `${age.label} (× ${age.mult})` },
      { label: "Working", value: input.working ? "Yes" : "No — priced for repair/parts" },
    ],
  };
}
