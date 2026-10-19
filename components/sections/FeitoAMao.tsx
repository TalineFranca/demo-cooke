"use client";

import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { cardapio } from "@/data/cardapio";
import { cn } from "@/lib/aleatorio";
import { useMenosMovimento } from "@/lib/hooks";
import { AnimBolinha, AnimEntrega, AnimForno, AnimMassa } from "../ui/AnimacoesProcesso";
import { CookiePartido } from "../ui/CookiePartido";

type Etapa = { titulo: string; texto: string; Anim: ComponentType<{ ativo: boolean }>; cor: string };

const ETAPAS: Etapa[] = [
  { titulo: "Massa", texto: "Manteiga de verdade, açúcar mascavo e chocolate em pedaço. Nada de atalho.", Anim: AnimMassa, cor: "bg-[#0b0670]" },
  { titulo: "Bolinha", texto: "Uma por uma, na mão e na balança. Sim, a gente confere o peso.", Anim: AnimBolinha, cor: "bg-bebe text-royal" },
  { titulo: "Forno", texto: "Sai rachado por fora e molinho por dentro. De propósito.", Anim: AnimForno, cor: "bg-nevoa text-royal" },
  { titulo: "Entrega", texto: "Seu Cookê Time chegou e você não pode vir buscar? A gente leva.", Anim: AnimEntrega, cor: "bg-white text-royal" },
];

function Painel({ etapa, i, ativo }: { etapa: Etapa; i: number; ativo: boolean }) {
  return (
    <article
      className={cn(
        "relative flex w-[80vw] shrink-0 flex-col justify-between p-5 md:w-[34vw] md:p-7",
        etapa.cor,
        i % 2 ? "h-[50svh] self-end" : "h-[46svh] self-start",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="texto-vazado-fino font-display text-[16vw] leading-[0.75] md:text-[5.5vw]">0{i + 1}</span>
        <div className="h-[18svh] w-[50%] md:h-[20svh]">
          <etapa.Anim ativo={ativo} />
        </div>
      </div>
      <div>
        <h3 className="font-display text-4xl uppercase leading-[0.9] md:text-5xl">{etapa.titulo}</h3>
        <p className="mt-3 max-w-[30ch] text-sm leading-snug opacity-80">{etapa.texto}</p>
      </div>
    </article>
  );
}

function Processo() {
  const ref = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const [distancia, setDistancia] = useState(0);
  const [ativo, setAtivo] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distancia]);

  useLayoutEffect(() => {
    const medir = () => trilho.current && setDistancia(trilho.current.scrollWidth - window.innerWidth);
    medir();
    const obs = new ResizeObserver(medir);
    if (trilho.current) obs.observe(trilho.current);
    window.addEventListener("resize", medir);
    return () => {
      obs.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => setAtivo(Math.min(ETAPAS.length - 1, Math.floor(v * ETAPAS.length))));

  return (
    <div ref={ref} className="relative" style={{ height: `${ETAPAS.length * 85}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-24">
        <motion.div ref={trilho} style={{ x }} className="flex h-full max-h-[620px] w-max gap-5 px-4 md:gap-8 md:px-10">
          {ETAPAS.map((etapa, i) => (
            <Painel key={etapa.titulo} etapa={etapa} i={i} ativo={ativo === i} />
          ))}
        </motion.div>
        <div className="absolute inset-x-4 bottom-6 flex items-center gap-4 md:inset-x-10">
          <span className="font-display text-xs uppercase tracking-wide text-white/70">Rola que ele anda</span>
          <div className="h-0.5 flex-1 bg-white/20">
            <motion.div className="h-full origin-left bg-bebe" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** versão sem movimento: as etapas empilhadas, sem pin nem scroll lateral */
function ProcessoEstatico() {
  return (
    <div className="flex flex-col gap-6 px-4 py-10 md:px-10">
      {ETAPAS.map((etapa, i) => (
        <Painel key={etapa.titulo} etapa={etapa} i={i} ativo={false} />
      ))}
    </div>
  );
}

export function FeitoAMao() {
  const reduzido = useMenosMovimento();
  const cookieRef = useRef<HTMLDivElement>(null);
  const partiu = useInView(cookieRef, { amount: 0.6 });

  return (
    <section id="feito-a-mao" aria-labelledby="titulo-feito" className="relative">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-20 md:grid-cols-12 md:px-10 md:pb-16 md:pt-28">
        <div ref={cookieRef} className="relative md:col-span-7">
          <CookiePartido
            visual={cardapio[0].visual}
            seed="feito-a-mao"
            foto="/fotos/ninho-nutella.png"
            sizes="(max-width: 768px) 90vw, 50vw"
            aberto={partiu || reduzido}
            abertura="20%"
            className="relative mx-auto aspect-square w-[78%] max-w-[520px]"
          >
            <h2 id="titulo-feito" className="text-center font-display text-[10vw] uppercase leading-[0.85] text-bebe md:text-[3.6vw]">
              Feito
              <br />à mão
            </h2>
          </CookiePartido>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="font-display text-3xl uppercase leading-[0.9]">Literalmente.</p>
          <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-white/80">
            Sem fábrica, sem esteira, sem conservante com nome difícil. Uma cozinha em Carapicuíba, ingredientes
            escolhidos a dedo e alguém de avental vigiando o forno feito gavião.
          </p>
        </div>
      </div>

      {reduzido ? <ProcessoEstatico /> : <Processo />}
    </section>
  );
}
