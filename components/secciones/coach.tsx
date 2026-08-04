import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export function Coach() {
  return (
    <section
      id="coach"
      className="scroll-mt-28 bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-[84rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <div className="relative">
            <div className="relative aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-[var(--radius-suave)]">
              <Image
                src="/coach-estudio.jpg"
                alt="Yadira entrenando en el gimnasio"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
            <div
              aria-hidden
              className="absolute -right-4 -bottom-8 -z-10 h-40 w-40 rounded-[var(--radius-blob)] bg-brand/50 blur-2xl sm:right-10"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="type-etiqueta text-brand-text">La coach</p>
          <h2 className="type-h2 mt-4 text-h2 text-ink">
            Hola, soy {site.nombreCorto}
          </h2>

          <div className="mt-6 max-w-[52ch] space-y-4 text-base leading-[1.8] text-ink-muted">
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

          <p className="type-etiqueta mt-8 text-ink">
            {site.programa} · {site.nombre}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
