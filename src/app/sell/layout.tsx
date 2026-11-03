import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell your gadget",
  description: "Get an instant Josachi estimate for a laptop, phone, monitor or other electronics, then drop it at the Juja shop.",
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
