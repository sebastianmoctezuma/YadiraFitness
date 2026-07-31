import type {
  PreguntaFrecuente,
  Reto,
  Testimonio,
  Transformacion,
} from "./types";

/**
 * ⚠️ CONTENIDO DE PLANTILLA
 *
 * Nombres, precios, fechas y textos son de relleno hasta que Yadira entregue
 * el material real. Las fotos son de Unsplash (uso comercial libre) y se
 * sustituyen por las suyas.
 *
 * Cuando conectemos Supabase, este archivo se reemplaza por una consulta a la
 * tabla `retos`. Los componentes no cambian.
 */

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const retos: Reto[] = [
  {
    slug: "reto-30-dias",
    nombre: "Arranque",
    tagline: "Para dejar de empezar los lunes",
    duracionDias: 30,
    precioMXN: 1200,
    modalidad: "ambas",
    fechaInicio: "2026-09-01",
    descripcion:
      "Un mes para ordenar lo básico: qué comes, cuánto te mueves y a qué hora duermes. Sin restricciones absurdas ni alimentos prohibidos.",
    incluye: [
      "Plan de alimentación para 4 semanas",
      "Rutina de 4 días a la semana",
      "Lista de súper semanal",
      "Un ajuste a medio reto",
    ],
    paraTi: [
      "Nunca has seguido un plan estructurado",
      "Quieres probar cómo trabajo antes de comprometerte más",
    ],
    imagen: img("1571019613454-1cb2f99b2d8b"),
    imagenAlt:
      "Mujer haciendo abdominales sobre un tapete, con la luz de la mañana entrando por el ventanal",
    activo: true,
  },
  {
    slug: "reto-60-dias",
    nombre: "Cambio",
    tagline: "Cuando ya quieres ver diferencia en el espejo",
    duracionDias: 60,
    precioMXN: 2200,
    precioAnteriorMXN: 2600,
    modalidad: "ambas",
    fechaInicio: "2026-09-01",
    descripcion:
      "Dos meses con progresión real de cargas y una dieta que se recalcula cada quince días según cómo vas respondiendo.",
    incluye: [
      "Plan de alimentación con recálculo quincenal",
      "Rutina progresiva de 5 días",
      "Seguimiento por WhatsApp cada semana",
      "Guía de comidas fuera de casa",
      "Ajustes ilimitados durante el reto",
    ],
    paraTi: [
      "Ya entrenas pero te estancaste",
      "Necesitas que alguien te esté encima cada semana",
    ],
    imagen: img("1609899517237-77d357b047cf"),
    imagenAlt:
      "Mujer haciendo zancadas con mancuernas frente al espejo de un gimnasio luminoso",
    destacado: true,
    activo: true,
  },
  {
    // Este es el reto real que Yadira promociona ("Reto Transformación").
    // El contenido de abajo sale de sus flyers; solo el precio sigue pendiente.
    slug: "reto-90-dias",
    nombre: "Transformación",
    tagline: "El que de verdad cambia el cuerpo",
    duracionDias: 90,
    // TODO(cliente): PRECIO SIN CONFIRMAR. El flyer anuncia "inscripción $500",
    // que puede ser solo la inscripción y no el total. No conectar Stripe hasta
    // aclararlo.
    precioMXN: 2900,
    temporada: 3,
    modalidad: "ambas",
    // TODO(cliente): la 3ª temporada arrancó el 7 de julio. Falta la fecha de
    // la siguiente generación.
    fechaInicio: "2026-09-01",
    descripcion:
      "Tres meses es el tiempo mínimo honesto para un cambio que se sostiene. Entrenas conmigo presencial o en línea, con evaluación al arrancar y mediciones durante todo el reto.",
    incluye: [
      "Plan de comidas personalizado",
      "Rutina de entrenamiento personalizada",
      "Corrección de ejercicios y técnica",
      "Mediciones y seguimiento",
      "Evaluación inicial",
      "Entrenamiento presencial o en línea",
      "Suplementación de acuerdo a tu meta",
      // ⚠️ REVISAR ANTES DE PUBLICAR: "detox" y "limpieza de hígado graso"
      // aparecen en su flyer, pero el hígado graso es un diagnóstico médico y
      // ofrecer tratarlo es una afirmación de salud. Su certificación es en
      // nutrición fitness y suplementación deportiva, no en medicina. Consultar
      // con ella antes de dejarlo en la página.
    ],
    paraTi: [
      "Quieres un cambio que aguante después del reto",
      "Entrenas con sobrepeso u obesidad y necesitas progresión adaptada",
      "Buscas aumento de masa muscular con pesas, HIIT o funcional",
    ],
    imagen: img("1518611012118-696072aa579a"),
    imagenAlt:
      "Grupo entrenando sobre tapetes en un estudio de ladrillo con mucha luz natural",
    activo: true,
  },
];

export const getReto = (slug: string) =>
  retos.find((reto) => reto.slug === slug && reto.activo);

/**
 * ⚠️ Fotos de ejemplo. Las reales exigen consentimiento por escrito de cada
 * persona antes de publicarse (ver CONTEXT.md → consideraciones legales).
 */
export const transformaciones: Transformacion[] = [
  {
    id: "t1",
    nombre: "Mariana",
    retoSlug: "reto-90-dias",
    resultado: "90 días · dejó de tenerle miedo a las pesas",
    antesSrc: img("1518459031867-a89b944bffe4", 900),
    despuesSrc: img("1606902965551-dce093cda6e7", 900),
    alt: "Comparación de ejemplo antes y después de un reto de 90 días",
  },
  {
    id: "t2",
    nombre: "Paola",
    retoSlug: "reto-60-dias",
    resultado: "60 días · volvió a dormir bien",
    antesSrc: img("1571732154690-f6d1c3e5178a", 900),
    despuesSrc: img("1584863265045-f9d10ca7fa61", 900),
    alt: "Comparación de ejemplo antes y después de un reto de 60 días",
  },
];

export const testimonios: Testimonio[] = [
  {
    id: "te1",
    nombre: "Mariana R.",
    reto: "Reto 90 días",
    cita: "Llevaba años haciendo dietas de internet. Lo distinto aquí fue que alguien me contestaba el miércoles a las 10 de la noche cuando ya me iba a rendir.",
    avatarSrc: img("1494790108377-be9c29b29330", 200),
  },
  {
    id: "te2",
    nombre: "Paola G.",
    reto: "Reto 60 días",
    cita: "Pensé que iba a pasar hambre. Como más que antes, solo que ahora sí sé qué estoy comiendo.",
    avatarSrc: img("1438761681033-6461ffad8d80", 200),
  },
  {
    id: "te3",
    nombre: "Andrea L.",
    reto: "Reto 30 días",
    cita: "Entré por probar un mes y me quedé nueve. El plan se ajusta a mi vida, no al revés.",
    avatarSrc: img("1531123897727-8f129e1688ce", 200),
  },
];

export const preguntas: PreguntaFrecuente[] = [
  {
    pregunta: "¿Cómo recibo mi plan después de pagar?",
    respuesta:
      "En cuanto se confirma el pago te llega un mensaje mío por WhatsApp. Te mando un cuestionario corto de salud, hábitos y objetivos, y con eso armo tu plan. Lo tienes en un máximo de 48 horas.",
  },
  {
    pregunta: "¿La dieta es personalizada o es la misma para todas?",
    respuesta:
      "Personalizada. Se arma con tu peso, estatura, actividad, horarios y —muy importante— lo que sí te gusta comer. Un plan que odias no lo sigues.",
  },
  {
    pregunta: "¿Necesito ir a un gimnasio?",
    respuesta:
      "No es obligatorio. Cada reto tiene versión de gimnasio y versión de casa con equipo mínimo. Me dices con qué cuentas y armo la que te sirva.",
  },
  {
    pregunta: "¿Puedo pagar en OXXO o solo con tarjeta?",
    respuesta:
      "Ambas. El pago va por Stripe, que acepta tarjeta de crédito, débito y pago en efectivo en OXXO. Nunca veo ni guardo los datos de tu tarjeta.",
  },
  {
    pregunta: "¿Qué pasa si tengo alguna condición médica?",
    respuesta:
      "Avísame antes de comprar. No sustituyo a tu médico: si tienes diabetes, hipertensión, embarazo o algún trastorno alimenticio, necesito el visto bueno de tu especialista para trabajar contigo.",
  },
  {
    pregunta: "¿Puedo cancelar y recuperar mi dinero?",
    respuesta:
      "Sí, mientras no te haya entregado tu plan: te devuelvo el 100%. Una vez entregado, el trabajo ya está hecho y no hay reembolso, pero el reto no caduca y lo puedes retomar cuando quieras dentro de los siguientes 6 meses.",
  },
];
