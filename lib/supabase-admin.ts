import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la llave secreta (rol de servicio): brinca RLS. Solo puede
 * importarse desde route handlers/páginas de servidor, nunca en cliente.
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } },
);
