import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Boton } from "@/components/ui/boton";
import { getReto, retos } from "@/lib/retos";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return retos.map((reto) => ({ slug: reto.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const reto = getReto(slug);
  if (!reto) return {};

  return {
    title: `Reto ${reto.duracionDias} días — ${reto.nombre}`,
    description: reto.descripcion,
  };
}

const precio = (mxn: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(mxn);

export default async function RetoPage({ params }: Props) {
  const { slug } = await params;
  const reto = getReto(slug);
  if (!reto) notFound();

  const inicio = new Date(reto.fechaInicio + "T00:00:00").toLocaleDateString(
    "es-MX",
    { day: "numeric", month: "long", year: "numeric" },
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 sm:pt-36">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
          <Link
            href="/#retos"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            ← Todos los retos
          </Link>

          <div className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
            <div>
              <div className="flex items-baseline gap-3">
                <span
                  className="type-display text-[clamp(4rem,11vw,7rem)] text-ink"
                  style={{ fontVariationSettings: '"wdth" 118' }}
                >
                  {reto.duracionDias}
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">
                  días
                </span>
              </div>

              <h1 className="type-h2 mt-2 text-h1 text-ink">{reto.nombre}</h1>
              <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
                {reto.descripcion}
              </p>

              <h2 className="mt-12 text-h3 font-bold tracking-[-0.02em] text-ink">
                Qué incluye
              </h2>
              <ul className="mt-5 space-y-3.5">
                {reto.incluye.map((cosa) => (
                  <li key={cosa} className="flex gap-3.5 text-[0.95rem] text-ink">
                    <span
                      aria-hidden
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft"
                    />
                    <span className="max-w-[52ch] leading-relaxed">{cosa}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-h3 font-bold tracking-[-0.02em] text-ink">
                Este reto es para ti si
              </h2>
              <ul className="mt-5 space-y-3.5">
                {reto.paraTi.map((cosa) => (
                  <li key={cosa} className="flex gap-3.5 text-[0.95rem] text-ink">
                    <span aria-hidden className="mt-0.5 text-brand-text">
                      ✓
                    </span>
                    <span className="max-w-[52ch] leading-relaxed">{cosa}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
                <Image
                  src={reto.imagen}
                  alt={reto.imagenAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-6 rounded-3xl border border-line p-7">
                {reto.precioAnteriorMXN && (
                  <p className="text-sm text-ink-muted line-through">
                    {precio(reto.precioAnteriorMXN)}
                  </p>
                )}
                <p className="text-4xl font-extrabold tracking-[-0.03em] text-ink">
                  {precio(reto.precioMXN)}
                </p>
                <p className="mt-1.5 text-sm text-ink-muted">
                  Pago único · Arranca el {inicio}
                </p>

                {/* TODO: aquí entra Stripe Checkout. Hoy lleva a la página de
                    confirmación para poder recorrer el flujo completo. */}
                <Boton href="/gracias" className="mt-6 w-full">
                  Reservar mi lugar
                </Boton>

                <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                  Pago seguro con tarjeta u OXXO. Si cancelas antes de que te
                  entregue tu plan, te devuelvo el 100%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
