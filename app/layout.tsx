import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Una sola familia. El contraste sale del eje de ancho (wdth) y del peso,
 * no de emparejar dos tipografías parecidas entre sí.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.nombre} — Retos de 30, 60 y 90 días`,
    template: `%s · ${site.nombre}`,
  },
  description: site.descripcion,
  openGraph: {
    title: `${site.nombre} — Retos de 30, 60 y 90 días`,
    description: site.descripcion,
    locale: "es_MX",
    type: "website",
  },
};

/**
 * Marca el documento antes del primer paint para que el revelado por scroll
 * arranque oculto sin parpadeo. Si el JS no corre, la clase nunca se agrega y
 * todo el contenido queda visible: ninguna sección se envía en blanco.
 *
 * El script toca <html>, que React también controla, así que el DOM deja de
 * coincidir con lo que React renderiza. `suppressHydrationWarning` en <html>
 * es la salida prevista para justo este caso (es lo que hace next-themes) y
 * solo afecta a los atributos de ese elemento, no a sus descendientes.
 */
const marcarReveal = `document.documentElement.classList.add('js-reveal')`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${archivo.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: marcarReveal }} />
      </head>
      <body className="min-h-full bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
