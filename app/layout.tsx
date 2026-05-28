import type { Metadata } from "next";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}
export const metadata: Metadata = {
  title: "Kernel — Boutiques en ligne",
  description: "Créez votre boutique en ligne en quelques minutes",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
