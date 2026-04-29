import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  src: "../assets/fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-geist",
  weight: "100 900",
});

const gambarino = localFont({
  src: "../assets/fonts/Gambarino-Regular.otf",
  variable: "--font-gambarino",
  weight: "400",
});

const anton = localFont({
  src: "../assets/fonts/Anton-Regular.otf",
  variable: "--font-anton",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://juliettemarounek.com",
  ),
  title: "JULIETTEMAROUNEK",
  description: "Portfolio of JULIETTEMAROUNEK, director and art director.",
  openGraph: {
    title: "JULIETTEMAROUNEK",
    description: "Director and art director portfolio.",
    siteName: "JULIETTEMAROUNEK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${gambarino.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
