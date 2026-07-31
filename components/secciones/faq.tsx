import { whatsappUrl } from "@/lib/site";
import type { PreguntaFrecuente } from "@/lib/types";

/**
 * Acordeón sobre <details>/<summary> nativos: teclado, lector de pantalla y
 * "buscar en la página" funcionan sin escribir una línea de JavaScript.
 *
 * Este bloque cubre además el chatbot de FAQ del alcance: mismas preguntas,
 * sin costo y sin dependencias.
 */
export function Faq({ items }: { items: PreguntaFrecuente[] }) {
  return (
    <section id="faq" className="scroll-mt-24 bg-bg py-24 sm:py-32">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h2 className="type-h2 max-w-[12ch] text-h2 text-ink">
            Antes de que preguntes
          </h2>
          <p className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink-muted">
            ¿Falta la tuya? Mándamela por WhatsApp y te contesto yo, no un bot.
          </p>
          <a
            href={whatsappUrl("Hola Yadira, tengo una duda sobre los retos:")}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-ink underline decoration-brand decoration-[3px] underline-offset-[6px] transition-colors hover:text-brand-text"
          >
            Escríbeme
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="border-t border-line">
          {items.map((item) => (
            <details
              key={item.pregunta}
              className="group border-b border-line py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[1.05rem] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {item.pregunta}
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-transform duration-300 ease-out-quart group-open:rotate-45 group-open:border-brand group-open:bg-brand"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-muted">
                {item.respuesta}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
