import { NextResponse } from "next/server";
import {
  CODIGO_ANTICIPADO,
  claveIdempotencia,
  construirParamsCheckout,
} from "@/lib/pagos";
import { getReto } from "@/lib/retos";
import { getStripe } from "@/lib/stripe";

/** Vuelve a la página del reto con un aviso que la clienta pueda leer; un
    JSON crudo en pantalla blanca solo invita a reintentar a lo bruto. */
const volverConAviso = (origen: string, slug: string, aviso: string) =>
  NextResponse.redirect(`${origen}/retos/${slug}?pago=${aviso}`, 303);

export async function POST(request: Request) {
  const form = await request.formData();
  const slug = String(form.get("reto") ?? "");
  const origen = new URL(request.url).origin;
  const reto = getReto(slug);

  if (!reto) {
    return NextResponse.redirect(`${origen}/#retos`, 303);
  }
  if (!reto.ventaAbierta) {
    return volverConAviso(origen, slug, "cerrado");
  }

  // Lo pone el navegador al cargar la página. Sin JS llega vacío y cada
  // envío es un intento nuevo, que es el comportamiento de siempre.
  const intento = String(form.get("intento") ?? "") || crypto.randomUUID();

  try {
    const stripe = getStripe();
    const precios = await stripe.prices.list({
      lookup_keys: [slug],
      limit: 1,
    });
    const precio = precios.data[0];
    if (!precio) {
      console.error(`checkout: no hay precio con lookup_key ${slug}`);
      return volverConAviso(origen, slug, "error");
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
    const cliente = await stripe.customers.create(
      { metadata: { origen: "checkout-web", reto: slug } },
      { idempotencyKey: claveIdempotencia("cliente", slug, intento) },
    );

    const session = await stripe.checkout.sessions.create(
      construirParamsCheckout({
        slug,
        priceId: precio.id,
        origen,
        customerId: cliente.id,
        promotionCodeId: promo?.id,
      }),
      { idempotencyKey: claveIdempotencia("sesion", slug, intento) },
    );
    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("checkout:", err);
    return volverConAviso(origen, slug, "error");
  }
}
