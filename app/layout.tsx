import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baymori | Websites & Ongoing Care for Service Businesses",
  description: "Websites and ongoing care for service businesses that depend on inquiries and bookings. Keep your existing platform or start with a new website.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
