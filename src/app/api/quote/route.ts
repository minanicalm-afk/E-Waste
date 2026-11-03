import { NextRequest, NextResponse } from "next/server";
import { calculateQuote, CATEGORIES, type CategoryId } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !CATEGORIES.some(c => c.id === body.category)) {
    return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
  }
  const quote = calculateQuote({
    category: body.category as CategoryId,
    brand: String(body.brand ?? "Other"),
    condition: String(body.condition ?? "good"),
    age: String(body.age ?? "1-2"),
    working: Boolean(body.working ?? true),
  });
  return NextResponse.json({ quote });
}
