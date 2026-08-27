import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Portada del enlace: lo que se ve al compartir el sitio en WhatsApp o al
 * pautarlo en Facebook.
 *
 * Es el retrato de Yadira y nada más, por pedido suyo: la foto sin textos
 * encima. La info ("Reto Transfórmate / En gym exclusivo para mujeres") va en
 * el título y descripción OG de [app/layout.tsx](app/layout.tsx).
 *
 * El tamaño es la decisión de diseño: Yadira quiere la tarjeta compacta de
 * WhatsApp —miniatura a la izquierda, info a la derecha—, y ese layout lo
 * elige WhatsApp según la imagen: con 300px o más muestra el banner grande
 * (a 400×400 todavía salía el foto-tarjetón); **por debajo de 300px** cae a
 * la miniatura lateral. De ahí el 256×256: no agrandarla sin saber que se
 * pierde ese layout.
 *
 * El retrato va en JPEG dentro de `assets/` porque satori no decodifica el
 * WebP de `public/`. Es vertical (668×1000): el 28% de objectPosition salta el
 * techo oscuro del estudio y encuadra cara y torso.
 */

export const alt = "Yadira, entrenadora personal, en el gym";

export const size = { width: 256, height: 256 };

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
          width={256}
          height={256}
          style={{ objectFit: "cover", objectPosition: "50% 28%" }}
        />
      </div>
    ),
    size,
  );
}
