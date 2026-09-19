# Pagos en línea con Stripe — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cobrar el Reto 30 días ($2,500 MXN) y el Reto 90 días ($6,500 MXN, cupón 20% anticipado manejado desde Stripe) con Checkout hosteado, y registrar cada pago en Supabase vía webhook.

**Architecture:** El sitio sigue estático; se agregan dos route handlers (`/api/checkout` crea la sesión y redirige al Checkout hosteado de Stripe; `/api/stripe/webhook` verifica firma y hace upsert en la tabla `pagos` de Supabase) y una página dinámica `/gracias` que consulta el estado real de la sesión. Los montos viven en Stripe (lookup keys); el descuento es un promotion code que se activa desde el dashboard.

**Tech Stack:** Next.js 16.2.12 (App Router), `stripe` (SDK Node), `@supabase/supabase-js`, Supabase CLI (migraciones), Vitest.

**Spec:** `docs/superpowers/specs/2026-09-19-pagos-stripe-design.md`

## Global Constraints

- Copy en español de México, con el tono del sitio (tuteo, directo).
- Next 16: `searchParams` en páginas es `Promise` (se hace `await`); route handlers usan `Request`/`Response` web estándar. Ante cualquier duda, leer `node_modules/next/dist/docs/`.
- Dinero: centavos como enteros en Stripe y Supabase; en UI pesos con formato `es-MX` (`$2,500 MXN`).
- Secretos SOLO del lado servidor vía `process.env` (`.env.local` en local; Vercel en prod). Nada de llaves en cliente ni en el repo. No se usa llave publicable.
- Supabase: RLS activo en `pagos`; solo el rol de servicio (llave `sb_secret_…`) lee/escribe.
- Proyecto Supabase: ref `cekfgkffbdthmkvqrbsn` (YadiraWeb). Cuenta Stripe en modo prueba (llaves en `.env.local`).
- Commits en español; terminan con `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Comentarios de código: solo restricciones que el código no puede mostrar, en español, como el resto del repo.

---

### Task 1: Dependencias y runner de pruebas

**Files:**
- Modify: `package.json` (deps y script `test`)
- Create: `vitest.config.ts`
- Test: `tests/smoke.test.ts` (temporal, se borra en Task 2)

**Interfaces:**
- Produces: `npm test` corre Vitest; alias `@/` resuelve a la raíz del repo en tests.

- [ ] **Step 1: Instalar dependencias**

```bash
npm install stripe @supabase/supabase-js && npm install -D vitest
```

- [ ] **Step 2: Configurar Vitest con el alias `@/`**

```ts
// vitest.config.ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
});
```

Y en `package.json`, dentro de `scripts`, agregar: `"test": "vitest run"`.

- [ ] **Step 3: Prueba humo y verificación**

```ts
// tests/smoke.test.ts
import { expect, test } from "vitest";

test("el runner corre", () => {
  expect(1 + 1).toBe(2);
});
```

Run: `npm test` — Expected: 1 passed.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests/smoke.test.ts
git commit -m "Instala stripe, supabase-js y vitest con alias @/

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Precios en los datos y helper de formato

**Files:**
- Create: `lib/precio.ts`
- Test: `tests/precio.test.ts` (y borrar `tests/smoke.test.ts`)
- Modify: `lib/types.ts` (campo `ventaAbierta`), `lib/retos.ts` (precios y flag)

**Interfaces:**
- Produces: `precioMXN(pesos: number): string` → `"$2,500 MXN"`. `Reto.precioMXN?: number` (pesos, ya existía) con valores 2500/6500; `Reto.ventaAbierta: boolean`.

- [ ] **Step 1: Escribir la prueba que falla**

```ts
// tests/precio.test.ts
import { expect, test } from "vitest";
import { precioMXN } from "@/lib/precio";

test("formatea pesos con separador de miles y sufijo MXN", () => {
  expect(precioMXN(2500)).toBe("$2,500 MXN");
  expect(precioMXN(6500)).toBe("$6,500 MXN");
});
```

- [ ] **Step 2: Verificar que falla** — Run: `npm test` — Expected: FAIL (módulo no existe).

- [ ] **Step 3: Implementación mínima**

```ts
// lib/precio.ts
/** Pesos enteros → "$2,500 MXN". Los centavos solo existen hacia Stripe. */
export const precioMXN = (pesos: number) =>
  `$${pesos.toLocaleString("es-MX")} MXN`;
```

- [ ] **Step 4: Verificar que pasa** — Run: `npm test` — Expected: PASS. Borrar `tests/smoke.test.ts`.

- [ ] **Step 5: Datos**

En `lib/types.ts`, dentro de `Reto`, después de `activo: boolean;` agregar:

```ts
  /** Si el botón de pago está disponible; el cierre de cupos hoy es manual. */
  ventaAbierta: boolean;
```

Y actualizar el comentario del bloque de `precioMXN?`/`fechaInicio?` para que ya no diga que el precio no está definido: el precio ya se publica; `fechaInicio` sigue sin definirse.

En `lib/retos.ts`: al reto de 30 días agregar `precioMXN: 2500, ventaAbierta: true,` y al de 90 `precioMXN: 6500, ventaAbierta: true,`.

- [ ] **Step 6: Verificar** — Run: `npx tsc --noEmit && npm test` — Expected: sin errores, tests PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/precio.ts lib/types.ts lib/retos.ts tests/
git commit -m "Publica los precios en los datos: 30 días \$2,500 y 90 días \$6,500

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Migración Supabase — tabla `pagos`

**Files:**
- Create: `supabase/` (via `supabase init`), `supabase/migrations/<timestamp>_crear_tabla_pagos.sql`

**Interfaces:**
- Produces: tabla `public.pagos` con unique `stripe_session_id`, RLS activo, acceso solo `service_role`. Columnas exactas que Task 4 produce como `FilaPago`.

- [ ] **Step 1: Inicializar y ligar el proyecto**

```bash
supabase init
supabase link --project-ref cekfgkffbdthmkvqrbsn \
  -p "$(python3 -c "print(next(l.split('=',1)[1].strip() for l in open('.env.local') if l.startswith('SUPABASE_DB_PASSWORD=')))")"
```

(La contraseña vive SOLO en `.env.local` — jamás pegarla en archivos del
repo ni en comandos a mano; trae `$` y `!` que el shell expandiría.)

- [ ] **Step 2: Crear la migración**

```bash
supabase migration new crear_tabla_pagos
```

Contenido del archivo generado en `supabase/migrations/`:

```sql
-- Registro propio de cada pago. Stripe es la fuente de verdad; esta tabla
-- es el registro consultable que llena el webhook (upsert por sesión).
create table public.pagos (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  reto text not null,
  monto integer not null,          -- centavos
  moneda text not null default 'mxn',
  descuento integer not null default 0, -- centavos
  estado text not null check (estado in ('pagado', 'procesando', 'fallido')),
  nombre text,
  email text,
  telefono text,
  modalidad text,
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);

-- Candado: RLS sin políticas = nadie pasa por la API pública.
-- Solo el rol de servicio (llave secreta, solo servidor) toca la tabla.
alter table public.pagos enable row level security;
revoke all on table public.pagos from anon, authenticated;
grant all on table public.pagos to service_role;
```

- [ ] **Step 3: Aplicar y verificar**

```bash
supabase db push
```

Expected: migración aplicada sin error. Verificar que la API la ve pero cerrada:

```bash
python3 - <<'EOF'
import os, urllib.request
env = dict(l.split('=',1) for l in open('.env.local') if '=' in l and not l.startswith('#'))
url = env['SUPABASE_URL'].strip() + '/rest/v1/pagos?select=id&limit=1'
req = urllib.request.Request(url, headers={'apikey': env['SUPABASE_SECRET_KEY'].strip()})
print('con secret:', urllib.request.urlopen(req).status)  # espera 200
EOF
```

Expected: `con secret: 200`.

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "Tabla pagos en Supabase: RLS cerrado, solo el servidor escribe

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Lógica pura de pagos (`lib/pagos.ts`)

**Files:**
- Create: `lib/pagos.ts`
- Test: `tests/pagos.test.ts`

**Interfaces:**
- Consumes: tipo `Stripe.Checkout.Session` del paquete `stripe`.
- Produces:
  - `type FilaPago = { stripe_session_id: string; stripe_payment_intent: string | null; reto: string; monto: number; moneda: string; descuento: number; estado: "pagado" | "procesando" | "fallido"; nombre: string | null; email: string | null; telefono: string | null; modalidad: string | null; actualizado: string }`
  - `estadoDePago(tipoEvento: string, session: Stripe.Checkout.Session): FilaPago["estado"]`
  - `sesionAFila(tipoEvento: string, session: Stripe.Checkout.Session): FilaPago`
  - `construirParamsCheckout(opts: { slug: string; priceId: string; origen: string; promotionCodeId?: string }): Stripe.Checkout.SessionCreateParams`
  - `CODIGO_ANTICIPADO = "ANTICIPADO20"`

- [ ] **Step 1: Escribir las pruebas que fallan**

```ts
// tests/pagos.test.ts
import { expect, test } from "vitest";
import type Stripe from "stripe";
import {
  construirParamsCheckout,
  estadoDePago,
  sesionAFila,
} from "@/lib/pagos";

const sesion = (extra: object = {}) =>
  ({
    id: "cs_test_123",
    payment_intent: "pi_123",
    payment_status: "paid",
    amount_total: 650000,
    currency: "mxn",
    total_details: { amount_discount: 130000 },
    metadata: { reto: "reto-90-dias" },
    customer_details: {
      name: "Ana López",
      email: "ana@correo.com",
      phone: "+528331234567",
    },
    custom_fields: [
      { key: "modalidad", dropdown: { value: "presencial" } },
    ],
    ...extra,
  }) as unknown as Stripe.Checkout.Session;

test("pago con tarjeta queda pagado", () => {
  expect(estadoDePago("checkout.session.completed", sesion())).toBe("pagado");
});

test("SPEI sin confirmar queda procesando", () => {
  expect(
    estadoDePago(
      "checkout.session.completed",
      sesion({ payment_status: "unpaid" }),
    ),
  ).toBe("procesando");
});

test("transferencia fallida queda fallido", () => {
  expect(
    estadoDePago("checkout.session.async_payment_failed", sesion()),
  ).toBe("fallido");
});

test("sesionAFila mapea todos los campos", () => {
  const fila = sesionAFila("checkout.session.completed", sesion());
  expect(fila).toMatchObject({
    stripe_session_id: "cs_test_123",
    stripe_payment_intent: "pi_123",
    reto: "reto-90-dias",
    monto: 650000,
    moneda: "mxn",
    descuento: 130000,
    estado: "pagado",
    nombre: "Ana López",
    email: "ana@correo.com",
    telefono: "+528331234567",
    modalidad: "presencial",
  });
  expect(typeof fila.actualizado).toBe("string");
});

test("construirParamsCheckout arma la sesión con SPEI y modalidad", () => {
  const params = construirParamsCheckout({
    slug: "reto-30-dias",
    priceId: "price_abc",
    origen: "http://localhost:3000",
  });
  expect(params.mode).toBe("payment");
  expect(params.line_items).toEqual([{ price: "price_abc", quantity: 1 }]);
  expect(params.payment_method_types).toEqual(["card", "customer_balance"]);
  expect(params.customer_creation).toBe("always");
  expect(params.phone_number_collection).toEqual({ enabled: true });
  expect(params.success_url).toBe(
    "http://localhost:3000/gracias?session_id={CHECKOUT_SESSION_ID}",
  );
  expect(params.cancel_url).toBe("http://localhost:3000/retos/reto-30-dias");
  expect(params.metadata).toEqual({ reto: "reto-30-dias" });
  expect(params.discounts).toBeUndefined();
});

test("con promo activa la aplica", () => {
  const params = construirParamsCheckout({
    slug: "reto-90-dias",
    priceId: "price_xyz",
    origen: "https://yadira-fitness.vercel.app",
    promotionCodeId: "promo_1",
  });
  expect(params.discounts).toEqual([{ promotion_code: "promo_1" }]);
});
```

- [ ] **Step 2: Verificar que fallan** — Run: `npm test` — Expected: FAIL (módulo no existe).

- [ ] **Step 3: Implementación**

```ts
// lib/pagos.ts
import type Stripe from "stripe";

/** El promotion code del 20% anticipado; se activa desde el dashboard. */
export const CODIGO_ANTICIPADO = "ANTICIPADO20";

export type FilaPago = {
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  reto: string;
  monto: number;
  moneda: string;
  descuento: number;
  estado: "pagado" | "procesando" | "fallido";
  nombre: string | null;
  email: string | null;
  telefono: string | null;
  modalidad: string | null;
  actualizado: string;
};

export function estadoDePago(
  tipoEvento: string,
  session: Stripe.Checkout.Session,
): FilaPago["estado"] {
  if (tipoEvento === "checkout.session.async_payment_failed") return "fallido";
  return session.payment_status === "paid" ? "pagado" : "procesando";
}

export function sesionAFila(
  tipoEvento: string,
  session: Stripe.Checkout.Session,
): FilaPago {
  const modalidad =
    session.custom_fields?.find((c) => c.key === "modalidad")?.dropdown
      ?.value ?? null;
  return {
    stripe_session_id: session.id,
    stripe_payment_intent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
    reto: session.metadata?.reto ?? "desconocido",
    monto: session.amount_total ?? 0,
    moneda: session.currency ?? "mxn",
    descuento: session.total_details?.amount_discount ?? 0,
    estado: estadoDePago(tipoEvento, session),
    nombre: session.customer_details?.name ?? null,
    email: session.customer_details?.email ?? null,
    telefono: session.customer_details?.phone ?? null,
    modalidad,
    actualizado: new Date().toISOString(),
  };
}

export function construirParamsCheckout(opts: {
  slug: string;
  priceId: string;
  origen: string;
  promotionCodeId?: string;
}): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    line_items: [{ price: opts.priceId, quantity: 1 }],
    payment_method_types: ["card", "customer_balance"],
    payment_method_options: {
      customer_balance: {
        funding_type: "bank_transfer",
        bank_transfer: { type: "mx_bank_transfer" },
      },
    },
    // SPEI (customer_balance) exige que la sesión cree un customer.
    customer_creation: "always",
    phone_number_collection: { enabled: true },
    custom_fields: [
      {
        key: "modalidad",
        label: { type: "custom", custom: "¿Cómo vas a entrenar?" },
        type: "dropdown",
        dropdown: {
          options: [
            { label: "Presencial, en el gym", value: "presencial" },
            { label: "En línea", value: "online" },
          ],
        },
      },
    ],
    ...(opts.promotionCodeId
      ? { discounts: [{ promotion_code: opts.promotionCodeId }] }
      : {}),
    metadata: { reto: opts.slug },
    success_url: `${opts.origen}/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origen}/retos/${opts.slug}`,
    locale: "es-419",
  };
}
```

- [ ] **Step 4: Verificar que pasan** — Run: `npm test && npx tsc --noEmit` — Expected: PASS, sin errores de tipos.

- [ ] **Step 5: Commit**

```bash
git add lib/pagos.ts tests/pagos.test.ts
git commit -m "Lógica pura de pagos: mapeo de sesión a fila y parámetros del checkout

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Alta idempotente en Stripe (productos, precios, cupón)

**Files:**
- Create: `scripts/stripe-setup.mjs`

**Interfaces:**
- Consumes: `STRIPE_SECRET_KEY` del entorno.
- Produces: en Stripe, precios con `lookup_key` `reto-30-dias` (250000 mxn) y `reto-90-dias` (650000 mxn); cupón `ANTICIPADO20` (20%) con promotion code `ANTICIPADO20` INACTIVO y `metadata.reto = "reto-90-dias"`.

- [ ] **Step 1: Escribir el script**

```js
// scripts/stripe-setup.mjs
// Alta idempotente del catálogo en Stripe. Correr una vez por entorno:
//   node --env-file=.env.local scripts/stripe-setup.mjs
// Reejecutarlo no duplica nada: busca por lookup_key / id antes de crear.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const RETOS = [
  { lookup: "reto-30-dias", nombre: "Reto 30 días", monto: 250000 },
  { lookup: "reto-90-dias", nombre: "Reto Transformación (90 días)", monto: 650000 },
];

for (const reto of RETOS) {
  const existentes = await stripe.prices.list({ lookup_keys: [reto.lookup] });
  if (existentes.data.length > 0) {
    console.log(`ya existe: ${reto.lookup}`);
    continue;
  }
  const producto = await stripe.products.create({
    name: reto.nombre,
    metadata: { slug: reto.lookup },
  });
  await stripe.prices.create({
    product: producto.id,
    unit_amount: reto.monto,
    currency: "mxn",
    lookup_key: reto.lookup,
  });
  console.log(`creado: ${reto.lookup} → $${reto.monto / 100} MXN`);
}

// Cupón 20% por pago anticipado. El promotion code nace INACTIVO: se
// enciende desde el dashboard cuando exista la fecha límite.
let cupon;
try {
  cupon = await stripe.coupons.retrieve("ANTICIPADO20");
  console.log("cupón ya existe");
} catch {
  cupon = await stripe.coupons.create({
    id: "ANTICIPADO20",
    percent_off: 20,
    duration: "once",
    name: "20% por pago anticipado",
  });
  console.log("cupón creado");
}

const promos = await stripe.promotionCodes.list({ code: "ANTICIPADO20", limit: 1 });
if (promos.data.length === 0) {
  await stripe.promotionCodes.create({
    coupon: cupon.id,
    code: "ANTICIPADO20",
    active: false,
    metadata: { reto: "reto-90-dias" },
  });
  console.log("promotion code creado (inactivo)");
} else {
  console.log("promotion code ya existe");
}
```

- [ ] **Step 2: Correrlo contra el modo prueba**

Run: `node --env-file=.env.local scripts/stripe-setup.mjs`
Expected: `creado: reto-30-dias…`, `creado: reto-90-dias…`, `cupón creado`, `promotion code creado (inactivo)`.

- [ ] **Step 3: Verificar idempotencia** — Correrlo de nuevo. Expected: puros "ya existe".

- [ ] **Step 4: Commit**

```bash
git add scripts/stripe-setup.mjs
git commit -m "Script idempotente de alta en Stripe: retos, precios MXN y cupón anticipado

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Clientes de servidor y `POST /api/checkout`

**Files:**
- Create: `lib/stripe.ts`, `lib/supabase-admin.ts`, `app/api/checkout/route.ts`

**Interfaces:**
- Consumes: `getReto` de `@/lib/retos` (filtra `activo`); `construirParamsCheckout` y `CODIGO_ANTICIPADO` de `@/lib/pagos` (Task 4); precios por lookup key (Task 5).
- Produces: `stripe` (instancia `Stripe`), `supabaseAdmin` (cliente Supabase); endpoint `POST /api/checkout` que recibe `FormData` con campo `reto` (slug) y responde 303 → Checkout, 404, 409 o 500.

- [ ] **Step 1: Clientes**

```ts
// lib/stripe.ts
import Stripe from "stripe";

/** Cliente único del servidor. La llave jamás llega al navegador. */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
```

```ts
// lib/supabase-admin.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con la llave secreta (rol de servicio): brinca RLS. Solo puede
 * importarse desde route handlers/páginas de servidor, nunca en cliente.
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } },
);
```

- [ ] **Step 2: Route handler**

```ts
// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { CODIGO_ANTICIPADO, construirParamsCheckout } from "@/lib/pagos";
import { getReto } from "@/lib/retos";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const form = await request.formData();
  const slug = String(form.get("reto") ?? "");
  const reto = getReto(slug);

  if (!reto) {
    return NextResponse.json({ error: "Reto no encontrado" }, { status: 404 });
  }
  if (!reto.ventaAbierta) {
    return NextResponse.json(
      { error: "La venta de este reto está cerrada por ahora" },
      { status: 409 },
    );
  }

  const origen = new URL(request.url).origin;

  try {
    const precios = await stripe.prices.list({
      lookup_keys: [slug],
      limit: 1,
    });
    const precio = precios.data[0];
    if (!precio) {
      console.error(`checkout: no hay precio con lookup_key ${slug}`);
      return NextResponse.json(
        { error: "El pago no está disponible en este momento" },
        { status: 500 },
      );
    }

    // El 20% anticipado se aplica solo si el code está activo en Stripe y
    // este reto es el suyo. Encenderlo/apagarlo es cosa del dashboard.
    const promos = await stripe.promotionCodes.list({
      code: CODIGO_ANTICIPADO,
      active: true,
      limit: 1,
    });
    const promo = promos.data.find((p) => p.metadata?.reto === slug);

    const session = await stripe.checkout.sessions.create(
      construirParamsCheckout({
        slug,
        priceId: precio.id,
        origen,
        promotionCodeId: promo?.id,
      }),
    );
    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    console.error("checkout:", err);
    return NextResponse.json(
      { error: "No pudimos iniciar tu pago. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 3: Verificación manual**

```bash
(npx next dev -p 3456 >/dev/null 2>&1 &) && sleep 4
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -X POST -F reto=reto-30-dias http://localhost:3456/api/checkout
curl -s -o /dev/null -w "%{http_code}\n" -X POST -F reto=inexistente http://localhost:3456/api/checkout
```

Expected: primera línea `303 https://checkout.stripe.com/…`; segunda `404`. Después `pkill -f "next dev -p 3456"`.

- [ ] **Step 4: Verificar tipos y build** — Run: `npx tsc --noEmit` — Expected: limpio.

- [ ] **Step 5: Commit**

```bash
git add lib/stripe.ts lib/supabase-admin.ts app/api/checkout/route.ts
git commit -m "POST /api/checkout: crea la sesión de pago y redirige al Checkout de Stripe

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Página `/gracias`

**Files:**
- Create: `app/gracias/page.tsx`

**Interfaces:**
- Consumes: `stripe` (Task 6), `site`/`whatsappUrl` de `@/lib/site`, `Header`/`Footer` de `@/components/secciones/…`, `Boton` de `@/components/ui/boton`.
- Produces: página dinámica que lee `?session_id=`, consulta Stripe server-side y muestra estado real.

- [ ] **Step 1: Implementar la página**

```tsx
// app/gracias/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Boton } from "@/components/ui/boton";
import { site, whatsappUrl } from "@/lib/site";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Gracias",
  robots: { index: false },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) notFound();

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    notFound();
  }

  // Con SPEI la sesión se completa antes de que llegue el dinero: el estado
  // real lo dice payment_status, no el hecho de haber llegado a esta página.
  const pagado = session.payment_status === "paid";
  const nombre = session.customer_details?.name ?? "";

  return (
    <>
      <Header />
      <main className="mesh-amarillo flex min-h-[70vh] items-center pt-28 pb-16 sm:pt-36">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-text">
            {pagado ? "Pago confirmado" : "Pago en proceso"}
          </p>
          <h1 className="type-display mt-5 max-w-[16ch] text-display text-ink">
            {pagado ? (
              <>
                Tu cupo está <span className="mark">asegurado</span>
              </>
            ) : (
              "Estamos esperando tu transferencia"
            )}
          </h1>
          <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-ink-muted sm:text-lg">
            {pagado
              ? "Ya quedó. Escríbele a Yadira por WhatsApp para agendar tu evaluación y arrancar tu reto."
              : "En cuanto tu banco confirme la transferencia (normalmente unos minutos), tu cupo queda asegurado y te llega un correo de confirmación."}
          </p>
          <div className="mt-9">
            <Boton
              href={whatsappUrl(
                `Hola ${site.nombreCorto}, soy ${nombre || "clienta nueva"} y ya ${pagado ? "pagué" : "inicié el pago de"} mi reto. ¿Cómo empezamos?`,
              )}
            >
              Escribir a Yadira por WhatsApp
            </Boton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verificación manual**

Con el dev server corriendo, completar un pago de prueba desde la URL del Task 6 Step 3 (tarjeta `4242 4242 4242 4242`, fecha futura, CVC cualquiera, teléfono y modalidad llenos) y confirmar que redirige a `/gracias` con "Tu cupo está asegurado". Además: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3456/gracias` → Expected: 404.

- [ ] **Step 3: Commit**

```bash
git add app/gracias/page.tsx
git commit -m "Página /gracias: confirma el cupo con el estado real de la sesión

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Webhook de Stripe → Supabase

**Files:**
- Create: `app/api/stripe/webhook/route.ts`

**Interfaces:**
- Consumes: `stripe` (Task 6), `supabaseAdmin` (Task 6), `sesionAFila` (Task 4), `STRIPE_WEBHOOK_SECRET`.
- Produces: endpoint `POST /api/stripe/webhook` — 400 firma inválida, 500 si Supabase falla (Stripe reintenta), 200 en lo demás.

- [ ] **Step 1: Implementar el handler**

```ts
// app/api/stripe/webhook/route.ts
import type Stripe from "stripe";
import { sesionAFila } from "@/lib/pagos";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

const EVENTOS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
]);

export async function POST(request: Request) {
  // La firma se verifica sobre el cuerpo CRUDO: nada de request.json().
  const cuerpo = await request.text();
  const firma = request.headers.get("stripe-signature") ?? "";

  let evento: Stripe.Event;
  try {
    evento = stripe.webhooks.constructEvent(
      cuerpo,
      firma,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Firma inválida", { status: 400 });
  }

  if (EVENTOS.has(evento.type)) {
    const session = evento.data.object as Stripe.Checkout.Session;
    // Upsert por sesión: los reintentos de Stripe y el par de eventos de
    // SPEI (completed + async_payment_succeeded) no duplican filas.
    const { error } = await supabaseAdmin
      .from("pagos")
      .upsert(sesionAFila(evento.type, session), {
        onConflict: "stripe_session_id",
      });
    if (error) {
      console.error("webhook: error al registrar en Supabase", error);
      return new Response("Error al registrar", { status: 500 });
    }
  }

  return new Response("ok");
}
```

- [ ] **Step 2: Crear el endpoint del webhook en Stripe (modo prueba) y guardar el secret**

```bash
python3 - <<'EOF'
import json, urllib.request, urllib.parse
env = dict(l.split('=',1) for l in open('.env.local') if '=' in l and not l.startswith('#'))
sk = env['STRIPE_SECRET_KEY'].strip()
datos = urllib.parse.urlencode([
    ('url', 'https://yadira-fitness.vercel.app/api/stripe/webhook'),
    ('enabled_events[]', 'checkout.session.completed'),
    ('enabled_events[]', 'checkout.session.async_payment_succeeded'),
    ('enabled_events[]', 'checkout.session.async_payment_failed'),
]).encode()
req = urllib.request.Request('https://api.stripe.com/v1/webhook_endpoints', data=datos)
import base64
req.add_header('Authorization', 'Basic ' + base64.b64encode((sk+':').encode()).decode())
r = json.load(urllib.request.urlopen(req))
s = open('.env.local').read().replace('STRIPE_WEBHOOK_SECRET=', 'STRIPE_WEBHOOK_SECRET=' + r['secret'], 1)
open('.env.local','w').write(s)
print('endpoint creado:', r['id'])
EOF
```

Expected: `endpoint creado: we_…` y `.env.local` con el `whsec_…`. (Ese secret es del endpoint de producción; para pruebas locales el paso siguiente usa el suyo propio.)

- [ ] **Step 3: Probar en local con el Stripe CLI**

```bash
stripe --version || brew install stripe/stripe-cli/stripe
```

En una terminal: `stripe listen --events checkout.session.completed --forward-to localhost:3456/api/stripe/webhook --api-key "$(grep STRIPE_SECRET_KEY .env.local | cut -d= -f2)"` — imprime un `whsec_…` local; correr el dev server con ese valor: `STRIPE_WEBHOOK_SECRET=whsec_local npx next dev -p 3456`. Luego `stripe trigger checkout.session.completed --api-key …`.

Expected: el listener muestra `200`, y en Supabase aparece la fila:

```bash
python3 - <<'EOF'
import json, urllib.request
env = dict(l.split('=',1) for l in open('.env.local') if '=' in l and not l.startswith('#'))
req = urllib.request.Request(
    env['SUPABASE_URL'].strip() + '/rest/v1/pagos?select=reto,estado,monto&order=creado.desc&limit=3',
    headers={'apikey': env['SUPABASE_SECRET_KEY'].strip()})
print(json.load(urllib.request.urlopen(req)))
EOF
```

Expected: lista con al menos una fila `estado: "pagado"`. Repetir el trigger y verificar que NO se duplica (mismo número de filas para la misma sesión).

- [ ] **Step 4: Commit**

```bash
git add app/api/stripe/webhook/route.ts
git commit -m "Webhook de Stripe: registra cada pago en Supabase con upsert idempotente

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9: UI — precios visibles y botón de pago

**Files:**
- Modify: `components/ui/boton.tsx` (agregar `BotonSubmit`), `components/secciones/retos.tsx` (precio en cada fila), `app/retos/[slug]/page.tsx` (tarjeta "Reserva tu cupo" con pago)

**Interfaces:**
- Consumes: `precioMXN` (Task 2), endpoint `/api/checkout` (Task 6).
- Produces: `BotonSubmit({ children, variante?, className? })` — botón `type="submit"` con los mismos estilos que `Boton`.

- [ ] **Step 1: `BotonSubmit`**

En `components/ui/boton.tsx`, después del componente `Boton`, agregar (reutiliza las constantes `base` y `variantes` ya definidas en el archivo):

```tsx
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
```

- [ ] **Step 2: Precio en el catálogo**

En `components/secciones/retos.tsx`, importar `precioMXN` de `@/lib/precio` y, dentro del bloque `<div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-4">` (la columna derecha de cada fila), ANTES del `<span className="glass …">Ver el reto…`, agregar:

```tsx
{reto.precioMXN && (
  <span className="text-lg font-extrabold tracking-[-0.01em] text-ink">
    {precioMXN(reto.precioMXN)}
  </span>
)}
```

- [ ] **Step 3: Tarjeta de pago en la página del reto**

En `app/retos/[slug]/page.tsx`, importar `BotonSubmit` de `@/components/ui/boton` y `precioMXN` de `@/lib/precio`. Reemplazar el contenido de la tarjeta `<div className="glass mt-6 rounded-3xl p-7">` por:

```tsx
<div className="glass mt-6 rounded-3xl p-7">
  <h2 className="text-base font-bold text-ink">Reserva tu cupo</h2>
  {reto.precioMXN && (
    <p className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-ink">
      {precioMXN(reto.precioMXN)}
    </p>
  )}
  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">
    ¿Estás lista? Inscríbete ya. ¿Qué esperas? Mis cupos son limitados:
    aprovecha y ve por tu mejor versión.
  </p>

  {reto.ventaAbierta ? (
    <form action="/api/checkout" method="POST" className="mt-6">
      <input type="hidden" name="reto" value={reto.slug} />
      <BotonSubmit className="w-full">Pagar y reservar mi cupo</BotonSubmit>
    </form>
  ) : (
    <p className="mt-6 text-sm font-semibold text-ink">
      La venta de esta generación está cerrada. Escríbeme para apartar la
      siguiente.
    </p>
  )}

  <Boton
    href={whatsappUrl(
      `Hola ${site.nombreCorto}, tengo una duda sobre el ${reto.nombre}.`,
    )}
    variante="secundario"
    className="mt-3 w-full"
  >
    Tengo una duda, WhatsApp
  </Boton>
</div>
```

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit && npm run build` — Expected: build limpio. Con dev server: la página del reto muestra precio y el botón lleva al Checkout; el catálogo muestra `$2,500 MXN` / `$6,500 MXN`.

- [ ] **Step 5: Commit**

```bash
git add components/ui/boton.tsx components/secciones/retos.tsx "app/retos/[slug]/page.tsx"
git commit -m "Precios publicados y botón de pago en la página de cada reto

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10: Términos, reembolsos y aviso de privacidad

**Files:**
- Create: `app/terminos/page.tsx`
- Modify: `components/secciones/footer.tsx` (enlace en la barra inferior)

**Interfaces:**
- Produces: página `/terminos` (borrador a validar por Yadira) enlazada desde el footer.

- [ ] **Step 1: Página**

```tsx
// app/terminos/page.tsx
import type { Metadata } from "next";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y privacidad",
  description:
    "Condiciones de compra, política de reembolsos y aviso de privacidad de los retos.",
};

/* Borrador operativo: Yadira debe validarlo antes de considerarlo final. */
const secciones = [
  {
    titulo: "Qué compras",
    parrafos: [
      "Al pagar un reto reservas tu cupo en el programa de entrenamiento personal correspondiente (30 o 90 días), que incluye lo publicado en la sección “Qué incluye tu reto”. La fecha de arranque de cada generación se coordina por WhatsApp después del pago.",
    ],
  },
  {
    titulo: "Pagos",
    parrafos: [
      "Los pagos se procesan a través de Stripe con tarjeta o transferencia bancaria (SPEI). Nosotros no guardamos los datos de tu tarjeta. Los precios están en pesos mexicanos e incluyen el programa completo; no hay cargos recurrentes.",
    ],
  },
  {
    titulo: "Reembolsos",
    parrafos: [
      "Si aún no arranca tu reto, puedes pedir reembolso completo escribiéndonos por WhatsApp. Una vez iniciado el programa, el pago no es reembolsable, porque el cupo y el plan se preparan de forma personal para ti. Si tu transferencia SPEI no se completa, no se hace ningún cargo.",
    ],
  },
  {
    titulo: "Aviso de privacidad",
    parrafos: [
      `${site.nombre} usa tu nombre, correo y teléfono únicamente para darte de alta en tu reto, contactarte por WhatsApp y emitir tu comprobante de pago. No compartimos tus datos con terceros fuera de los proveedores que hacen posible el cobro (Stripe) y la operación del sitio. Puedes pedir la corrección o eliminación de tus datos escribiéndonos por WhatsApp.`,
    ],
  },
  {
    titulo: "Salud",
    parrafos: [
      "Los planes de alimentación y entrenamiento no sustituyen atención médica. Consulta a tu médico antes de empezar cualquier reto.",
    ],
  },
];

export default function TerminosPage() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="mx-auto max-w-[52rem] px-5 sm:px-8">
          <h1 className="type-h2 text-h1 text-ink">
            Términos, reembolsos y privacidad
          </h1>
          {secciones.map((s) => (
            <section key={s.titulo} className="mt-10">
              <h2 className="text-h3 font-bold text-ink">{s.titulo}</h2>
              {s.parrafos.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="mt-3 text-base leading-relaxed text-ink-muted"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Enlace en el footer**

En `components/secciones/footer.tsx`, en la barra inferior (el `<div className="border-t border-bg/12">`), junto al `© {anio}`, cambiar el párrafo por:

```tsx
<p>
  © {anio} {site.nombre}. ·{" "}
  <Link href="/terminos" className="underline-offset-4 hover:text-brand hover:underline">
    Términos y privacidad
  </Link>
</p>
```

(Agregar `import Link from "next/link";` arriba.)

- [ ] **Step 3: Verificar** — Run: `npx tsc --noEmit && npm run build` — Expected: limpio; `/terminos` renderiza.

- [ ] **Step 4: Commit**

```bash
git add app/terminos/page.tsx components/secciones/footer.tsx
git commit -m "Página de términos, reembolsos y aviso de privacidad (borrador a validar)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11: Verificación end-to-end y despliegue

**Files:**
- Modify: `DESIGN.md` (sección corta "Pagos"), `.env.local` ya completo

**Interfaces:**
- Consumes: todo lo anterior.

- [ ] **Step 1: Flujo completo en test mode**

Con `npx next dev -p 3456` y `stripe listen … --forward-to localhost:3456/api/stripe/webhook` corriendo (con su `whsec_` local en el entorno del dev server):
1. Abrir `/retos/reto-30-dias` → botón "Pagar y reservar mi cupo" → Checkout.
2. Pagar con `4242 4242 4242 4242` llenando teléfono y modalidad.
3. Confirmar `/gracias` con "Tu cupo está asegurado".
4. Confirmar la fila en Supabase (query del Task 8 Step 3) con nombre, teléfono, modalidad, monto 250000, estado `pagado`.
5. Probar tarjeta rechazada `4000 0000 0000 0002` → el Checkout muestra el error, no hay fila.

- [ ] **Step 2: Pruebas y build finales**

Run: `npm test && npx tsc --noEmit && npm run build` — Expected: todo verde.

- [ ] **Step 3: Documentar en DESIGN.md**

Agregar al final de `DESIGN.md`:

```markdown
## Pagos

Stripe Checkout hosteado: [app/api/checkout/route.ts](app/api/checkout/route.ts)
crea la sesión (precios por lookup key `reto-30-dias`/`reto-90-dias`, SPEI +
tarjeta) y [app/api/stripe/webhook/route.ts](app/api/stripe/webhook/route.ts)
registra cada pago en la tabla `pagos` de Supabase (upsert idempotente, RLS
cerrado). El 20% anticipado es el promotion code `ANTICIPADO20` en Stripe:
se activa/desactiva desde el dashboard, sin deploys. El catálogo de Stripe se
da de alta con `node --env-file=.env.local scripts/stripe-setup.mjs`
(idempotente; correr también en live al activar la cuenta).
```

- [ ] **Step 4: Variables en Vercel (manual o CLI)**

Si `vercel whoami` responde, cargar `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY` con `vercel env add <NOMBRE> production` (valores de `.env.local`). Si no, indicarle a Sebastian que las capture en Vercel → Settings → Environment Variables.

- [ ] **Step 5: Push y verificación en producción (test mode)**

```bash
git push
```

Tras el deploy: pagar un reto de prueba en `https://yadira-fitness.vercel.app` con `4242…`, confirmar `/gracias` y la fila en Supabase (el webhook de producción ya existe desde Task 8 Step 2).

- [ ] **Step 6: Commit final**

```bash
git add DESIGN.md
git commit -m "DESIGN.md documenta el flujo de pagos con Stripe y Supabase

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
```

---

## Pendientes que NO cubre este plan (van después, ya definidos con Yadira)

- Activación live de Stripe (datos fiscales + CLABE) y correr `stripe-setup.mjs` con la llave live desde Vercel/terminal segura.
- Fecha límite del 20%: activar el promotion code `ANTICIPADO20` en el dashboard (Products → Coupons) cuando exista.
- Cupos automáticos, paquete reto+comida, facturación CFDI.
- Validación de Yadira al texto de `/terminos`.
