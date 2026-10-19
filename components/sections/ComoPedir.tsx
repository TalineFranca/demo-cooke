import { linkWhatsApp } from "@/lib/pedido";

const PASSOS = [
  { titulo: "Escolhe", texto: "Avulso, na caixa ou os dois. Ninguém tá julgando." },
  { titulo: "Chama no zap", texto: "A mensagem já vai escrita. Você só aperta enviar e fica olhando o “digitando…”." },
  { titulo: "Crava os dentes", texto: "Retira aqui em Carapicuíba ou a gente entrega na região. Comer em pé na cozinha é permitido." },
];

export function ComoPedir() {
  return (
    <section id="como-pedir" aria-labelledby="titulo-como" className="relative px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="titulo-como" className="font-display text-[12vw] uppercase leading-[0.85] md:text-[4.5vw]">
          Como pedir <span className="text-bebe">(é fácil, juro)</span>
        </h2>

        <ol className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo} className="border-t border-white/25 pt-4">
              <span aria-hidden="true" className="texto-vazado-rosa block font-display text-7xl leading-none md:text-8xl">
                {i + 1}
              </span>
              <h3 className="mt-3 font-display text-2xl uppercase leading-none md:text-3xl">{passo.titulo}</h3>
              <p className="mt-2 max-w-[32ch] text-sm leading-snug text-white/70">{passo.texto}</p>
            </li>
          ))}
        </ol>

        <a
          href={linkWhatsApp("Oi, Cookê! Bateu o Cookê Time. O que tem pra hoje?")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-block bg-bebe px-5 py-3 font-display text-lg uppercase leading-none text-royal transition-colors hover:bg-white"
        >
          Chamar no WhatsApp &gt;&gt;&gt;
        </a>
      </div>
    </section>
  );
}
