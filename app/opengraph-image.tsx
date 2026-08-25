import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

/**
 * Portada del enlace: lo que se ve al compartir el sitio en WhatsApp o al
 * pautarlo en Facebook.
 *
 * Lleva la fotografía de Yadira (pedido suyo: sin foto, el preview era pura
 * tipografía y no la mostraba a ella, que es la marca). El retrato va en JPEG
 * dentro de `assets/` porque satori no decodifica el WebP de `public/`.
 *
 * Los colores van en hex porque satori no interpreta oklch(); son los tokens de
 * globals.css convertidos a sRGB. Si allá cambia un token, hay que traerlo aquí
 * a mano.
 */
const color = {
  bg: "#ffffff",
  ink: "#0f0e0b",
  inkMuted: "#54534c",
  brand: "#f4d600",
  brandText: "#955a00",
};

export const alt = "Reto Transfórmate — En gym exclusivo para mujeres";

export const size = { width: 1200, height: 630 };

/** PNG y no JPEG: los planos de color y texto salen limpios y la foto no sufre. */
export const contentType = "image/png";

export default async function Image() {
  /**
   * Archivo en WOFF estático, no la variable: satori renderiza la instancia por
   * defecto de una fuente variable, así que el eje `wdth` expandido —que es de
   * dónde sale el contraste de la tipografía del sitio— se perdería. Cada
   * archivo ya viene instanciado en su ancho y peso.
   */
  const [expandidaExtraBold, semiBold, retrato] = await Promise.all([
    readFile(join(process.cwd(), "assets/Archivo-SemiExpanded-ExtraBold.woff")),
    readFile(join(process.cwd(), "assets/Archivo-SemiBold.woff")),
    readFile(join(process.cwd(), "assets/coach-retrato.jpg")),
  ]);

  const retratoSrc = `data:image/jpeg;base64,${retrato.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: color.bg,
          fontFamily: "Archivo",
        }}
      >
        {/* Columna de texto. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {/* Fila de créditos. Dice de quién es esto con palabras, que a
              tamaño de miniatura se leen mejor que una marca gráfica de 40px. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "60px 48px 0 72px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: color.brand,
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 25,
                fontWeight: 800,
                letterSpacing: 4.5,
                textTransform: "uppercase",
                color: color.brandText,
              }}
            >
              {site.nombre}
            </div>
          </div>

          {/* El titular manda: es lo único que se alcanza a leer cuando la
              tarjeta va a un tercio de tamaño en el feed. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "center",
              padding: "0 48px 0 72px",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -3.4,
              lineHeight: 0.95,
              color: color.ink,
            }}
          >
            <div style={{ display: "flex" }}>Reto</div>
            {/* El marcatextos: trazo amarillo inclinado detrás de la palabra.
                Va antes del texto en el DOM porque satori pinta en ese orden,
                y así queda debajo sin depender de z-index. */}
            <div style={{ display: "flex", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: -18,
                  right: -18,
                  top: 12,
                  bottom: 12,
                  backgroundColor: color.brand,
                  transform: "skewX(-9deg)",
                }}
              />
              <div style={{ display: "flex" }}>Transfórmate</div>
            </div>
          </div>

          {/* Los dos datos que deciden si alguien abre. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "0 48px 60px 72px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 800,
                color: color.ink,
              }}
            >
              En gym exclusivo para mujeres
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 27,
                fontWeight: 600,
                color: color.inkMuted,
              }}
            >
              Presencial y en línea
            </div>
          </div>
        </div>

        {/* El retrato, a sangre por la derecha. La franja amarilla lo separa
            del texto y ancla la marca aunque la foto sea oscura. */}
        <div
          style={{
            display: "flex",
            width: 430,
            height: "100%",
            borderLeft: `14px solid ${color.brand}`,
          }}
        >
          <img
            src={retratoSrc}
            width={416}
            height={630}
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Archivo",
          data: expandidaExtraBold,
          style: "normal",
          weight: 800,
        },
        { name: "Archivo", data: semiBold, style: "normal", weight: 600 },
      ],
    },
  );
}
