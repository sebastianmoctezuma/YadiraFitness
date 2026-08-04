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
      <main className="pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
          <Link
            href="/#retos"
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            ← Todos los retos
          </Link>

          <div className="mt-8 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20">
            <div>
              <p className="type-etiqueta text-brand-text">
                {reto.duracionDias} días
                {reto.temporada ? ` · ${reto.temporada}ª temporada` : ""}
              </p>

              <h1 className="type-display mt-5 text-h1 text-ink">
                {reto.nombre}
              </h1>
              <p className="mt-6 max-w-[52ch] text-lg leading-[1.8] text-ink-muted">
                {reto.descripcion}
              </p>

              <h2 className="type-h2 mt-14 text-h3 text-ink">Qué incluye</h2>
              <ul className="mt-6 border-t border-line">
                {incluye.map((item) => (
                  <li key={item.titulo} className="border-b border-line py-5">
                    <h3 className="text-base font-medium text-ink">
                      {item.titulo}
                    </h3>
                    <p className="mt-1.5 max-w-[52ch] text-[0.95rem] leading-relaxed text-ink-muted">
                      {item.detalle}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-suave)]">
                <Image
                  src={reto.imagen}
                  alt={reto.imagenAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-6 rounded-[var(--radius-suave)] bg-surface p-8">
                <p className="type-etiqueta text-ink-muted">
                  {etiquetaModalidad[reto.modalidad]}
                </p>
                <p className="mt-4 text-[0.95rem] leading-[1.75] text-ink-muted">
                  El precio y la fecha de arranque de la siguiente generación se
                  confirman por WhatsApp. Los cupos son limitados.
                </p>

                <Boton
                  href={whatsappUrl(
                    `Hola ${site.nombreCorto}, me interesa el ${reto.nombre} de ${reto.duracionDias} días.`,
                  )}
                  className="mt-7 w-full"
                >
                  Reservar mi cupo
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
