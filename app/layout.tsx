import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kernel — Boutiques en ligne",
  description: "Créez votre boutique en ligne en quelques minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
