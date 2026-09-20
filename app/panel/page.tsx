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
                        className="inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-bold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-ink hover:text-brand"
                      >
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
