# Josachi — We Buy Used & Faulty Electronics (Juja, Kenya)

Next.js website for **Josachi**, Juja. Individuals get an instant price estimate (20–30% of estimated market value) for laptops, phones, monitors & more. Companies submit bulk inventory and Josachi visits them to inspect & negotiate.

## Run locally
```bash
npm install
npm run dev   # http://localhost:3000
```

## Pages
| Route | Purpose |
|---|---|
| `/` | Home — categories, how it works (individuals vs companies), CTA |
| `/landing` | Alternate homepage — hero + phone mockup, stats, gadget carousel, 4-step timeline |
| `/sell` | Individual flow: pick gadget → details → photos/receipt → contact → **instant price calculator** → accept → reference + bring-to-shop instructions |
| `/bulk` | Companies: company details + item rows (type, brand, qty, condition, asking price) + optional Excel/CSV upload → site-visit request |
| `/contact` | Address (Juja), phone, email, hours, map, message form |
| Floating button | WhatsApp chat with a pre-filled message (bottom-right, every page) |
| Navbar 🎨 Theme button | Default is **Josachi Green** (the Stitch palette: `#00653d` / `#0d8050` with copper `#fe932c` for company accents). Optional extras: Slate Blue, Copper, Dusty Teal. Palettes live in `src/app/globals.css`. |

## ⚠️ Before going live — edit these
1. **WhatsApp & contacts** — `src/lib/config.ts`: replace `whatsappNumber` (`254712345678`), `phoneDisplay`, `email`, and the exact shop `address`.
2. **Prices** — `src/lib/pricing.ts`: `baseMarket` per category, brand/condition/age multipliers. These drive the 20–30% estimate. Tune them to your real Juja market prices.
3. **Submissions storage** — `/api/submissions` currently validates, logs, and issues a reference (also saved in the visitor's browser). Before launch, connect a database (Supabase/Postgres) and/or forward submissions to your email/WhatsApp so no lead is lost. Contact-form messages are currently demo-only (front-end confirmation).

## Deploy to Vercel
1. Push this folder to GitHub.
2. On [vercel.com](https://vercel.com) → New Project → import the repo → Deploy (no settings needed; Next.js is auto-detected).
3. Add your custom domain in Vercel → Settings → Domains if you have one.

## Assumptions made (change anytime)
- Guest flow — no account/login needed; name + phone only.
- Individuals **drop off** items at the Juja shop after accepting the estimate (no pickup option yet).
- Bulk = form rows + optional file upload; pricing done after physical visit & negotiation.
- Categories: Laptop, Phone, Monitor, Tablet, Desktop, TV, Game Console, Printer.
# E-Waste
