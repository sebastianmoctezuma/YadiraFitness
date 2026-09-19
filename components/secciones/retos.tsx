import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { precioMXN } from "@/lib/precio";
import { retos } from "@/lib/retos";
import { etiquetaModalidad } from "@/lib/types";

/**
 * Catálogo como programa, no como rejilla de tarjetas. La duración manda en
 * tamaño porque, sin precio publicado, es el dato que decide.
 */
export function Retos() {
  return (
    <section id="retos" className="scroll-mt-24 bg-bg py-16 sm:py-24">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="type-h2 max-w-[16ch] text-h1 text-ink">
            Elige cuánto trabajamos juntas
          </h2>
          <p className="max-w-[38ch] text-base text-ink-muted">
            Los dos retos incluyen lo mismo. Cambia el tiempo que dura el
            acompañamiento.
          </p>
        </Reveal>

        <ul className="mt-10 border-t border-line">
          {retos.map((reto, i) => (
            <Reveal as="li" key={reto.slug} delay={i * 100}>
              <Link
                href={`/retos/${reto.slug}`}
                className="group grid grid-cols-1 items-center gap-6 border-b border-line py-8 transition-colors duration-300 hover:bg-surface sm:grid-cols-[auto_1fr_auto] sm:gap-10 sm:py-10"
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="type-display text-[clamp(3.5rem,10vw,6rem)] text-ink transition-colors duration-300 group-hover:text-brand-text"
                    style={{ fontVariationSettings: '"wdth" 118' }}
                  >
                    {reto.duracionDias}
                  </span>
                  <span className="text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
                    días
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-h3 font-bold tracking-[-0.02em] text-ink">
                      {reto.nombre}
                    </h3>
                    {reto.etiqueta && (
                      <span className="rounded-full bg-brand px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.1em] text-ink uppercase">
                        {reto.etiqueta}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-[54ch] text-[0.95rem] leading-relaxed text-ink-muted">
                    {reto.descripcion}
                  </p>
                  <p className="mt-3 text-xs font-semibold tracking-[0.1em] text-ink-muted uppercase">
                    {etiquetaModalidad[reto.modalidad]}
                  </p>
                </div>

                <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-4">
                  {reto.precioMXN && (
                    <span className="text-lg font-extrabold tracking-[-0.01em] text-ink">
                      {precioMXN(reto.precioMXN)}
                    </span>
                  )}
                  {/* Botón de verdad, con liquid glass, y a ancho completo en
                      móvil: como texto suelto no se leía como algo tocable. */}
                  <span className="glass flex min-h-14 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-bold tracking-[0.06em] text-ink uppercase transition-colors duration-200 ease-out-quart group-hover:bg-ink group-hover:text-brand sm:w-auto">
                    Ver el reto
                    <span
                      aria-hidden
                      className="transition-transform duration-300 ease-out-quart group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 max-w-[54ch] text-sm text-ink-muted">
          Los cupos son limitados porque el entrenamiento es personal. El precio
          y la fecha de arranque se confirman por WhatsApp.
        </p>
      </div>
    </section>
  );
}
