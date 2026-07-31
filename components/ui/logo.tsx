import Image from "next/image";

/**
 * Marca gráfica, en su color original.
 *
 * Es decorativa: siempre acompaña al nombre en texto, así que no lleva nombre
 * accesible propio para no repetirlo en los lectores de pantalla.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-guerrera.png"
      alt=""
      aria-hidden
      width={512}
      height={512}
      priority
      className={className}
    />
  );
}
