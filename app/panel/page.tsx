import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { enlaceWhatsapp, formatearTelefono, tieneAcceso } from "@/lib/panel";
import { precioMXN } from "@/lib/precio";
import { getReto } from "@/lib/retos";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tus clientas",
  robots: { index: false, follow: false },
};

/** Datos de personas: nunca se guardan en caché. */
export const dynamic = "force-dynamic";

type Pago = {
  stripe_session_id: string;
  reto: string;
  monto: number;
  descuento: number;
  estado: string;
  nombre: string | null;
  email: string | null;
  telefono: string | null;
  modalidad: string | null;
  duplicado: boolean;
  creado: string;
};

const etiquetaEstado: Record<string, { texto: string; clase: string }> = {
  pagado: { texto: "Pagado", clase: "bg-brand text-ink" },
  procesando: { texto: "Esperando pago", clase: "bg-ink/10 text-ink" },
  fallido: { texto: "No se completó", clase: "bg-ink/70 text-bg" },
};

/**
 * El verde de WhatsApp, no el amarillo de la marca: este panel es una
 * herramienta interna y el botón manda fuera del sitio. Yadira lo reconoce
 * antes de leerlo, que es justo lo que se busca cuando lo usa a diario.
 */
const IconoWhatsapp = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className="h-[18px] w-[18px]"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function PanelPage() {
  if (!(await tieneAcceso())) notFound();

  const { data, error } = await getSupabaseAdmin()
    .from("pagos")
    .select(
      "stripe_session_id, reto, monto, descuento, estado, nombre, email, telefono, modalidad, duplicado, creado",
    )
    .order("creado", { ascending: false })
    .limit(200);

  if (error) {
    console.error("panel:", error);
  }
  const pagos = (data ?? []) as Pago[];
  const cobrado = pagos
    .filter((p) => p.estado === "pagado")
    .reduce((suma, p) => suma + p.monto, 0);

  return (
    <main className="min-h-dvh bg-surface pb-20">
      <header className="border-b border-line bg-bg px-5 pt-10 pb-7 sm:px-8">
        <div className="mx-auto max-w-[72rem]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            {site.nombre}
          </p>
          <h1 className="type-h2 mt-3 text-h2 text-ink">Tus clientas</h1>
          <p className="mt-4 text-base text-ink-muted">
            {pagos.filter((p) => p.estado === "pagado").length} pagadas ·{" "}
            {precioMXN(cobrado / 100)} cobrados
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[72rem] px-5 sm:px-8">
        {pagos.length === 0 ? (
          <p className="mt-10 text-base text-ink-muted">
            Todavía no hay pagos. Cuando alguien reserve su cupo aparecerá aquí.
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {pagos.map((p) => {
              const estado = etiquetaEstado[p.estado] ?? {
                texto: p.estado,
                clase: "bg-ink/10 text-ink",
              };
              const nombreReto = getReto(p.reto)?.nombre ?? p.reto;
              const wa = enlaceWhatsapp(
                p.telefono,
                `Hola ${p.nombre?.split(" ")[0] ?? ""}, soy ${site.nombreCorto}. Ya vi tu pago del ${nombreReto}. ¿Cuándo empezamos?`,
              );

              return (
                <li
                  key={p.stripe_session_id}
                  className="rounded-2xl border border-line bg-bg p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-ink">
                      {p.nombre ?? "Sin nombre"}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] ${estado.clase}`}
                    >
                      {estado.texto}
                    </span>
                    {p.duplicado && (
                      <span className="rounded-full bg-ink px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.1em] text-brand">
                        Ya había pagado
                      </span>
                    )}
                  </div>

                  <dl className="mt-4 grid gap-x-8 gap-y-2 text-[0.95rem] sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="text-ink-muted">Reto:</dt>
                      <dd className="font-semibold text-ink">
                        {nombreReto}
                        {p.modalidad ? ` · ${p.modalidad}` : ""}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-ink-muted">Pagó:</dt>
                      <dd className="font-semibold text-ink">
                        {precioMXN(p.monto / 100)}
                        {p.descuento > 0 ? " (con descuento)" : ""}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-ink-muted">Teléfono:</dt>
                      <dd className="text-ink">{formatearTelefono(p.telefono)}</dd>
                    </div>
                    <div className="flex min-w-0 gap-2">
                      <dt className="text-ink-muted">Correo:</dt>
                      <dd className="truncate text-ink">{p.email ?? "—"}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {wa && (
                      <a
                        href={wa}
                        className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#25D366] px-5 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#1da851]"
                      >
                        <IconoWhatsapp />
                        Escribirle
                      </a>
                    )}
                    <span className="text-sm text-ink-muted">
                      {fecha(p.creado)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
