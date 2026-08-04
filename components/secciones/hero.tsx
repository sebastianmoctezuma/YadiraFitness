import Image from "next/image";
import { Boton } from "@/components/ui/boton";
import { site, whatsappUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="mesh-amarillo relative overflow-hidden bg-bg pt-32 pb-16 sm:pt-36 sm:pb-24">
      <div className="relative mx-auto grid max-w-[88rem] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            {site.temporada}
          </p>

          <h1 className="type-display mt-5 max-w-[13ch] text-display text-ink">
            {/* El marcatextos va sobre UNA palabra: si abarca un tramo que se
                parte en dos líneas, el trazo se derrama a lo ancho del bloque. */}
            Transfórmate en tu <span className="mark">mejor</span> versión
          </h1>

          <p className="mt-7 max-w-[48ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            Gym privado exclusivo de mujeres, a puerta cerrada. Aquí aprendes a
            llevar un estilo de vida saludable con un programa de entrenamiento
            personal, presencial o en línea.
          </p>

          {/* En móvil los botones van a ancho completo: así quedan alineados
              con el bloque de texto en vez de flotar desiguales a la izquierda. */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Boton href="#retos" className="w-full sm:w-auto">
              Ver los retos
            </Boton>
            {/* Oculto en móvil: ahí la barra fija ya ofrece esta misma acción y
                quedaban dos botones idénticos en la misma pantalla.
                Va en un envoltorio porque `hidden` sobre el propio botón no
                gana al `inline-flex` de su clase base: las dos son utilidades
                de display y el orden lo decide la hoja de estilos. */}
            <span className="hidden lg:block">
              <Boton
                href={whatsappUrl(
                  `Hola ${site.nombreCorto}, quiero reservar mi cupo.`,
                )}
                variante="secundario"
              >
                Reservar mi cupo
              </Boton>
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            <Image
              src="/coach-frontal.jpg"
              alt="Yadira, entrenadora personal, en el gym"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="object-cover object-top"
            />
          </div>

          {/* Liquid glass sobre la fotografía: deja ver la imagen debajo y
              mantiene legible el dato. */}
          <div className="glass absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full py-3 pr-6 pl-5 whitespace-nowrap">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand ring-4 ring-brand/25"
            />
            <span className="text-sm font-semibold text-ink">
              Presencial y en línea
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
