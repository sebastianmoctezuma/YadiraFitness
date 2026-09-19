import Stripe from "stripe";

/** Cliente único del servidor. La llave jamás llega al navegador. */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
