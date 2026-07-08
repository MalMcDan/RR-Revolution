import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RR Road Rider",
  description: "Curated scheduled motorcycle rides and rider experiences in Hampton Roads, Virginia."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
