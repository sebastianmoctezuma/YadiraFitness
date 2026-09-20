"use client";

import { useEffect, useState } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] transition-[background-color,color,transform,box-shadow] duration-200 ease-out-quart";

/**
 * El botón de pago. Se bloquea en el primer clic porque cada envío abre una
 * sesión de pago distinta: dos clics dejaban a la clienta con dos pestañas de
 * cobro vivas.
 *
 * Doble cinturón, porque el bloqueo visual depende de que React alcance a
 * repintar: `onSubmit` cancela cualquier envío posterior, y el campo `intento`
 * —un identificador que nace en el navegador con la página— viaja al servidor
 * como clave de idempotencia, así que si aun así llegaran dos peticiones,
 * Stripe devuelve la misma sesión en vez de abrir otra.
 *
 * Sin JavaScript el formulario sigue funcionando como envío nativo de toda la
 * vida; solo se pierden el bloqueo y la clave.
 */

/**
 * El giro es el único aviso de que algo está pasando mientras Stripe
 * responde. Quien pidió menos movimiento ve el círculo quieto: el texto
 * "Preparando tu pago…" ya dice lo mismo sin marear.
 */
const Girito = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="h-[18px] w-[18px] motion-safe:animate-spin"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="3"
      className="opacity-25"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export function FormaPago({
  slug,
  etiqueta = "Pagar y reservar mi cupo",
  claseForm = "mt-6",
  claseBoton = "w-full bg-brand text-ink shadow-[0_6px_20px_-6px_oklch(0.875_0.183_99_/_0.9)] hover:bg-ink hover:text-brand hover:shadow-none active:translate-y-px disabled:cursor-wait disabled:bg-ink disabled:text-brand disabled:shadow-none",
}: {
  slug: string;
  etiqueta?: string;
  claseForm?: string;
  claseBoton?: string;
}) {
  const [enviando, setEnviando] = useState(false);
  const [intento, setIntento] = useState("");

  // Tras hidratar, no en el render: en el HTML prerenderizado este valor es
  // el mismo para todas las visitantes y no serviría para distinguir envíos.
  useEffect(() => {
    setIntento(crypto.randomUUID());
  }, []);

  return (
    <form
      action="/api/checkout"
      method="POST"
      className={claseForm}
      onSubmit={(e) => {
        if (enviando) {
          e.preventDefault();
          return;
        }
        setEnviando(true);
      }}
    >
      <input type="hidden" name="reto" value={slug} />
      <input type="hidden" name="intento" value={intento} />
      <button
        type="submit"
        disabled={enviando}
        aria-busy={enviando}
        className={`${base} ${claseBoton}`}
      >
        {enviando ? (
          <>
            <Girito />
            Preparando tu pago…
          </>
        ) : (
          etiqueta
        )}
      </button>
    </form>
  );
}
