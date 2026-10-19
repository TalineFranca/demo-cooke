"use client";

import { motion } from "framer-motion";
import { depoimentos, type Conversa } from "@/data/depoimentos";
import { cn } from "@/lib/aleatorio";
import { CookieMordido } from "../ui/Logo";

const GIROS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];
const DESLOCAMENTOS = ["md:mt-0", "md:mt-12", "md:mt-4", "md:mt-16"];

function PrintDM({ conversa, i }: { conversa: Conversa; i: number }) {
  return (
    <figure
      className={cn(
        "relative w-full max-w-[320px] bg-white text-[#111] shadow-[6px_6px_0_#0b0670]",
        GIROS[i % GIROS.length],
        DESLOCAMENTOS[i % DESLOCAMENTOS.length],
        i % 2 ? "justify-self-end" : "justify-self-start",
      )}
    >
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-nevoa font-bold uppercase text-royal">
          {conversa.usuario[0]}
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-sm font-semibold">{conversa.usuario}</p>
          <p className="text-xs text-black/50">{conversa.status}</p>
        </div>
        <span aria-hidden="true" className="text-lg leading-none tracking-widest text-black/60">
          ···
        </span>
      </div>

      <div className="flex flex-col gap-1.5 px-3 py-4">
        {conversa.mensagens.map((m, j) => {
          const minha = m.de === "cooke";
          return (
            <motion.div
              key={j}
              className={cn("relative max-w-[78%]", minha ? "self-end" : "self-start", m.curtida && "mb-3")}
              initial={{ scale: 0.4, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 22, delay: j * 0.35 }}
              style={{ originX: minha ? 1 : 0, originY: 1 }}
            >
              <p
                className={cn(
                  "rounded-[20px] px-3.5 py-2 text-[14px] leading-snug",
                  minha ? "bg-royal text-white" : "bg-[#efefef]",
                )}
              >
                {m.texto}
              </p>
              {m.curtida && (
                <span
                  aria-label="curtiu"
                  className={cn(
                    "absolute -bottom-3 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-[#efefef] text-[11px] text-[#ff3040]",
                    minha ? "right-2" : "left-2",
                  )}
                >
                  ♥
                </span>
              )}
            </motion.div>
          );
        })}
        <p className="mt-1 self-end text-[11px] text-black/40">Visto</p>
      </div>

      <div className="mx-3 mb-3 flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm text-black/40">
        <CookieMordido className="h-5 w-5 text-bebe" />
        Mensagem…
      </div>
      <figcaption className="sr-only">Mensagem de {conversa.usuario} no Instagram</figcaption>
    </figure>
  );
}

export function QuemJaProvou() {
  return (
    <section aria-labelledby="titulo-provou" className="relative overflow-hidden px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto mb-12 max-w-6xl">
        <h2 id="titulo-provou" className="font-display text-[12vw] uppercase leading-[0.85] md:text-[4.5vw]">
          Quem já <span className="text-bebe">provou</span>
        </h2>
        <p className="mt-3 text-sm text-white/75">…e veio contar na DM. A gente printou, claro.</p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {depoimentos.map((c, i) => (
          <PrintDM key={c.usuario} conversa={c} i={i} />
        ))}
      </div>
    </section>
  );
}
