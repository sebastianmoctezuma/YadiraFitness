import { expect, test } from "vitest";
import type Stripe from "stripe";
import {
  construirParamsCheckout,
  estadoDePago,
  sesionAFila,
} from "@/lib/pagos";

const sesion = (extra: object = {}) =>
  ({
    id: "cs_test_123",
    payment_intent: "pi_123",
    payment_status: "paid",
    amount_total: 650000,
    currency: "mxn",
    total_details: { amount_discount: 130000 },
    metadata: { reto: "reto-90-dias" },
    customer_details: {
      name: "Ana López",
      email: "ana@correo.com",
      phone: "+528331234567",
    },
    custom_fields: [{ key: "modalidad", dropdown: { value: "presencial" } }],
    ...extra,
  }) as unknown as Stripe.Checkout.Session;

test("pago con tarjeta queda pagado", () => {
  expect(estadoDePago("checkout.session.completed", sesion())).toBe("pagado");
});

test("SPEI sin confirmar queda procesando", () => {
  expect(
    estadoDePago(
      "checkout.session.completed",
      sesion({ payment_status: "unpaid" }),
    ),
  ).toBe("procesando");
});

test("transferencia fallida queda fallido", () => {
  expect(estadoDePago("checkout.session.async_payment_failed", sesion())).toBe(
    "fallido",
  );
});

test("sesionAFila mapea todos los campos", () => {
  const fila = sesionAFila("checkout.session.completed", sesion());
  expect(fila).toMatchObject({
    stripe_session_id: "cs_test_123",
    stripe_payment_intent: "pi_123",
    reto: "reto-90-dias",
    monto: 650000,
    moneda: "mxn",
    descuento: 130000,
    estado: "pagado",
    nombre: "Ana López",
    email: "ana@correo.com",
    telefono: "+528331234567",
    modalidad: "presencial",
  });
  expect(typeof fila.actualizado).toBe("string");
});

test("construirParamsCheckout arma la sesión con SPEI y modalidad", () => {
  const params = construirParamsCheckout({
    slug: "reto-30-dias",
    priceId: "price_abc",
    origen: "http://localhost:3000",
  });
  expect(params.mode).toBe("payment");
  expect(params.line_items).toEqual([{ price: "price_abc", quantity: 1 }]);
  expect(params.payment_method_types).toEqual(["card", "customer_balance"]);
  expect(params.customer_creation).toBe("always");
  expect(params.phone_number_collection).toEqual({ enabled: true });
  expect(params.success_url).toBe(
    "http://localhost:3000/gracias?session_id={CHECKOUT_SESSION_ID}",
  );
  expect(params.cancel_url).toBe("http://localhost:3000/retos/reto-30-dias");
  expect(params.metadata).toEqual({ reto: "reto-30-dias" });
  expect(params.discounts).toBeUndefined();
});

test("con promo activa la aplica", () => {
  const params = construirParamsCheckout({
    slug: "reto-90-dias",
    priceId: "price_xyz",
    origen: "https://yadira-fitness.vercel.app",
    promotionCodeId: "promo_1",
  });
  expect(params.discounts).toEqual([{ promotion_code: "promo_1" }]);
});
