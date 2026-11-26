import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baymori | Websites, Connected Systems & Managed Care",
  description: "Baymori designs websites, connects business tools, and provides managed hosting and ongoing website care for businesses and creators.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
