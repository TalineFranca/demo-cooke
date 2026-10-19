"use client";

import { motion } from "framer-motion";
import { useSacola } from "@/lib/sacola";

export function BotaoQuero({ id, nome }: { id: string; nome: string }) {
  const qtd = useSacola((s) => s.itens[id] ?? 0);
  const adicionar = useSacola((s) => s.adicionar);
  const remover = useSacola((s) => s.remover);

  if (!qtd) {
    return (
      <button
        type="button"
        onClick={() => adicionar(id)}
        className="bg-bebe px-3.5 py-2 font-display text-sm uppercase leading-none text-royal transition-colors hover:bg-white"
      >
        + Quero
      </button>
    );
  }

  return (
    <div className="inline-flex items-stretch bg-white font-display text-sm leading-none text-royal">
      <button
        type="button"
        onClick={() => remover(id)}
        aria-label={`Tirar um ${nome}`}
        className="px-2.5 py-2 hover:bg-bebe"
      >
        −
      </button>
      <motion.span
        key={qtd}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid w-6 place-items-center tabular-nums"
        aria-live="polite"
        aria-label={`${qtd} na sacola`}
      >
        {qtd}
      </motion.span>
      <button
        type="button"
        onClick={() => adicionar(id)}
        aria-label={`Mais um ${nome}`}
        className="px-2.5 py-2 hover:bg-bebe"
      >
        +
      </button>
    </div>
  );
}
