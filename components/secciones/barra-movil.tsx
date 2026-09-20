/**
 * Barra fija de acción, solo en móvil.
 *
 * Lleva al catálogo, no directo a WhatsApp: sin haber elegido reto el mensaje
 * llegaría sin contexto y Yadira tendría que preguntar de cuál se trata. Desde
 * cada reto el botón sí abre WhatsApp, y ya con el nombre y la duración dentro
 * del mensaje.
 */
export function BarraMovil() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-sticky p-3 lg:hidden">
      <a
        href="/#retos"
        className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-bold tracking-[0.08em] text-bg uppercase shadow-[0_10px_30px_-8px_oklch(0.165_0.008_100/0.55)]"
      >
        Reservar mi cupo
      </a>
    </div>
  );
}
