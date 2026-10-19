"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cardapio, categorias, type Categoria } from "@/data/cardapio";
import { cn } from "@/lib/aleatorio";
import { CardCookie } from "../ui/CardCookie";

export function Cardapio() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const lista = filtro === "todos" ? cardapio : cardapio.filter((c) => c.categoria === filtro);

  return (
    <section id="cardapio" aria-labelledby="titulo-cardapio" className="relative px-4 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28">
      <header className="mb-8 grid items-end gap-3 md:mb-12 md:grid-cols-12">
        <h2 id="titulo-cardapio" className="font-display text-[16vw] uppercase leading-[0.85] md:col-span-8 md:text-[6.5vw]">
          O cardá<span className="text-bebe">pio</span>
        </h2>
        <p className="max-w-[32ch] text-sm leading-snug text-white/70 md:col-span-4 md:justify-self-end md:pb-2">
          <span className="hidden md:inline">Passa o mouse na foto. Ela morde de volta.</span>
          <span className="md:hidden">Toca na foto pra dar uma mordida.</span> Tudo assado no dia, rachadinho de propósito.
        </p>
      </header>

      <div role="group" aria-label="Filtrar por categoria" className="mb-10 flex flex-wrap gap-x-1 gap-y-2 md:mb-14">
        {categorias.map((c) => {
          const ativo = filtro === c.id;
          const n = c.id === "todos" ? cardapio.length : cardapio.filter((k) => k.categoria === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={ativo}
              onClick={() => setFiltro(c.id)}
              className={cn(
                "relative px-3 py-1.5 font-display text-base uppercase leading-none transition-colors md:text-lg",
                ativo ? "text-royal" : "text-white hover:text-bebe",
              )}
            >
              {ativo && (
                <motion.span
                  layoutId="filtro-ativo"
                  className="absolute inset-0 -z-0 bg-bebe"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">
                {c.rotulo}
                <sup className="ml-0.5 align-super text-[0.45em]">{n}</sup>
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
        <AnimatePresence mode="popLayout">
          {lista.map((cookie, i) => (
            <CardCookie key={cookie.id} cookie={cookie} indice={i} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
