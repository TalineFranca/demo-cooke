/**
 * BANNER SAZONAL (Encomendas especiais)
 * -------------------------------------
 * Troque o conteúdo abaixo a cada data comemorativa.
 * Para esconder a seção, use `ativo: false`.
 *
 * Exemplos prontos no fim do arquivo (Páscoa, Dia das Mães).
 */

export type Sazonal = {
  ativo: boolean;
  /** etiqueta pequena acima do título */
  chamada: string;
  /** foto em /public/fotos */
  foto: string;
  titulo: string;
  texto: string;
  prazo: string;
  cta: string;
  /** mensagem que já vai escrita no WhatsApp */
  mensagem: string;
  cores: { fundo: string; texto: string };
};

export const sazonal: Sazonal = {
  ativo: false,
  chamada: "Natal",
  foto: "/fotos/natal.jpg",
  titulo: "Caixa de Natal Cookê",
  texto:
    "6 ou 12 cookies numa caixa que dá pra dar de presente. Ou não dar. Ninguém precisa saber.",
  prazo: "Encomendas até 18/12",
  cta: "Encomendar a minha",
  mensagem: "Oi, Cookê! Quero encomendar a Caixa de Natal. Como funciona?",
  cores: { fundo: "#F5A6CF", texto: "#1A0FB5" },
};

/*
export const sazonal: Sazonal = {
  ativo: true,
  chamada: "Páscoa",
  foto: "/fotos/pascoa.jpg",
  titulo: "Ovo? Cookê.",
  texto: "Cookie recheado gigante no lugar do ovo. Ninguém reclamou até hoje.",
  prazo: "Encomendas até a quarta-feira santa",
  cta: "Quero o meu",
  mensagem: "Oi, Cookê! Quero encomendar o kit de Páscoa.",
  cores: { fundo: "#E4E4E4", texto: "#1A0FB5" },
};

export const sazonal: Sazonal = {
  ativo: true,
  chamada: "Dia das Mães",
  foto: "/fotos/maes.jpg",
  titulo: "Dia das Mães",
  texto: "Caixa com bilhete escrito à mão. A letra é nossa, o amor é seu.",
  prazo: "Encomendas até quinta antes do domingo",
  cta: "Encomendar pra ela",
  mensagem: "Oi, Cookê! Quero a caixa de Dia das Mães.",
  cores: { fundo: "#F5A6CF", texto: "#1A0FB5" },
};
*/
