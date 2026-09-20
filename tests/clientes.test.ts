import { afterEach, beforeEach, expect, test, vi } from "vitest";

/**
 * El build de Next evalúa los módulos de cada ruta para recolectar sus datos,
 * y en Vercel eso ocurre sin los secretos del runtime. Si un cliente se
 * construye al importar el módulo, el build entero falla. Estas pruebas
 * blindan esa frontera: importar nunca toca las llaves, solo llamar lo hace.
 */

const SIN_LLAVES = {
  STRIPE_SECRET_KEY: undefined,
  SUPABASE_URL: undefined,
  SUPABASE_SECRET_KEY: undefined,
};

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("STRIPE_SECRET_KEY", "");
  vi.stubEnv("SUPABASE_URL", "");
  vi.stubEnv("SUPABASE_SECRET_KEY", "");
  for (const clave of Object.keys(SIN_LLAVES)) delete process.env[clave];
});

afterEach(() => {
  vi.unstubAllEnvs();
});

test("importar el cliente de Stripe sin llave no lanza", async () => {
  await expect(import("@/lib/stripe")).resolves.toBeDefined();
});

test("usar el cliente de Stripe sin llave lanza un error legible", async () => {
  const { getStripe } = await import("@/lib/stripe");
  expect(() => getStripe()).toThrow(/STRIPE_SECRET_KEY/);
});

test("importar el cliente de Supabase sin llaves no lanza", async () => {
  await expect(import("@/lib/supabase-admin")).resolves.toBeDefined();
});

test("usar el cliente de Supabase sin llaves lanza un error legible", async () => {
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  expect(() => getSupabaseAdmin()).toThrow(/SUPABASE_/);
});

test("con llaves presentes, el cliente se construye una sola vez", async () => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_llave_de_prueba");
  const { getStripe } = await import("@/lib/stripe");
  expect(getStripe()).toBe(getStripe());
});
