import { Boton } from "@/components/ui/boton";
import { site, whatsappUrl } from "@/lib/site";

export function CtaFinal() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-[var(--radius-blob)] bg-rosa-soft blur-3xl"
      />

      <div className="relative mx-auto max-w-[84rem] px-5 text-center sm:px-8">
        <p className="type-etiqueta text-brand-text">{site.temporada}</p>
        <h2 className="type-display mx-auto mt-5 max-w-[18ch] text-h1 text-ink">
          Reserva tu cupo
        </h2>
        <p className="mx-auto mt-6 max-w-[44ch] text-base leading-[1.8] text-ink-muted">
          Los lugares son limitados porque el entrenamiento es personal.
          Escríbeme y te cuento cómo empezamos.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Boton
            href={whatsappUrl(
              `Hola ${site.nombreCorto}, quiero reservar mi cupo.`,
            )}
          >
            Escribir por WhatsApp
          </Boton>
          <Boton href="#retos" variante="secundario">
            Ver los retos
          </Boton>
        </div>
      </div>
    </section>
  );
}
