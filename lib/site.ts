/**
 * Configuración de la marca. Un solo lugar para cambiar datos de contacto,
 * nombre y enlaces cuando Yadira los confirme.
 */
export const site = {
  // TODO(cliente): decidir el nombre que encabeza la página. Sus flyers usan
  // "TEAM YADIRA" como firma y "LA GUERRERA" (#LAGUERRERA) como nombre del
  // programa. "Yadira Fitness" es un nombre de trabajo, no aparece en su
  // material.
  nombre: "Yadira Fitness",
  nombreCorto: "Yadira",
  equipo: "Team Yadira",
  programa: "La Guerrera",
  hashtag: "#LaGuerrera",
  // TODO(cliente): confirmar el número real de WhatsApp.
  whatsapp: "5215500000000",
  instagram: "https://instagram.com/",
  email: "hola@yadirafitness.mx",
  ciudad: "Ciudad de México",
  descripcion:
    "Reto de 90 días con plan de comidas y rutina personalizados, mediciones, seguimiento y entrenamiento presencial u online.",
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
