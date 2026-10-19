import Image from "next/image";
import type { Cookie } from "@/data/cardapio";
import { cn } from "@/lib/aleatorio";
import { CookieArt } from "./CookieArt";

/** foto real recortada (PNG sem fundo) se existir em data/cardapio.ts; senão, o desenho */
export function FotoCookie({
  cookie,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  cookie: Cookie;
  className?: string;
  sizes?: string;
}) {
  if (cookie.foto) {
    return (
      <span className={cn("relative block", className)}>
        <Image src={cookie.foto} alt={`Cookie ${cookie.nome}`} fill sizes={sizes} className="object-contain" />
      </span>
    );
  }
  return <CookieArt visual={cookie.visual} seed={cookie.id} className={className} />;
}
