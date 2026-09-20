/**
 * Qué configuración ve el servidor. Existe porque un "404" o un aviso que no
 * llega se ven igual si falta una variable, si llegó con un espacio de más o
 * si el despliegue es viejo, y sin acceso al panel de Vercel no había forma
 * de distinguirlos.
 *
 * Nunca devuelve valores: solo si están, cuánto miden y cómo empiezan las que
 * no son secretas. Con eso se detecta el error típico —copiar de más o de
 * menos— sin exponer nada.
 */
const estado = (valor: string | undefined) =>
  valor
    ? { presente: true, largo: valor.length, espacios: valor !== valor.trim() }
    : { presente: false };

export async function GET() {
  return Response.json(
    {
      stripe: {
        llave: {
          ...estado(process.env.STRIPE_SECRET_KEY),
          modo: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")
            ? "live"
            : process.env.STRIPE_SECRET_KEY?.startsWith("sk_test")
              ? "prueba"
              : "desconocido",
        },
        webhook: estado(process.env.STRIPE_WEBHOOK_SECRET),
      },
      supabase: {
        url: estado(process.env.SUPABASE_URL),
        llave: estado(process.env.SUPABASE_SECRET_KEY),
      },
      panel: estado(process.env.PANEL_LLAVE),
      avisos: {
        telefono: estado(process.env.CALLMEBOT_TELEFONO),
        apikey: estado(process.env.CALLMEBOT_APIKEY),
      },
      desplegado: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    },
    { headers: { "cache-control": "no-store" } },
  );
}
