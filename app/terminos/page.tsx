import type { Metadata } from "next";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y privacidad",
  description:
    "Condiciones de compra, política de reembolsos y aviso de privacidad de los retos.",
};

/* Borrador operativo: Yadira debe validarlo antes de considerarlo final. */
const secciones = [
  {
    titulo: "Qué compras",
    parrafos: [
      "Al pagar un reto reservas tu cupo en el programa de entrenamiento personal correspondiente (30 o 90 días), que incluye lo publicado en la sección “Qué incluye tu reto”. La fecha de arranque de cada generación se coordina por WhatsApp después del pago.",
    ],
  },
  {
    titulo: "Pagos",
    parrafos: [
      "Los pagos se procesan a través de Stripe con tarjeta o transferencia bancaria (SPEI). Nosotros no guardamos los datos de tu tarjeta. Los precios están en pesos mexicanos e incluyen el programa completo; no hay cargos recurrentes.",
    ],
  },
  {
    titulo: "Reembolsos",
    parrafos: [
      "Si aún no arranca tu reto, puedes pedir reembolso completo escribiéndonos por WhatsApp. Una vez iniciado el programa, el pago no es reembolsable, porque el cupo y el plan se preparan de forma personal para ti. Si tu transferencia SPEI no se completa, no se hace ningún cargo.",
    ],
  },
  {
    titulo: "Aviso de privacidad",
    parrafos: [
      `${site.nombre} usa tu nombre, correo y teléfono únicamente para darte de alta en tu reto, contactarte por WhatsApp y emitir tu comprobante de pago. No compartimos tus datos con terceros fuera de los proveedores que hacen posible el cobro (Stripe) y la operación del sitio. Puedes pedir la corrección o eliminación de tus datos escribiéndonos por WhatsApp.`,
    ],
  },
  {
    titulo: "Salud",
    parrafos: [
      "Los planes de alimentación y entrenamiento no sustituyen atención médica. Consulta a tu médico antes de empezar cualquier reto.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-[52rem] px-5 sm:px-8">
          <h1 className="type-h2 text-h1 text-ink">
            Términos, reembolsos y privacidad
          </h1>
          {secciones.map((s) => (
            <section key={s.titulo} className="mt-10">
              <h2 className="text-h3 font-bold text-ink">{s.titulo}</h2>
              {s.parrafos.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="mt-3 text-base leading-relaxed text-ink-muted"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
