import Image from "next/image";
import { Boton } from "@/components/ui/boton";
import { site, whatsappUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* Mancha de color detrás del titular. Es lo que da el aire de estudio
          en vez de cartel de gimnasio. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-32 h-[34rem] w-[34rem] rounded-[var(--radius-blob)] bg-brand-soft blur-3xl sm:-left-16"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-[-10rem] h-[28rem] w-[28rem] rounded-[var(--radius-blob)] bg-rosa-soft blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[84rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div>
          <p className="type-etiqueta text-brand-text">{site.temporada}</p>

          <h1 className="type-display mt-5 text-display text-ink">
            Transfórmate en tu{" "}
            <span className="subrayado">mejor versión</span>
          </h1>

          <p className="mt-7 max-w-[46ch] text-lg leading-[1.7] text-ink-muted">
            Gym privado exclusivo de mujeres, a puerta cerrada. Aquí aprendes a
            llevar un estilo de vida saludable con un programa de entrenamiento
            personal, presencial o en línea.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Boton href="#retos">Ver los retos</Boton>
            <Boton
              href={whatsappUrl(
                `Hola ${site.nombreCorto}, quiero reservar mi cupo.`,
              )}
              variante="secundario"
            >
              Reservar mi cupo
            </Boton>
          </div>

          <p className="mt-7 text-sm text-ink-muted">
            Contamos con cocina propia para elaborar tu dieta.
          </p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-suave)] shadow-[0_30px_70px_-30px_oklch(0.27_0.021_30/0.4)]">
            <Image
              src="/coach-retrato.jpg"
              alt="Yadira, entrenadora personal, en el estudio"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover object-top"
            />
          </div>

          {/* Liquid glass sobre la fotografía: deja ver la imagen debajo y
              mantiene legible el dato. */}
          <div className="glass absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full py-3 pr-6 pl-5 whitespace-nowrap">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full bg-brand ring-4 ring-brand/25"
            />
            <span className="text-sm font-normal text-ink">
              Presencial y en línea
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
