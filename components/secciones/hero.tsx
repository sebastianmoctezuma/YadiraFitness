import Image from "next/image";
import { Boton } from "@/components/ui/boton";
import { site, whatsappUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="mesh-amarillo relative overflow-hidden bg-bg pt-28 pb-12 sm:pt-32 sm:pb-16">
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

          {/* Texto de Yadira. Va partido en dos porque son dos cosas distintas
              —el gancho y lo que hay dentro—, y un solo bloque de este largo se
              lee como un muro. El primero queda en tinta plena y el segundo en
              gris: sin esa diferencia, ninguno de los dos manda. */}
          <div className="mt-7 max-w-[48ch] space-y-4">
            <p className="text-base leading-relaxed font-medium text-ink sm:text-lg">
              El reto tan esperado por todas, el que ha cambiado la vida de
              miles de mujeres. ¿Estás cansada de intentarlo todo? Esto es para
              ti: soy tu primera o tu última opción, compruébalo.
            </p>
            <p className="text-base leading-relaxed text-ink-muted">
              Gym exclusivo para mujeres donde aprenderás a llevar un estilo de
              vida saludable con un entrenamiento personal, ya sea presencial u
              online, como tú decidas. El resultado te sorprenderá.
            </p>
          </div>

          {/* En móvil los botones van a ancho completo: así quedan alineados
              con el bloque de texto en vez de flotar desiguales a la izquierda. */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Boton href="/#retos" className="w-full sm:w-auto">
              Ver los retos
            </Boton>
            {/* Se llama por lo que hace, no "Reservar mi cupo": ese texto lleva
                siempre al catálogo, y aquí abriría WhatsApp. Dos botones con el
                mismo rótulo y distinto destino confunden.
                Oculto en móvil, donde la barra fija ya ocupa ese lugar. Va en un
                envoltorio porque `hidden` sobre el propio botón no gana al
                `inline-flex` de su clase base: las dos son utilidades de display
                y el orden lo decide la hoja de estilos. */}
            <span className="hidden lg:block">
              <Boton
                href={whatsappUrl(
                  `Hola ${site.nombreCorto}, tengo una duda sobre los retos.`,
                )}
                variante="secundario"
              >
                Escríbeme por WhatsApp
              </Boton>
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="deriva-scroll relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            <Image
              src="/coach-frontal.webp"
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
