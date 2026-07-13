import type { Metadata } from "next";
import { Pixelify_Sans, Share_Tech_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "./desktop.css";

const display = Pixelify_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: false,
});

const mono = Share_Tech_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  adjustFontFallback: false,
});

const reading = Source_Serif_4({
  variable: "--font-reading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Albert Mends",
  description:
    "Software engineer, founder of FuncStart, and educator building in AI, ML, and Blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${mono.variable} ${reading.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
