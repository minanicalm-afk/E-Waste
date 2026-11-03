"use client";
import { useRef, useState } from "react";
import { Building2, CheckCircle2, FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/pricing";
import { site, whatsappLink } from "@/lib/config";

const inputCls = "w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40";
const labelCls = "mb-1.5 block text-sm font-semibold text-txt";

interface Row { category: string; brand: string; quantity: string; condition: string; asking: string; }
const emptyRow: Row = { category: "laptop", brand: "", quantity: "", condition: "Good / Working", asking: "" };

export default function BulkPage() {
  const [company, setCompany] = useState(""); const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState(""); const [email, setEmail] = useState("");
  const [location, setLocation] = useState(""); const [visitDate, setVisitDate] = useState("");
  const [notes, setNotes] = useState(""); const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Row[]>([{ ...emptyRow }]);
  const [reference, setReference] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const totalQty = rows.reduce((s, r) => s + (Number(r.quantity) || 0), 0);

  function updateRow(index: number, patch: Partial<Row>) {
    setRows(current => current.map((row, i) => i === index ? { ...row, ...patch } : row));
  }

  async function submit() {
    if (!company.trim() || !contactPerson.trim() || !phone.trim()) return setError("Please fill Company, Contact Person and Phone.");
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "bulk", company, contactPerson, items: rows, inventoryFile: fileName, visitDate, notes, contact: { name: contactPerson, phone, email, location } }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reference) {
        setError("We couldn't save that request. Try again, or message us on WhatsApp.");
        setLoading(false);
        return;
      }
      setReference(data.reference);
    } catch {
      setError("We couldn't save that request. Try again, or message us on WhatsApp.");
    }
    setLoading(false);
  }

  if (reference) return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 size={56} className="mx-auto text-emerald-600" />
      <h1 className="mt-4 text-3xl font-black">Request received!</h1>
      <p className="mt-2 text-muted">Reference: <span className="rounded-lg bg-panel px-3 py-1 font-mono font-bold text-accent">{reference}</span></p>
      <p className="mx-auto mt-4 max-w-md text-muted">Our team will contact <strong className="text-txt">{contactPerson}</strong> on <strong className="text-txt">{phone}</strong> to schedule a physical visit to <strong className="text-txt">{company}</strong>{visitDate ? <> around <strong className="text-txt">{visitDate}</strong></> : ""}. We&apos;ll inspect the {totalQty || ""} item(s), negotiate, and agree on price on site.</p>
      <div className="mt-6 flex justify-center gap-3"><a href={whatsappLink(`Hello ${site.name}! I submitted a bulk selling request (Ref: ${reference}) for ${company}. Please schedule our visit.`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 font-bold text-white">Follow Up on WhatsApp</a></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent"><Building2 size={13} /> For Companies & Organisations</span>
      <h1 className="mt-4 text-3xl font-black">Sell in bulk — we come to you</h1>
      <p className="mt-2 text-muted">Offices, schools, NGOs, SACCOs, cyber cafés & institutions: tell us what you have and we&apos;ll visit your premises, inspect, negotiate and collect.</p>
      {error && <div role="alert" className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 space-y-6 rounded-3xl border border-line bg-card p-6">
        <div><h2 className="font-bold">Company details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>Company / Organisation *</label><input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. XYZ Ltd, ABC School" className={inputCls} /></div>
            <div><label className={labelCls}>Contact person *</label><input value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Full name & role" className={inputCls} /></div>
            <div><label className={labelCls}>Phone / WhatsApp *</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XX XXX XXX" className={inputCls} /></div>
            <div><label className={labelCls}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="company@email.com" className={inputCls} /></div>
            <div><label className={labelCls}>Company location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Town, building, street" className={inputCls} /></div>
            <div><label className={labelCls}>Preferred visit date</label><input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} className={inputCls} /></div>
          </div>
        </div>

        <div><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold">Items you&apos;re selling {totalQty > 0 && <span className="text-sm font-semibold text-accent">· {totalQty} total items</span>}</h2><button type="button" onClick={() => setRows([...rows, { ...emptyRow }])} className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-bold text-white"><Plus size={14} /> Add Item Type</button></div>
          <div className="mt-4 space-y-3">
            {rows.map((r, i) => (
              <div key={i} className="grid gap-2 rounded-2xl border border-line bg-panel p-3 sm:grid-cols-[1fr_1fr_5rem_1fr_1fr_auto]">
                <select aria-label={`Category for item ${i + 1}`} value={r.category} onChange={e => updateRow(i, { category: e.target.value })} className={inputCls}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
                <input aria-label={`Brand for item ${i + 1}`} value={r.brand} onChange={e => updateRow(i, { brand: e.target.value })} placeholder="Brand / model" className={inputCls} />
                <input aria-label={`Quantity for item ${i + 1}`} type="number" min={1} value={r.quantity} onChange={e => updateRow(i, { quantity: e.target.value })} placeholder="Qty" className={inputCls} />
                <select aria-label={`Condition for item ${i + 1}`} value={r.condition} onChange={e => updateRow(i, { condition: e.target.value })} className={inputCls}>{["Like New", "Good / Working", "Fair", "Faulty", "Not Working", "Mixed"].map(c => <option key={c}>{c}</option>)}</select>
                <input aria-label={`Asking price for item ${i + 1}`} type="number" min={0} value={r.asking} onChange={e => updateRow(i, { asking: e.target.value })} placeholder="Asking KSh / unit" className={inputCls} />
                <button type="button" aria-label={`Remove item ${i + 1}`} onClick={() => setRows(rows.filter((_, j) => j !== i))} disabled={rows.length === 1} className="grid h-10 w-10 place-items-center rounded-xl bg-white text-red-700 disabled:opacity-30"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.pdf" hidden onChange={e => setFileName(e.target.files?.[0]?.name ?? "")} />
          <button type="button" onClick={() => fileRef.current?.click()} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-line px-4 py-3 text-sm font-semibold text-muted hover:border-accent"><FileSpreadsheet size={16} className="text-accent" /> {fileName ? `Attached: ${fileName}` : "Optional: upload inventory list (Excel / CSV / PDF)"}</button>
        </div>

        <div><label className={labelCls}>Notes for our visit team</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Access instructions, parking, best contact hours, disposal certificates needed, etc." className={inputCls} /></div>

        <button disabled={loading} onClick={submit} className="w-full rounded-full bg-brand py-4 font-black text-white hover:bg-brand2 disabled:opacity-50">{loading ? "Submitting…" : "Request a Site Visit →"}</button>
        <p className="text-center text-xs text-muted">No instant price for bulk — we inspect physically and negotiate with you on site.</p>
      </div>
    </div>
  );
}
