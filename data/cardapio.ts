/**
 * CARDÁPIO DA COOKÊ
 * -----------------
 * Edite aqui: nome, descrição, peso, preço, categoria e foto.
 *
 * - `foto`: caminho de uma imagem em /public/fotos (ex.: "/fotos/tradicional.png").
 *   As fotos atuais são PROVISÓRIAS (banco de imagens CC0) — troque pelas fotos reais.
 *   Use PNG com FUNDO TRANSPARENTE (só o cookie), de preferência quadrado.
 *   Sem foto, o site desenha o cookie com as cores de `visual`.
 * - `visual`: cores do desenho usado quando não há foto.
 * - `selo`: etiqueta opcional ("Novo", "Queridinho"...).
 *
 * Preços e pesos abaixo são EXEMPLOS — confira antes de publicar.
 */

export type Categoria = "classicos" | "recheados" | "da-casa";

export type VisualCookie = {
  /** cor da massa no centro */
  massa: string;
  /** cor da borda mais assada */
  borda: string;
  /** cor das gotas/pedaços */
  gotas: string;
  /** cor do recheio (aparece na mordida) */
  recheio: string;
};

export type Cookie = {
  id: string;
  nome: string;
  descricao: string;
  /** em gramas */
  peso: number;
  /** em reais */
  preco: number;
  categoria: Categoria;
  visual: VisualCookie;
  foto?: string;
  selo?: string;
};

export const categorias: { id: Categoria | "todos"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "classicos", rotulo: "Clássicos" },
  { id: "recheados", rotulo: "Recheados" },
  { id: "da-casa", rotulo: "Da casa" },
];

const tradicional: VisualCookie = {
  massa: "#e6b571",
  borda: "#a9672c",
  gotas: "#3b1d0f",
  recheio: "#4a2412",
};

export const cardapio: Cookie[] = [
  {
    id: "tradicional",
    foto: "/fotos/tradicional.png",
    nome: "Tradicional",
    descricao: "Baunilha, gotas de chocolate ao leite e meio amargo. O que começou tudo.",
    peso: 120,
    preco: 12,
    categoria: "classicos",
    visual: tradicional,
  },
  {
    id: "double-choc",
    foto: "/fotos/double-choc.png",
    nome: "Double Choc",
    descricao: "Massa de cacau com chocolate branco e meio amargo. Pra quem não brinca em serviço.",
    peso: 120,
    preco: 13,
    categoria: "classicos",
    visual: { massa: "#6e3d24", borda: "#3e1f10", gotas: "#f3e6cf", recheio: "#2a140a" },
  },
  {
    id: "red-velvet",
    foto: "/fotos/red-velvet.png",
    nome: "Red Velvet",
    descricao: "Massa red velvet, chocolate branco e recheio de cream cheese.",
    peso: 140,
    preco: 15,
    categoria: "recheados",
    visual: { massa: "#a92b3d", borda: "#6b1423", gotas: "#f6eee2", recheio: "#fbf3e6" },
  },
  {
    id: "nutella",
    foto: "/fotos/nutella.png",
    nome: "Nutella",
    descricao: "Tradicional por fora, um lago de Nutella por dentro. 10s no micro (confia).",
    peso: 140,
    preco: 15,
    categoria: "recheados",
    visual: { ...tradicional, recheio: "#5a2d15" },
  },
  {
    id: "ninho-nutella",
    foto: "/fotos/ninho-nutella.png",
    nome: "Ninho c/ Nutella",
    descricao: "Massa de leite Ninho com chocolate branco e recheio de Nutella.",
    peso: 140,
    preco: 16,
    categoria: "recheados",
    visual: { massa: "#f1d6a6", borda: "#c48d4e", gotas: "#fbf5e9", recheio: "#5a2d15" },
  },
  {
    id: "pistache",
    foto: "/fotos/pistache.png",
    nome: "Pistache",
    descricao: "Massa amanteigada, chocolate branco e creme de pistache de verdade.",
    peso: 140,
    preco: 17,
    categoria: "da-casa",
    visual: { massa: "#d6c47e", borda: "#8e8636", gotas: "#f6eee2", recheio: "#9db45a" },
    selo: "Queridinho",
  },
  {
    id: "doce-de-leite",
    foto: "/fotos/doce-de-leite.png",
    nome: "Doce de Leite",
    descricao: "Flor de sal na massa e doce de leite que escorre. Guardanapo por sua conta.",
    peso: 140,
    preco: 15,
    categoria: "da-casa",
    visual: { ...tradicional, gotas: "#8a4b1c", recheio: "#c47a2c" },
  },
  {
    id: "brigadeiro",
    foto: "/fotos/brigadeiro.png",
    nome: "Brigadeiro",
    descricao: "Massa de cacau, recheio de brigadeiro de panela e granulado. Festa de criança, versão adulta.",
    peso: 140,
    preco: 15,
    categoria: "da-casa",
    visual: { massa: "#5b301b", borda: "#341808", gotas: "#1d0c05", recheio: "#3d1c0c" },
    selo: "Novo",
  },
];

export const cookiePorId = (id: string) => cardapio.find((c) => c.id === id);
