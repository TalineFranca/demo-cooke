"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cookiePorId } from "@/data/cardapio";
import { lenis } from "@/lib/lenis";
import { agrupar, linkWhatsApp, mensagemSacola, precoDe, reais } from "@/lib/pedido";
import { contarSacola, totalSacola, useSacola } from "@/lib/sacola";
import { FotoCookie } from "./FotoCookie";

export function Sacola() {
  const aberta = useSacola((s) => s.aberta);
  const setAberta = useSacola((s) => s.setAberta);
  const itens = useSacola((s) => s.itens);
  const caixas = useSacola((s) => s.caixas);
  const adicionar = useSacola((s) => s.adicionar);
  const remover = useSacola((s) => s.remover);
  const removerCaixa = useSacola((s) => s.removerCaixa);
  const limpar = useSacola((s) => s.limpar);
  const fechar = useRef<HTMLButtonElement>(null);

  const qtd = contarSacola({ itens, caixas });
  const total = totalSacola({ itens, caixas });

  useEffect(() => {
    if (!aberta) return;
    const anterior = document.activeElement as HTMLElement | null;
    lenis()?.stop();
    document.body.style.overflow = "hidden";
    fechar.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAberta(false);
    window.addEventListener("keydown", tecla);
    return () => {
      lenis()?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", tecla);
      anterior?.focus();
    };
  }, [aberta, setAberta]);

  return (
    <AnimatePresence>
      {aberta && (
        <>
          <motion.div
            key="fundo"
            className="fixed inset-0 z-[60] bg-[#0b0670]/70"
            onClick={() => setAberta(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            key="painel"
            role="dialog"
            aria-modal="true"
            aria-label="Sua sacola"
            data-lenis-prevent
            className="fixed right-0 top-0 z-[61] flex h-[100dvh] w-full max-w-md flex-col bg-bebe text-royal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
          >
            <div className="flex items-start justify-between border-b-2 border-royal p-5">
              <h2 className="font-display text-5xl uppercase leading-[0.85]">
                Sua
                <br />
                sacola
              </h2>
              <button
                ref={fechar}
                type="button"
                onClick={() => setAberta(false)}
                className="font-display text-base uppercase underline underline-offset-4"
              >
                fechar ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5">
              {qtd === 0 ? (
                <div className="py-10">
                  <p className="font-display text-4xl uppercase leading-none">Sacola vazia.</p>
                  <p className="mt-2 text-sm">Isso é triste. Bora resolver?</p>
                  <a
                    href="#cardapio"
                    onClick={() => setAberta(false)}
                    className="mt-6 inline-block bg-royal px-4 py-2 font-display uppercase text-white"
                  >
                    Ver o cardápio &gt;&gt;&gt;
                  </a>
                </div>
              ) : (
                <ul>
                  {Object.entries(itens).map(([id, n]) => {
                    const cookie = cookiePorId(id);
                    if (!cookie) return null;
                    return (
                      <li key={id} className="flex items-center gap-3 border-b border-royal/20 py-3">
                        <FotoCookie cookie={cookie} className="h-14 w-14 shrink-0" sizes="56px" />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-xl uppercase leading-none">{cookie.nome}</p>
                          <p className="text-xs">{reais(cookie.preco * n)}</p>
                        </div>
                        <div className="flex items-center font-display text-lg">
                          <button type="button" aria-label={`Tirar um ${cookie.nome}`} onClick={() => remover(id)} className="px-2.5 py-1 hover:bg-white">
                            −
                          </button>
                          <span className="w-6 text-center tabular-nums">{n}</span>
                          <button type="button" aria-label={`Mais um ${cookie.nome}`} onClick={() => adicionar(id)} className="px-2.5 py-1 hover:bg-white">
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                  {caixas.map((caixa) => (
                    <li key={caixa.id} className="flex items-start gap-3 border-b border-royal/20 py-3">
                      <span className="grid h-14 w-14 shrink-0 place-items-center bg-royal font-display text-2xl text-bebe">
                        {caixa.sabores.length}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xl uppercase leading-none">Caixa com {caixa.sabores.length}</p>
                        <p className="mt-1 text-xs leading-snug">
                          {agrupar(caixa.sabores)
                            .map(({ id, qtd: n }) => `${n}x ${cookiePorId(id)?.nome ?? id}`)
                            .join(", ")}
                        </p>
                        <p className="text-xs font-bold">{reais(precoDe(caixa.sabores))}</p>
                      </div>
                      <button type="button" onClick={() => removerCaixa(caixa.id)} className="text-xs uppercase underline">
                        tirar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {qtd > 0 && (
              <div className="border-t-2 border-royal p-5">
                <div className="mb-3 flex items-baseline justify-between font-display uppercase">
                  <span className="text-xl">Total</span>
                  <span className="text-4xl">{reais(total)}</span>
                </div>
                <a
                  href={linkWhatsApp(mensagemSacola(itens, caixas))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-royal py-4 text-center font-display text-3xl uppercase leading-none text-white transition-colors hover:bg-[#0b0670]"
                >
                  Pedir no WhatsApp &gt;&gt;&gt;
                </a>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span>Abre o WhatsApp com tudo escrito.</span>
                  <button type="button" onClick={limpar} className="uppercase underline">
                    esvaziar
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
