// src/app/layout.tsx
import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Africa Impact Studio | L'innovation au service de la formation en Afrique",
    template: "%s | Africa Impact Studio"
  },
  description: "Transformer durablement l'éducation et la formation en Afrique grâce à l'animation interactive, l'intelligence artificielle et la cybersécurité.",
  metadataBase: new URL("https://africaimpact.studio"),
  keywords: ["EdTech", "Afrique", "Formation", "Intelligence Artificielle", "Cybersécurité", "Animation 3D", "Éducation"],
  openGraph: {
    title: "Africa Impact Studio",
    description: "L'innovation au service de la formation en Afrique",
    url: "https://africaimpact.studio",
    siteName: "Africa Impact Studio",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Africa Impact Studio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Impact Studio",
    description: "L'innovation au service de la formation en Afrique",
    images: ["/assets/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${outfit.variable} ${plusJakartaSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
