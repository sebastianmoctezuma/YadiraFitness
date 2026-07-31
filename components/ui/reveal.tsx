"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Retraso en ms, para escalonar los hijos de una misma lista. */
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "header";
};

/**
 * Revela el contenido cuando entra en pantalla.
 *
 * El estado por defecto en el HTML es visible; solo se oculta si el script del
 * layout marcó `js-reveal` en <html>. Así el contenido nunca depende de que la
 * transición se dispare (las transiciones se pausan en pestañas ocultas y en
 * renderers headless, y esa es la forma clásica de publicar una sección vacía).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.dataset.revealed = "true";
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            el.dataset.revealed = "true";
            observador.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — el ref es del elemento concreto que renderiza Tag
      ref={ref}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
