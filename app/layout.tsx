import type { Metadata, Viewport } from "next";
import { Anton, DM_Sans, Fredoka } from "next/font/google";
import type { ReactNode } from "react";
import { Provedores } from "@/components/ui/Provedores";
import { marca } from "@/data/marca";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const fredoka = Fredoka({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-fredoka", display: "swap" });

const descricao = `${marca.bio}. Cookies artesanais, grandes e recheados, feitos à mão em ${marca.cidade}-${marca.estado}. Monte sua caixa e peça pelo WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(marca.siteUrl),
  title: {
    default: `Cookê · Cookies artesanais em ${marca.cidade}-${marca.estado}`,
    template: "%s · Cookê",
  },
  description: descricao,
  keywords: ["cookie", "cookies artesanais", "Carapicuíba", "cookie recheado", "doces", "Cookê", "cooke.time"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Cookê",
    title: "Cookê · Se for para adoçar o dia, que seja com Cookê",
    description: descricao,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookê · Cookies artesanais",
    description: descricao,
  },
};

export const viewport: Viewport = {
  themeColor: "#1A0FB5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${dmSans.variable} ${fredoka.variable}`}>
      <body>
        <a
          href="#cardapio"
          className="sr-only z-[100] bg-bebe px-4 py-2 font-display uppercase text-royal focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Pular para o cardápio
        </a>
        <Provedores>{children}</Provedores>
        <div className="grao" aria-hidden="true" />
      </body>
    </html>
  );
}
