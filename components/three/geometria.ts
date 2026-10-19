import * as THREE from "three";
import { semente } from "@/lib/aleatorio";

export const RAIO = 1.6;
const ESPESSURA = 0.26;
const BISEL = 0.14;
/** altura da face de cima depois de centralizar */
export const TOPO = ESPESSURA / 2 + BISEL;

export type Gota = { posicao: THREE.Vector3; rotacao: THREE.Euler; escala: THREE.Vector3 };

/**
 * Cookie procedural em duas metades que se encaixam numa rachadura irregular.
 * `leve` = celular: menos pontos no contorno, menos bisel, menos gotas.
 */
export function criarCookie(leve: boolean) {
  const rand = semente(7);
  const fases = [rand(), rand(), rand()].map((v) => v * Math.PI * 2);
  const raio = (a: number) =>
    RAIO *
    (1 + 0.03 * Math.sin(3 * a + fases[0]) + 0.02 * Math.sin(5 * a + fases[1]) + 0.012 * Math.sin(11 * a + fases[2]));
  const ponto = (a: number) => new THREE.Vector2(Math.cos(a) * raio(a), Math.sin(a) * raio(a));

  const topo = ponto(Math.PI / 2);
  const base = ponto(-Math.PI / 2);
  const passos = 11;
  const racha: THREE.Vector2[] = [topo];
  for (let i = 1; i < passos; i++) {
    const t = i / passos;
    racha.push(new THREE.Vector2((rand() - 0.5) * 0.34 + Math.sin(t * 6) * 0.05, topo.y + (base.y - topo.y) * t));
  }
  racha.push(base);

  const segmentos = leve ? 32 : 72;

  const esquerda = new THREE.Shape();
  esquerda.moveTo(topo.x, topo.y);
  for (let i = 1; i <= segmentos; i++) {
    const p = ponto(Math.PI / 2 + (Math.PI * i) / segmentos);
    esquerda.lineTo(p.x, p.y);
  }
  for (let i = racha.length - 2; i >= 1; i--) esquerda.lineTo(racha[i].x, racha[i].y);
  esquerda.closePath();

  const direita = new THREE.Shape();
  direita.moveTo(base.x, base.y);
  for (let i = 1; i <= segmentos; i++) {
    const p = ponto(-Math.PI / 2 + (Math.PI * i) / segmentos);
    direita.lineTo(p.x, p.y);
  }
  for (let i = 1; i < racha.length - 1; i++) direita.lineTo(racha[i].x, racha[i].y);
  direita.closePath();

  const extrudar = (forma: THREE.Shape) => {
    const g = new THREE.ExtrudeGeometry(forma, {
      depth: ESPESSURA,
      bevelEnabled: true,
      bevelThickness: BISEL,
      bevelSize: 0.12,
      bevelSegments: leve ? 2 : 5,
      curveSegments: 1,
    });
    g.translate(0, 0, -ESPESSURA / 2);
    return g;
  };

  const gotas = (lado: 1 | -1) => {
    const lista: Gota[] = [];
    const total = leve ? 6 : 10;
    for (let t = 0; t < 200 && lista.length < total; t++) {
      const a = rand() * Math.PI * 2;
      const d = Math.sqrt(rand()) * RAIO * 0.8;
      const x = Math.cos(a) * d;
      const y = Math.sin(a) * d;
      if (Math.sign(x) !== lado || Math.abs(x) < 0.22) continue;
      if (lista.some((g) => Math.hypot(g.posicao.x - x, g.posicao.y - y) < 0.42)) continue;
      const s = 0.8 + rand() * 0.6;
      lista.push({
        posicao: new THREE.Vector3(x, y, TOPO - 0.03),
        rotacao: new THREE.Euler(rand() * 3, rand() * 3, rand() * 3),
        escala: new THREE.Vector3(s, s * (0.7 + rand() * 0.3), s * 0.55),
      });
    }
    return lista;
  };

  return {
    esquerda: extrudar(esquerda),
    direita: extrudar(direita),
    gotasEsquerda: gotas(-1),
    gotasDireita: gotas(1),
  };
}

/** textura de massa assada: dourado no centro, borda mais escura, rachaduras e pintinhas */
export function criarTextura(leve: boolean) {
  const t = leve ? 256 : 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = t;
  const g = canvas.getContext("2d")!;
  const rand = semente(42);

  const fundo = g.createRadialGradient(t * 0.45, t * 0.42, t * 0.04, t / 2, t / 2, t * 0.5);
  fundo.addColorStop(0, "#efc282");
  fundo.addColorStop(0.65, "#d89d58");
  fundo.addColorStop(1, "#a4622a");
  g.fillStyle = fundo;
  g.fillRect(0, 0, t, t);

  for (let i = 0; i < t * 5; i++) {
    g.fillStyle = rand() > 0.5 ? "rgba(120,66,26,.2)" : "rgba(255,232,190,.16)";
    g.beginPath();
    g.arc(rand() * t, rand() * t, rand() * t * 0.005 + 0.4, 0, Math.PI * 2);
    g.fill();
  }

  g.lineCap = "round";
  g.lineJoin = "round";
  for (let k = 0; k < 16; k++) {
    let ang = rand() * Math.PI * 2;
    const r = rand() * t * 0.36;
    let x = t / 2 + Math.cos(ang) * r;
    let y = t / 2 + Math.sin(ang) * r;
    const caminho = new Path2D();
    caminho.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      ang += (rand() - 0.5) * 1.6;
      x += Math.cos(ang) * t * 0.04;
      y += Math.sin(ang) * t * 0.04;
      caminho.lineTo(x, y);
    }
    g.strokeStyle = "rgba(104,54,18,.6)";
    g.lineWidth = t * 0.009;
    g.stroke(caminho);
    g.save();
    g.translate(-t * 0.004, -t * 0.004);
    g.strokeStyle = "rgba(255,226,175,.35)";
    g.lineWidth = t * 0.003;
    g.stroke(caminho);
    g.restore();
  }

  // chocolate derretido escorrendo
  for (let k = 0; k < 7; k++) {
    const x = t * (0.2 + rand() * 0.6);
    const y = t * (0.2 + rand() * 0.6);
    g.fillStyle = "rgba(58,28,12,.85)";
    g.beginPath();
    g.ellipse(x, y, t * (0.012 + rand() * 0.02), t * (0.01 + rand() * 0.014), rand() * 3, 0, Math.PI * 2);
    g.fill();
  }

  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  // UVs da tampa = coordenadas da forma (-RAIO..RAIO) -> 0..1
  const escala = 1 / (RAIO * 2.3);
  textura.repeat.set(escala, escala);
  textura.offset.set(0.5, 0.5);
  textura.anisotropy = leve ? 1 : 4;
  return textura;
}
