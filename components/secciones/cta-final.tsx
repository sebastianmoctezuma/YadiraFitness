import { Boton } from "@/components/ui/boton";
import { retos } from "@/lib/retos";

const proximaFecha = new Date(retos[0].fechaInicio + "T00:00:00").toLocaleDateString(
  "es-MX",
  { day: "numeric", month: "long" },
);

/**
 * El único bloque donde el amarillo es la superficie completa. Cierra la página
 * con el mismo color con que la franja la abrió.
 */
export function CtaFinal() {
  return (
    <section className="bg-brand py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 text-center sm:px-8">
        <h2 className="type-display mx-auto max-w-[19ch] text-h1 text-ink">
          La siguiente generación arranca el{" "}
          {/* Sin cortar solo cuando cabe: a 390px "1 de septiembre" en una
              sola línea desbordaba el viewport. */}
          <span className="sm:whitespace-nowrap">{proximaFecha}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-base leading-relaxed text-ink/75">
          Cierro inscripciones tres días antes para tener listo tu plan a
          tiempo. Después de eso te toca esperar a la siguiente.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Boton href="#retos" variante="oscuro">
            Apartar mi lugar
          </Boton>
          <Boton href="#faq" variante="secundario">
            Tengo dudas
          </Boton>
        </div>
      </div>
    </section>
  );
}
