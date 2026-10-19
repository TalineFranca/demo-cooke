"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cardapio, cookiePorId, type Cookie } from "@/data/cardapio";
import { cn } from "@/lib/aleatorio";
import { linkWhatsApp, mensagemCaixa, precoDe, reais } from "@/lib/pedido";
import { useSacola } from "@/lib/sacola";
import { FotoCookie } from "../ui/FotoCookie";
import { Logo } from "../ui/Logo";

const TAMANHOS = [4, 6] as const;
type Tamanho = (typeof TAMANHOS)[number];

/** cada cookie entra na caixa meio tortinho, como na vida real */
const tortinho = (i: number) => [-3, 2, -1, 3, -2, 1][i % 6];

function CookieArrastavel({
  cookie,
  bloqueado,
  onMover,
  onSoltar,
  onEscolher,
}: {
  cookie: Cookie;
  bloqueado: boolean;
  onMover: (info: PanInfo) => void;
  onSoltar: (info: PanInfo) => void;
  onEscolher: () => void;
}) {
  const arrastando = useRef(false);
  return (
    <li className="flex flex-col items-center">
      <motion.button
        type="button"
        drag={!bloqueado}
        dragSnapToOrigin
        dragMomentum={false}
        whileDrag={{ scale: 1.15, rotate: -6, zIndex: 40 }}
        whileTap={{ scale: 0.92 }}
        onDragStart={() => (arrastando.current = true)}
        onDrag={(_, info) => onMover(info)}
        onDragEnd={(_, info) => {
          onSoltar(info);
          requestAnimationFrame(() => (arrastando.current = false));
        }}
        onClick={() => !arrastando.current && !bloqueado && onEscolher()}
        disabled={bloqueado}
        aria-label={`Colocar ${cookie.nome} na caixa`}
        className="relative aspect-square w-full touch-none select-none disabled:opacity-40"
      >
        <FotoCookie cookie={cookie} className="pointer-events-none h-full w-full" sizes="120px" />
      </motion.button>
      <span className="mt-1.5 text-center font-display text-xs uppercase leading-none">{cookie.nome}</span>
    </li>
  );
}

export function MonteSuaCaixa() {
  const [tamanho, setTamanho] = useState<Tamanho>(6);
  const [espacos, setEspacos] = useState<(string | null)[]>(() => Array(6).fill(null));
  const [mirando, setMirando] = useState<number | null>(null);
  const [fechada, setFechada] = useState(false);
  const [naSacola, setNaSacola] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);
  const adicionarCaixa = useSacola((s) => s.adicionarCaixa);
  const setAberta = useSacola((s) => s.setAberta);

  const cheios = espacos.filter(Boolean).length;
  const cheia = cheios === tamanho;
  const sabores = espacos.filter((s): s is string => !!s);

  useEffect(() => {
    if (!cheia) {
      setFechada(false);
      return;
    }
    const t = setTimeout(() => setFechada(true), 450);
    return () => clearTimeout(t);
  }, [cheia]);

  const mudarTamanho = (n: Tamanho) => {
    setTamanho(n);
    setEspacos((atual) => Array.from({ length: n }, (_, i) => atual[i] ?? null));
    setNaSacola(false);
  };

  const colocar = (id: string, onde?: number) =>
    setEspacos((atual) => {
      const novo = [...atual];
      const i = onde != null && !novo[onde] ? onde : novo.indexOf(null);
      if (i === -1) return atual;
      novo[i] = id;
      return novo;
    });

  const tirar = (i: number) => {
    setEspacos((atual) => atual.map((v, j) => (j === i ? null : v)));
    setNaSacola(false);
  };

  const esvaziar = () => {
    setEspacos(Array(tamanho).fill(null));
    setNaSacola(false);
  };

  const preencherAleatorio = () =>
    setEspacos((atual) => atual.map((v) => v ?? cardapio[Math.floor(Math.random() * cardapio.length)].id));

  /** descobre se o ponteiro está sobre um espaço da caixa (ou sobre a caixa) */
  const alvoEm = (info: PanInfo): number | "caixa" | null => {
    const x = info.point.x - window.scrollX;
    const y = info.point.y - window.scrollY;
    for (const el of document.elementsFromPoint(x, y)) {
      const espaco = (el as HTMLElement).dataset?.espaco;
      if (espaco != null) return Number(espaco);
      if (el === caixaRef.current) return "caixa";
    }
    return null;
  };

  const soltar = (id: string, info: PanInfo) => {
    const alvo = alvoEm(info);
    setMirando(null);
    if (alvo === null) return;
    colocar(id, alvo === "caixa" ? undefined : alvo);
  };

  return (
    <section id="caixa" aria-labelledby="titulo-caixa" className="relative overflow-hidden bg-nevoa px-4 py-20 text-royal md:px-10 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-14">
        <div className="relative z-20 md:col-span-5">
          <h2 id="titulo-caixa" className="font-display text-[12vw] uppercase leading-[0.92] md:text-[4.5vw]">
            Monte
            <br />
            sua caixa
          </h2>
          <p className="mt-4 max-w-[34ch] text-sm leading-snug">
            Arrasta os cookies pra dentro da caixa (ou só toca neles). Sem pressão. Tá, um pouco de pressão.
          </p>

          <div role="group" aria-label="Tamanho da caixa" className="mt-6 flex items-center gap-2">
            {TAMANHOS.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={tamanho === n}
                onClick={() => mudarTamanho(n)}
                className={cn(
                  "border border-royal px-3 py-1.5 font-display text-sm uppercase leading-none",
                  tamanho === n ? "bg-royal text-white" : "hover:bg-white",
                )}
              >
                Caixa com {n}
              </button>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-4 gap-x-3 gap-y-5">
            {cardapio.map((cookie) => (
              <CookieArrastavel
                key={cookie.id}
                cookie={cookie}
                bloqueado={cheia}
                onEscolher={() => colocar(cookie.id)}
                onMover={(info) => {
                  const alvo = alvoEm(info);
                  setMirando(typeof alvo === "number" ? alvo : null);
                }}
                onSoltar={(info) => soltar(cookie.id, info)}
              />
            ))}
          </ul>
        </div>

        <div className="relative z-10 md:col-span-6 md:col-start-7 md:pt-4">
          <p className="mb-3 flex items-baseline justify-between font-display uppercase" aria-live="polite">
            <span className="text-xl md:text-2xl">
              {cheia ? "Fechou!" : cheios === 0 ? "Caixa vazia" : `Faltam ${tamanho - cheios}`}
            </span>
            <span className="text-base tabular-nums">
              {cheios}/{tamanho}
            </span>
          </p>

          <div className="[perspective:1400px]">
            <div
              ref={caixaRef}
              className="relative -rotate-1 bg-bebe p-3 shadow-[8px_8px_0_#1A0FB5] md:p-4"
            >
              <div className={cn("grid gap-2 md:gap-3", tamanho === 4 ? "grid-cols-2" : "grid-cols-3")}>
                {espacos.map((id, i) => {
                  const cookie = id ? cookiePorId(id) : undefined;
                  return (
                    <button
                      key={i}
                      type="button"
                      data-espaco={i}
                      onClick={() => cookie && tirar(i)}
                      disabled={!cookie || fechada}
                      aria-label={cookie ? `Tirar ${cookie.nome} da caixa` : `Espaço ${i + 1} vazio`}
                      className={cn(
                        "relative grid aspect-square place-items-center bg-[#f7d3e6] transition-colors",
                        !cookie && "border-2 border-dashed border-royal/30",
                        mirando === i && !cookie && "border-royal bg-white",
                      )}
                    >
                      {!cookie && <span className="pointer-events-none font-display text-lg text-royal/30">{i + 1}</span>}
                      <AnimatePresence>
                        {cookie && (
                          <motion.span
                            key={`${id}-${i}`}
                            className="pointer-events-none absolute inset-[4%]"
                            initial={{ scale: 1.6, rotate: -30, opacity: 0 }}
                            animate={{ scale: 1, rotate: tortinho(i), opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 420, damping: 17 }}
                          >
                            <FotoCookie cookie={cookie} className="h-full w-full" sizes="200px" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>

              {/* tampa */}
              <motion.div
                aria-hidden={!fechada}
                className="pointer-events-none absolute inset-0 flex origin-top flex-col items-center justify-center border-4 border-bebe bg-royal text-center [backface-visibility:hidden]"
                initial={false}
                animate={fechada ? { rotateX: 0, opacity: 1 } : { rotateX: -110, opacity: 0 }}
                transition={fechada ? { type: "spring", stiffness: 110, damping: 14 } : { duration: 0.35 }}
              >
                <Logo className="text-[12vw] md:text-[4.5vw]" />
                <p className="mt-3 font-display text-xs uppercase tracking-wide text-bebe md:text-sm">
                  Não abra antes de chegar em casa
                </p>
                <p className="text-[11px] text-white/70">(a gente sabe que vai abrir)</p>
              </motion.div>
            </div>
          </div>

          <div className="mt-8 min-h-[110px]">
            <AnimatePresence mode="wait">
              {fechada ? (
                <motion.div
                  key="pronta"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <p className="font-display text-lg uppercase">
                    {tamanho} cookies · {reais(precoDe(sabores))}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href={linkWhatsApp(mensagemCaixa(sabores))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-royal px-4 py-3 font-display text-base uppercase leading-none text-white hover:bg-[#0b0670]"
                    >
                      Pedir no WhatsApp &gt;&gt;&gt;
                    </a>
                    {naSacola ? (
                      <button type="button" onClick={() => setAberta(true)} className="font-display text-base uppercase underline">
                        Tá na sacola. Ver?
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          adicionarCaixa(sabores);
                          setNaSacola(true);
                        }}
                        className="border border-royal px-4 py-3 font-display text-base uppercase leading-none hover:bg-white"
                      >
                        Pôr na sacola
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={esvaziar} className="mt-4 text-xs uppercase underline">
                    Abrir e começar de novo
                  </button>
                </motion.div>
              ) : (
                <motion.div key="montando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-sm">Tocou num cookie da caixa? Ele sai. Simples assim.</p>
                  <div className="mt-3 flex gap-4 text-xs uppercase">
                    <button type="button" onClick={preencherAleatorio} className="underline">
                      Tô com preguiça, escolhe aí
                    </button>
                    {cheios > 0 && (
                      <button type="button" onClick={esvaziar} className="underline">
                        Esvaziar
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
