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

/**
 * Qué decirle a la clienta al volver del checkout. No basta con "pagó o no":
 * con OXXO se lleva una ficha que todavía tiene que ir a pagar, y sin darle
 * el enlace a esa ficha se queda sin saber qué hacer.
 */
export type EstadoGracias =
  | { tipo: "pagado" }
  | { tipo: "oxxo"; vale: string | null }
  | { tipo: "transferencia" }
  | { tipo: "pendiente" };

export function estadoGracias(
  session: Stripe.Checkout.Session,
): EstadoGracias {
  if (session.payment_status === "paid") return { tipo: "pagado" };

  // Solo viene si la sesión se pidió con el payment_intent expandido.
  const intent =
    typeof session.payment_intent === "object" ? session.payment_intent : null;
  const siguiente = intent?.next_action;

  if (siguiente?.type === "oxxo_display_details") {
    return {
      tipo: "oxxo",
      vale: siguiente.oxxo_display_details?.hosted_voucher_url ?? null,
    };
  }
  if (siguiente?.type === "display_bank_transfer_instructions") {
    return { tipo: "transferencia" };
  }
  return { tipo: "pendiente" };
}

/**
 * El comprobante del cobro, alojado por Stripe: la clienta lo ve, lo descarga
 * en PDF y le sirve de respaldo de lo que pagó. No es una factura fiscal
 * (eso es CFDI y Stripe no lo emite), pero es el acuse que la gente espera.
 *
 * Solo existe cuando ya hubo cargo: con una ficha de OXXO sin pagar todavía
 * no hay nada que enseñar. Requiere la sesión con `payment_intent.latest_charge`
 * expandido.
 */
export function comprobanteDe(
  session: Stripe.Checkout.Session,
): string | null {
  const intent =
    typeof session.payment_intent === "object" ? session.payment_intent : null;
  const cargo = intent?.latest_charge;
  if (!cargo || typeof cargo === "string") return null;
  return cargo.receipt_url ?? null;
}

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
    // Sin reembolsos, la aceptación tiene que ser explícita y quedar
    // registrada: Stripe guarda en la sesión que esta persona marcó la
    // casilla, que es lo que se enseña si algún día disputa el cargo.
    // La URL de los términos se configura en el dashboard de Stripe.
    consent_collection: { terms_of_service: "required" },
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
