import { expect, test } from "vitest";
import { mensajeDePago } from "@/lib/avisos";
import type { FilaPago } from "@/lib/pagos";

const fila = (extra: Partial<FilaPago> = {}): FilaPago => ({
  stripe_session_id: "cs_123",
  stripe_payment_intent: "pi_ABC123",
  reto: "reto-90-dias",
  monto: 650000,
  moneda: "mxn",
  descuento: 0,
  estado: "pagado",
  nombre: "Ana López",
  email: "ana@correo.com",
  telefono: "+528331234567",
  modalidad: "presencial",
  actualizado: "2026-09-20T00:00:00.000Z",
  ...extra,
});

/**
 * El contrato de este módulo: CallMeBot es un tercero al que la clienta no
 * autorizó, así que por ahí no viaja NADA suyo. Si alguien agrega el nombre
 * al mensaje "para que sea más útil", estas pruebas se caen.
 */
test("el aviso no lleva ningún dato de la clienta", () => {
  const texto = mensajeDePago(fila(), "Reto Transformación");
  expect(texto).not.toContain("Ana");
  expect(texto).not.toContain("López");
  expect(texto).not.toContain("ana@correo.com");
  expect(texto).not.toContain("8331234567");
});

test("dice lo que Yadira necesita saber de un vistazo", () => {
  const texto = mensajeDePago(fila(), "Reto Transformación");
  expect(texto).toContain("Reto Transformación");
  expect(texto).toContain("$6,500 MXN");
  expect(texto).toContain("presencial");
});

test("lleva el enlace al pago en Stripe, que es donde están los datos", () => {
  const texto = mensajeDePago(fila(), "Reto Transformación");
  expect(texto).toContain("https://dashboard.stripe.com/payments/pi_ABC123");
});

test("sin el id del cargo, manda a la lista de pagos", () => {
  const texto = mensajeDePago(
    fila({ stripe_payment_intent: null }),
    "Reto 30 días",
  );
  expect(texto).toContain("https://dashboard.stripe.com/payments");
});

test("avisa cuando el pago trae descuento aplicado", () => {
  const texto = mensajeDePago(
    fila({ monto: 520000, descuento: 130000 }),
    "Reto Transformación",
  );
  expect(texto).toContain("$5,200 MXN");
  expect(texto).toContain("descuento");
});
