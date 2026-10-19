import { useId, useMemo } from "react";
import type { VisualCookie } from "@/data/cardapio";
import { semente } from "@/lib/aleatorio";

type Ponto = [number, number];

const f = (n: number) => n.toFixed(1);
/** arredonda: Math.sin/cos do Node e do navegador podem divergir na última casa e quebrar a hidratação */
const r1 = (n: number) => Math.round(n * 10) / 10;
const meio = (a: Ponto, b: Ponto): Ponto => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** fecha os pontos num contorno com curvas suaves */
function contornoSuave(p: Ponto[]) {
  const inicio = meio(p[p.length - 1], p[0]);
  let d = `M${f(inicio[0])} ${f(inicio[1])}`;
  p.forEach((ponto, i) => {
    const m = meio(ponto, p[(i + 1) % p.length]);
    d += `Q${f(ponto[0])} ${f(ponto[1])} ${f(m[0])} ${f(m[1])}`;
  });
  return `${d}Z`;
}

function bolha(rand: () => number, cx: number, cy: number, r: number, n: number, irregular: number) {
  const pontos: Ponto[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + (rand() - 0.5) * irregular);
    pontos.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return contornoSuave(pontos);
}

function clarear(hex: string, quanto: number) {
  const n = parseInt(hex.slice(1), 16);
  const canal = (c: number) => Math.round(c + (255 - c) * quanto);
  const [r, g, b] = [canal(n >> 16), canal((n >> 8) & 255), canal(n & 255)];
  return `rgb(${r},${g},${b})`;
}

function desenhar(seed: string) {
  const rand = semente(seed);
  const fases = [rand(), rand(), rand()].map((v) => v * Math.PI * 2);

  const pontos: Ponto[] = [];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const r =
      86 *
      (1 +
        0.035 * Math.sin(3 * a + fases[0]) +
        0.02 * Math.sin(5 * a + fases[1]) +
        0.014 * Math.sin(9 * a + fases[2]) +
        (rand() - 0.5) * 0.012);
    pontos.push([100 + Math.cos(a) * r, 100 + Math.sin(a) * r]);
  }

  let rachas = "";
  for (let k = 0; k < 6; k++) {
    let ang = rand() * Math.PI * 2;
    const raio = 12 + rand() * 50;
    let x = 100 + Math.cos(ang) * raio;
    let y = 100 + Math.sin(ang) * raio;
    rachas += `M${f(x)} ${f(y)}`;
    for (let s = 0; s < 5; s++) {
      ang += (rand() - 0.5) * 1.8;
      const passo = 8 + rand() * 7;
      x += Math.cos(ang) * passo;
      y += Math.sin(ang) * passo;
      rachas += `L${f(x)} ${f(y)}`;
    }
  }

  const gotas: { d: string; x: number; y: number; r: number }[] = [];
  for (let t = 0; t < 80 && gotas.length < 11; t++) {
    const a = rand() * Math.PI * 2;
    const dist = Math.sqrt(rand()) * 64;
    const x = 100 + Math.cos(a) * dist;
    const y = 100 + Math.sin(a) * dist;
    if (gotas.some((g) => Math.hypot(g.x - x, g.y - y) < 24)) continue;
    const r = 6.5 + rand() * 5;
    gotas.push({ d: bolha(rand, x, y, r, 7, 0.5), x: r1(x), y: r1(y), r: r1(r) });
  }

  const pintas: Ponto[] = Array.from({ length: 26 }, () => {
    const a = rand() * Math.PI * 2;
    const dist = Math.sqrt(rand()) * 78;
    return [r1(100 + Math.cos(a) * dist), r1(100 + Math.sin(a) * dist)];
  });

  // miolo: recheio puxado para o canto da mordida (cima/direita)
  const recheio = bolha(rand, 116, 84, 50, 11, 0.32);
  const brilho = bolha(rand, 104, 72, 14, 7, 0.4);
  const derretidas = Array.from({ length: 5 }, () =>
    bolha(rand, 60 + rand() * 60, 100 + rand() * 50, 7 + rand() * 4, 7, 0.7),
  );

  return { contorno: contornoSuave(pontos), rachas, gotas, pintas, recheio, brilho, derretidas };
}

type Props = {
  visual: VisualCookie;
  seed: string;
  /** desenha o corte por dentro (o que aparece na mordida) */
  miolo?: boolean;
  sombra?: boolean;
  className?: string;
};

export function CookieArt({ visual, seed, miolo = false, sombra = true, className }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const d = useMemo(() => desenhar(seed), [seed]);
  const massa = `massa${id}`;
  const recorte = `recorte${id}`;

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={massa} cx="44%" cy="40%" r="64%">
          <stop offset="0" stopColor={miolo ? clarear(visual.massa, 0.25) : clarear(visual.massa, 0.08)} />
          <stop offset="0.7" stopColor={visual.massa} />
          <stop offset="1" stopColor={visual.borda} />
        </radialGradient>
        <clipPath id={recorte}>
          <path d={d.contorno} />
        </clipPath>
      </defs>

      {sombra && <path d={d.contorno} fill="#07034a" opacity="0.4" transform="translate(6 8)" />}
      <path d={d.contorno} fill={`url(#${massa})`} />

      <g clipPath={`url(#${recorte})`}>
        {miolo ? (
          <>
            <path d={d.contorno} fill="none" stroke={visual.borda} strokeWidth="10" />
            {d.pintas.slice(0, 14).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1.6} fill={visual.borda} opacity="0.35" />
            ))}
            {d.derretidas.map((g, i) => (
              <path key={i} d={g} fill={visual.gotas} opacity="0.9" />
            ))}
            <path d={d.recheio} fill={visual.recheio} />
            <path d={d.brilho} fill="#fff" opacity="0.25" />
          </>
        ) : (
          <>
            {d.pintas.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={r1(0.8 + (i % 3) * 0.35)} fill={visual.borda} opacity="0.4" />
            ))}
            <path
              d={d.rachas}
              fill="none"
              stroke={visual.borda}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            <path
              d={d.rachas}
              fill="none"
              stroke="#fff"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.2"
              transform="translate(-1.3 -1.3)"
            />
            {d.gotas.map((g, i) => (
              <g key={i}>
                <path d={g.d} fill={visual.gotas} />
                <ellipse cx={r1(g.x - g.r * 0.3)} cy={r1(g.y - g.r * 0.35)} rx={r1(g.r * 0.35)} ry={r1(g.r * 0.2)} fill="#fff" opacity="0.3" />
              </g>
            ))}
          </>
        )}
      </g>
    </svg>
  );
}
