import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { retos } from "@/lib/retos";
import { etiquetaModalidad } from "@/lib/types";

/**
 * Dos retos, sin precio ni fecha porque todavía no están definidos. En su
 * lugar manda la duración, que es lo único cerrado.
 */
export function Retos() {
  return (
    <section id="retos" className="scroll-mt-28 bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <Reveal className="max-w-[34ch]">
          <p className="type-etiqueta text-brand-text">Los retos</p>
          <h2 className="type-h2 mt-4 text-h2 text-ink">
            Elige cuánto tiempo trabajamos juntas
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-8 md:grid-cols-2">
          {retos.map((reto, i) => (
            <Reveal as="li" key={reto.slug} delay={i * 120}>
              <Link
                href={`/retos/${reto.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-suave)] bg-surface transition-shadow duration-500 ease-out-quart hover:shadow-[0_28px_60px_-30px_oklch(0.27_0.021_30/0.35)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={reto.imagen}
                    alt={reto.imagenAlt}
                    fill
                    sizes="(max-width: 768px) 92vw, 42vw"
                    className="object-cover transition-transform duration-700 ease-out-quart group-hover:scale-[1.04]"
                  />
                  <span className="glass absolute top-4 left-4 rounded-full px-4 py-2 text-sm text-ink">
                    <strong className="font-medium">{reto.duracionDias}</strong>{" "}
                    días
                  </span>
                  {reto.temporada && (
                    <span className="absolute top-4 right-4 rounded-full bg-brand px-4 py-2 text-xs font-medium text-ink">
                      {reto.temporada}ª temporada
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <h3 className="type-h2 text-h3 text-ink">{reto.nombre}</h3>
                  <p className="mt-1.5 text-sm text-brand-text">
                    {reto.tagline}
                  </p>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-[1.75] text-ink-muted">
                    {reto.descripcion}
                  </p>

                  <p className="type-etiqueta mt-6 text-ink-muted">
                    {etiquetaModalidad[reto.modalidad]}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors group-hover:text-brand-text">
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

        <p className="mt-8 max-w-[52ch] text-sm text-ink-muted">
          Los cupos son limitados porque el entrenamiento es personal.
          Escríbeme y vemos cuál te conviene.
        </p>
      </div>
    </section>
  );
}
