import type { Reto, TipoEntrenamiento } from "./types";

/**
 * Todo el contenido de este archivo sale de los flyers de Yadira. No hay
 * testimonios, resultados ni preguntas inventadas: cuando ella los entregue,
 * se agregan aquí.
 *
 * Sin precios ni fechas de inicio a propósito: no están definidos.
 *
 * Cuando conectemos Supabase, este archivo se reemplaza por una consulta a la
 * tabla `retos` y los componentes no cambian.
 */

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Lo que incluye el programa, tal como aparece en el flyer del reto. */
export const incluye = [
  {
    titulo: "Dieta de acuerdo a tu meta",
    detalle:
      "Contamos con cocina propia para elaborar tu dieta, así que no dependes de encontrar qué comer.",
  },
  {
    titulo: "Evaluación",
    detalle:
      "Antes de empezar medimos de dónde partes, para saber contra qué comparamos.",
  },
  {
    titulo: "Entreno presencial y en línea",
    detalle:
      "Entrenas en el estudio o desde donde estés. El programa es el mismo.",
  },
  {
    titulo: "Suplementación",
    detalle:
      "Con certificación en nutrición fitness y suplementación deportiva.",
  },
];

/** Tipos de entrenamiento que se trabajan, según el flyer. */
export const entrenamientos: TipoEntrenamiento[] = [
  {
    titulo: "Entrenamiento para mujeres",
    detalle: "Todo el programa está pensado para el cuerpo de una mujer.",
  },
  {
    titulo: "Personalizado",
    detalle: "Tu programa se arma para ti, no se reparte igual a todas.",
  },
  { titulo: "Pesas", detalle: "La base del cambio de composición corporal." },
  { titulo: "HIIT", detalle: "Intervalos de alta intensidad." },
  { titulo: "Funcional", detalle: "Movimiento que sirve fuera del gimnasio." },
  {
    titulo: "Con sobrepeso y obesidad",
    detalle: "Progresión adaptada desde el primer día, sin exigir lo que no.",
  },
  {
    titulo: "Aumento de masa muscular",
    detalle: "Para quien no busca bajar, sino construir.",
  },
];

const incluyeCorto = incluye.map((i) => i.titulo);

export const retos: Reto[] = [
  {
    slug: "reto-30-dias",
    nombre: "Reto 30 días",
    duracionDias: 30,
    tagline: "Un mes para entrar al método",
    descripcion:
      "El mismo programa que el de 90 días, en formato de un mes: evaluación, dieta según tu meta y entrenamiento personal, presencial o en línea.",
    modalidad: "ambas",
    incluye: incluyeCorto,
    imagen: img("1518611012118-696072aa579a"),
    imagenAlt:
      "Mujeres entrenando sobre tapetes en un estudio luminoso de paredes de ladrillo",
    activo: true,
  },
  {
    slug: "reto-90-dias",
    nombre: "Reto Transformación",
    duracionDias: 90,
    temporada: 3,
    tagline: "90 días de impacto",
    descripcion:
      "El programa completo de entrenamiento personal: evaluación, dieta de acuerdo a tu meta, suplementación y noventa días de acompañamiento presencial o en línea.",
    modalidad: "ambas",
    incluye: incluyeCorto,
    imagen: img("1649887974297-4be052375a67"),
    imagenAlt:
      "Mujer entrenando en un estudio luminoso de paredes blancas y ventanales altos",
    destacado: true,
    activo: true,
  },
];

export const getReto = (slug: string) =>
  retos.find((reto) => reto.slug === slug && reto.activo);
