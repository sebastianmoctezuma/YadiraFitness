import type { Punto, Reto } from "./types";

/**
 * Todo lo de este archivo sale de los flyers de Yadira. No hay testimonios,
 * resultados ni preguntas frecuentes: nada de eso existe todavía, y ponerlo
 * inventado es peor que no ponerlo.
 *
 * Sin precios ni fechas de inicio a propósito: no están definidos.
 *
 * Cuando conectemos Supabase, este archivo se reemplaza por una consulta a la
 * tabla `retos` y los componentes no cambian.
 */

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const retos: Reto[] = [
  {
    slug: "reto-30-dias",
    nombre: "Reto 30 días",
    duracionDias: 30,
    tagline: "Un mes para entrar al método",
    descripcion:
      "El mismo programa, en formato de un mes. Evaluación, plan de comidas, rutina personalizada y corrección de técnica, presencial o en línea.",
    modalidad: "ambas",
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
    tagline: "Noventa días de impacto",
    descripcion:
      "El programa completo de entrenamiento personal: evaluación, plan de comidas, rutina personalizada, suplementación y noventa días de seguimiento con mediciones.",
    modalidad: "ambas",
    imagen: img("1649887974297-4be052375a67"),
    imagenAlt:
      "Mujer entrenando en un estudio luminoso de paredes blancas y ventanales altos",
    destacado: true,
    activo: true,
  },
];

export const getReto = (slug: string) =>
  retos.find((reto) => reto.slug === slug && reto.activo);

/** Lo que incluye el programa, tal como lo listan los flyers. */
export const incluye: Punto[] = [
  {
    titulo: "Plan de comidas personalizado",
    detalle:
      "Tu dieta se arma según tu meta. Contamos con cocina propia para elaborarla.",
  },
  {
    titulo: "Rutina de entrenamiento personalizada",
    detalle: "Un programa hecho para ti, no el mismo repartido a todas.",
  },
  {
    titulo: "Corrección de ejercicios y técnica",
    detalle: "Para que entrenes seguro y cada repetición cuente.",
  },
  {
    titulo: "Mediciones y seguimiento",
    detalle: "Evaluación al arrancar y control durante todo el reto.",
  },
  {
    titulo: "Suplementación",
    detalle:
      "Con certificación en nutrición fitness y suplementación deportiva.",
  },
  {
    titulo: "Entreno presencial y en línea",
    detalle: "Entrenas en el gym o desde donde estés. El programa es el mismo.",
  },
];

/** Tipos de entrenamiento que se trabajan, según el flyer. */
export const entrenamientos: Punto[] = [
  {
    titulo: "Entrenamiento para mujeres",
    detalle: "Todo el programa está pensado para el cuerpo de una mujer.",
  },
  {
    titulo: "Personalizado",
    detalle: "Se ajusta a tu nivel, tus horarios y tu meta.",
  },
  { titulo: "Pesas", detalle: "La base del cambio de composición corporal." },
  { titulo: "HIIT", detalle: "Intervalos de alta intensidad." },
  { titulo: "Funcional", detalle: "Movimiento que sirve fuera del gimnasio." },
  {
    titulo: "Con sobrepeso y obesidad",
    detalle: "Progresión adaptada desde el primer día.",
  },
  {
    titulo: "Aumento de masa muscular",
    detalle: "Para quien no busca bajar, sino construir.",
  },
];

/** Lo que hace distinto al gym, según el flyer de temporada. */
export const gym: Punto[] = [
  {
    titulo: "Privado y a puerta cerrada",
    detalle: "Los entrenamientos son cerrados. Nadie entra a mirar.",
  },
  {
    titulo: "Exclusivo de mujeres",
    detalle: "Solo mujeres, siempre.",
  },
  {
    titulo: "Con cocina propia",
    detalle: "Tu dieta se elabora aquí mismo, así comer bien deja de ser el problema.",
  },
];
