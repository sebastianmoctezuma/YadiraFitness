# Design

Sistema visual de Yadira Fitness. Los tokens viven en
[app/globals.css](app/globals.css); este documento explica por qué son los que
son.

## Theme

Claro. La escena: una mujer revisando el teléfono de noche, decidiendo si esta
vez sí. Una página oscura habría hecho de esto un gimnasio; una página clara la
deja parecerse a un plan escrito en una hoja limpia. Blanco puro, mucho aire,
fotografía de luz natural alta.

## Color

Estrategia: **Committed**. El amarillo no es un detalle; carga franjas y
secciones enteras. El fondo se queda en blanco puro a propósito — el crema o el
beige tintado es el tell de fondo generado por IA, y además apagaría el amarillo.

Todo en OKLCH.

| Rol | Valor | Uso |
|---|---|---|
| `--color-bg` | `oklch(1 0 0)` | Fondo de página. Blanco literal, sin calidez oculta. |
| `--color-surface` | `oklch(0.972 0.001 100)` | Bandas de sección alternas. |
| `--color-line` | `oklch(0.905 0.003 100)` | Filetes y separadores. |
| `--color-ink` | `oklch(0.165 0.008 100)` | Texto principal y superficies oscuras. |
| `--color-ink-muted` | `oklch(0.44 0.011 100)` | Texto secundario. ~8.5:1 sobre blanco. |
| `--color-brand` | `oklch(0.875 0.183 99)` | Amarillo marcatextos. Superficies, no texto. |
| `--color-brand-soft` | `oklch(0.955 0.062 100)` | Halos y anillos. |
| `--color-brand-text` | `oklch(0.52 0.128 72)` | Ámbar oscuro para texto de acento sobre blanco. |

**Regla de contraste:** el amarillo de marca sobre blanco no llega a 4.5:1, así
que nunca se usa para texto. Cuando el acento tiene que ser texto se usa
`--color-brand-text`. Verificado con axe-core: cero violaciones de contraste.

## Typography

Una sola familia: **Archivo** (variable, ejes `wght` 100–900 y `wdth` 62–125).

El reflejo de la categoría era una condensada pesada tipo Anton o Bebas — el
cartel de gimnasio. Se rechazó por eso mismo. El segundo reflejo, la editorial
con serif display en itálica, también, por no ser una revista. Archivo llevada al
ancho **expandido** con peso máximo da confianza atlética sin gritar, y el eje de
ancho aporta el contraste que normalmente exigiría una segunda tipografía.

- `.type-display` — `wdth` 112, peso 800, tracking `-0.035em`, interlínea 0.92.
- `.type-h2` — `wdth` 108, peso 750, tracking `-0.028em`.
- Ambas llevan `word-spacing` positivo: el tracking negativo cierra los espacios
  entre palabras y las pega.
- Escala fluida con `clamp()`, ratio ~1.3. Techo del display: 4.75rem (76px).

## Gesto de marca

El **marcatextos** (`.mark`): un trazo amarillo inclinado detrás de una palabra,
como subrayar el día en el calendario del reto. Es el único adorno del sistema y
sustituye a los "eyebrows" en versalitas sobre cada sección, que son andamiaje de
IA. Se usa una vez por sección como máximo.

## Liquid glass

Escaso y con función: solo sobre fotografía o sobre contenido que se desplaza por
debajo. Nunca sobre un fondo plano, donde sería decoración.

- `.glass` — cabecera fija al hacer scroll, chip de fecha sobre el hero, marco
  de la foto de nutrición.
- `.glass-dark` — etiquetas sobre imágenes oscuras.
- Ambas tienen respaldo con `@supports not (backdrop-filter)`.

## Layout

- Ancho máximo `88rem`, padding `1.25rem` en móvil y `2rem` desde `sm`.
- El catálogo de retos es una **lista con filete**, no una rejilla de tarjetas:
  se lee como un calendario de generaciones y deja que la duración mande.
- Escala z semántica: `sticky` (40) → `nav` (50) → `overlay` (60).

## Motion

- Curvas exponenciales de salida (`--ease-out-quint`, `--ease-out-quart`). Sin
  rebote.
- Revelado al entrar en pantalla, escalonado dentro de una misma lista.
- **El estado por defecto es visible.** Un script inline marca `js-reveal` en
  `<html>` antes del primer paint; sin JavaScript nada se oculta, así que ninguna
  sección se publica en blanco.
- Todo tiene alternativa bajo `prefers-reduced-motion: reduce`.

## Imágenes

Hoy son de Unsplash (uso comercial libre), todas verificadas. Se eligieron por
luz alta y encuadre con aire negativo del lado del texto. Se sustituyen por las
de Yadira; las de antes/después exigen consentimiento por escrito de cada
persona.

## Portada del enlace

[app/opengraph-image.tsx](app/opengraph-image.tsx) — lo que se ve al compartir el
sitio en WhatsApp o al pautarlo en Facebook.

Antes no había imagen declarada, así que los crawlers caían al ícono y el
preview salía siendo el logo amarillo solo; como anuncio eso no invita a abrir
nada. Hubo una versión tipográfica y luego una de foto con textos encima;
Yadira pidió que fuera **solo su retrato, sin información sobre la foto**. La
info ("Reto Transfórmate / En gym exclusivo para mujeres") vive en el
`openGraph` de [app/layout.tsx](app/layout.tsx), que es lo que WhatsApp muestra
como título y descripción debajo de la imagen.

Dos cosas a mantener a mano:

- El retrato vive duplicado en `assets/coach-retrato.jpg` porque satori no
  decodifica el WebP de `public/`. Si se cambia la foto, hay que regenerar el
  JPEG (`sips -s format jpeg public/coach-retrato.webp --out assets/coach-retrato.jpg`).
- El retrato es vertical y la tarjeta apaisada: el `objectPosition` (28%) está
  calibrado para esa foto en concreto, encuadrando cara y torso. Con otra foto
  hay que recalibrarlo mirando el render en `/opengraph-image`.

Las fuentes WOFF estáticas de `assets/` ya no las usa la portada, pero se
quedan: cualquier arte OG futuro con la tipografía del sitio las necesita
(satori no instancia fuentes variables).
