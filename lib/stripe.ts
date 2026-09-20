import Stripe from "stripe";

let cliente: Stripe | null = null;

/**
 * Cliente único del servidor. La llave jamás llega al navegador.
 *
 * Perezoso a propósito: el build de Next evalúa los módulos de cada ruta para
 * recolectar sus datos, y ahí los secretos no existen. Construirlo al importar
 * tumbaba el build en Vercel con "Neither apiKey nor config.authenticator".
 */
export function getStripe(): Stripe {
  if (cliente) return cliente;

  const llave = process.env.STRIPE_SECRET_KEY;
  if (!llave) {
    throw new Error("Falta la variable de entorno STRIPE_SECRET_KEY");
  }

  cliente = new Stripe(llave);
  return cliente;
}
