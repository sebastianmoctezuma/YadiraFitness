import { NextResponse } from "next/server";
import { CODIGO_ANTICIPADO, construirParamsCheckout } from "@/lib/pagos";
import { getReto } from "@/lib/retos";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const form = await request.formData();
  const slug = String(form.get("reto") ?? "");
  const reto = getReto(slug);

  if (!reto) {
    return NextResponse.json({ error: "Reto no encontrado" }, { status: 404 });
  }
  if (!reto.ventaAbierta) {
    return NextResponse.json(
      { error: "La venta de este reto está cerrada por ahora" },
      { status: 409 },
    );
  }

  const origen = new URL(request.url).origin;

  try {
    const precios = await stripe.prices.list({
      lookup_keys: [slug],
      limit: 1,
    });
    const precio = precios.data[0];
    if (!precio) {
      console.error(`checkout: no hay precio con lookup_key ${slug}`);
      return NextResponse.json(
        { error: "El pago no está disponible en este momento" },
        { status: 500 },
      );
    }

    // El 20% anticipado se aplica solo si el code está activo en Stripe y
    // este reto es el suyo. Encenderlo/apagarlo es cosa del dashboard.
    const promos = await stripe.promotionCodes.list({
      code: CODIGO_ANTICIPADO,
      active: true,
      limit: 1,
    });
    const promo = promos.data.find((p) => p.metadata?.reto === slug);

    // SPEI exige un Customer existente; el correo y nombre reales los
    // captura el Checkout y viven en customer_details de la sesión.
    const cliente = await stripe.customers.create({
      metadata: { origen: "checkout-web", reto: slug },
    });

    const session = await stripe.checkout.sessions.create(
      construirParamsCheckout({
        slug,
        priceId: precio.id,
        origen,
        customerId: cliente.id,
        promotionCodeId: promo?.id,
      }),
    );
    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("checkout:", err);
    return NextResponse.json(
      { error: "No pudimos iniciar tu pago. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
