import Link from "next/link";

type Variante = "primario" | "secundario" | "oscuro" | "glass";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold uppercase tracking-[0.06em] transition-[background-color,color,transform,box-shadow,border-color] duration-200 ease-out-quart active:translate-y-px";

const variantes: Record<Variante, string> = {
  primario:
    "bg-brand text-ink shadow-[0_6px_20px_-6px_oklch(0.875_0.183_99_/_0.9)] hover:bg-ink hover:text-brand hover:shadow-none",
  secundario:
    "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-bg",
  oscuro: "bg-ink text-bg hover:bg-brand hover:text-ink",
  glass: "glass text-ink hover:bg-ink hover:text-brand",
};

/**
 * Los enlaces de ancla y los externos se renderizan como <a> nativo.
 *
 * `<Link>` de Next con un href de solo ancla intercepta la navegación y su
 * restauración de scroll compite con `scroll-behavior: smooth`: a veces no
 * desplaza, y al reclicar el mismo hash nunca lo hace. El <a> nativo desplaza
 * siempre, incluso si la URL ya trae ese hash.
 */
export function Boton({
  href,
  children,
  variante = "primario",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variante?: Variante;
  className?: string;
}) {
  const clases = `${base} ${variantes[variante]} ${className}`;
  const esAncla = href.startsWith("#");
  const esExterno = href.startsWith("http");

  if (esAncla) {
    return (
      <a href={href} className={clases}>
        {children}
      </a>
    );
  }

  if (esExterno) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clases}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={clases}>
      {children}
    </Link>
  );
}

/** Mismo lenguaje visual que Boton, pero envía el <form> que lo envuelve. */
export function BotonSubmit({
  children,
  variante = "primario",
  className = "",
}: {
  children: React.ReactNode;
  variante?: Variante;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={`${base} ${variantes[variante]} cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
