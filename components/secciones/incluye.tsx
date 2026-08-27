import { Reveal } from "@/components/ui/reveal";
import { incluye } from "@/lib/retos";

/**
 * Dibujos de línea a medida, no un set de iconos genérico: trazo de tinta con
 * remates redondos (el mismo lenguaje que los botones pill) y, detrás, el
 * marcatextos amarillo inclinado que firma todo el sitio. El shaker es un
 * guiño al termo amarillo Team Yadira de las fotos.
 *
 * La clave viene de `Punto.icono`; si un punto no trae, simplemente no lleva
 * dibujo. Todos comparten trazo 1.8 sobre viewBox de 24 para que pesen igual.
 */
const iconos: Record<string, React.ReactNode> = {
  comidas: (
    <>
      <path d="M5.5 3v4.5a2.5 2.5 0 0 0 5 0V3" />
      <path d="M8 3v4.5" />
      <path d="M8 10v11" />
      <ellipse cx="16.5" cy="6" rx="2.6" ry="3.5" />
      <path d="M16.5 9.5V21" />
    </>
  ),
  rutina: (
    <>
      <path d="M6.5 8v8" />
      <path d="M3.5 9.5v5" />
      <path d="M17.5 8v8" />
      <path d="M20.5 9.5v5" />
      <path d="M6.5 12h11" />
    </>
  ),
  tecnica: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2.5V5" />
      <path d="M12 19v2.5" />
      <path d="M2.5 12H5" />
      <path d="M19 12h2.5" />
      <path d="m9 12.2 2.1 2.1 4.2-4.3" />
    </>
  ),
  mediciones: (
    <>
      <path d="m3 16.5 13.5-13.5L21 7.5 7.5 21 3 16.5Z" />
      <path d="m8 11.5 1.8 1.8" />
      <path d="m11 8.5 1.8 1.8" />
      <path d="m14 5.5 1.8 1.8" />
    </>
  ),
  suplementacion: (
    <>
      <path d="M9.2 3h5.6l1.2 4H8l1.2-4Z" />
      <path d="M8 7l1 12.3a1.9 1.9 0 0 0 1.9 1.7h2.2a1.9 1.9 0 0 0 1.9-1.7L16 7" />
      <path d="M9.4 12h5.2" />
    </>
  ),
  modalidad: (
    <>
      <rect x="7.5" y="2.5" width="9" height="19" rx="2.2" />
      <path d="m10.8 9.3 4.3 2.7-4.3 2.7Z" />
      <path d="M10.8 5.5h2.4" />
    </>
  ),
};

export function Incluye() {
  return (
    <section
      id="incluye"
      className="scroll-mt-24 border-y border-line bg-surface py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <Reveal className="max-w-[30ch]">
          <h2 className="type-h2 text-h2 text-ink">Qué incluye tu reto</h2>
        </Reveal>

        <ul className="mt-10 grid gap-x-10 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
          {incluye.map((item, i) => (
            <Reveal
              as="li"
              key={item.titulo}
              delay={i * 70}
              className="border-t border-ink/15 pt-6"
            >
              {item.icono && (
                /* El swipe cubre solo la mitad baja del dibujo: pasada de
                   marcador bajo el trazo, no chip de color detrás de un icono. */
                <span aria-hidden className="relative inline-flex isolate">
                  <span className="absolute -inset-x-1 top-[52%] -bottom-0.5 -skew-x-[9deg] bg-brand" />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative h-[26px] w-[26px] text-ink"
                  >
                    {iconos[item.icono]}
                  </svg>
                </span>
              )}
              <h3 className="mt-4 text-base font-bold tracking-[-0.01em] text-ink">
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
