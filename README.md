# Yadira Team

Landing de los retos de 30 y 90 días: gym privado exclusivo de mujeres,
entrenamiento personal presencial y en línea, con cocina propia para elaborar
la dieta.

## Estado

**Frontend, sin cobros todavía.** Los textos salen de los flyers de Yadira; no
hay testimonios ni resultados porque aún no existen. Precio y fecha de inicio
están sin definir a propósito, así que no se publican: son campos opcionales
del modelo y aparecen solos en cuanto se llenen. Mientras tanto todos los CTA
llevan a WhatsApp.

Ni Stripe ni Supabase están conectados.

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run lint
```

## Despliegue

Vercel, conectado a `main`: cada push despliega.

Vercel bloquea el deploy si el correo del autor del commit no es válido. Si
git nunca se configuró en la máquina, inventa uno a partir del nombre del
equipo (`usuario@MacBook-de-Alguien.local`) y el deploy falla con
*Deployment Blocked*. Se arregla una sola vez:

```bash
git config --global user.email "el-correo-de-tu-cuenta-github"
git config --global user.name "Tu Nombre"
```

Los commits anteriores al arreglo conservan el correo inválido: si redespliegas
uno de ellos desde el panel, volverá a bloquearse.

## Cómo está organizado

```
app/
  layout.tsx              fuente, metadata, script anti-parpadeo del revelado
  page.tsx                compone las secciones de la landing
  retos/[slug]/page.tsx   detalle de cada reto (estático, uno por reto)
  gracias/page.tsx        confirmación tras el pago
components/
  secciones/              una sección de la landing por archivo
  ui/                     Boton, Reveal
lib/
  types.ts                modelo de datos — es la forma futura de las tablas
  retos.ts                catálogo y contenido (hoy en archivo)
  site.ts                 nombre, WhatsApp, correo, navegación
```

`lib/retos.ts` es la única fuente de contenido. Cuando conectemos Supabase se
reemplaza por una consulta a la tabla `retos` y los componentes no cambian.

## Documentación

- [PRODUCT.md](PRODUCT.md) — a quién le habla, qué debe creer y qué evitar.
- [DESIGN.md](DESIGN.md) — color, tipografía, motion y por qué.

## Lo que falta

Por parte de la clienta:

- Nombres, descripciones y **precios reales** de los retos.
- Fotos suyas y de las instalaciones.
- Fotos antes/después **con consentimiento por escrito** de cada persona.
- Número de WhatsApp para los avisos, correo de contacto y logo.
- Política de cancelación y reembolso definitiva.
- Cuenta de Stripe a su nombre, con sus datos bancarios.

Por parte de desarrollo:

- Stripe Checkout y el webhook `checkout.session.completed`.
- Supabase: tablas de retos y reservas, y Storage para las fotos.
- Aviso por WhatsApp a la dueña cuando entra una reserva pagada.
- Páginas de aviso de privacidad y términos.

## Notas técnicas

- Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript.
- Sin librería de componentes: los tres elementos interactivos (menú móvil,
  acordeón de FAQ y comparador antes/después) están hechos a mano sobre HTML
  nativo para no pelear con los tokens del sistema de diseño.
- Accesibilidad verificada con axe-core (WCAG 2.1 AA) en 390px y 1440px.
