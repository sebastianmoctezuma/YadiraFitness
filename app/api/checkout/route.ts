import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  claveIdempotencia,
  construirParamsCheckout,
  nombreCookiePago,
  puedeReutilizarse,
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

    // ¿Ya había empezado a pagar este reto y se salió? Se retoma su sesión
    // en vez de abrir otra. Stripe las expira a las 24 h y entonces nace una
    // nueva sola; una ya pagada nunca se reabre.
    const galletas = await cookies();
    const sesionPrevia = galletas.get(nombreCookiePago(slug))?.value;
    if (sesionPrevia) {
      const previa = await stripe.checkout.sessions
        .retrieve(sesionPrevia)
        .catch(() => null);
      if (puedeReutilizarse(previa) && previa?.url) {
        return NextResponse.redirect(previa.url, 303);
      }
    }

    const precios = await stripe.prices.list({
      lookup_keys: [slug],
      limit: 1,
    });
    const precio = precios.data[0];
    if (!precio) {
      console.error(`checkout: no hay precio con lookup_key ${slug}`);
      return volverConAviso(origen, slug, "error");
    }

    // Cualquier promoción ACTIVA marcada para este reto se aplica sola. Se
    // buscan todas y no una por nombre: así Yadira puede crear la promoción
    // que quiera desde el dashboard —el 20% anticipado, una de temporada—
    // poniéndole `reto` en la metadata, sin que nadie toque este archivo.
    const promos = await stripe.promotionCodes.list({ active: true, limit: 100 });
    const promo = promos.data.find((p) => p.metadata?.reto === slug);

    // Un Customer por sesión, no por clic: SPEI lo exige para asignar la
    // CLABE, y gracias a la cookie de arriba dejan de acumularse clientes
    // vacíos de gente que solo miró.
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

    const respuesta = NextResponse.redirect(session.url!, 303);
    // Caduca con la sesión: así el navegador y Stripe olvidan a la vez.
    respuesta.cookies.set(nombreCookiePago(slug), session.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: origen.startsWith("https"),
      expires: new Date((session.expires_at ?? 0) * 1000),
      path: "/",
    });
    return respuesta;
  } catch (err) {
    console.error("checkout:", err);
    return volverConAviso(origen, slug, "error");
  }
}
