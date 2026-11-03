import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-24">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">404</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">That page is not on this site.</h1>
      <p className="mt-3 text-muted">The link may be old. You can start a valuation, ask about a company lot, or go back home.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand2">Home</Link>
        <Link href="/sell" className="rounded-full border border-line bg-card px-6 py-3 text-sm font-bold hover:bg-panel">Sell a gadget</Link>
        <Link href="/contact" className="rounded-full border border-line bg-card px-6 py-3 text-sm font-bold hover:bg-panel">Contact</Link>
      </div>
    </div>
  );
}
