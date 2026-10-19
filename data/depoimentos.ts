/**
 * DEPOIMENTOS ("Quem já provou")
 * ------------------------------
 * ATENÇÃO: os textos abaixo são EXEMPLOS de layout.
 * Antes de publicar, troque por mensagens reais de clientes
 * (com autorização de quem mandou).
 */

export type Mensagem = { de: "cliente" | "cooke"; texto: string; curtida?: boolean };

export type Conversa = {
  usuario: string;
  status: string;
  mensagens: Mensagem[];
};

export const depoimentos: Conversa[] = [
  {
    usuario: "cliente.um",
    status: "Ativo(a) há 4 min",
    mensagens: [
      { de: "cliente", texto: "gente o de nutella" },
      { de: "cliente", texto: "EU NÃO TÔ BEM" },
      { de: "cliente", texto: "comi em pé na cozinha igual um bicho", curtida: true },
      { de: "cooke", texto: "é exatamente assim que se come" },
    ],
  },
  {
    usuario: "cliente.dois",
    status: "Ativo(a) agora",
    mensagens: [
      { de: "cliente", texto: "pedi 6 pra dividir com o pessoal do trampo" },
      { de: "cliente", texto: "dividi com ninguém" },
      { de: "cooke", texto: "Tá de boa!!! >>>", curtida: true },
    ],
  },
  {
    usuario: "cliente.tres",
    status: "Ativo(a) há 1 h",
    mensagens: [
      { de: "cliente", texto: "o red velvet devia ser proibido" },
      { de: "cliente", texto: "manda mais 4 sexta?" },
      { de: "cooke", texto: "sexta é nossa", curtida: true },
    ],
  },
  {
    usuario: "cliente.quatro",
    status: "Ativo(a) ontem",
    mensagens: [
      { de: "cliente", texto: "chegou QUENTINHO??? como" },
      { de: "cooke", texto: "segredo de estado" },
      { de: "cliente", texto: "respeito", curtida: true },
    ],
  },
];
