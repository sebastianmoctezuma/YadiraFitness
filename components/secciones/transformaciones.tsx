"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { transformaciones } from "@/lib/retos";

/**
 * Carrusel de antes y después.
 *
 * Va sobre scroll nativo con `scroll-snap` en vez de una librería: el gesto de
 * deslizar en el teléfono ya funciona sin JavaScript, el scroll con teclado
 * también, y no añade peso. Las flechas son un extra para ratón, no el único
 * modo de avanzar.
 */
export function Transformaciones() {
  const pista = useRef<HTMLDivElement>(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(false);

  const revisarBordes = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setAlInicio(el.scrollLeft <= 8);
    setAlFinal(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    revisarBordes();
    const el = pista.current;
    if (!el) return;
    el.addEventListener("scroll", revisarBordes, { passive: true });
    window.addEventListener("resize", revisarBordes);
    return () => {
      el.removeEventListener("scroll", revisarBordes);
      window.removeEventListener("resize", revisarBordes);
    };
  }, [revisarBordes]);

  const mover = (direccion: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const paso = el.querySelector("li")?.clientWidth ?? el.clientWidth;
    el.scrollBy({ left: direccion * (paso + 16), behavior: "smooth" });
  };

  return (
    <section
      id="resultados"
      className="scroll-mt-24 overflow-hidden border-y border-line bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="type-h2 max-w-[16ch] text-h2 text-ink">
            Ellas ya lo hicieron
          </h2>

          <div className="flex items-center gap-3">
            <p className="max-w-[30ch] text-sm text-ink-muted">
              Desliza para ver más.
            </p>
            {/* Solo con ratón: en el teléfono el gesto ya avanza. */}
            <div className="hidden gap-2 lg:flex">
              <button
                type="button"
                onClick={() => mover(-1)}
                disabled={alInicio}
                aria-label="Ver anteriores"
                className="glass flex h-12 w-12 items-center justify-center rounded-full text-ink transition-opacity disabled:pointer-events-none disabled:opacity-35"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => mover(1)}
                disabled={alFinal}
                aria-label="Ver siguientes"
                className="glass flex h-12 w-12 items-center justify-center rounded-full text-ink transition-opacity disabled:pointer-events-none disabled:opacity-35"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* La pista sangra hasta el borde para que se vea que hay más a la
          derecha; el padding la vuelve a alinear con el resto de la página.
          El rol de región va en el contenedor, no en la <ul>: puesto en la
          lista le quita su rol y los <li> se quedan sin padre válido. */}
      <div
        ref={pista}
        tabIndex={0}
        role="region"
        aria-label="Transformaciones de clientas"
        className="mt-12 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex snap-x snap-mandatory gap-4 px-5 pb-4 sm:px-8">
          {transformaciones.map((item, i) => (
            <li
              key={item.src}
              className="w-[78vw] max-w-[26rem] shrink-0 snap-center sm:w-[22rem] lg:w-[24rem]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-bg">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 78vw, 24rem"
                  loading={i < 2 ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <p className="mt-4 max-w-[60ch] text-sm text-ink-muted">
          Resultados reales de clientas del programa, publicados con su permiso.
          Cada cuerpo responde distinto: estas fotos no son una promesa de
          resultado.
        </p>
      </div>
    </section>
  );
}
