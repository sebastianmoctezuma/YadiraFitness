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

export const retos: Reto[] = [
  {
    slug: "reto-30-dias",
    nombre: "Reto 30 días",
    duracionDias: 30,
    tagline: "Un mes para entrar al método",
    descripcion:
      "El mismo programa, en formato de un mes. Evaluación, plan de comidas, rutina personalizada y corrección de técnica, presencial o en línea.",
    modalidad: "ambas",
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

/**
 * Antes y después de clientas.
 *
 * Cada archivo ya viene compuesto (las etapas y, en varias, la báscula), así
 * que no hace falta comparador: basta con mostrarlos.
 *
 * ⚠️ Son personas identificables. Antes de publicar hace falta consentimiento
 * por escrito de cada una para uso comercial de su imagen.
 */
export const transformaciones = Array.from({ length: 16 }, (_, i) => ({
  src: `/transformaciones/t${String(i + 1).padStart(2, "0")}.webp`,
  alt: `Antes y después de una clienta tras completar el reto (${i + 1} de 16)`,
}));

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
