import { expect, test } from "vitest";
import type Stripe from "stripe";
import { nombreCookiePago, puedeReutilizarse } from "@/lib/pagos";

const sesion = (status: string) =>
  ({ status }) as unknown as Stripe.Checkout.Session;

test("una sesión abierta se retoma", () => {
  expect(puedeReutilizarse(sesion("open"))).toBe(true);
});

test("una sesión ya pagada NO se retoma: cobraría de nuevo", () => {
  expect(puedeReutilizarse(sesion("complete"))).toBe(false);
});

test("una sesión expirada NO se retoma", () => {
  expect(puedeReutilizarse(sesion("expired"))).toBe(false);
});

test("sin sesión no hay nada que retomar", () => {
  expect(puedeReutilizarse(null)).toBe(false);
});

test("cada reto recuerda su propia sesión", () => {
  expect(nombreCookiePago("reto-30-dias")).toBe("pago_reto-30-dias");
  expect(nombreCookiePago("reto-30-dias")).not.toBe(
    nombreCookiePago("reto-90-dias"),
  );
});
