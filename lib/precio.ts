/** Pesos enteros → "$2,500 MXN". Los centavos solo existen hacia Stripe. */
export const precioMXN = (pesos: number) =>
  `$${pesos.toLocaleString("es-MX")} MXN`;
