"use client";

import { motion, useInView, useMotionValueEvent, useScroll } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cardapio } from "@/data/cardapio";
import { marca } from "@/data/marca";
import { useDispositivoLeve, useMenosMovimento } from "@/lib/hooks";
import { CookiePartido } from "../ui/CookiePartido";
import { Logo } from "../ui/Logo";

// three.js só baixa depois que a página já pintou (fora do caminho crítico)
const CookieCanvas = dynamic(() => import("../three/CookieCanvas"), { ssr: false });

function temWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [aberto, setAberto] = useState(false);
  const [usar3D, setUsar3D] = useState(false);
  const [pronto3D, setPronto3D] = useState(false);
  const abertoPelaRolagem = useRef(false);
  const leve = useDispositivoLeve();
  const reduzido = useMenosMovimento();
  const visivel = useInView(ref);

  useEffect(() => {
    if (!temWebGL()) return;
    const carregar = () => setUsar3D(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(carregar, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(carregar, 800);
    return () => clearTimeout(t);
  }, []);

  // rolar parte o cookie; voltar ao topo junta de novo (se foi a rolagem que partiu)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.1 && !aberto) {
      abertoPelaRolagem.current = true;
      setAberto(true);
    } else if (v < 0.02 && aberto && abertoPelaRolagem.current) {
      abertoPelaRolagem.current = false;
      setAberto(false);
    }
  });

  const alternar = () => {
    abertoPelaRolagem.current = false;
    setAberto((v) => !v);
  };

  return (
    <section ref={ref} id="topo" className="relative h-[100svh] min-h-[460px] overflow-hidden">
      <h1 className="sr-only">
        Cookê: cookies artesanais em {marca.cidade}-{marca.estado}. Se for para adoçar o dia, que seja com Cookê.
      </h1>

      {/* tipografia gigante atrás do cookie */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none font-display uppercase leading-[0.8]">
        <span className="absolute left-4 top-[calc(3.5rem+5%)] text-[min(15vw,9.5svh)] md:left-10 lg:landscape:top-[15%] lg:landscape:text-[min(8vw,13svh)]">Se for pra</span>
        <span className="texto-vazado absolute right-4 top-[calc(3.5rem+14%)] text-[min(15vw,9.5svh)] md:right-10 lg:landscape:top-[31%] lg:landscape:text-[min(8vw,13svh)]">
          adoçar o dia,
        </span>
        {/* celular e tablet em pé: vem antes do cookie (ordem de leitura); tela larga deitada: embaixo à esquerda */}
        <span className="absolute left-4 top-[calc(3.5rem+24%)] text-[min(9vw,5.5svh)] text-bebe md:left-10 lg:landscape:bottom-[16%] lg:landscape:top-auto lg:landscape:text-[min(3.2vw,5svh)]">
          que seja com
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-pressed={aberto}
        aria-label={aberto ? "Juntar o cookie de novo" : "Partir o cookie ao meio"}
        onClick={alternar}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), alternar())}
        className="absolute inset-x-0 bottom-[10%] top-[calc(3.5rem+22%)] outline-none focus-visible:outline-2 focus-visible:outline-offset-[-8px] focus-visible:outline-bebe lg:landscape:bottom-0 lg:landscape:top-0"
        data-cursor
      >
        {/* pôster: aparece antes do 3D carregar e fica se não houver WebGL */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: pronto3D ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <CookiePartido
            visual={cardapio[0].visual}
            seed="hero"
            aberto={aberto}
            abertura="32%"
            className="aspect-square w-[min(62vw,40svh)] max-w-[400px] lg:landscape:w-[28vw]"
          />
        </motion.div>
        {usar3D && (
          <div className="absolute inset-0">
            <CookieCanvas aberto={aberto} visivel={visivel} leve={leve} reduzido={reduzido} onPronto={() => setPronto3D(true)} />
          </div>
        )}
      </div>

      {/* o logo aparece entre as duas metades */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[10%] top-[calc(3.5rem+22%)] flex items-center justify-center lg:landscape:bottom-0 lg:landscape:top-0"
        initial={false}
        animate={aberto ? { opacity: 1, scale: 1, rotate: -7 } : { opacity: 0, scale: 0.3, rotate: -25 }}
        transition={{ type: "spring", stiffness: 180, damping: 13, delay: aberto ? 0.12 : 0 }}
      >
        <Logo className="text-[min(16vw,10svh)] drop-shadow-[4px_4px_0_#0b0670] lg:landscape:text-[6.5vw]" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 py-6 pl-4 pr-24 md:py-8 md:pl-10 md:pr-32">
        <p className="max-w-[22ch] text-xs leading-snug text-white/80 md:text-sm">
          {marca.subtitulo}. Feitos em {marca.cidade}, {marca.estado}.
        </p>
        <a
          href="#cardapio"
          className="pointer-events-auto shrink-0 font-display text-base uppercase leading-none text-bebe md:text-lg"
        >
          {aberto ? "Tá de boa!!! >>>" : "Clica no cookie >>>"}
        </a>
      </div>
    </section>
  );
}
