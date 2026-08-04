import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Boton } from "@/components/ui/boton";
import { getReto, incluye, retos } from "@/lib/retos";
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
      <main className="mesh-amarillo pt-28 pb-24 sm:pt-36">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
          <Link
            href="/#retos"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            ← Todos los retos
          </Link>

          <div className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20">
            <div>
              <div className="flex items-baseline gap-3">
                <span
                  className="type-display text-[clamp(4rem,11vw,7rem)] text-ink"
                  style={{ fontVariationSettings: '"wdth" 118' }}
                >
                  {reto.duracionDias}
                </span>
                <span className="text-sm font-bold tracking-[0.14em] text-ink-muted uppercase">
                  días
                </span>
              </div>

              <h1 className="type-h2 mt-2 text-h1 text-ink">{reto.nombre}</h1>

              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-[0.1em] text-ink-muted uppercase">
                {reto.temporada && (
                  <span className="rounded-full bg-brand px-3 py-1 text-ink">
                    {reto.temporada}ª temporada
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

              <div className="glass mt-6 rounded-3xl p-7">
                <h2 className="text-base font-bold text-ink">
                  Reserva tu cupo
                </h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
                  El precio y la fecha de arranque de la siguiente generación se
                  confirman por WhatsApp. Los cupos son limitados porque el
                  entrenamiento es personal.
                </p>

                <Boton
                  href={whatsappUrl(
                    `Hola ${site.nombreCorto}, me interesa el ${reto.nombre} de ${reto.duracionDias} días.`,
                  )}
                  className="mt-6 w-full"
                >
                  Escribir por WhatsApp
                </Boton>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
