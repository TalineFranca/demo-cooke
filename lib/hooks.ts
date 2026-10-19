"use client";

import { useCallback, useSyncExternalStore } from "react";

/** media query segura para SSR: no servidor (e na hidratação) devolve `servidor`. */
export function useMedia(query: string, servidor = false) {
  const assinar = useCallback(
    (avisar: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", avisar);
      return () => m.removeEventListener("change", avisar);
    },
    [query],
  );
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(query).matches,
    () => servidor,
  );
}

export const useMenosMovimento = () => useMedia("(prefers-reduced-motion: reduce)");

/** celular / tablet: 3D mais leve, sem sombras */
export const useDispositivoLeve = () => useMedia("(max-width: 767px), (pointer: coarse)", true);
