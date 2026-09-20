import { expect, test } from "vitest";
import { enlaceWhatsapp, formatearTelefono, llaveValida } from "@/lib/panel";

test("el teléfono se lee de un vistazo", () => {
  expect(formatearTelefono("+528337778899")).toBe("+52 833 777 8899");
  expect(formatearTelefono("528334445566")).toBe("+52 833 444 5566");
});

test("un teléfono con formato raro se deja como está, no se inventa", () => {
  expect(formatearTelefono("+1 415 555 0100")).toBe("+1 415 555 0100");
  expect(formatearTelefono(null)).toBe("—");
});

test("el enlace de WhatsApp lleva el número limpio y el mensaje", () => {
  const url = enlaceWhatsapp("+52 833 777 8899", "Hola");
  expect(url).toBe("whatsapp://send?phone=528337778899&text=Hola");
});

test("sin teléfono no hay enlace que ofrecer", () => {
  expect(enlaceWhatsapp(null, "Hola")).toBe(null);
  expect(enlaceWhatsapp("123", "Hola")).toBe(null);
});

test("una llave que no es la del panel no abre nada", () => {
  process.env.PANEL_LLAVE = "la-buena";
  expect(llaveValida("la-buena")).toBe(true);
  expect(llaveValida("la-mala")).toBe(false);
  expect(llaveValida("la-buena-mas-larga")).toBe(false);
  expect(llaveValida(undefined)).toBe(false);
});

test("un espacio invisible al pegar la llave no deja fuera a nadie", () => {
  process.env.PANEL_LLAVE = "la-buena \n";
  expect(llaveValida("la-buena")).toBe(true);
  expect(llaveValida(" la-buena ")).toBe(true);
  expect(llaveValida("la-mala")).toBe(false);
});
