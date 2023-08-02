import "./globals.css";
import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";

const inter = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"] });
const ibm = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Poetic Light & Dark mode reader",
  description: "by seungmee lee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
