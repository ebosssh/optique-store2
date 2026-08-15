import type { Metadata } from "next";
import { Nunito, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const sans = Nunito({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "OptikaZir — окуляри, контактні лінзи та аксесуари",
  description:
    "Інтернет-магазин оптики OptikaZir: оправи для зору, сонцезахисні окуляри, контактні лінзи, аксесуари та запис на прийом до лікаря-офтальмолога.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`${sans.variable} ${display.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
