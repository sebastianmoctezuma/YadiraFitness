import type { Metadata } from "next";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Boton } from "@/components/ui/boton";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reserva confirmada",
  robots: { index: false },
};

/**
 * Página de confirmación. Hoy es estática; cuando conectemos Stripe leerá el
 * `session_id` del checkout para mostrar el reto y el monto reales.
 */
export default function GraciasPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[80svh] items-center pt-28 pb-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
          <div className="max-w-[40rem]">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl text-ink">
              ✓
            </span>
            <h1 className="type-h2 mt-8 text-h1 text-ink">
              Listo, ya tienes tu lugar
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              Te mandé un correo con el comprobante. En las próximas horas te
              escribo por WhatsApp con el cuestionario para armar tu plan.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Boton
                href={whatsappUrl(
                  `Hola ${site.nombreCorto}, acabo de reservar mi reto.`,
                )}
              >
                Escribirle a {site.nombreCorto}
              </Boton>
              <Boton href="/" variante="secundario">
                Volver al inicio
              </Boton>
            </div>

            <p className="mt-10 text-sm text-ink-muted">
              ¿No te llegó nada en 24 horas? Escríbeme a{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-ink underline decoration-brand decoration-[3px] underline-offset-4"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
