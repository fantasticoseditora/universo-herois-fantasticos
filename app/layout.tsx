import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Universo Heróis Fantásticos | 21 autores, um universo compartilhado",
  description:
    "Conheça Universo Heróis Fantásticos Vol. I: 21 autores e 21 histórias de super-heróis brasileiros em um mesmo universo compartilhado.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/uhf-logo-cutout.png",
    shortcut: "/images/uhf-logo-cutout.png",
    apple: "/images/uhf-logo-cutout.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
