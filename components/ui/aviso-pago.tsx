"use client";

import { useSearchParams } from "next/navigation";

/**
 * Lo que ve la clienta cuando el pago no pudo ni empezar. Se lee en cliente a
 * propósito: así la página del reto sigue siendo estática y servida desde el
 * CDN, en vez de renderizarse en cada visita solo por un aviso que casi nunca
 * aparece.
 */
const avisos: Record<string, string> = {
  error:
    "No pudimos abrir la pantalla de pago. No se te cobró nada. Inténtalo otra vez o escríbeme por WhatsApp y lo resolvemos.",
  cerrado:
    "La venta de esta generación acaba de cerrarse. Escríbeme por WhatsApp para apartar la siguiente.",
};

export function AvisoPago() {
  const aviso = avisos[useSearchParams().get("pago") ?? ""];
  if (!aviso) return null;

  return (
    <p
      role="status"
      className="mt-4 rounded-2xl border border-ink/15 bg-brand-soft px-5 py-4 text-[0.95rem] leading-relaxed text-ink"
    >
      {aviso}
    </p>
  );
}
