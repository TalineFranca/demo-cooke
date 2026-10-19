"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cardapio } from "@/data/cardapio";
import { useMenosMovimento } from "@/lib/hooks";
import { CookieArt } from "./CookieArt";

const criarGotas = () =>
  Array.from({ length: 42 }, (_, i) => ({
    i,
    esquerda: Math.random() * 100,
    tamanho: 44 + Math.random() * 96,
    duracao: 2 + Math.random() * 2.4,
    atraso: Math.random() * 1.8,
    giro: (Math.random() - 0.5) * 900,
    visual: cardapio[Math.floor(Math.random() * cardapio.length)].visual,
  }));

/** easter egg do rodapé */
export function ChuvaDeCookies({ onFim }: { onFim: () => void }) {
  const reduzido = useMenosMovimento();
  const [gotas] = useState(criarGotas);

  useEffect(() => {
    const t = setTimeout(onFim, reduzido ? 3000 : 5600);
    return () => clearTimeout(t);
  }, [onFim, reduzido]);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" role="status">
      {reduzido ? (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-bebe px-4 py-2 text-center font-display uppercase text-royal">
          Ia chover cookie aqui. Mas você pediu menos movimento, então: imagina.
        </p>
      ) : (
        <>
          <span className="sr-only">Choveu cookie.</span>
          {gotas.map((g) => (
            <div
              key={g.i}
              aria-hidden="true"
              className="chuva-cookie absolute top-0"
              style={
                {
                  left: `${g.esquerda}%`,
                  width: g.tamanho,
                  height: g.tamanho,
                  animationDuration: `${g.duracao}s`,
                  animationDelay: `${g.atraso}s`,
                  "--giro": `${g.giro}deg`,
                } as CSSProperties
              }
            >
              <CookieArt visual={g.visual} seed={`chuva-${g.i}`} className="h-full w-full" />
            </div>
          ))}
        </>
      )}
    </div>,
    document.body,
  );
}
