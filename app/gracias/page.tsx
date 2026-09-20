import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Boton } from "@/components/ui/boton";
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
    session = await getStripe().checkout.sessions.retrieve(session_id);
  } catch {
    notFound();
  }

  // Con SPEI la sesión se completa antes de que llegue el dinero: el estado
  // real lo dice payment_status, no el hecho de haber llegado a esta página.
  const pagado = session.payment_status === "paid";
  const nombre = session.customer_details?.name ?? "";

  return (
    <>
      <Header />
      <main className="mesh-amarillo flex min-h-[70vh] items-center pt-28 pb-16 sm:pt-36">
        <div className="mx-auto w-full max-w-[88rem] px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            {pagado ? "Pago confirmado" : "Pago en proceso"}
          </p>
          <h1 className="type-display mt-5 max-w-[16ch] text-display text-ink">
            {pagado ? (
              <>
                Tu cupo está <span className="mark">asegurado</span>
              </>
            ) : (
              "Estamos esperando tu transferencia"
            )}
          </h1>
          <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            {pagado
              ? "Ya quedó. Escríbele a Yadira por WhatsApp para agendar tu evaluación y arrancar tu reto."
              : "En cuanto tu banco confirme la transferencia (normalmente unos minutos), tu cupo queda asegurado y te llega un correo de confirmación."}
          </p>
          <div className="mt-9">
            <Boton
              href={whatsappUrl(
                `Hola ${site.nombreCorto}, soy ${nombre || "clienta nueva"} y ya ${pagado ? "pagué" : "inicié el pago de"} mi reto. ¿Cómo empezamos?`,
              )}
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
