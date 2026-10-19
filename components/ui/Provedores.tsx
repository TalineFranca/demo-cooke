"use client";

import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useMenosMovimento } from "@/lib/hooks";
import { definirLenis } from "@/lib/lenis";
import { useSacola } from "@/lib/sacola";

function RolagemSuave() {
  const reduzido = useMenosMovimento();
  useEffect(() => {
    if (reduzido) return;
    const instancia = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -40 } });
    definirLenis(instancia);
    return () => {
      instancia.destroy();
      definirLenis(null);
    };
  }, [reduzido]);
  return null;
}

export function Provedores({ children }: { children: ReactNode }) {
  useEffect(() => {
    useSacola.persist.rehydrate();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <RolagemSuave />
    </MotionConfig>
  );
}
