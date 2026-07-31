import Image from "next/image";
import { Boton } from "@/components/ui/boton";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export function Coach() {
  return (
    <section id="coach" className="scroll-mt-24 bg-ink py-24 text-bg sm:py-32">
      <div className="mx-auto grid max-w-[88rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1584863265045-f9d10ca7fa61?auto=format&fit=crop&w=1000&q=80"
              alt="Yadira de pie en el gimnasio, junto a un rack de discos, mirando a cámara"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          {/* Texto claro sobre fondo oscuro: line-height un punto más alto,
              porque la tipografía en claro se lee más ligera. */}
          <h2 className="type-h2 max-w-[16ch] text-h2 text-bg">
            Hola, soy {site.nombreCorto}
          </h2>
          <div className="mt-6 max-w-[52ch] space-y-4 text-base leading-[1.75] text-bg/75">
            <p>
              Llevo ocho años entrenando mujeres en {site.ciudad} y perdí la
              cuenta de cuántas llegaron después de tres dietas que no
              funcionaron. Casi nunca fue falta de disciplina: fue que el plan
              no estaba hecho para su vida.
            </p>
            <p>
              Por eso trabajo por retos con fecha de inicio y de fin. Un
              principio, un final y alguien que te pregunta cómo vas antes de
              que te caigas.
            </p>
          </div>

          <p
            className="mt-8 text-[1.75rem] text-brand"
            style={{ fontVariationSettings: '"wdth" 88', fontWeight: 500 }}
          >
            {site.nombre}
          </p>

          <Boton href="#retos" className="mt-8">
            Ver los retos
          </Boton>
        </Reveal>
      </div>
    </section>
  );
}
