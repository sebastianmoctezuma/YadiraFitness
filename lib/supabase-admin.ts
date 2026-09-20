import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

/**
 * Cliente con la llave secreta (rol de servicio): brinca RLS. Solo puede
 * usarse desde route handlers/páginas de servidor, nunca en cliente.
 *
 * Perezoso por la misma razón que [getStripe](stripe.ts): durante el build no
 * hay secretos, y construirlo al importar tumbaría el despliegue.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.SUPABASE_URL;
  const llave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !llave) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_SECRET_KEY",
    );
  }

  cliente = createClient(url, llave, { auth: { persistSession: false } });
  return cliente;
}
