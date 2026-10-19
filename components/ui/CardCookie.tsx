"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Cookie } from "@/data/cardapio";
import { cn } from "@/lib/aleatorio";
import { reais } from "@/lib/pedido";
import { BotaoQuero } from "./BotaoQuero";
import { FotoCookie } from "./FotoCookie";

/** card do cardápio: no hover (ou toque) o cookie leva uma mordida */
export function CardCookie({ cookie, indice }: { cookie: Cookie; indice: number }) {
  const [mordido, setMordido] = useState(false);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn("group relative flex flex-col", indice % 2 === 1 && "lg:mt-10")}
    >
      <button
        type="button"
        onClick={() => setMordido((v) => !v)}
        aria-pressed={mordido}
        aria-label={`Dar uma mordida no ${cookie.nome}`}
        className="mordivel relative mx-auto block aspect-square w-[88%]"
        data-mordido={mordido}
      >
        <span className="casca absolute inset-0">
          <FotoCookie
            cookie={cookie}
            className="h-full w-full drop-shadow-[0_14px_18px_rgba(5,2,58,.45)] transition-transform duration-700 ease-out group-hover:rotate-[10deg]"
          />
        </span>
      </button>

      {cookie.selo && (
        <span className="absolute left-0 top-0 bg-bebe px-2 py-0.5 font-display text-xs uppercase tracking-wide text-royal">
          {cookie.selo}
        </span>
      )}

      <h3 className="mt-4 font-display text-xl uppercase leading-none md:text-2xl">{cookie.nome}</h3>
      <p className="mt-1.5 flex-1 text-xs leading-snug text-white/70">
        {cookie.descricao} <span className="whitespace-nowrap text-white/45">· {cookie.peso}g</span>
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/15 pt-3">
        <p className="font-display text-lg leading-none text-bebe md:text-xl">{reais(cookie.preco)}</p>
        <BotaoQuero id={cookie.id} nome={cookie.nome} />
      </div>
    </motion.li>
  );
}
