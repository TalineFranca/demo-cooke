import type Lenis from "lenis";

/** instância única do Lenis, para pausar a rolagem quando a sacola abre */
let instancia: Lenis | null = null;

export const definirLenis = (l: Lenis | null) => {
  instancia = l;
};

export const lenis = () => instancia;
