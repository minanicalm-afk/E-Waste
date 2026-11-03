import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell in bulk",
  description: "Companies and organisations can book a Josachi site visit. Bulk lots are inspected and priced on site.",
};

export default function BulkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
