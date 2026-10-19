# Cookê — site

Site da **Cookê** (@cooke.time), cookies artesanais de Carapicuíba-SP.
Next.js (App Router) + TypeScript + Tailwind CSS 4, React Three Fiber, Framer Motion, Lenis e Zustand.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck
```

Defina `NEXT_PUBLIC_SITE_URL` (ex.: `https://cooke.com.br`) na hospedagem para o SEO e o Open Graph usarem a URL certa.

## O que dá pra editar sem mexer em código

| Arquivo | O quê |
| --- | --- |
| `data/cardapio.ts` | sabores, descrição, peso, preço, categoria, selo e foto |
| `data/sazonal.ts` | banner de encomendas especiais (Natal, Páscoa…). `ativo: false` esconde |
| `data/depoimentos.ts` | conversas da seção "Quem já provou" (**troque pelos prints reais**) |
| `data/marca.ts` | Instagram, WhatsApp, cidade, horário |

### Fotos dos cookies

Coloque a imagem em `public/fotos/` (PNG ou WebP, **fundo transparente**, cookie centralizado, formato quadrado) e aponte no cardápio:

```ts
foto: "/fotos/tradicional.png",
```

Sem foto, o site desenha o cookie com as cores de `visual`. Essas cores também pintam o recheio que aparece na mordida.

## Estrutura

```
app/                 layout (fontes, SEO, lang pt-BR), página, OG image, robots, sitemap
components/sections  Hero, Cardapio, MonteSuaCaixa, FeitoAMao, ComoPedir, QuemJaProvou, EncomendasEspeciais, Rodape
components/three     cookie 3D procedural (duas metades + migalhas)
components/ui        logo, cookie em SVG, cookie partido, sacola, cursor, faixa, chuva de cookies
data/                conteúdo editável
lib/                 sacola (Zustand + localStorage), mensagem do WhatsApp, hooks
```

## Comportamentos

- **3D**: carregado sob demanda (`dynamic import` depois do `requestIdleCallback`). Enquanto carrega, ou se não houver WebGL, aparece o cookie em SVG, que também parte ao meio. No celular o 3D é mais leve: menos polígonos, sem sombra de contato e menos migalhas. O canvas para de renderizar quando o hero sai da tela.
- **Reduzir movimento** (`prefers-reduced-motion`): sem Lenis, sem flutuação ou migalhas no 3D, processo empilhado na vertical em vez do scroll lateral, faixas paradas e sem chuva de cookies.
- **Easter egg**: 5 cliques no logo gigante do rodapé.
- **Pedido**: a sacola e a "Monte sua caixa" abrem `wa.me/5511940167551` com a mensagem já escrita.
