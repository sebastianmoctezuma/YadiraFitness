# Pagos en línea con Stripe — diseño

**Fecha:** 2026-09-19 · **Estado:** en revisión

## Objetivo

Que una clienta pueda pagar su reto completo desde el sitio y su cupo quede
asegurado, con registro propio de cada pago. Hoy todo el flujo termina en
WhatsApp y no existe cobro en línea.

## Alcance v1

- **Reto 30 días — $2,500 MXN** y **Reto 90 días — $6,500 MXN**, pago completo.
- **Descuento 20% en el de 90 días por pago anticipado.** Vive en Stripe como
  cupón + promotion code con vigencia; la fecha límite aún no existe, así que
  se activa/desactiva desde el dashboard de Stripe **sin deploys**.
- **Métodos de pago:** tarjeta (débito/crédito) y transferencia SPEI.
- **Datos capturados en el checkout de Stripe:** nombre, correo, teléfono
  (WhatsApp) y modalidad (presencial / en línea) como campo personalizado.
- **Registro de pagos:** tabla `pagos` en Supabase, llenada por webhook.
  Stripe es la fuente de verdad; Supabase es el registro consultable propio.
- **Precios publicados** en el catálogo y la página de cada reto (sustituye a
  "el precio se confirma por WhatsApp").
- Página de **términos, reembolsos y aviso de privacidad** (requisito antes de
  cobrar; borrador nuestro, lo valida Yadira).

**Fuera de alcance v1** (pendientes declarados por Sebastian): cupos
automáticos, paquete reto+comida ($6,500), facturación CFDI, panel propio.
El cierre de ventas es manual: apagar el botón con un flag en `lib/retos.ts`.

## Arquitectura

El sitio sigue siendo estático; se agregan dos route handlers y una página.
Nunca tocamos datos de tarjeta: el pago ocurre en el Checkout hosteado por
Stripe (PCI resuelto).

```
Página del reto ──POST──▶ /api/checkout ──crea──▶ Stripe Checkout (hosteado)
     ▲                                                    │ paga
     │ cancel_url                                         ▼
     └──────────────────────────────── /gracias?session_id=…  (estado real)
                                                          │
Stripe ──evento──▶ /api/stripe/webhook ──inserta/actualiza──▶ Supabase `pagos`
```

### Componentes

1. **Catálogo con precios** — `lib/retos.ts` gana `precioMXN` (ya existe el
   campo opcional en `Reto`) y un flag `ventaAbierta`. La UI de
   `retos.tsx` y `app/retos/[slug]/page.tsx` muestra el precio y el botón
   "Reservar mi cupo" (un `<form>` que hace POST a `/api/checkout`).

2. **`POST /api/checkout`** (route handler):
   - Recibe el `slug`, lo valida contra `lib/retos.ts`; si `ventaAbierta` es
     falso → 409.
   - Resuelve el precio en Stripe por `lookup_key` (`reto-30-dias`,
     `reto-90-dias`) — los montos viven en Stripe, no en el código.
   - Si existe un promotion code activo con metadata `reto=<slug>`, lo aplica
     automáticamente (`discounts`). Así el 20% se enciende desde el dashboard.
   - Crea la sesión: `mode: payment`, tarjeta + SPEI
     (`customer_balance` con `mx_bank_transfer`), teléfono obligatorio,
     campo personalizado `modalidad` (dropdown presencial/en línea),
     `success_url: /gracias?session_id={CHECKOUT_SESSION_ID}`,
     `cancel_url` de vuelta al reto, y `metadata.reto = slug`.
   - Redirige (303) a `session.url`.

3. **`/gracias`** (página dinámica): recupera la sesión server-side con el
   `session_id` y muestra el estado real —pagado (tarjeta) o "procesando tu
   transferencia" (SPEI, que confirma después)— más el botón al WhatsApp de
   Yadira. No confía en el redirect: consulta a Stripe.

4. **`POST /api/stripe/webhook`**:
   - Verifica la firma con `STRIPE_WEBHOOK_SECRET` (cuerpo crudo).
   - Eventos: `checkout.session.completed`,
     `checkout.session.async_payment_succeeded` y
     `…async_payment_failed` (SPEI confirma tarde).
   - Upsert idempotente en Supabase por `stripe_session_id` (reintentos de
     Stripe no duplican filas). Responde 200 rápido; si Supabase falla,
     responde 500 para que Stripe reintente.

5. **Supabase — tabla `pagos`** (esquema en migración SQL versionada):
   `id uuid pk`, `stripe_session_id text unique`, `stripe_payment_intent
   text`, `reto text`, `monto integer` (centavos), `moneda text`,
   `descuento integer` (centavos), `estado text`
   (`pagado | procesando | fallido`), `nombre text`, `email text`,
   `telefono text`, `modalidad text`, `creado timestamptz default now()`,
   `actualizado timestamptz`.
   **RLS activado sin políticas públicas**: solo el service role (servidor)
   lee y escribe. El sitio público jamás toca la tabla.

6. **Script de alta en Stripe** — `scripts/stripe-setup.mjs`, idempotente
   (busca por `lookup_key` antes de crear): productos, precios MXN y el cupón
   `ANTICIPADO20` (20%, sin promotion code activo hasta tener fecha). Se corre
   una vez en test y una vez en live.

### Secretos y entornos

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY` — solo servidor, en `.env.local` (gitignored) y
  en Vercel. No se usa llave publicable: el Checkout hosteado no la necesita.
- Las llaves live se capturan directo en Vercel, nunca en el chat ni el repo.
- Webhook en producción: endpoint en el dashboard de Stripe apuntando a
  `https://<dominio>/api/stripe/webhook`; en local, `stripe listen`.

### Manejo de errores

- Checkout: slug inválido → 404; venta cerrada → 409; error de Stripe → 500
  con mensaje genérico (el detalle queda en logs de Vercel).
- Webhook: firma inválida → 400; evento no manejado → 200 (ack sin acción).
- SPEI vencido/fallido → fila `fallido`; Yadira ve el estado en Supabase y
  Stripe le avisa por su app/correo.

### Pruebas

- TDD en lo unitario: resolución de precio por lookup key, aplicación del
  promo, construcción del upsert, idempotencia del webhook (Stripe se mockea).
- Flujo completo en test mode: tarjeta `4242…`, tarjeta rechazada, SPEI de
  prueba, y reintento de webhook (no debe duplicar).
- El webhook se prueba con eventos firmados por `stripe listen`/fixtures.

## Estado actual verificado (2026-09-19)

- Cuenta Stripe: México, MXN, "Yadira Web". **Activación pendiente**
  (`charges_enabled: false`): sin datos fiscales + CLABE no hay cobros live.
- Modo prueba **vacío**: sin productos, precios ni cupones (por eso el script
  de alta).
- Supabase: **no existe proyecto aún**. Falta crearlo y pasar URL + service
  role key.

## Qué necesitamos de Sebastian/Yadira

1. Crear el proyecto Supabase y pegar `SUPABASE_URL` y
   `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` y Vercel.
2. Completar la activación de Stripe (datos fiscales, CLABE) para ir a live.
3. Validar el borrador de términos/reembolsos y aviso de privacidad.
4. Confirmar la fecha límite del 20% cuando exista (se activa en el dashboard).
5. Confirmar que los precios ya pueden ser públicos en el sitio.
