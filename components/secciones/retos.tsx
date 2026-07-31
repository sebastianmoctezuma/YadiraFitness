import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { retos } from "@/lib/retos";
import { etiquetaModalidad } from "@/lib/types";

const precio = (mxn: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(mxn);

/**
 * Catálogo como programa, no como rejilla de tarjetas.
 *
 * Cada reto es una fila: la duración manda en tamaño porque es literalmente lo
 * que se compra, y las filas separadas por filete se leen como un calendario de
 * generaciones. Una rejilla de tres tarjetas idénticas habría dicho lo mismo
 * con menos carácter.
 */
export function Retos() {
  return (
    <section id="retos" className="scroll-mt-24 bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="type-h2 max-w-[14ch] text-h1 text-ink">
            Elige cuánto te aguantas
          </h2>
          <p className="max-w-[38ch] text-base text-ink-muted">
            Los dos incluyen dieta y rutina. Cambia el tiempo que trabajamos
            juntas y qué tan lejos llega el cambio.
          </p>
        </Reveal>

        <ul className="mt-14 border-t border-line">
          {retos.map((reto, i) => (
            <Reveal as="li" key={reto.slug} delay={i * 90}>
              <Link
                href={`/retos/${reto.slug}`}
                className="group grid grid-cols-1 items-center gap-6 border-b border-line py-8 transition-colors duration-300 hover:bg-surface sm:grid-cols-[auto_1fr_auto] sm:gap-10 sm:py-10"
              >
                {/* La duración es el dato que se compra: le toca el tamaño. */}
                <div className="flex items-baseline gap-2">
                  <span
                    className="type-display text-[clamp(3.5rem,10vw,6rem)] text-ink transition-colors duration-300 group-hover:text-brand-text"
                    style={{ fontVariationSettings: '"wdth" 118' }}
                  >
                    {reto.duracionDias}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
                    días
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-h3 font-bold tracking-[-0.02em] text-ink">
                      {reto.nombre}
                    </h3>
                    {reto.destacado && (
                      <span className="rounded-full bg-brand px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-ink">
                        El más elegido
                      </span>
                    )}
                  </div>
                  <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-muted">
                    {reto.tagline}. {reto.descripcion}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
                    {reto.incluye.length} cosas incluidas
                    <span aria-hidden className="mx-2 text-line">
                      ·
                    </span>
                    {etiquetaModalidad[reto.modalidad]}
                  </p>
                </div>

                <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-4">
                  <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-2xl lg:block">
                    <Image
                      src={reto.imagen}
                      alt={reto.imagenAlt}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 ease-out-quart group-hover:scale-105"
                    />
                  </div>
                  <div className="text-left sm:text-right">
                    {reto.precioAnteriorMXN && (
                      <p className="text-sm text-ink-muted line-through">
                        {precio(reto.precioAnteriorMXN)}
                      </p>
                    )}
                    <p className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
                      {precio(reto.precioMXN)}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition-colors group-hover:text-brand-text">
                      Ver el reto
                      <span
                        aria-hidden
                        className="transition-transform duration-300 ease-out-quart group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 text-sm text-ink-muted">
          Pago único, sin mensualidades. Si no te queda claro cuál es el tuyo,
          escríbeme y lo vemos.
        </p>
      </div>
    </section>
  );
}
