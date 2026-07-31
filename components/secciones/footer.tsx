import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { navegacion, site, whatsappUrl } from "@/lib/site";

const anio = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-ink text-bg">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12 text-brand" />
            <p className="flex items-baseline gap-1.5">
              <span
                className="text-xl font-extrabold uppercase tracking-[-0.02em]"
                style={{ fontVariationSettings: '"wdth" 112' }}
              >
                Yadira
              </span>
              <span
                className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-bg/50"
                style={{ fontVariationSettings: '"wdth" 88' }}
              >
                Fitness
              </span>
            </p>
          </div>
          <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-bg/60">
            {site.descripcion}
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-bg/45">
            Navegar
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navegacion.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-bg/80 transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-bg/45">
            Contacto
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={whatsappUrl("Hola Yadira, me interesa un reto.")}
                className="text-bg/80 transition-colors hover:text-brand"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-bg/80 transition-colors hover:text-brand"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.instagram}
                className="text-bg/80 transition-colors hover:text-brand"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bg/12">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-5 py-7 text-xs text-bg/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {anio} {site.nombre}. {site.ciudad}.
          </p>
          <p className="max-w-[62ch]">
            Los planes de alimentación y entrenamiento no sustituyen atención
            médica. Consulta a tu médico antes de empezar cualquier reto.
          </p>
        </div>
      </div>
    </footer>
  );
}
