import type Stripe from "stripe";
import { sesionAFila } from "@/lib/pagos";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const EVENTOS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
]);

export async function POST(request: Request) {
  // La firma se verifica sobre el cuerpo CRUDO: nada de request.json().
  const cuerpo = await request.text();
  const firma = request.headers.get("stripe-signature") ?? "";

  let evento: Stripe.Event;
  try {
    evento = getStripe().webhooks.constructEvent(
      cuerpo,
      firma,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Firma inválida", { status: 400 });
  }

  if (EVENTOS.has(evento.type)) {
    const session = evento.data.object as Stripe.Checkout.Session;
    // Upsert por sesión: los reintentos de Stripe y el par de eventos de
    // SPEI (completed + async_payment_succeeded) no duplican filas.
    const { error } = await getSupabaseAdmin()
      .from("pagos")
      .upsert(sesionAFila(evento.type, session), {
        onConflict: "stripe_session_id",
      });
    if (error) {
      console.error("webhook: error al registrar en Supabase", error);
      return new Response("Error al registrar", { status: 500 });
    }
  }

  return new Response("ok");
}
