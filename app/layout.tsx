import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

// Plus Jakarta Sans — matches Artlist.io's clean, modern geometric aesthetic
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// DM Serif Display — bold, high-contrast display serif matching the Canela editorial feel
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lentera Cinema — Cinematic Memories",
  description:
    "Vendor kreatif untuk Yearbook Sekolah, Wedding, Foto & Video Wisuda di Indonesia.",
  keywords: "yearbook, wedding organizer, foto wisuda, video wisuda, lentera cinema",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${dmSerifDisplay.variable}`}>
      <body>{children}</body>
    </html>
  );
}

