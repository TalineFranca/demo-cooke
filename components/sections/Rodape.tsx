"use client";

import { useCallback, useRef, useState } from "react";
import { marca } from "@/data/marca";
import { linkWhatsApp } from "@/lib/pedido";
import { ChuvaDeCookies } from "../ui/ChuvaDeCookies";
import { Logo } from "../ui/Logo";

const CLIQUES = 5;

export function Rodape() {
  const [cliques, setCliques] = useState(0);
  const [chovendo, setChovendo] = useState(false);
  const zerar = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clicar = () => {
    clearTimeout(zerar.current);
    const n = cliques + 1;
    if (n >= CLIQUES) {
      setChovendo(true);
      setCliques(0);
      return;
    }
    setCliques(n);
    zerar.current = setTimeout(() => setCliques(0), 1800);
  };

  const parar = useCallback(() => setChovendo(false), []);

  const infos = [
    { rotulo: "Instagram", valor: `@${marca.instagram}`, href: marca.instagramUrl },
    { rotulo: "WhatsApp", valor: marca.whatsappExibicao, href: linkWhatsApp("Oi, Cookê!") },
    { rotulo: "Onde", valor: `${marca.cidade} – ${marca.estado}. Retirada e entrega na região.` },
    { rotulo: "Quando", valor: marca.horario },
  ];

  return (
    <footer className="relative px-4 pb-6 pt-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-t border-white/20 pt-10 md:grid-cols-12">
          <div className="relative md:col-span-4">
            <button type="button" onClick={clicar} aria-label="Logo da Cookê" className="leading-none">
              <Logo className="text-5xl" />
            </button>
            {cliques >= 2 && (
              <span
                aria-live="polite"
                className="absolute left-36 top-0 rotate-6 bg-bebe px-2 py-0.5 font-display text-xs uppercase text-royal"
              >
                mais {CLIQUES - cliques}…
              </span>
            )}
            <p className="mt-3 max-w-[28ch] text-sm leading-snug text-white/70">{marca.bio}.</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:col-span-8 md:grid-cols-4">
            {infos.map((info) => (
              <div key={info.rotulo}>
                <dt className="font-display text-xs uppercase tracking-wide text-bebe">{info.rotulo}</dt>
                <dd className="mt-1 text-sm leading-snug">
                  {info.href ? (
                    <a href={info.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      {info.valor}
                    </a>
                  ) : (
                    info.valor
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-12 text-xs text-white/50">© {new Date().getFullYear()} Cookê · cookies artesanais</p>
      </div>

      {chovendo && <ChuvaDeCookies onFim={parar} />}
    </footer>
  );
}
