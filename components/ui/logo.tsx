/**
 * Marca gráfica. La forma sale del canal alfa del PNG usado como máscara, así
 * que hereda `currentColor`: el mismo archivo va en tinta sobre fondo claro y
 * en amarillo sobre fondo oscuro, sin duplicar assets.
 *
 * Es decorativa: siempre acompaña al nombre en texto, así que no lleva nombre
 * accesible propio para no repetirlo en los lectores de pantalla.
 */
export function Logo({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`logo-marca block ${className}`} />;
}
