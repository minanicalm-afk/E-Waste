"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/config";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const links = [
  { href: "/", label: "Home" },
  { href: "/sell", label: "Sell Your Gadget" },
  { href: "/bulk", label: "For Companies" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="Josachi home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white"><Zap size={20} fill="currentColor" /></span>
          <span className="text-xl font-black tracking-tight">{site.name}<span className="text-brand">.</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined} className={`rounded-full px-3 py-2 text-sm font-medium lg:px-4 ${path === l.href ? "bg-brand text-white" : "text-muted hover:bg-panel hover:text-txt"}`}>{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/sell" className="hidden items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand2 md:inline-flex">
            <WhatsAppIcon /> Get Instant Price →
          </Link>
          <button type="button" onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-t border-line px-4 py-3 md:hidden">
          {links.map(l => <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined} className="block rounded-lg px-3 py-2.5 text-txt hover:bg-panel">{l.label}</Link>)}
          <Link href="/sell" className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-bold text-white"><WhatsAppIcon /> Get Instant Price</Link>
        </nav>
      )}
    </header>
  );
}
