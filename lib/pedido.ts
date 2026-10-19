import { cookiePorId } from "@/data/cardapio";
import { marca } from "@/data/marca";

export const linkWhatsApp = (mensagem: string) =>
  `https://wa.me/${marca.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const reais = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** ["a","a","b"] -> [{ id: "a", qtd: 2 }, { id: "b", qtd: 1 }] */
export function agrupar(ids: string[]) {
  const mapa = new Map<string, number>();
  ids.forEach((id) => mapa.set(id, (mapa.get(id) ?? 0) + 1));
  return [...mapa].map(([id, qtd]) => ({ id, qtd }));
}

export const precoDe = (ids: string[]) =>
  ids.reduce((soma, id) => soma + (cookiePorId(id)?.preco ?? 0), 0);

function linhaCaixa(sabores: string[]) {
  const conteudo = agrupar(sabores)
    .map(({ id, qtd }) => `${qtd}x ${cookiePorId(id)?.nome ?? id}`)
    .join(", ");
  return `• Caixa com ${sabores.length}: ${conteudo} — ${reais(precoDe(sabores))}`;
}

export function mensagemCaixa(sabores: string[]) {
  return [
    "Oi, Cookê! Montei minha caixa no site:",
    "",
    linhaCaixa(sabores),
    "",
    "Pode confirmar se tem tudo e como fica a entrega?",
  ].join("\n");
}

export function mensagemSacola(itens: Record<string, number>, caixas: { sabores: string[] }[]) {
  const linhas: string[] = [];
  let total = 0;

  Object.entries(itens).forEach(([id, qtd]) => {
    const cookie = cookiePorId(id);
    if (!cookie || qtd <= 0) return;
    total += cookie.preco * qtd;
    linhas.push(`• ${qtd}x ${cookie.nome} — ${reais(cookie.preco * qtd)}`);
  });

  caixas.forEach(({ sabores }) => {
    total += precoDe(sabores);
    linhas.push(linhaCaixa(sabores));
  });

  return [
    "Oi, Cookê! Bateu o Cookê Time. Quero pedir:",
    "",
    ...linhas,
    "",
    `Total: ${reais(total)}`,
    "",
    "Pode confirmar disponibilidade e entrega?",
  ].join("\n");
}
