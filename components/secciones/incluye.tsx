import { Reveal } from "@/components/ui/reveal";
import { incluye } from "@/lib/retos";

export function Incluye() {
  return (
    <section
      id="incluye"
      className="scroll-mt-28 bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <Reveal className="max-w-[30ch]">
          <p className="type-etiqueta text-brand-text">Qué incluye</p>
          <h2 className="type-h2 mt-4 text-h2 text-ink">
            Todo lo que necesitas, resuelto
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {incluye.map((item, i) => (
            <Reveal as="li" key={item.titulo} delay={i * 90}>
              <span
                aria-hidden
                className="block h-12 w-12 rounded-[var(--radius-blob)] bg-brand"
              />
              <h3 className="type-h2 mt-5 text-h3 text-ink">{item.titulo}</h3>
              <p className="mt-3 text-[0.95rem] leading-[1.75] text-ink-muted">
                {item.detalle}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
