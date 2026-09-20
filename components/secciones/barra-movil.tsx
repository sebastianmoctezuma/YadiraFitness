import { FormaPago } from "@/components/ui/forma-pago";
import type { Reto } from "@/lib/types";

/**
 * Barra fija de acción, solo en móvil.
 *
 * Hace lo que toca según dónde esté la clienta. En la portada lleva al
 * catálogo, porque sin haber elegido reto no hay nada que cobrar. Dentro de
 * un reto **cobra ese reto**: mandarla de vuelta al catálogo la sacaba de lo
 * que estaba leyendo para que volviera a elegir lo que ya había elegido.
 */
export function BarraMovil({ reto }: { reto?: Reto }) {
  const enBarra =
    "min-h-14 w-full px-6 text-sm tracking-[0.08em] shadow-[0_10px_30px_-8px_oklch(0.165_0.008_100/0.55)]";

  return (
    <div className="fixed inset-x-0 bottom-0 z-sticky p-3 lg:hidden">
      {reto?.ventaAbierta ? (
        <FormaPago
          slug={reto.slug}
          etiqueta="Reservar mi cupo"
          claseForm=""
          claseBoton={`${enBarra} bg-ink text-bg disabled:cursor-wait disabled:bg-ink disabled:text-brand`}
        />
      ) : (
        <a
          href="/#retos"
          className={`flex items-center justify-center gap-2 rounded-full bg-ink font-bold text-bg uppercase ${enBarra}`}
        >
          {reto ? "Ver los otros retos" : "Elegir mi reto"}
        </a>
      )}
    </div>
  );
}
