import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

const puntos = [
  "Se recalcula cada quince días según cómo vas respondiendo",
  "Incluye lista de súper y equivalencias para cambiar ingredientes",
  "Tiene versión para comer fuera de casa, porque va a pasar",
];

export function Nutricion() {
  return (
    <section className="bg-bg py-24 sm:py-32">
      <div className="mx-auto grid max-w-[88rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <h2 className="type-h2 max-w-[15ch] text-h2 text-ink">
            La dieta que <span className="mark">sí</span> vas a seguir
          </h2>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-muted">
            No hay alimentos prohibidos ni tuppers tristes. Armo tu plan con lo
            que ya comes y lo ajusto hasta que las cuentas salgan. Si odias el
            brócoli, no vas a comer brócoli.
          </p>

          <ul className="mt-8 space-y-4">
            {puntos.map((punto) => (
              <li key={punto} className="flex gap-3.5 text-[0.95rem] text-ink">
                <span
                  aria-hidden
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft"
                />
                <span className="max-w-[42ch] leading-relaxed">{punto}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Dos fotos desfasadas: rompe la rejilla y da profundidad sin recurrir
            a otra tarjeta. */}
        <Reveal className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] sm:aspect-[5/4] lg:aspect-[4/5]">
            <div className="absolute inset-y-0 left-0 w-[72%] overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1543353071-c953d88f7033?auto=format&fit=crop&w=900&q=80"
                alt="Dos recipientes de comida preparada con garbanzo, aguacate y arroz sobre mármol blanco"
                fill
                sizes="(max-width: 1024px) 70vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="glass absolute right-0 bottom-8 w-[52%] overflow-hidden rounded-3xl p-1.5">
              <div className="relative aspect-square overflow-hidden rounded-[1.35rem]">
                <Image
                  src="https://images.unsplash.com/photo-1606858374191-c18040e98ad7?auto=format&fit=crop&w=700&q=80"
                  alt="Salmón con quinoa y limón en un recipiente de vidrio, rodeado de acelgas frescas"
                  fill
                  sizes="(max-width: 1024px) 40vw, 18vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
