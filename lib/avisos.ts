import type { FilaPago } from "./pagos";

/**
 * Aviso a Yadira por WhatsApp cuando entra un pago, vía CallMeBot.
 *
 * CallMeBot es un servicio de un tercero al que la clienta nunca autorizó
 * nada, y el aviso de privacidad que ella acepta al pagar dice que sus datos
 * no salen de quien procesa el cobro. Por eso **el mensaje no lleva nombre,
 * correo ni teléfono**: lleva el enlace al cargo en Stripe, donde Yadira ve
 * todo con un toque. Las pruebas de `tests/avisos.test.ts` lo sostienen.
 */

const pesos = (centavos: number) =>
  `$${(centavos / 100).toLocaleString("es-MX")} MXN`;

export function mensajeDePago(
  fila: FilaPago,
  nombreReto: string,
  enlacePanel?: string,
): string {
  // El panel gana al dashboard de Stripe: ahí los datos están ordenados para
  // ella y con el botón para escribirle a la clienta.
  const enlace =
    enlacePanel ??
    (fila.stripe_payment_intent
      ? `https://dashboard.stripe.com/payments/${fila.stripe_payment_intent}`
      : "https://dashboard.stripe.com/payments");

  const lineas = [
    `Nuevo pago: ${nombreReto}`,
    fila.descuento > 0
      ? `${pesos(fila.monto)} (con descuento) · ${fila.modalidad ?? "sin definir"}`
      : `${pesos(fila.monto)} · ${fila.modalidad ?? "sin definir"}`,
    `Datos de la clienta: ${enlace}`,
  ];

  return lineas.join("\n");
}

/**
 * Envío best-effort: si CallMeBot no responde, el pago YA quedó registrado y
 * no se puede fallar por esto, porque Stripe reintentaría el evento y Yadira
 * recibiría el aviso repetido.
 */
export async function enviarAviso(texto: string): Promise<void> {
  const telefono = process.env.CALLMEBOT_TELEFONO;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!telefono || !apikey) return;

  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${encodeURIComponent(telefono)}` +
    `&text=${encodeURIComponent(texto)}` +
    `&apikey=${encodeURIComponent(apikey)}`;

  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("aviso: CallMeBot respondió", r.status);
  } catch (err) {
    console.error("aviso: no se pudo enviar", err);
  }
}
