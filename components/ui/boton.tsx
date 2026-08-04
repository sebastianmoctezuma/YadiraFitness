import Link from "next/link";

type Variante = "primario" | "secundario" | "oscuro";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] transition-[background-color,color,transform,box-shadow] duration-200 ease-out-quart active:translate-y-px";

const variantes: Record<Variante, string> = {
  primario:
    "bg-brand text-ink shadow-[0_6px_20px_-6px_oklch(0.875_0.183_99_/_0.9)] hover:bg-ink hover:text-brand hover:shadow-none",
  secundario:
    "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-bg",
  oscuro: "bg-ink text-bg hover:bg-brand hover:text-ink",
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
  return (
    <Link href={href} className={`${base} ${variantes[variante]} ${className}`}>
      {children}
    </Link>
  );
}
