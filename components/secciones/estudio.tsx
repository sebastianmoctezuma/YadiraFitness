import { Reveal } from "@/components/ui/reveal";
import { gym } from "@/lib/retos";

export function Estudio() {
  return (
    <section
      id="estudio"
      className="mesh-amarillo scroll-mt-24 border-y border-line bg-surface py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <Reveal className="max-w-[30ch]">
          <h2 className="type-h2 text-h2 text-ink">
            Un gym donde entrenar sin sentirte observada
          </h2>
        </Reveal>

        <ul className="mt-10 grid gap-x-10 gap-y-11 sm:grid-cols-3">
          {gym.map((item, i) => (
            <Reveal
              as="li"
              key={item.titulo}
              delay={i * 90}
              className="border-t border-ink/20 pt-6"
            >
              <h3 className="text-h3 font-bold tracking-[-0.02em] text-ink">
                {item.titulo}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink-muted">
                {item.detalle}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
