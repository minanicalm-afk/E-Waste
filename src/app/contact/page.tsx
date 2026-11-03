"use client";
import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/config";

const inputCls = "w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/40";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", subject: "I want to sell a gadget", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", subject: form.subject, message: form.message, contact: { name: form.name, phone: form.phone } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reference) {
        setError("We couldn't send that just now. Use WhatsApp or call the shop.");
        setLoading(false);
        return;
      }
      setReference(data.reference);
      setSent(true);
    } catch {
      setError("We couldn't send that just now. Use WhatsApp or call the shop.");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-black">Contact Us</h1>
      <p className="mt-1 text-muted">Questions about selling, a price, or a bulk visit? Reach us any way you like.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          {([
            [MapPin, "Visit Our Shop", site.address],
            [Phone, "Call / WhatsApp", site.phoneDisplay, `tel:+${site.whatsappNumber}`],
            [Mail, "Email Us", site.email, `mailto:${site.email}`],
            [Clock, "Opening Hours", site.hours],
          ] as const).map(([Icon, t, d, href]) => (
            <div key={t} className="flex gap-3 rounded-2xl border border-line bg-card p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-brand"><Icon size={18} /></span><div><div className="font-bold">{t}</div>{href ? <a href={href} className="text-sm text-muted hover:text-txt">{d}</a> : <div className="text-sm text-muted">{d}</div>}</div></div>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-[#25D366] p-5 text-center font-black text-white hover:opacity-90">💬 Chat Instantly on WhatsApp</a>
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe title="Josachi location — Juja, Kenya" src="https://www.google.com/maps?q=Juja,+Kiambu,+Kenya&output=embed" className="h-56 w-full" loading="lazy" />
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-card p-6 md:col-span-3">
          {sent ? <div className="py-16 text-center"><CheckCircle2 size={52} className="mx-auto text-emerald-600" /><h2 className="mt-4 text-2xl font-black">Message received</h2><p className="mt-2 text-muted">Thank you, {form.name.split(" ")[0]}. Your reference is <span className="font-mono font-bold text-brand">{reference}</span>. We&apos;ll reply on {form.phone}.</p></div> : (
            <form onSubmit={onSubmit}>
              <h2 className="font-bold text-lg">Send us a message</h2>
              {error && <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold">Your name *</label><input id="contact-name" required autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Full name" /></div>
                <div><label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold">Phone / WhatsApp *</label><input id="contact-phone" required type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="07XX XXX XXX" /></div>
              </div>
              <div className="mt-4"><label htmlFor="contact-subject" className="mb-1.5 block text-sm font-semibold">Subject</label><select id="contact-subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={inputCls}>{["I want to sell a gadget", "Bulk / company selling", "Question about my estimate", "Where is your shop?", "Other"].map(s => <option key={s}>{s}</option>)}</select></div>
              <div className="mt-4"><label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold">Message *</label><textarea id="contact-message" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={inputCls} placeholder="Tell us what you have or what you'd like to know…" /></div>
              <button disabled={loading} className="mt-5 w-full rounded-full bg-brand py-3.5 font-black text-white hover:bg-brand2 disabled:opacity-50">{loading ? "Sending…" : "Send Message →"}</button>
              <p className="mt-3 text-center text-xs text-muted">For the fastest reply, use the WhatsApp button — we usually respond within minutes during opening hours.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
