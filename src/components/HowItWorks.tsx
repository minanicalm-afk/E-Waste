import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, Building2, Calculator, ClipboardCheck, HandCoins, PackageSearch, PhoneCall, Search, User, type LucideIcon } from "lucide-react";

const INDIVIDUAL: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: Search, title: "Pick your gadget", copy: "Choose laptop, phone, monitor etc. and tap its card." },
  { icon: ClipboardCheck, title: "Describe it", copy: "Brand, model, condition, working or not, photos & receipt/proof of ownership." },
  { icon: Calculator, title: "Get instant estimate", copy: "Our calculator gives you 20–30% of its estimated market value, instantly." },
  { icon: Banknote, title: "Accept & get paid", copy: "Accept the price, we'll contact you to bring it to our Juja shop. Inspect → pay." },
];

const COMPANY: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: PackageSearch, title: "Tell us what you have", copy: "Brand, type, quantity, condition and your asking price — per item or as a lot." },
  { icon: PhoneCall, title: "We schedule a visit", copy: "Our team visits your premises to physically inspect the items." },
  { icon: BadgeCheck, title: "Negotiate & agree", copy: "We agree on a fair bulk price together, on site." },
  { icon: HandCoins, title: "Collection & payment", copy: "We collect the items and complete payment as agreed." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-y border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-black md:text-3xl">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-card p-6">
            <div className="flex items-center gap-2 text-lg font-black">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white"><User size={18} /></span>
              For Individuals
            </div>
            <ol className="mt-5 space-y-4">
              {INDIVIDUAL.map(({ icon: Icon, title, copy }, i) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-panel text-brand"><Icon size={16} /></span>
                  <div>
                    <div className="font-bold">{i + 1}. {title}</div>
                    <div className="text-sm text-muted">{copy}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/sell" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white hover:bg-brand2">Start Selling <ArrowRight size={16} /></Link>
          </div>
          <div className="rounded-3xl border border-accent/30 bg-gradient-to-b from-accent/10 to-card p-6">
            <div className="flex items-center gap-2 text-lg font-black">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-white"><Building2 size={18} /></span>
              For Companies & Organisations
            </div>
            <ol className="mt-5 space-y-4">
              {COMPANY.map(({ icon: Icon, title, copy }, i) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-panel text-accent"><Icon size={16} /></span>
                  <div>
                    <div className="font-bold">{i + 1}. {title}</div>
                    <div className="text-sm text-muted">{copy}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/bulk" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-bold text-white hover:opacity-90">Request a Bulk Visit <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
