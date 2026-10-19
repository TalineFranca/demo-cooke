"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Migalha = { p: THREE.Vector3; v: THREE.Vector3; giro: THREE.Euler; tamanho: number; viva: boolean };

const GRAVIDADE = 7;

/** migalhas que saltam da rachadura quando o cookie parte — física simples, sem engine */
export function Migalhas({ aberto, quantidade, escala }: { aberto: boolean; quantidade: number; escala: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const boneco = useMemo(() => new THREE.Object3D(), []);
  const migalhas = useMemo<Migalha[]>(
    () =>
      Array.from({ length: quantidade }, () => ({
        p: new THREE.Vector3(),
        v: new THREE.Vector3(),
        giro: new THREE.Euler(),
        tamanho: 0,
        viva: false,
      })),
    [quantidade],
  );

  useEffect(() => {
    if (!aberto) return;
    migalhas.forEach((m) => {
      m.p.set((Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 2.6, 0.25 + Math.random() * 0.2);
      m.v.set((Math.random() - 0.5) * 3.2, 0.4 + Math.random() * 2.4, Math.random() * 1.6);
      m.tamanho = 0.025 + Math.random() * 0.06;
      m.viva = true;
    });
  }, [aberto, migalhas]);

  useFrame((_, delta) => {
    const malha = ref.current;
    if (!malha) return;
    const dt = Math.min(delta, 1 / 30);
    migalhas.forEach((m, i) => {
      if (m.viva) {
        m.v.y -= GRAVIDADE * dt;
        m.p.addScaledVector(m.v, dt);
        m.giro.x += dt * 5;
        m.giro.y += dt * 3;
        if (m.p.y < -5) m.viva = false;
      }
      boneco.position.copy(m.p).multiplyScalar(escala);
      boneco.rotation.copy(m.giro);
      boneco.scale.setScalar(m.viva ? m.tamanho * escala : 0);
      boneco.updateMatrix();
      malha.setMatrixAt(i, boneco.matrix);
    });
    malha.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, quantidade]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#cf914b" roughness={0.9} />
    </instancedMesh>
  );
}
