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
  promotionCodeId?: string;
}): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: [{ price: opts.priceId, quantity: 1 }],
    payment_method_types: ["card", "customer_balance"],
    payment_method_options: {
      customer_balance: {
        funding_type: "bank_transfer",
        bank_transfer: { type: "mx_bank_transfer" },
      },
    },
    // SPEI (customer_balance) exige que la sesión cree un customer.
    customer_creation: "always",
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
