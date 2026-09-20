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
  // Se recorta de los dos lados: al pegar la llave en el panel de Vercel se
  // cuela un espacio o un salto de línea con facilidad, y un acceso que
  // falla por un carácter invisible es de lo más difícil de diagnosticar.
  const llave = process.env.PANEL_LLAVE?.trim();
  candidata = candidata?.trim();
  if (!llave) {
    // Hacia fuera esto es un 404 mudo, como debe ser. Pero sin esta línea,
    // "el panel no abre" y "la llave está mal" se ven idénticos en los
    // registros, y son problemas distintos.
    console.warn("panel: falta la variable PANEL_LLAVE; nadie puede entrar");
    return false;
  }
  if (!candidata) return false;
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

/**
 * Cada clienta con su enlace listo para escribirle sin teclear el número.
 *
 * Abre la app directamente (`whatsapp://`) en vez de pasar por wa.me, que
 * mete una pantalla intermedia de "continuar al chat". Este panel lo usa solo
 * Yadira, que obviamente tiene WhatsApp instalado; para las clientas, en el
 * sitio público, se sigue usando wa.me porque ahí sí puede no estar.
 */
export function enlaceWhatsapp(
  telefono: string | null,
  mensaje: string,
): string | null {
  const digitos = (telefono ?? "").replace(/\D/g, "");
  if (digitos.length < 10) return null;
  return `whatsapp://send?phone=${digitos}&text=${encodeURIComponent(mensaje)}`;
}
