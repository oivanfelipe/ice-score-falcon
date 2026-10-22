import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ICE Score | Falcon",
  description: "Mapeamento e priorização de hipóteses por cliente — Squad Falcon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
