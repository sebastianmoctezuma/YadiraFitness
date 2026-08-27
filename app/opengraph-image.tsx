import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Portada del enlace: lo que se ve al compartir el sitio en WhatsApp o al
 * pautarlo en Facebook.
 *
 * Es el retrato de Yadira y nada más, por pedido suyo: la foto sin textos
 * encima. La info ("Reto Transfórmate / En gym exclusivo para mujeres") va en
 * el título y descripción OG de [app/layout.tsx](app/layout.tsx), que es lo que
 * la tarjeta muestra debajo de la imagen.
 *
 * El retrato va en JPEG dentro de `assets/` porque satori no decodifica el
 * WebP de `public/`. Es vertical (668×1000) y la tarjeta es apaisada: el 28%
 * de objectPosition salta el techo oscuro del estudio y encuadra cara y torso.
 */

export const alt = "Yadira, entrenadora personal, en el gym";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function Image() {
  const retrato = await readFile(
    join(process.cwd(), "assets/coach-retrato.jpg"),
  );
  const retratoSrc = `data:image/jpeg;base64,${retrato.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <img
          src={retratoSrc}
          width={1200}
          height={630}
          style={{ objectFit: "cover", objectPosition: "50% 28%" }}
        />
      </div>
    ),
    size,
  );
}
