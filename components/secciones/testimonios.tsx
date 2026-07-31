import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import type { Testimonio } from "@/lib/types";

export function Testimonios({ items }: { items: Testimonio[] }) {
  return (
    <section className="border-y border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <h2 className="type-h2 max-w-[18ch] text-h2 text-ink">
          Lo dicen ellas, no yo
        </h2>

        {/* Sin cajas: filetes y aire. Tres tarjetas idénticas habrían
            convertido tres voces distintas en un solo bloque. */}
        <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={i * 100}
              className="border-t border-ink/15 pt-7"
            >
              <blockquote className="text-[1.05rem] leading-[1.65] text-ink">
                <span aria-hidden className="text-brand-text">
                  “
                </span>
                {item.cita}
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <Image
                  src={item.avatarSrc}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-ink">{item.nombre}</p>
                  <p className="text-xs text-ink-muted">{item.reto}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
