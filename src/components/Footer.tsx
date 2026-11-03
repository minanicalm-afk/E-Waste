import Link from "next/link";
import { Zap, MapPin, Phone, Mail, Clock } from "lucide-react";
import { site } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-black"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white"><Zap size={16} fill="currentColor" /></span>{site.name}.</div>
          <p className="mt-3 text-sm text-muted">We buy used, faulty, surplus and unwanted electronics in Juja & across Kenya. Fair instant estimates, cash on inspection.</p>
        </div>
        <div><h4 className="font-bold">Sell</h4><ul className="mt-3 space-y-2 text-sm text-muted"><li><Link href="/sell" className="hover:text-txt">Sell as an Individual</Link></li><li><Link href="/bulk" className="hover:text-txt">Sell in Bulk (Companies)</Link></li><li><Link href="/sell" className="hover:text-txt">Price Calculator</Link></li></ul></div>
        <div><h4 className="font-bold">Company</h4><ul className="mt-3 space-y-2 text-sm text-muted"><li><Link href="/" className="hover:text-txt">Home</Link></li><li><Link href="/contact" className="hover:text-txt">Contact Us</Link></li><li><Link href="/#how" className="hover:text-txt">How It Works</Link></li><li><Link href="/#categories" className="hover:text-txt">What We Buy</Link></li></ul></div>
        <div><h4 className="font-bold">Visit Us</h4><ul className="mt-3 space-y-2 text-sm text-muted"><li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-brand" />{site.address}</li><li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-brand" /><a href={`tel:+${site.whatsappNumber}`} className="hover:text-txt">{site.phoneDisplay}</a></li><li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-brand" /><a href={`mailto:${site.email}`} className="hover:text-txt">{site.email}</a></li><li className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-brand" />{site.hours}</li></ul></div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-faint">© 2026 {site.name}, Juja, Kenya. All rights reserved. Final price confirmed after physical inspection.</div>
    </footer>
  );
}
