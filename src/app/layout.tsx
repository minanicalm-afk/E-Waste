import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/lib/config";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${site.name} — We Buy Used & Faulty Electronics in Juja, Kenya`,
    template: `%s — ${site.name}`,
  },
  description: "Sell your laptop, phone, monitor and other electronics to Josachi in Juja. Instant price estimate at 20–30% of market value. Companies: bulk buying and site visits.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="green" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink text-txt">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
