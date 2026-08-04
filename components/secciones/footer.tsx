import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { navegacion, site, whatsappUrl } from "@/lib/site";

const anio = new Date().getFullYear();

const redes = [
  { href: site.instagram, red: "Instagram", usuario: site.instagramUsuario },
  { href: site.tiktok, red: "TikTok", usuario: site.tiktokUsuario },
  { href: site.facebook, red: "Facebook", usuario: site.facebookUsuario },
];

export function Footer() {
  return (
    <footer className="bg-ink text-bg">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-14 w-auto" />
            <p
              className="text-xl font-extrabold tracking-[-0.02em] uppercase"
              style={{ fontVariationSettings: '"wdth" 112' }}
            >
              {site.nombre}
            </p>
          </div>
          <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-bg/60">
            {site.descripcion}
          </p>
          <p className="mt-6 text-xs font-bold tracking-[0.18em] text-brand uppercase">
            {site.hashtag}
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-xs font-bold tracking-[0.14em] text-bg/60 uppercase">
            Navegar
          </h2>
          <ul className="mt-5 space-y-2.5">
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
          <h2 className="text-xs font-bold tracking-[0.14em] text-bg/60 uppercase">
            Sígueme
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {redes.map((red) => (
              <li key={red.red}>
                <a
                  href={red.href}
                  className="text-bg/80 transition-colors hover:text-brand"
                >
                  {red.red} <span className="text-bg/60">{red.usuario}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={whatsappUrl(
                  `Hola ${site.nombreCorto}, quiero reservar mi cupo.`,
                )}
                className="text-bg/80 transition-colors hover:text-brand"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bg/12">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-5 py-7 text-xs text-bg/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {anio} {site.nombre}.
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
