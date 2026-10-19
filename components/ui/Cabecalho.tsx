"use client";

import { motion } from "framer-motion";
import { contarSacola, useSacola } from "@/lib/sacola";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#cardapio", rotulo: "Cardápio" },
  { href: "#caixa", rotulo: "Monte sua caixa" },
  { href: "#como-pedir", rotulo: "Como pedir" },
];

export function Cabecalho() {
  const qtd = useSacola(contarSacola);
  const setAberta = useSacola((s) => s.setAberta);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-white/10 bg-royal px-4 md:px-10">
      <a href="#topo" aria-label="Cookê, voltar ao topo">
        <Logo className="text-2xl md:text-[1.7rem]" />
      </a>

      <nav aria-label="Seções" className="hidden gap-8 md:flex">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="font-display text-sm uppercase tracking-wide text-white/80 transition-colors hover:text-bebe"
          >
            {l.rotulo}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setAberta(true)}
        className="flex items-center gap-2 bg-bebe px-3 py-1.5 font-display text-sm uppercase leading-none text-royal transition-colors hover:bg-white"
        aria-label={`Abrir sacola, ${qtd} cookies`}
      >
        Sacola
        <motion.span
          key={qtd}
          initial={{ scale: qtd ? 1.6 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 14 }}
          className="grid h-5 min-w-5 place-items-center bg-royal px-1 text-xs text-white"
        >
          {qtd}
        </motion.span>
      </button>
    </header>
  );
}
