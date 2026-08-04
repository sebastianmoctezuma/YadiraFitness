import { Reveal } from "@/components/ui/reveal";
import { incluye } from "@/lib/retos";

export function Incluye() {
  return (
    <section
      id="incluye"
      className="scroll-mt-24 border-y border-line bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <Reveal className="max-w-[30ch]">
          <h2 className="type-h2 text-h2 text-ink">Qué incluye tu reto</h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
          {incluye.map((item, i) => (
            <Reveal
              as="li"
              key={item.titulo}
              delay={i * 70}
              className="border-t border-ink/15 pt-6"
            >
              <h3 className="text-base font-bold tracking-[-0.01em] text-ink">
                {item.titulo}
              </h3>
              <p className="mt-2.5 max-w-[38ch] text-[0.95rem] leading-relaxed text-ink-muted">
                {item.detalle}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
