import { expect, test } from "vitest";
import type Stripe from "stripe";
import { comprobanteDe, estadoGracias } from "@/lib/pagos";

const sesion = (extra: object) =>
  ({ payment_status: "unpaid", ...extra }) as unknown as Stripe.Checkout.Session;

test("pago con tarjeta: el cupo ya está", () => {
  expect(estadoGracias(sesion({ payment_status: "paid" }))).toEqual({
    tipo: "pagado",
  });
});

test("OXXO: se le entrega su ficha para pagar en tienda", () => {
  const s = sesion({
    payment_intent: {
      next_action: {
        type: "oxxo_display_details",
        oxxo_display_details: {
          hosted_voucher_url: "https://payments.stripe.com/oxxo/voucher_123",
        },
      },
    },
  });
  expect(estadoGracias(s)).toEqual({
    tipo: "oxxo",
    vale: "https://payments.stripe.com/oxxo/voucher_123",
  });
});

test("transferencia: se avisa que el banco tarda", () => {
  const s = sesion({
    payment_intent: {
      next_action: { type: "display_bank_transfer_instructions" },
    },
  });
  expect(estadoGracias(s)).toEqual({ tipo: "transferencia" });
});

test("sin saber qué método fue, el mensaje es genérico", () => {
  expect(estadoGracias(sesion({ payment_intent: "pi_123" }))).toEqual({
    tipo: "pendiente",
  });
});

test("un pago pagado manda aunque traiga next_action vieja", () => {
  const s = sesion({
    payment_status: "paid",
    payment_intent: { next_action: { type: "oxxo_display_details" } },
  });
  expect(estadoGracias(s)).toEqual({ tipo: "pagado" });
});

test("cuando hay cargo, se ofrece su comprobante de Stripe", () => {
  const s = {
    payment_status: "paid",
    payment_intent: {
      latest_charge: { receipt_url: "https://pay.stripe.com/receipts/abc123" },
    },
  } as unknown as Stripe.Checkout.Session;
  expect(comprobanteDe(s)).toBe("https://pay.stripe.com/receipts/abc123");
});

test("sin cargo todavía (OXXO sin pagar) no hay comprobante que ofrecer", () => {
  const s = {
    payment_status: "unpaid",
    payment_intent: { latest_charge: null },
  } as unknown as Stripe.Checkout.Session;
  expect(comprobanteDe(s)).toBe(null);
});

test("si la sesión no viene expandida, no se inventa un enlace", () => {
  const s = { payment_intent: "pi_123" } as unknown as Stripe.Checkout.Session;
  expect(comprobanteDe(s)).toBe(null);
});
