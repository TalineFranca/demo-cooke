"use client";

import { motion } from "framer-motion";

const MASSA = "#e2ad68";
const CHOCO = "#3b1d0f";
const ROYAL = "#1A0FB5";
const BEBE = "#F5A6CF";

type P = { ativo: boolean };
const loop = (ativo: boolean, duracao: number, extra = {}) =>
  ativo ? { duration: duracao, repeat: Infinity, ease: "easeInOut" as const, ...extra } : { duration: 0.3 };

/** 01 — a massa sendo mexida, gotas caindo na tigela */
export function AnimMassa({ ativo }: P) {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      {[60, 100, 135].map((x, i) => (
        <motion.ellipse
          key={x}
          cx={x}
          rx="5"
          ry="4"
          fill={CHOCO}
          initial={false}
          animate={ativo ? { cy: [-10, 82], opacity: [1, 1, 0] } : { cy: -10, opacity: 0 }}
          transition={loop(ativo, 1.1, { delay: i * 0.37, ease: "easeIn" })}
        />
      ))}
      <motion.ellipse
        cx="100"
        cy="88"
        rx={62}
        ry={16}
        fill={MASSA}
        initial={false}
        animate={ativo ? { rx: [62, 66, 58, 62], ry: [16, 13, 19, 16] } : { rx: 62, ry: 16 }}
        transition={loop(ativo, 1.2)}
      />
      <motion.g
        style={{ originX: "100px", originY: "88px" }}
        initial={false}
        animate={ativo ? { rotate: [-22, 22, -22] } : { rotate: 0 }}
        transition={loop(ativo, 1.2)}
      >
        <rect x="96" y="14" width="8" height="74" rx="4" fill="#fff" />
        <ellipse cx="100" cy="86" rx="11" ry="7" fill="#fff" />
      </motion.g>
      <path d="M30 88 Q30 150 100 150 Q170 150 170 88 Z" fill={BEBE} />
      <path d="M26 88 H174" stroke={BEBE} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

/** 02 — bolinhas caindo na assadeira e achatando */
export function AnimBolinha({ ativo }: P) {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      <rect x="14" y="128" width="172" height="10" fill="#fff" />
      {[50, 100, 150].map((x, i) => (
        <motion.ellipse
          key={x}
          cx={x}
          fill={MASSA}
          stroke="#b97a3c"
          strokeWidth="2"
          initial={false}
          animate={
            ativo
              ? { cy: [20, 108, 112, 106, 108], rx: [18, 18, 24, 17, 19], ry: [18, 18, 12, 19, 17] }
              : { cy: 108, rx: 19, ry: 17 }
          }
          transition={loop(ativo, 1.6, { delay: i * 0.25, times: [0, 0.45, 0.55, 0.7, 1], repeatDelay: 0.6, ease: "easeOut" })}
        />
      ))}
    </svg>
  );
}

/** 03 — o forno: a bolinha espalha, doura e racha */
export function AnimForno({ ativo }: P) {
  const t = loop(ativo, 3, { repeatDelay: 0.6, times: [0, 0.6, 1] });
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      <rect x="20" y="10" width="160" height="140" fill={ROYAL} stroke="#fff" strokeWidth="4" />
      <motion.rect
        x="36"
        y="40"
        width="128"
        height="90"
        fill="#ff9f43"
        initial={false}
        animate={ativo ? { opacity: [0.35, 0.8, 0.5] } : { opacity: 0.2 }}
        transition={loop(ativo, 1.4, { repeatType: "mirror" })}
      />
      <rect x="36" y="40" width="128" height="90" fill="none" stroke="#fff" strokeWidth="3" />
      {[50, 72, 94].map((x) => (
        <circle key={x} cx={x} cy="25" r="5" fill={BEBE} />
      ))}
      <motion.text
        x="164"
        y="30"
        textAnchor="end"
        fill="#fff"
        className="font-display"
        fontSize="16"
        initial={false}
        animate={ativo ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
        transition={loop(ativo, 1)}
      >
        180°
      </motion.text>
      <motion.ellipse
        cx="100"
        cy="102"
        initial={false}
        animate={ativo ? { rx: [16, 40, 40], ry: [14, 11, 11], fill: ["#f0cc93", "#d18b45", "#d18b45"] } : { rx: 40, ry: 11, fill: "#d18b45" }}
        transition={t}
      />
      <motion.path
        d="M78 101 L88 98 L95 104 L106 99 L114 103 L122 100"
        fill="none"
        stroke="#7a4214"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={false}
        animate={ativo ? { pathLength: [0, 0, 1], opacity: [0, 0, 1] } : { pathLength: 1, opacity: 1 }}
        transition={t}
      />
    </svg>
  );
}

/** 04 — a caixa chegando com tudo */
export function AnimEntrega({ ativo }: P) {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full overflow-visible" aria-hidden="true">
      <motion.g
        initial={false}
        animate={ativo ? { x: [-160, 8, -4, 0, 0, 220] } : { x: 0 }}
        transition={loop(ativo, 3.2, { times: [0, 0.25, 0.32, 0.38, 0.8, 1], repeatDelay: 0.2 })}
      >
        {[60, 80, 100].map((y, i) => (
          <motion.rect
            key={y}
            x={10 - i * 8}
            y={y}
            height="4"
            fill="#fff"
            initial={false}
            animate={ativo ? { width: [40, 0, 0, 0, 0, 40], opacity: [1, 0, 0, 0, 0, 1] } : { width: 0 }}
            transition={loop(ativo, 3.2, { times: [0, 0.25, 0.32, 0.38, 0.8, 1], repeatDelay: 0.2 })}
          />
        ))}
        <rect x="60" y="56" width="96" height="70" fill={BEBE} />
        <rect x="54" y="46" width="108" height="16" fill={ROYAL} stroke={BEBE} strokeWidth="3" />
        <rect x="102" y="46" width="12" height="80" fill="#fff" />
      </motion.g>
      <motion.text
        x="108"
        y="30"
        textAnchor="middle"
        fill={BEBE}
        fontSize="22"
        className="font-display"
        initial={false}
        animate={ativo ? { scale: [0, 0, 1.2, 1, 1, 0], opacity: [0, 0, 1, 1, 1, 0] } : { scale: 1, opacity: 1 }}
        transition={loop(ativo, 3.2, { times: [0, 0.3, 0.38, 0.45, 0.78, 0.82], repeatDelay: 0.2 })}
        style={{ originX: "108px", originY: "24px" }}
      >
        CHEGOU!
      </motion.text>
    </svg>
  );
}
