/**
 * Configuración de la marca. Todo sale de los flyers de Yadira.
 */
export const site = {
  nombre: "Yadira Team",
  nombreCorto: "Yadira",
  programa: "La Guerrera",
  hashtag: "#LaGuerrera",
  temporada: "3ª temporada 2026",
  // TODO(cliente): confirmar el número real de WhatsApp.
  whatsapp: "5215500000000",
  instagram: "https://instagram.com/la_guerrera_yadira",
  instagramUsuario: "@la_guerrera_yadira",
  tiktok: "https://tiktok.com/@yadirahernandez1984",
  tiktokUsuario: "@yadirahernandez1984",
  facebook: "https://facebook.com/",
  facebookUsuario: "Yadira Hernandez",
  descripcion:
    "Gym privado exclusivo de mujeres, a puerta cerrada. Entrenamiento personal presencial y en línea, con cocina propia para elaborar tu dieta.",
} as const;

export const whatsappUrl = (mensaje: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const navegacion = [
  { href: "#coach", label: "La coach" },
  { href: "#retos", label: "Retos" },
  { href: "#resultados", label: "Resultados" },
  { href: "#incluye", label: "Qué incluye" },
  { href: "#estudio", label: "El gym" },
] as const;
