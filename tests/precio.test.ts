import { expect, test } from "vitest";
import { precioMXN } from "@/lib/precio";

test("formatea pesos con separador de miles y sufijo MXN", () => {
  expect(precioMXN(2500)).toBe("$2,500 MXN");
  expect(precioMXN(6500)).toBe("$6,500 MXN");
});
