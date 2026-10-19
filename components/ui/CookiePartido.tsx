"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import type { VisualCookie } from "@/data/cardapio";
import { cn } from "@/lib/aleatorio";
import { CookieArt } from "./CookieArt";

/** linha da rachadura: x (%) de cima para baixo */
const RACHA = [50, 46, 53, 47.5, 54, 49, 52.5, 47, 51];
const pontos = RACHA.map((x, i) => `${x}% ${((i / (RACHA.length - 1)) * 100).toFixed(1)}%`).join(", ");
const ESQUERDA = `polygon(0 0, ${pontos}, 0 100%)`;
const DIREITA = `polygon(100% 0, ${pontos}, 100% 100%)`;

type Props = {
  visual: VisualCookie;
  seed: string;
  /** foto real (PNG sem fundo): é partida ao meio no lugar do desenho */
  foto?: string;
  sizes?: string;
  aberto: boolean;
  /** quanto cada metade se afasta (relativo à largura) */
  abertura?: string;
  children?: ReactNode;
  className?: string;
};

/** o cookie partido ao meio do feed: uma metade de cada lado do conteúdo */
export function CookiePartido({ visual, seed, foto, sizes = "50vw", aberto, abertura = "22%", children, className }: Props) {
  const metade = foto ? (
    <Image src={foto} alt="" fill sizes={sizes} className="object-contain" />
  ) : (
    <CookieArt visual={visual} seed={seed} className="h-full w-full" />
  );
  const mola = { type: "spring" as const, stiffness: 150, damping: 15 };
  return (
    <div className={cn("relative", className)}>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: ESQUERDA }}
        initial={false}
        animate={aberto ? { x: `-${abertura}`, y: "3%", rotate: -8 } : { x: 0, y: 0, rotate: 0 }}
        transition={mola}
      >
        {metade}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: DIREITA }}
        initial={false}
        animate={aberto ? { x: abertura, y: "-2%", rotate: 6 } : { x: 0, y: 0, rotate: 0 }}
        transition={mola}
      >
        {metade}
      </motion.div>
      {children && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={aberto ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ ...mola, delay: aberto ? 0.08 : 0 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
