import { expect, test } from "vitest";
import { claveIdempotencia, esPagoDuplicado, type FilaPago } from "@/lib/pagos";

const fila = (extra: Partial<FilaPago> = {}): FilaPago => ({
  stripe_session_id: "cs_nueva",
  stripe_payment_intent: "pi_1",
  reto: "reto-30-dias",
  monto: 250000,
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

test("no hay duplicado cuando es el primer pago", () => {
  expect(esPagoDuplicado(fila(), [])).toBe(false);
});

test("hay duplicado si ya existe otro pago cobrado del mismo correo y reto", () => {
  const previos = [{ stripe_session_id: "cs_vieja", estado: "pagado" }];
  expect(esPagoDuplicado(fila(), previos)).toBe(true);
});

test("reprocesar la MISMA sesión no cuenta como duplicado", () => {
  const previos = [{ stripe_session_id: "cs_nueva", estado: "pagado" }];
  expect(esPagoDuplicado(fila(), previos)).toBe(false);
});

test("un intento previo fallido o en proceso no cuenta como duplicado", () => {
  const previos = [
    { stripe_session_id: "cs_a", estado: "fallido" },
    { stripe_session_id: "cs_b", estado: "procesando" },
  ];
  expect(esPagoDuplicado(fila(), previos)).toBe(false);
});

test("un pago que aún no se cobra no se marca como duplicado", () => {
  const previos = [{ stripe_session_id: "cs_vieja", estado: "pagado" }];
  expect(esPagoDuplicado(fila({ estado: "procesando" }), previos)).toBe(false);
});

test("sin correo no se puede afirmar que sea duplicado", () => {
  const previos = [{ stripe_session_id: "cs_vieja", estado: "pagado" }];
  expect(esPagoDuplicado(fila({ email: null }), previos)).toBe(false);
});

test("la clave de idempotencia es la misma para el mismo intento", () => {
  expect(claveIdempotencia("sesion", "reto-30-dias", "abc-123")).toBe(
    claveIdempotencia("sesion", "reto-30-dias", "abc-123"),
  );
});

test("distinto intento, reto o propósito dan claves distintas", () => {
  const base = claveIdempotencia("sesion", "reto-30-dias", "abc-123");
  expect(claveIdempotencia("sesion", "reto-30-dias", "otro")).not.toBe(base);
  expect(claveIdempotencia("sesion", "reto-90-dias", "abc-123")).not.toBe(base);
  expect(claveIdempotencia("cliente", "reto-30-dias", "abc-123")).not.toBe(base);
});

test("el intento viene del navegador, así que se sanea y se acota", () => {
  const clave = claveIdempotencia("sesion", "reto-30-dias", "a b/c\n<script>");
  expect(clave).toBe("sesion:reto-30-dias:abcscript");
  expect(claveIdempotencia("sesion", "reto-30-dias", "x".repeat(200)).length)
    .toBeLessThanOrEqual(255);
});
