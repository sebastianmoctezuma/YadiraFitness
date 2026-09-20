import type Stripe from "stripe";
import { esPagoDuplicado, sesionAFila } from "@/lib/pagos";
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
    const fila = sesionAFila(evento.type, session);
    const supabase = getSupabaseAdmin();

    // ¿Esta persona ya tenía cobrado este reto? Si el cobro doble ocurrió,
    // la fila queda marcada para que Yadira lo vea y reembolse en Stripe.
    let duplicado = false;
    if (fila.estado === "pagado" && fila.email) {
      const { data: previos, error } = await supabase
        .from("pagos")
        .select("stripe_session_id, estado")
        .eq("email", fila.email)
        .eq("reto", fila.reto);
      if (error) {
        console.error("webhook: no se pudo revisar pagos previos", error);
        return new Response("Error al revisar duplicados", { status: 500 });
      }
      duplicado = esPagoDuplicado(fila, previos ?? []);
      if (duplicado) {
        console.warn(
          `webhook: posible cobro doble de ${fila.email} en ${fila.reto}`,
        );
      }
    }

    // Upsert por sesión: los reintentos de Stripe y el par de eventos de
    // SPEI (completed + async_payment_succeeded) no duplican filas.
    const { error } = await supabase
      .from("pagos")
      .upsert({ ...fila, duplicado }, { onConflict: "stripe_session_id" });
    if (error) {
      console.error("webhook: error al registrar en Supabase", error);
      return new Response("Error al registrar", { status: 500 });
    }
  }

  return new Response("ok");
}
