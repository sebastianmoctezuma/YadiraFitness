import Link from "next/link";

type Variante = "primario" | "secundario";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-quart active:translate-y-px";

const variantes: Record<Variante, string> = {
  primario:
    "bg-ink text-bg hover:bg-brand hover:text-ink shadow-[0_10px_24px_-12px_oklch(0.27_0.021_30/0.6)]",
  secundario:
    "border border-ink/20 bg-transparent text-ink hover:border-ink/45 hover:bg-white/60",
};

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
  const externo = href.startsWith("http");

  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variantes[variante]} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${variantes[variante]} ${className}`}>
      {children}
    </Link>
  );
}
