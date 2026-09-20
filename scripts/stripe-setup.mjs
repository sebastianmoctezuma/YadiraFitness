// Alta idempotente de TODO lo que el sitio necesita en una cuenta de Stripe:
// productos, precios, el cupón del 20% y el webhook de producción.
//
// Correr una vez por cuenta y por modo. Reejecutarlo no duplica nada: busca
// por lookup_key / id / url antes de crear.
//
//   Modo prueba:  node --env-file=.env.local scripts/stripe-setup.mjs
//   Modo live:    STRIPE_SECRET_KEY=sk_live_… node scripts/stripe-setup.mjs
//
// La llave live no se guarda en ningún archivo del repo: se pasa en la línea
// del comando y vive solo en Vercel.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITIO = process.env.SITIO_URL || "https://yadira-fitness.vercel.app";
const esLive = (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_live");

const RETOS = [
  { lookup: "reto-30-dias", nombre: "Reto 30 días", monto: 250000 },
  {
    lookup: "reto-con-comida",
    nombre: "Reto con comida (4 semanas)",
    monto: 650000,
  },
  {
    lookup: "reto-90-dias",
    nombre: "Reto Transformación (90 días)",
    monto: 650000,
  },
];

// ── 1. En qué cuenta estamos, y si puede cobrar ──────────────────────────
const cuenta = await stripe.accounts.retrieve();
const nombre =
  cuenta.settings?.dashboard?.display_name ||
  cuenta.business_profile?.name ||
  "(sin nombre)";
console.log(`\nCuenta: ${nombre} (${cuenta.id})`);
console.log(`Modo:   ${esLive ? "LIVE — cobros reales" : "prueba"}`);
console.log(`Cobros habilitados: ${cuenta.charges_enabled}`);
if (esLive && !cuenta.charges_enabled) {
  console.log(
    "\n⚠️  Esta cuenta todavía no puede cobrar. Completa la activación en el\n" +
      "   dashboard (datos fiscales y cuenta bancaria) antes de abrir la venta.\n" +
      "   El catálogo se dará de alta igual, pero los pagos fallarían.",
  );
}
const pendientes = cuenta.requirements?.currently_due ?? [];
if (pendientes.length) console.log(`Pendiente en Stripe: ${pendientes.join(", ")}`);
console.log("");

// ── 2. Productos y precios ───────────────────────────────────────────────
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

// ── 3. Cupón del 20% por pago anticipado ─────────────────────────────────
// El promotion code nace INACTIVO: se enciende desde el dashboard cuando
// exista la fecha límite.
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

const promos = await stripe.promotionCodes.list({
  code: "ANTICIPADO20",
  limit: 1,
});
if (promos.data.length === 0) {
  await stripe.promotionCodes.create({
    promotion: { type: "coupon", coupon: cupon.id },
    code: "ANTICIPADO20",
    active: false,
    metadata: { reto: "reto-90-dias" },
  });
  console.log("promotion code creado (inactivo)");
} else {
  console.log("promotion code ya existe");
}

// ── 4. Webhook, que es lo que alimenta la tabla de pagos ─────────────────
const destino = `${SITIO}/api/stripe/webhook`;
const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
if (endpoints.data.some((e) => e.url === destino)) {
  console.log(`webhook ya existe → ${destino}`);
} else {
  const hook = await stripe.webhookEndpoints.create({
    url: destino,
    enabled_events: [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
      "checkout.session.async_payment_failed",
    ],
  });
  console.log(`webhook creado → ${destino}`);
  console.log(
    `\n👉 Copia este valor en Vercel como STRIPE_WEBHOOK_SECRET:\n   ${hook.secret}\n` +
      "   (Stripe solo lo muestra ahora; después habría que rotarlo.)",
  );
}

console.log("\nListo.\n");
