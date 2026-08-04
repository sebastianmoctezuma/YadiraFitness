import { site, whatsappUrl } from "@/lib/site";

/**
 * Barra fija de acción, solo en móvil.
 *
 * La mayoría de las clientas entra desde el teléfono, y sin precio publicado el
 * único paso siguiente real es escribir por WhatsApp. Dejar esa acción siempre
 * a mano evita que tengan que volver a buscarla tras cada sección.
 */
export function BarraMovil() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-sticky p-3 lg:hidden">
      <a
        href={whatsappUrl(`Hola ${site.nombreCorto}, quiero reservar mi cupo.`)}
        className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold tracking-[0.08em] text-bg uppercase shadow-[0_10px_30px_-8px_oklch(0.165_0.008_100/0.55)]"
      >
        Reservar mi cupo
      </a>
    </div>
  );
}
