import { Cardapio } from "@/components/sections/Cardapio";
import { ComoPedir } from "@/components/sections/ComoPedir";
import { EncomendasEspeciais } from "@/components/sections/EncomendasEspeciais";
import { FeitoAMao } from "@/components/sections/FeitoAMao";
import { Hero } from "@/components/sections/Hero";
import { MonteSuaCaixa } from "@/components/sections/MonteSuaCaixa";
import { QuemJaProvou } from "@/components/sections/QuemJaProvou";
import { Rodape } from "@/components/sections/Rodape";
import { BotaoWhatsApp } from "@/components/ui/BotaoWhatsApp";
import { Cabecalho } from "@/components/ui/Cabecalho";
import { Sacola } from "@/components/ui/Sacola";
import { cardapio } from "@/data/cardapio";
import { marca } from "@/data/marca";

const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Cookê",
  description: `${marca.bio}. ${marca.subtitulo}.`,
  url: marca.siteUrl,
  telephone: `+${marca.whatsapp}`,
  sameAs: [marca.instagramUrl],
  address: {
    "@type": "PostalAddress",
    addressLocality: marca.cidade,
    addressRegion: marca.estado,
    addressCountry: "BR",
  },
  servesCuisine: "Cookies artesanais",
  hasMenu: {
    "@type": "Menu",
    hasMenuItem: cardapio.map((c) => ({
      "@type": "MenuItem",
      name: c.nome,
      description: c.descricao,
      offers: { "@type": "Offer", price: c.preco.toFixed(2), priceCurrency: "BRL" },
    })),
  },
};

export default function Inicio() {
  return (
    <>
      <Cabecalho />
      <main>
        <Hero />
        <Cardapio />
        <MonteSuaCaixa />
        <FeitoAMao />
        <ComoPedir />
        <QuemJaProvou />
        <EncomendasEspeciais />
      </main>
      <Rodape />
      <Sacola />
      <BotaoWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />
    </>
  );
}
