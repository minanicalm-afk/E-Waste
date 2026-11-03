import Link from "next/link";
import Image from "next/image";
import { Building2, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/lib/pricing";
import { site, whatsappLink } from "@/lib/config";
import HowItWorks from "@/components/HowItWorks";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const PRODUCT_IMG: Record<CategoryId, string> = {
  laptop: "/images/products/laptop.jpg",
  phone: "/images/products/phone.jpg",
  monitor: "/images/products/monitor.jpg",
  tablet: "/images/products/tablet.jpg",
  desktop: "/images/products/desktop.jpg",
  tv: "/images/products/tv.jpg",
  console: "/images/products/console.jpg",
  printer: "/images/products/printer.jpg",
};

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden">
        <Image
          src="/images/josachi-hero-counter-v2.jpg"
          alt="A client handing a laptop over the Josachi counter while a staff member pays cash"
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/15" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-6xl items-center px-4 py-16 md:py-24">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/80">{site.location} · electronics buyback</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-md md:text-6xl">
              We buy the gadgets gathering dust at home.
            </h1>
            <p className="mt-5 text-lg text-white/85">
              Instant valuation for laptops, phones, monitors and more. Accept the price, walk into our Juja shop, get cash or M-Pesa after inspection.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sell" className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 hover:bg-brand2">
                <WhatsAppIcon /> Get instant price
              </Link>
              <Link href="/bulk" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur hover:bg-white/25">
                <Building2 size={18} /> Company / bulk
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-white" /> No account needed</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={16} className="text-white" /> National ID required</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={16} className="text-white" /> Juja Town branch</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white py-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {[["20–30%", "of market value"], ["Same Day", "inspection & payment*"], ["Any Condition", "working · faulty · dead"]].map(([a, b]) => (
              <div key={b} className="rounded-2xl border border-line bg-panel/80 px-3 py-5 text-center">
                <div className="text-lg font-black text-brand md:text-2xl">{a}</div>
                <div className="text-[11px] text-muted md:text-xs">{b}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-faint">*Final price confirmed after physical inspection at our shop.</p>
        </div>
      </section>

      <section id="categories" className="bg-[#e8f4fb] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">What we buy</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Gadgets we cash out.</h2>
          <p className="mt-2 max-w-xl text-muted">Tap any card to start a valuation — working, faulty or dead.</p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map(c => (
              <Link
                key={c.id}
                href={`/sell?cat=${c.id}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] bg-panel">
                  <Image
                    src={PRODUCT_IMG[c.id]}
                    alt={c.label}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold group-hover:text-brand">{c.label}</h3>
                    <span className="rounded-full bg-panel px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand">Sell now</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{c.blurb}</p>
                  <p className="mt-3 text-sm font-semibold text-brand">Start valuation →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="bg-[#faf8ff] py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[["💰", "Fair, transparent pricing", "You see exactly how your estimate is calculated — 20–30% of market value based on brand, age and condition."], ["🔒", "Proof of ownership required", "We ask for a receipt or proof of ownership to keep trade safe and legitimate for everyone."], ["⚡", "Fast turnaround", "Instant online estimate, quick inspection in Juja, and payment once we confirm the item matches its description."]].map(([e, t, d]) => (
              <div key={t} className="rounded-2xl border border-line bg-card p-6">
                <div className="text-3xl">{e}</div>
                <h3 className="mt-3 font-bold">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl bg-gradient-to-r from-brand to-brand2 px-8 py-12 text-center text-white md:px-16">
            <h2 className="text-3xl font-black md:text-4xl">Got electronics gathering dust?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">Turn them into cash in Juja. Fair range, same-day inspection, WhatsApp if you&apos;d rather talk first.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/sell" className="rounded-full bg-white px-7 py-3 font-black text-brand">Calculate price</Link>
              <Link href="/contact" className="rounded-full border border-white/40 px-7 py-3 font-bold hover:bg-white/10">Contact us</Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/15 px-7 py-3 font-bold hover:bg-white/25">WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
