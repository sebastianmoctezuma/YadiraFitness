import { cookies } from "next/headers";

export const COOKIE_PANEL = "panel";

/**
 * Comparación en tiempo constante. Con una llave de 32 bytes al azar un
 * ataque de tiempos es teórico, pero cuesta cuatro líneas hacerlo bien.
 */
function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) {
    diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferencia === 0;
}

export function llaveValida(candidata: string | undefined): boolean {
  const llave = process.env.PANEL_LLAVE;
  if (!llave || !candidata) return false;
  return iguales(candidata, llave);
}

/** Si quien entra trae la cookie buena. Sin ella el panel no existe. */
export async function tieneAcceso(): Promise<boolean> {
  const galleta = (await cookies()).get(COOKIE_PANEL)?.value;
  return llaveValida(galleta);
}

/**
 * Stripe entrega el teléfono pegado ("+528337778899") y así no se lee ni se
 * dicta. Solo se agrupan los mexicanos, que son todos: con otro país se
 * devuelve lo que vino, sin inventar un formato que podría estar mal.
 */
export function formatearTelefono(telefono: string | null): string {
  if (!telefono) return "—";
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length === 12 && digitos.startsWith("52")) {
    const n = digitos.slice(2);
    return `+52 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }
  return telefono;
}

/** Cada clienta con su enlace listo para escribirle sin teclear el número. */
export function enlaceWhatsapp(
  telefono: string | null,
  mensaje: string,
): string | null {
  const digitos = (telefono ?? "").replace(/\D/g, "");
  if (digitos.length < 10) return null;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}
