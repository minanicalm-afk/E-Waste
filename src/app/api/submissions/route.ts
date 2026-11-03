import { NextRequest, NextResponse } from "next/server";

// NOTE: No database yet — submissions are validated and a reference is issued.
// Before launch, persist these to a DB (e.g. Supabase / Postgres) and/or
// forward them to email/WhatsApp. See README "Going Live" section.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.type || !body?.contact?.phone) {
    return NextResponse.json({ error: "type and contact phone are required" }, { status: 400 });
  }
  const prefix = body.type === "bulk" ? "JOS-BULK" : "JOS";
  const reference = `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  console.log("[Josachi submission]", reference, JSON.stringify(body).slice(0, 2000));
  return NextResponse.json({ ok: true, reference });
}
