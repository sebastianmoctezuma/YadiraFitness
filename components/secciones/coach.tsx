import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export function Coach() {
  return (
    <section
      id="coach"
      className="mesh-amarillo-oscuro scroll-mt-24 bg-ink py-16 text-bg sm:py-24"
    >
      <div className="mx-auto grid max-w-[88rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          {/* Dos fotos desfasadas: da profundidad sin convertir la sección en
              una galería. */}
          <div className="relative mx-auto w-full max-w-[30rem]">
            <div className="relative aspect-[3/4] w-[78%] overflow-hidden rounded-3xl">
              <Image
                src="/coach-retrato.webp"
                alt="Yadira en el gym"
                fill
                sizes="(max-width: 1024px) 70vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-[-2.5rem] aspect-square w-[46%] overflow-hidden rounded-3xl border-4 border-ink">
              <Image
                src="/coach-estudio.webp"
                alt="Yadira entrenando"
                fill
                sizes="(max-width: 1024px) 40vw, 18vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-16 lg:mt-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            La coach
          </p>

          <h2 className="type-h2 mt-4 max-w-[16ch] text-h2 text-bg">
            Hola, soy {site.nombreCorto}
          </h2>

          <div className="mt-6 max-w-[52ch] space-y-4 text-base leading-[1.75] text-bg/75">
            <p>
              Entreno mujeres en un gym privado, a puerta cerrada, donde nadie
              te mira. Trabajo con pesas y cardio, y armo un programa de
              entrenamiento personal para cada quien.
            </p>
            <p>
              Aquí aprendes a llevar un estilo de vida saludable y, a la vez, a
              sacar tu mejor versión. Tengo certificación en nutrición fitness y
              suplementación deportiva.
            </p>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-bg/50">
            {site.programa} · {site.nombre}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
