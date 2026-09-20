import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Boton } from "@/components/ui/boton";
import { comprobanteDe, estadoGracias } from "@/lib/pagos";
import { site, whatsappUrl } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Gracias",
  robots: { index: false },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) notFound();

  let session;
  try {
    // El payment_intent expandido es lo que dice si quedó una ficha de OXXO
    // pendiente y dónde está; sin él solo sabríamos que "no ha pagado".
    session = await getStripe().checkout.sessions.retrieve(session_id, {
      // latest_charge trae el comprobante que la clienta puede descargar.
      expand: ["payment_intent", "payment_intent.latest_charge"],
    });
  } catch {
    notFound();
  }

  const estado = estadoGracias(session);
  const nombre = session.customer_details?.name ?? "";
  const comprobante = comprobanteDe(session);
  const correo = session.customer_details?.email;

  const textos = {
    pagado: {
      eyebrow: "Pago confirmado",
      cuerpo:
        "Ya quedó. Escríbele a Yadira por WhatsApp para agendar tu evaluación y arrancar tu reto.",
    },
    oxxo: {
      eyebrow: "Falta un paso",
      cuerpo:
        "Tu ficha ya está lista: llévala a cualquier OXXO y paga en caja. En cuanto la tienda reporte el pago, tu cupo queda asegurado y Yadira te escribe. Guarda la ficha, la vas a necesitar.",
    },
    transferencia: {
      eyebrow: "Pago en proceso",
      cuerpo:
        "Sigue las instrucciones de transferencia que te dio Stripe. En cuanto tu banco confirme el envío, tu cupo queda asegurado y Yadira te escribe.",
    },
    pendiente: {
      eyebrow: "Pago en proceso",
      cuerpo:
        "Tu pago se está confirmando. En cuanto quede, tu cupo está asegurado y Yadira te escribe por WhatsApp.",
    },
  }[estado.tipo];

  const pagado = estado.tipo === "pagado";

  return (
    <>
      <Header />
      <main className="mesh-amarillo flex min-h-[70vh] items-center pt-28 pb-16 sm:pt-36">
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            {textos.eyebrow}
          </p>
          <h1 className="type-display mt-5 max-w-[16ch] text-display text-ink">
            {pagado ? (
              <>
                Tu cupo está <span className="mark">asegurado</span>
              </>
            ) : estado.tipo === "oxxo" ? (
              "Ve a pagar tu ficha"
            ) : (
              "Estamos confirmando tu pago"
            )}
          </h1>
          <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            {textos.cuerpo}
          </p>

          {correo && pagado && (
            <p className="mt-4 max-w-[52ch] text-[0.95rem] text-ink-muted">
              Te mandamos el comprobante a{" "}
              <span className="font-semibold text-ink">{correo}</span>. Si no
              aparece, revisa tu carpeta de spam.
            </p>
          )}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {estado.tipo === "oxxo" && estado.vale && (
              <Boton href={estado.vale}>Ver mi ficha de pago</Boton>
            )}
            {comprobante && (
              <Boton href={comprobante} variante="secundario">
                Ver mi comprobante
              </Boton>
            )}
            <Boton
              href={whatsappUrl(
                `Hola ${site.nombreCorto}, soy ${nombre || "clienta nueva"} y ya ${pagado ? "pagué" : "inicié el pago de"} mi reto. ¿Cómo empezamos?`,
              )}
              variante={estado.tipo === "oxxo" ? "secundario" : "primario"}
            >
              Escribir a Yadira por WhatsApp
            </Boton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
