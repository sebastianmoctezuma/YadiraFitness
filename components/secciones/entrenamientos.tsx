import { Reveal } from "@/components/ui/reveal";
import { entrenamientos } from "@/lib/retos";

/**
 * Lista larga en dos columnas separadas por filete. Una rejilla de siete
 * tarjetas iguales habría convertido siete cosas distintas en un patrón.
 */
export function Entrenamientos() {
  return (
    <section className="bg-bg py-24 sm:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <p className="type-etiqueta text-brand-text">Cómo entrenamos</p>
          <h2 className="type-h2 mt-4 max-w-[16ch] text-h2 text-ink">
            El programa se adapta a ti
          </h2>
          <p className="mt-6 max-w-[38ch] text-[0.95rem] leading-[1.8] text-ink-muted">
            No importa de dónde partas. Se trabaja igual con quien nunca ha
            entrenado que con quien quiere construir músculo.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <ul className="border-t border-line">
            {entrenamientos.map((item) => (
              <li
                key={item.titulo}
                className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <h3 className="text-base font-medium text-ink sm:w-[16rem] sm:shrink-0">
                  {item.titulo}
                </h3>
                <p className="text-[0.95rem] leading-relaxed text-ink-muted">
                  {item.detalle}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
