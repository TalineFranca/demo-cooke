import { useId } from "react";
import { cn } from "@/lib/aleatorio";

/** cookie mordido que faz o papel do acento do "ê" */
export function CookieMordido({ className, gotas = "#1A0FB5" }: { className?: string; gotas?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <mask id={`mordida${id}`}>
        <rect width="40" height="40" fill="#fff" />
        <circle cx="35" cy="7" r="7" fill="#000" />
        <circle cx="40" cy="16" r="5.5" fill="#000" />
        <circle cx="27" cy="1" r="5.5" fill="#000" />
      </mask>
      <g mask={`url(#mordida${id})`}>
        <circle cx="20" cy="21" r="17" fill="currentColor" />
        <circle cx="13" cy="17" r="2.6" fill={gotas} />
        <circle cx="22" cy="28" r="2.4" fill={gotas} />
        <circle cx="12" cy="28" r="1.8" fill={gotas} />
        <circle cx="26" cy="17" r="2" fill={gotas} />
        <circle cx="30" cy="27" r="1.5" fill={gotas} />
      </g>
    </svg>
  );
}

type Props = { className?: string; gotas?: string };

/** "Cookê": rosa, arredondado, inclinado, com o cookie mordido no lugar do acento */
export function Logo({ className, gotas }: Props) {
  return (
    <span
      role="img"
      aria-label="Cookê"
      className={cn(
        "font-logo inline-flex -skew-x-[9deg] items-baseline font-bold leading-none tracking-[-0.04em] text-bebe",
        className,
      )}
    >
      <span aria-hidden="true">Cook</span>
      <span aria-hidden="true" className="relative inline-block">
        e
        <CookieMordido
          gotas={gotas}
          className="absolute left-1/2 top-[-0.06em] h-[0.42em] w-[0.42em] -translate-x-1/2 rotate-[14deg]"
        />
      </span>
    </span>
  );
}
