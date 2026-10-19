"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { cookiePorId } from "@/data/cardapio";
import { precoDe } from "@/lib/pedido";

export type CaixaMontada = { id: string; sabores: string[] };

type EstadoSacola = {
  itens: Record<string, number>;
  caixas: CaixaMontada[];
  aberta: boolean;
  adicionar: (id: string) => void;
  remover: (id: string) => void;
  adicionarCaixa: (sabores: string[]) => void;
  removerCaixa: (id: string) => void;
  limpar: () => void;
  setAberta: (aberta: boolean) => void;
};

export const useSacola = create<EstadoSacola>()(
  persist(
    (set) => ({
      itens: {},
      caixas: [],
      aberta: false,
      adicionar: (id) => set((s) => ({ itens: { ...s.itens, [id]: (s.itens[id] ?? 0) + 1 } })),
      remover: (id) =>
        set((s) => {
          const itens = { ...s.itens };
          if ((itens[id] ?? 0) <= 1) delete itens[id];
          else itens[id] -= 1;
          return { itens };
        }),
      adicionarCaixa: (sabores) =>
        set((s) => ({ caixas: [...s.caixas, { id: `${Date.now()}`, sabores }] })),
      removerCaixa: (id) => set((s) => ({ caixas: s.caixas.filter((c) => c.id !== id) })),
      limpar: () => set({ itens: {}, caixas: [] }),
      setAberta: (aberta) => set({ aberta }),
    }),
    {
      name: "cooke-sacola",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ itens, caixas }) => ({ itens, caixas }),
      // reidratado no cliente pelo <Provedores />, evita erro de hidratação
      skipHydration: true,
    },
  ),
);

export const contarSacola = (s: Pick<EstadoSacola, "itens" | "caixas">) =>
  Object.values(s.itens).reduce((a, b) => a + b, 0) +
  s.caixas.reduce((a, c) => a + c.sabores.length, 0);

export const totalSacola = (s: Pick<EstadoSacola, "itens" | "caixas">) =>
  Object.entries(s.itens).reduce((a, [id, qtd]) => a + (cookiePorId(id)?.preco ?? 0) * qtd, 0) +
  s.caixas.reduce((a, c) => a + precoDe(c.sabores), 0);
