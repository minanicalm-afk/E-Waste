import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, email or message Josachi in Juja about a gadget sale or a company visit.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
