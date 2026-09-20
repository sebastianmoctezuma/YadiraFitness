import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarraMovil } from "@/components/secciones/barra-movil";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Suspense } from "react";
import { AvisoPago } from "@/components/ui/aviso-pago";
import { Boton } from "@/components/ui/boton";
import { FormaPago } from "@/components/ui/forma-pago";
import { precioMXN } from "@/lib/precio";
import { getReto, incluye, retos, transformaciones } from "@/lib/retos";
import { site, whatsappUrl } from "@/lib/site";
import { etiquetaModalidad } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return retos.map((reto) => ({ slug: reto.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const reto = getReto(slug);
  if (!reto) return {};

  return { title: reto.nombre, description: reto.descripcion };
}

export default async function RetoPage({ params }: Props) {
  const { slug } = await params;
  const reto = getReto(slug);
  if (!reto) notFound();

  return (
    <>
      <Header />
      <main className="mesh-amarillo pt-28 pb-28 sm:pt-36 lg:pb-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
          {/* Solo la flecha. Lleva nombre accesible porque un lector de
              pantalla no puede leer una flecha suelta. */}
          <Link
            href="/#retos"
            aria-label="Volver a todos los retos"
            className="glass flex h-12 w-12 items-center justify-center rounded-full text-lg text-ink transition-colors duration-200 ease-out-quart hover:bg-ink hover:text-brand"
          >
            <span aria-hidden>←</span>
          </Link>

          <div className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20">
            <div>
              <div className="flex items-baseline gap-3">
                <span
                  className="type-display text-[clamp(4rem,11vw,7rem)] text-ink"
                  style={{ fontVariationSettings: '"wdth" 118' }}
                >
                  {reto.duracion.numero}
                </span>
                <span className="text-sm font-bold tracking-[0.14em] text-ink-muted uppercase">
                  {reto.duracion.unidad}
                </span>
              </div>

              <h1 className="type-h2 mt-2 text-h1 text-ink">{reto.nombre}</h1>

              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-[0.1em] text-ink-muted uppercase">
                {reto.etiqueta && (
                  <span className="rounded-full bg-brand px-3 py-1 text-ink">
                    {reto.etiqueta}
                  </span>
                )}
                <span>{etiquetaModalidad[reto.modalidad]}</span>
              </p>

              <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-ink-muted">
                {reto.descripcion}
              </p>

              <h2 className="type-h2 mt-14 text-h3 text-ink">Qué incluye</h2>
              <ul className="mt-6 border-t border-line">
                {incluye.map((item) => (
                  <li key={item.titulo} className="border-b border-line py-5">
                    <h3 className="text-base font-bold text-ink">
                      {item.titulo}
                    </h3>
                    <p className="mt-1.5 max-w-[54ch] text-[0.95rem] leading-relaxed text-ink-muted">
                      {item.detalle}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {/* Una transformación real de una clienta. Antes había una foto
                  de stock de un estudio luminoso que no era su gym. */}
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
                <Image
                  src={transformaciones[0].src}
                  alt={transformaciones[0].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="glass mt-6 rounded-3xl p-7">
                <h2 className="text-base font-bold text-ink">
                  Reserva tu cupo
                </h2>
                {reto.precioMXN && (
                  <p className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-ink">
                    {precioMXN(reto.precioMXN)}
                  </p>
                )}
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                  ¿Estás lista? Inscríbete ya. ¿Qué esperas? Mis cupos son
                  limitados: aprovecha y ve por tu mejor versión.
                </p>

                {/* El aviso vive en cliente, así que la página no deja de
                    ser estática por leer un parámetro que casi nunca viene. */}
                <Suspense>
                  <AvisoPago />
                </Suspense>

                {reto.ventaAbierta ? (
                  <FormaPago slug={reto.slug} />
                ) : (
                  <p className="mt-6 text-sm font-semibold text-ink">
                    La venta de esta generación está cerrada. Escríbeme para
                    apartar la siguiente.
                  </p>
                )}

                <Boton
                  href={whatsappUrl(
                    `Hola ${site.nombreCorto}, tengo una duda sobre el ${reto.nombre}.`,
                  )}
                  variante="secundario"
                  className="mt-3 w-full"
                >
                  Tengo una duda, WhatsApp
                </Boton>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BarraMovil />
    </>
  );
}
