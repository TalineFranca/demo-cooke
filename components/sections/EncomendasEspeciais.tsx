import Image from "next/image";
import { sazonal } from "@/data/sazonal";
import { linkWhatsApp } from "@/lib/pedido";

/** banner sazonal: o conteúdo inteiro vem de data/sazonal.ts */
export function EncomendasEspeciais() {
  if (!sazonal.ativo) return null;
  const { cores } = sazonal;

  return (
    <section
      aria-labelledby="titulo-sazonal"
      className="relative px-4 py-16 md:px-10 md:py-20"
      style={{ background: cores.fundo, color: cores.texto }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-12 md:gap-12">
        <div className="relative aspect-[4/5] w-[70%] max-w-[340px] -rotate-2 md:col-span-4 md:w-full">
          <Image
            src={sazonal.foto}
            alt={sazonal.titulo}
            fill
            sizes="(max-width: 768px) 70vw, 340px"
            className="object-cover shadow-[8px_8px_0_currentColor]"
          />
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <p className="font-display text-sm uppercase tracking-wide">
            Encomendas especiais · {sazonal.chamada}
          </p>
          <h2 id="titulo-sazonal" className="mt-2 font-display text-4xl uppercase leading-[0.9] md:text-6xl">
            {sazonal.titulo}
          </h2>
          <p className="mt-4 max-w-[40ch] text-sm leading-snug">{sazonal.texto}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide">{sazonal.prazo}</p>
          <a
            href={linkWhatsApp(sazonal.mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block px-5 py-3 font-display text-lg uppercase leading-none transition-opacity hover:opacity-85"
            style={{ background: cores.texto, color: cores.fundo }}
          >
            {sazonal.cta} &gt;&gt;&gt;
          </a>
        </div>
      </div>
    </section>
  );
}
