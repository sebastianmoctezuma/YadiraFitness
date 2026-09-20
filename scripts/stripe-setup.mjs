// Alta idempotente del catálogo en Stripe. Correr una vez por entorno:
//   node --env-file=.env.local scripts/stripe-setup.mjs
// Reejecutarlo no duplica nada: busca por lookup_key / id antes de crear.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const RETOS = [
  { lookup: "reto-30-dias", nombre: "Reto 30 días", monto: 250000 },
  {
    lookup: "reto-90-dias",
    nombre: "Reto Transformación (90 días)",
    monto: 650000,
  },
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
