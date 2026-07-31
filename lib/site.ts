/**
 * Configuración de la marca. Un solo lugar para cambiar datos de contacto,
 * nombre y enlaces cuando Yadira los confirme.
 */
export const site = {
  nombre: "Yadira Fitness",
  nombreCorto: "Yadira",
  // TODO(cliente): confirmar el número real de WhatsApp.
  whatsapp: "5215500000000",
  instagram: "https://instagram.com/",
  email: "hola@yadirafitness.mx",
  ciudad: "Ciudad de México",
  descripcion:
    "Retos de 30, 60 y 90 días con plan de alimentación y entrenamiento personalizado, y seguimiento semanal real.",
} as const;

export const whatsappUrl = (mensaje: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const navegacion = [
  { href: "#retos", label: "Retos" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#resultados", label: "Resultados" },
  { href: "#coach", label: "Sobre mí" },
  { href: "#faq", label: "Preguntas" },
] as const;
