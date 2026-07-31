"use client";

import Image from "next/image";
import { useState } from "react";
import type { Transformacion } from "@/lib/types";

/**
 * Comparador antes/después.
 *
 * Va sobre un <input type="range"> real en vez de un arrastre a mano: se opera
 * con teclado y con lector de pantalla sin escribir nada extra, y el arrastre
 * con el dedo sigue funcionando igual.
 */
function Comparador({ item }: { item: Transformacion }) {
  const [posicion, setPosicion] = useState(50);

  return (
    <figure>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface select-none">
        <Image
          src={item.despuesSrc}
          alt={`Después: ${item.alt}`}
          fill
          sizes="(max-width: 768px) 90vw, 45vw"
          className="object-cover"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - posicion}% 0 0)` }}
        >
          <Image
            src={item.antesSrc}
            alt={`Antes: ${item.alt}`}
            fill
            sizes="(max-width: 768px) 90vw, 45vw"
            className="object-cover"
          />
        </div>

        <span className="glass-dark pointer-events-none absolute top-4 left-4 rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase">
          Antes
        </span>
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-brand px-3 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-ink uppercase">
          Después
        </span>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[3px] bg-brand"
          style={{ left: `${posicion}%`, transform: "translateX(-50%)" }}
        >
          <span className="glass absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm text-ink">
            ↔
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={posicion}
          onChange={(e) => setPosicion(Number(e.target.value))}
          aria-label={`Comparar antes y después de ${item.nombre}`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3">
        <span className="text-base font-bold text-ink">{item.nombre}</span>
        <span className="text-sm text-ink-muted">{item.resultado}</span>
      </figcaption>
    </figure>
  );
}

export function Transformaciones({ items }: { items: Transformacion[] }) {
  return (
    <section id="resultados" className="scroll-mt-24 bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="type-h2 max-w-[13ch] text-h2 text-ink">
            Lo que pasa en 90 días
          </h2>
          <p className="max-w-[36ch] text-sm text-ink-muted">
            Arrastra la barra para comparar. Ningún resultado está retocado y
            cada foto se publica con permiso por escrito de la persona.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {items.map((item) => (
            <Comparador key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
