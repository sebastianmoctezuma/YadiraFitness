import type Stripe from "stripe";

/** El promotion code del 20% anticipado; se activa desde el dashboard. */
export const CODIGO_ANTICIPADO = "ANTICIPADO20";

export type FilaPago = {
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  reto: string;
  monto: number;
  moneda: string;
  descuento: number;
  estado: "pagado" | "procesando" | "fallido";
  nombre: string | null;
  email: string | null;
  telefono: string | null;
  modalidad: string | null;
  actualizado: string;
};

/** Dónde se recuerda la sesión de pago abierta de cada reto. */
export const nombreCookiePago = (slug: string) => `pago_${slug}`;

/**
 * Si la clienta se salió y vuelve, retomar su sesión en vez de abrir otra.
 *
 * Solo cuando sigue `open`: una sesión `complete` ya se pagó —reabrirla sería
 * cobrar de nuevo— y una `expired` ya no sirve. Stripe las expira solas a las
 * 24 h, así que al día siguiente se abre una nueva sin que nadie lo decida.
 */
export function puedeReutilizarse(
  session: Stripe.Checkout.Session | null,
): boolean {
  return session?.status === "open";
}

/**
 * Clave de idempotencia para Stripe. El `intento` lo genera el navegador al
 * cargar la página del reto, así que dos envíos del mismo formulario —doble
 * clic, reenvío, reintento de red— comparten clave y Stripe devuelve LA MISMA
 * sesión en vez de abrir otra. Viene de afuera: se sanea y se acota.
 */
export function claveIdempotencia(
  proposito: string,
  slug: string,
  intento: string,
): string {
  const limpio = intento.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
  return `${proposito}:${slug}:${limpio}`;
}

/**
 * Un cobro doble genuino ocurre en Stripe, no aquí, y no se puede impedir
 * desde el sitio. Esto solo lo hace visible: la fila nueva se marca cuando el
 * mismo correo ya tiene cobrado ese reto en OTRA sesión.
 */
export function esPagoDuplicado(
  fila: FilaPago,
  previos: { stripe_session_id: string; estado: string }[],
): boolean {
  if (fila.estado !== "pagado" || !fila.email) return false;
  return previos.some(
    (p) => p.estado === "pagado" && p.stripe_session_id !== fila.stripe_session_id,
  );
}

export function estadoDePago(
  tipoEvento: string,
  session: Stripe.Checkout.Session,
): FilaPago["estado"] {
  if (tipoEvento === "checkout.session.async_payment_failed") return "fallido";
  return session.payment_status === "paid" ? "pagado" : "procesando";
}

export function sesionAFila(
  tipoEvento: string,
  session: Stripe.Checkout.Session,
): FilaPago {
  const modalidad =
    session.custom_fields?.find((c) => c.key === "modalidad")?.dropdown
      ?.value ?? null;
  return {
    stripe_session_id: session.id,
    stripe_payment_intent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
    reto: session.metadata?.reto ?? "desconocido",
    monto: session.amount_total ?? 0,
    moneda: session.currency ?? "mxn",
    descuento: session.total_details?.amount_discount ?? 0,
    estado: estadoDePago(tipoEvento, session),
    nombre: session.customer_details?.name ?? null,
    email: session.customer_details?.email ?? null,
    telefono: session.customer_details?.phone ?? null,
    modalidad,
    actualizado: new Date().toISOString(),
  };
}

export function construirParamsCheckout(opts: {
  slug: string;
  priceId: string;
  origen: string;
  /** SPEI (customer_balance) exige un Customer ya creado; lo crea la ruta. */
  customerId: string;
  promotionCodeId?: string;
}): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: [{ price: opts.priceId, quantity: 1 }],
    // Los métodos NO se fijan aquí: los decide lo que esté activo en el
    // dashboard de Stripe. Fijarlos rompía la cuenta live, donde la
    // transferencia SPEI no está habilitada y el checkout ni se abría.
    // Activar OXXO o SPEI mañana no requiere tocar este archivo.
    customer: opts.customerId,
    phone_number_collection: { enabled: true },
    custom_fields: [
      {
        key: "modalidad",
        label: { type: "custom", custom: "¿Cómo vas a entrenar?" },
        type: "dropdown",
        dropdown: {
          options: [
            { label: "Presencial, en el gym", value: "presencial" },
            { label: "En línea", value: "online" },
          ],
        },
      },
    ],
    ...(opts.promotionCodeId
      ? { discounts: [{ promotion_code: opts.promotionCodeId }] }
      : {}),
    metadata: { reto: opts.slug },
    success_url: `${opts.origen}/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origen}/retos/${opts.slug}`,
    locale: "es-419",
  };
}
