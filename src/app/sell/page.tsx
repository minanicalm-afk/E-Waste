"use client";
import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, ReceiptText, X } from "lucide-react";
import { CATEGORIES, CONDITIONS, AGES, calculateQuote, type CategoryId, type Quote } from "@/lib/pricing";
import { formatKES, site, whatsappLink } from "@/lib/config";

const inputCls = "w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm outline-none focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/40";
const labelCls = "mb-1.5 block text-sm font-semibold text-txt";

function SellForm() {
  const params = useSearchParams();
  const initial = (params.get("cat") as CategoryId) || "laptop";
  const start = CATEGORIES.find(c => c.id === initial) ?? CATEGORIES[0];
  const [step, setStep] = useState(params.get("cat") ? 2 : 1);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState<CategoryId>(start.id);
  const [brand, setBrand] = useState(start.brands[0]);
  const [model, setModel] = useState("");
  const [spec, setSpec] = useState("");
  const [condition, setCondition] = useState<string>("good");
  const [working, setWorking] = useState(true);
  const [age, setAge] = useState<string>("1-2");
  const [asking, setAsking] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [receipt, setReceipt] = useState<string>("");
  const [hasReceipt, setHasReceipt] = useState("yes");
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [town, setTown] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const imgRef = useRef<HTMLInputElement>(null); const recRef = useRef<HTMLInputElement>(null);

  const cat = useMemo(() => CATEGORIES.find(c => c.id === category)!, [category]);
  const filtered = CATEGORIES.filter(c => (c.label + c.blurb).toLowerCase().includes(filter.toLowerCase()));

  function onImages(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).slice(0, 5 - images.length).map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
    setImages(p => [...p, ...next]);
  }

  function removeImage(index: number) {
    setImages(prev => {
      const gone = prev[index];
      if (gone) URL.revokeObjectURL(gone.url);
      return prev.filter((_, j) => j !== index);
    });
  }

  async function getQuote() {
    setError("");
    if (!model.trim()) return setError("Please enter the model (e.g. EliteBook 840 G5, iPhone 11).");
    setLoading(true);
    try {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, brand, condition, age, working }) });
      const data = await res.json();
      setQuote(data.quote ?? calculateQuote({ category, brand, condition, age, working }));
    } catch { setQuote(calculateQuote({ category, brand, condition, age, working })); }
    setLoading(false); setStep(5);
  }

  async function acceptPrice() {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "individual", category, brand, model, spec, condition, working, age, askingPrice: asking, notes, hasReceipt, images: images.map(i => i.name), receiptFile: receipt, quote, contact: { name, phone, email, town } }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reference) {
        setError("We couldn't save that just now. Try again, or message us on WhatsApp.");
        setLoading(false);
        return;
      }
      setReference(data.reference);
      try { const old = JSON.parse(localStorage.getItem("josachi-submissions") ?? "[]"); old.push({ ref: data.reference, category, brand, model, phone, quote, at: new Date().toISOString() }); localStorage.setItem("josachi-submissions", JSON.stringify(old)); } catch {}
      setStep(6);
    } catch {
      setError("We couldn't save that just now. Try again, or message us on WhatsApp.");
    }
    setLoading(false);
  }

  const waMsg = `Hello ${site.name}! I just got an estimate${reference ? ` (Ref: ${reference})` : ""} for my ${brand} ${model || cat.label} — ${quote ? formatKES(quote.low) + " – " + formatKES(quote.high) : ""}. I'd like to proceed.`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black">Sell your gadget</h1>
      <p className="mt-1 text-muted">No account needed. Get an instant estimate, accept it, then bring the item to our Juja shop.</p>

      {/* Progress */}
      <ol className="mt-8 flex items-center gap-1" aria-label="Selling steps">
        {["Gadget", "Details", "Photos", "Your Info", "Price"].map((s, i) => {
          const n = i + 1; const active = step >= n && step < 6;
          return <li key={s} aria-current={step === n ? "step" : undefined} className="flex flex-1 items-center gap-1"><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black ${step > n || step === 6 ? "bg-brand2 text-white" : active ? "bg-brand text-white" : "bg-panel text-muted"}`}>{step > n || step === 6 ? "✓" : n}</div><span className="hidden text-xs font-medium text-muted sm:block">{s}</span><div className="h-px flex-1 bg-line" /></li>;
        })}
      </ol>

      {error && <div role="alert" className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 rounded-3xl border border-line bg-card p-6">
        {step === 1 && (
          <div>
            <h2 className="font-bold text-lg">1. What are you selling?</h2>
            <label htmlFor="gadget-search" className="sr-only">Search gadgets</label>
            <input id="gadget-search" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search gadgets… e.g. laptop" className={`${inputCls} mt-4`} />
            <div className="mt-3 flex flex-wrap gap-2">{CATEGORIES.map(c => <button key={c.id} onClick={() => { setCategory(c.id); setBrand(c.brands[0]); }} className={`rounded-full px-3 py-1.5 text-xs font-bold ${category === c.id ? "bg-brand text-white" : "bg-panel text-muted"}`}>{c.label}</button>)}</div>
            {filtered.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-line bg-panel px-4 py-6 text-sm text-muted">No gadgets match “{filter}”. Try laptop, phone, or TV.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filtered.map(c => (
                  <button type="button" key={c.id} aria-pressed={category === c.id} onClick={() => { setCategory(c.id); setBrand(c.brands[0]); }} className={`overflow-hidden rounded-2xl border text-left ${category === c.id ? "border-brand bg-brand/10" : "border-line bg-panel hover:border-slate-500"}`}>
                    <div className="relative aspect-[4/3] bg-white">
                      <Image src={`/images/products/${c.id}.jpg`} alt="" fill sizes="(min-width: 640px) 30vw, 45vw" className="object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="font-bold">{c.label}</div>
                      <div className="text-xs text-muted">{c.blurb}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <button type="button" disabled={!filtered.some(c => c.id === category)} onClick={() => setStep(2)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-40">Continue with {cat.label} <ArrowRight size={16} /></button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-bold text-lg">2. Tell us about your {cat.label}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><label className={labelCls}>Brand *</label><select value={brand} onChange={e => setBrand(e.target.value)} className={inputCls}>{cat.brands.map(b => <option key={b}>{b}</option>)}</select></div>
              <div><label className={labelCls}>Model *</label><input value={model} onChange={e => setModel(e.target.value)} placeholder={category === "laptop" ? "e.g. EliteBook 840 G5" : category === "phone" ? "e.g. iPhone 11, Galaxy A54" : "e.g. Model name / number"} className={inputCls} /></div>
              <div><label className={labelCls}>{cat.specLabel}</label><input value={spec} onChange={e => setSpec(e.target.value)} placeholder="Optional but helps pricing" className={inputCls} /></div>
              <div><label className={labelCls}>How old is it?</label><select value={age} onChange={e => setAge(e.target.value)} className={inputCls}>{AGES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}</select></div>
            </div>
            <label className={`${labelCls} mt-5`}>Condition *</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {CONDITIONS.map(c => <button key={c.id} onClick={() => { setCondition(c.id); if (c.id === "dead" || c.id === "faulty") setWorking(c.id === "faulty" ? working : false); }} className={`rounded-xl border p-3 text-left ${condition === c.id ? "border-brand bg-brand/10" : "border-line bg-panel"}`}><div className="font-bold text-sm">{c.label}</div><div className="text-xs text-muted">{c.desc}</div></button>)}
            </div>
            <label className={`${labelCls} mt-5`}>Is it working / powering on?</label>
            <div className="flex gap-2">{[true, false].map(v => <button key={String(v)} onClick={() => setWorking(v)} className={`rounded-full px-5 py-2.5 font-bold text-sm ${working === v ? "bg-brand text-white" : "bg-panel text-muted"}`}>{v ? "✓ Yes, it works" : "✗ No, it doesn't"}</button>)}</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><label className={labelCls}>Your asking price (KSh) — optional</label><input type="number" min={0} value={asking} onChange={e => setAsking(e.target.value)} placeholder="e.g. 8000" className={inputCls} /></div>
              <div><label className={labelCls}>Anything else we should know?</label><input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. cracked screen, no charger" className={inputCls} /></div>
            </div>
            <div className="mt-6 flex justify-between"><button onClick={() => setStep(1)} className="inline-flex items-center gap-1 rounded-full bg-panel px-5 py-3 font-bold"><ArrowLeft size={16} /> Back</button><button onClick={() => { if (!model.trim()) return setError("Please enter the model."); setError(""); setStep(3); }} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white">Continue <ArrowRight size={16} /></button></div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-bold text-lg">3. Photos & proof of ownership</h2>
            <p className="text-sm text-muted">Clear photos help us confirm your price faster. A receipt protects both of us.</p>
            <label className={labelCls + " mt-5"}>Photos of the item (up to 5)</label>
            <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={e => onImages(e.target.files)} />
            <button onClick={() => imgRef.current?.click()} className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-line py-8 text-muted hover:border-brand"><ImagePlus size={28} className="text-brand" /><span className="mt-2 text-sm font-semibold">Tap to upload photos</span><span className="text-xs">Front, back, screen on/off if possible</span></button>
            {images.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{images.map((im, i) => <div key={im.url} className="relative"><img src={im.url} alt={im.name} className="h-20 w-20 rounded-xl object-cover" /><button type="button" aria-label={`Remove ${im.name}`} onClick={() => removeImage(i)} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white"><X size={12} /></button></div>)}</div>}
            <label className={labelCls + " mt-6"}>Do you have a receipt / proof of ownership?</label>
            <div className="flex gap-2">{[["yes", "Yes, I have it"], ["no", "No receipt"], ["other", "Other proof (box, etc.)"]].map(([v, l]) => <button key={v} onClick={() => setHasReceipt(v)} className={`rounded-full px-4 py-2 text-sm font-bold ${hasReceipt === v ? "bg-brand text-white" : "bg-panel text-muted"}`}>{l}</button>)}</div>
            {hasReceipt !== "no" && <>
              <input ref={recRef} type="file" accept="image/*,.pdf" hidden onChange={e => setReceipt(e.target.files?.[0]?.name ?? "")} />
              <button onClick={() => recRef.current?.click()} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-3 text-sm font-semibold"><ReceiptText size={16} className="text-brand" /> {receipt ? `✓ ${receipt}` : "Upload receipt / proof"}</button>
            </>}
            {hasReceipt === "no" && <p className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-xs text-amber-700">No problem — bring your National ID when you visit. We may ask extra verification questions for items without receipts.</p>}
            <div className="mt-6 flex justify-between"><button onClick={() => setStep(2)} className="inline-flex items-center gap-1 rounded-full bg-panel px-5 py-3 font-bold"><ArrowLeft size={16} /> Back</button><button onClick={() => setStep(4)} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-bold text-white">Continue <ArrowRight size={16} /></button></div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-bold text-lg">4. How do we reach you?</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><label className={labelCls}>Full name *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jane Wanjiku" className={inputCls} /></div>
              <div><label className={labelCls} htmlFor="seller-phone">Phone / WhatsApp *</label><input id="seller-phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712 345 678" className={inputCls} /></div>
              <div><label className={labelCls}>Email (optional)</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} /></div>
              <div><label className={labelCls}>Your town / estate</label><input value={town} onChange={e => setTown(e.target.value)} placeholder="e.g. Juja, Ruiru, Thika, Nairobi" className={inputCls} /></div>
            </div>
            <div className="mt-6 flex justify-between"><button onClick={() => setStep(3)} className="inline-flex items-center gap-1 rounded-full bg-panel px-5 py-3 font-bold"><ArrowLeft size={16} /> Back</button>
              <button disabled={loading} onClick={() => { if (!name.trim() || !phone.trim()) return setError("Please enter your name and phone number so we can contact you."); setError(""); getQuote(); }} className="inline-flex items-center gap-2 rounded-full bg-brand hover:bg-brand2 px-6 py-3 font-black text-white disabled:opacity-50">{loading ? "Calculating…" : "💰 Get My Instant Price"}</button></div>
          </div>
        )}

        {step === 5 && quote && (
          <div className="text-center">
            <div className="text-sm font-bold uppercase tracking-wider text-brand">Your instant estimate</div>
            <div className="mt-2 text-sm text-muted">{brand} {model} · {cat.label}</div>
            <div className="mt-4 text-4xl font-black md:text-5xl">{formatKES(quote.low)} <span className="text-faint">–</span> {formatKES(quote.high)}</div>
            <div className="mt-2 text-sm text-muted">Estimated market value: <strong className="text-txt">{formatKES(quote.marketEstimate)}</strong> · We pay {quote.rateLabel}</div>
            {asking && Number(asking) > 0 && <div className="mx-auto mt-4 max-w-md rounded-xl bg-panel px-4 py-3 text-sm">You asked for <strong>{formatKES(Number(asking))}</strong> — {Number(asking) <= quote.high ? <span className="text-emerald-700">that&apos;s within our range! Likely to be accepted on inspection. ✅</span> : <span className="text-amber-700">that&apos;s above our range. You can still accept our estimate or talk to us on WhatsApp.</span>}</div>}
            <div className="mx-auto mt-5 max-w-md rounded-2xl border border-line bg-panel p-4 text-left"><div className="text-xs font-bold uppercase text-muted">How we calculated this</div>{quote.breakdown.map(b => <div key={b.label} className="mt-2 flex justify-between text-sm"><span className="text-muted">{b.label}</span><span className="font-semibold">{b.value}</span></div>)}</div>
            <p className="mx-auto mt-4 max-w-md text-xs text-faint">Final price is confirmed after physical inspection at our Juja shop. If the item matches your description, we pay within this range.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button disabled={loading} onClick={acceptPrice} className="rounded-full bg-emerald-600 px-7 py-3.5 font-black text-white hover:bg-emerald-500 disabled:opacity-50">{loading ? "Submitting…" : "✓ I Accept — Sell It"}</button>
              <a href={whatsappLink(waMsg)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3.5 font-bold text-white">Discuss on WhatsApp</a>
              <button onClick={() => setStep(2)} className="rounded-full bg-panel px-6 py-3.5 font-bold">Edit Details</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center">
            <CheckCircle2 size={56} className="mx-auto text-emerald-600" />
            <h2 className="mt-4 text-2xl font-black">You&apos;re booked in!</h2>
            <p className="mt-2 text-muted">Reference: <span className="rounded-lg bg-panel px-3 py-1 font-mono font-bold text-brand">{reference}</span></p>
            <div className="mx-auto mt-6 max-w-md space-y-3 text-left">
              {[["1", "We will contact you", `We'll call/WhatsApp ${phone || "you"} shortly to confirm a time.`], ["2", "Bring your item to Josachi, Juja", `${site.address}. Bring your ID ${hasReceipt === "no" ? "(required — no receipt)" : "and your receipt/proof of ownership"}.`], ["3", "Inspection & payment", "We verify the item matches your description, confirm the final price in your estimate range, and pay you."]].map(([n, t, d]) => (
                <div key={n} className="flex gap-3 rounded-2xl border border-line bg-panel p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-black text-white">{n}</span><div><div className="font-bold">{t}</div><div className="text-sm text-muted">{d}</div></div></div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={whatsappLink(waMsg)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 font-bold text-white">Confirm Faster on WhatsApp</a>
              <Link href="/sell" className="rounded-full bg-panel px-6 py-3 font-bold">Sell Another Item</Link>
              <Link href="/" className="rounded-full bg-panel px-6 py-3 font-bold">Back Home</Link>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-faint">Prefer to talk first? <a className="font-bold text-brand" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> or visit us in {site.location}.</p>
    </div>
  );
}

export default function SellPage() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted">Loading…</div>}><SellForm /></Suspense>;
}
