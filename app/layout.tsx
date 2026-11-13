import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baymori | Websites, Hosting, SEO & Automation",
  description: "Baymori builds, hosts, and optimizes websites and connected digital systems for growing businesses.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
