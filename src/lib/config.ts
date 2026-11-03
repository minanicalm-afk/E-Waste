// ── EDIT THESE BEFORE GOING LIVE ────────────────────────────────────────────
export const site = {
  name: "Josachi",
  tagline: "We Buy Your Electronics. Cash, Fast.",
  location: "Juja, Kenya",
  address: "Josachi, Juja Town, Juja, Kiambu County, Kenya",
  // TODO: replace with your real WhatsApp number (country code + number, no + or spaces)
  whatsappNumber: "254712345678",
  phoneDisplay: "+254 712 345 678",
  email: "hello@josachi.co.ke",
  hours: "Mon – Sat: 8:30 AM – 6:30 PM · Sun: Closed",
};

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    message ?? `Hello ${site.name}! I have an electronic device I'd like to sell. Please assist me.`
  )}`;

export const formatKES = (n: number) =>
  "KSh " + Math.round(n).toLocaleString("en-KE");
