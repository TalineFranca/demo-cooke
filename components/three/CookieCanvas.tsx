"use client";

import { ContactShadows, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { criarCookie, criarTextura, type Gota } from "./geometria";
import { Migalhas } from "./Migalhas";

type Props = {
  aberto: boolean;
  /** false quando o hero sai da tela: o canvas para de renderizar */
  visivel: boolean;
  leve: boolean;
  reduzido: boolean;
  onPronto?: () => void;
};

/** giroscópio no celular (quando o navegador entrega o evento sem pedir permissão) */
function useGiroscopio() {
  const ref = useRef({ x: 0, y: 0, ativo: false });
  useEffect(() => {
    const limitar = (v: number) => Math.max(-1, Math.min(1, v));
    const girar = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      ref.current = { x: limitar(e.gamma / 30), y: limitar((e.beta - 45) / 30), ativo: true };
    };
    window.addEventListener("deviceorientation", girar);
    return () => window.removeEventListener("deviceorientation", girar);
  }, []);
  return ref;
}

function GotasDeChocolate({ gotas, leve }: { gotas: Gota[]; leve: boolean }) {
  const geometria = useMemo(() => new THREE.IcosahedronGeometry(0.12, leve ? 0 : 1), [leve]);
  useEffect(() => () => geometria.dispose(), [geometria]);
  return (
    <>
      {gotas.map((g, i) => (
        <mesh key={i} geometry={geometria} position={g.posicao} rotation={g.rotacao} scale={g.escala}>
          <meshStandardMaterial color="#3a1c0e" roughness={0.32} />
        </mesh>
      ))}
    </>
  );
}

function Cookie({ aberto, leve, reduzido }: Omit<Props, "onPronto" | "visivel">) {
  const cookie = useMemo(() => criarCookie(leve), [leve]);
  const textura = useMemo(() => criarTextura(leve), [leve]);
  const materiais = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ map: textura, bumpMap: textura, bumpScale: 2.5, roughness: 0.82 }),
      new THREE.MeshStandardMaterial({ map: textura, color: "#e2b47a", bumpMap: textura, bumpScale: 4, roughness: 0.95 }),
    ],
    [textura],
  );

  useEffect(
    () => () => {
      cookie.esquerda.dispose();
      cookie.direita.dispose();
      textura.dispose();
      materiais.forEach((m) => m.dispose());
    },
    [cookie, textura, materiais],
  );

  const grupo = useRef<THREE.Group>(null);
  const metadeE = useRef<THREE.Group>(null);
  const metadeD = useRef<THREE.Group>(null);
  const progresso = useRef(0);
  const giro = useGiroscopio();
  const { viewport } = useThree();
  // cabe na largura e na altura (celular deitado, tablet em pé…)
  const escala = Math.min(0.6, viewport.width / 6, viewport.height / 5.2);

  useFrame((state, dt) => {
    const alvo = aberto ? 1 : 0;
    progresso.current = reduzido ? alvo : THREE.MathUtils.damp(progresso.current, alvo, 5.5, dt);
    const p = progresso.current;
    const e = metadeE.current;
    const d = metadeD.current;
    const g = grupo.current;
    if (!e || !d || !g) return;

    e.position.set(-p * 1.3, -p * 0.12, p * 0.1);
    e.rotation.set(0, -p * 0.32, p * 0.24);
    d.position.set(p * 1.3, p * 0.1, p * 0.1);
    d.rotation.set(0, p * 0.3, -p * 0.16);

    if (!reduzido) {
      const px = giro.current.ativo ? giro.current.x : state.pointer.x;
      const py = giro.current.ativo ? giro.current.y : state.pointer.y;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.45, 4, dt);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -0.38 - py * 0.3, 4, dt);
    }
  });

  return (
    <>
      <Float enabled={!reduzido} speed={1.6} rotationIntensity={0.25} floatIntensity={0.6}>
        <group ref={grupo} scale={escala} rotation={[-0.38, 0, 0]}>
          <group ref={metadeE}>
            <mesh geometry={cookie.esquerda} material={materiais} />
            <GotasDeChocolate gotas={cookie.gotasEsquerda} leve={leve} />
          </group>
          <group ref={metadeD}>
            <mesh geometry={cookie.direita} material={materiais} />
            <GotasDeChocolate gotas={cookie.gotasDireita} leve={leve} />
          </group>
        </group>
      </Float>
      {!reduzido && <Migalhas aberto={aberto} quantidade={leve ? 18 : 46} escala={escala} />}
    </>
  );
}

export default function CookieCanvas({ aberto, visivel, leve, reduzido, onPronto }: Props) {
  return (
    <Canvas
      dpr={leve ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !leve, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.5], fov: 35 }}
      frameloop={visivel ? "always" : "never"}
      onCreated={() => onPronto?.()}
      aria-hidden="true"
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} color="#fff0d8" />
      {/* contraluz rosa da marca */}
      <directionalLight position={[-4, -1, -3]} intensity={2.2} color="#F5A6CF" />
      <pointLight position={[0, -2, 3]} intensity={6} color="#7a6cff" distance={8} />
      <Cookie aberto={aberto} leve={leve} reduzido={reduzido} />
      {!leve && <ContactShadows position={[0, -2.1, 0]} opacity={0.4} scale={9} blur={2.6} far={4} color="#05023a" />}
    </Canvas>
  );
}
