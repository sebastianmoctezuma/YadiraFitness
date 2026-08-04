import { Boton } from "@/components/ui/boton";
import { site, whatsappUrl } from "@/lib/site";

/**
 * El único bloque donde el amarillo toma toda la superficie. Cierra la página
 * con el mismo color con que la franja la abrió.
 */
export function CtaFinal() {
  return (
    <section className="bg-brand py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 text-center sm:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-ink/75 uppercase">
          {site.temporada}
        </p>
        <h2 className="type-display mx-auto mt-5 max-w-[14ch] text-h1 text-ink">
          Reserva tu cupo
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-base leading-relaxed text-ink/75">
          Los lugares son limitados porque el entrenamiento es personal.
          Escríbeme y te digo cómo empezamos.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Boton
            href={whatsappUrl(
              `Hola ${site.nombreCorto}, quiero reservar mi cupo.`,
            )}
            variante="oscuro"
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
