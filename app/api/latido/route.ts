import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Consulta mínima que Vercel Cron dispara a diario (ver vercel.json). Existe
 * porque el plan Free de Supabase pausa el proyecto tras ~7 días sin
 * actividad, y el sitio solo toca la base cuando entra un pago o se abre el
 * panel: una semana floja bastaba para que el webhook dejara de registrar.
 *
 * Vercel manda CRON_SECRET como Bearer; sin él la ruta no hace nada.
 */
export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return new Response("No autorizado", { status: 401 });
  }

  const { error } = await getSupabaseAdmin()
    .from("pagos")
    .select("stripe_session_id")
    .limit(1);
  if (error) {
    console.error("latido: Supabase no respondió", error);
    return new Response("Supabase no respondió", { status: 500 });
  }

  return new Response("ok", { headers: { "cache-control": "no-store" } });
}
