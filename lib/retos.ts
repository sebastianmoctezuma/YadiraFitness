import type { Punto, Reto } from "./types";

/**
 * Todo lo de este archivo sale de los flyers de Yadira. No hay testimonios,
 * resultados ni preguntas frecuentes: nada de eso existe todavía, y ponerlo
 * inventado es peor que no ponerlo.
 *
 * Los precios los definió Yadira (2026-09-19); la fecha de inicio sigue sin
 * definirse y por eso no aparece.
 *
 * Cuando conectemos Supabase, este archivo se reemplaza por una consulta a la
 * tabla `retos` y los componentes no cambian.
 */

export const retos: Reto[] = [
  {
    slug: "reto-30-dias",
    nombre: "Reto 30 días",
    duracion: { numero: 30, unidad: "días" },
    precioMXN: 2500,
    ventaAbierta: true,
    tagline: "Un mes para entrar al método",
    descripcion:
      "El mismo programa, en formato de un mes. Evaluación, plan de comidas, rutina personalizada y corrección de técnica, presencial o en línea.",
    modalidad: "ambas",
    activo: true,
  },
  {
    slug: "reto-con-comida",
    nombre: "Reto con comida",
    duracion: { numero: 4, unidad: "semanas" },
    precioMXN: 6500,
    ventaAbierta: true,
    etiqueta: "Todo incluido",
    tagline: "Cuatro semanas sin pensar en qué comer",
    descripcion:
      "El programa de cuatro semanas con tus alimentos incluidos: se preparan en nuestra cocina para que tú solo te ocupes de entrenar.",
    modalidad: "presencial",
    activo: true,
  },
  {
    slug: "reto-90-dias",
    nombre: "Reto Transformación",
    duracion: { numero: 90, unidad: "días" },
    precioMXN: 4500,
    precioAntes: 6500,
    ventaAbierta: true,
    etiqueta: "El más completo y más pedido",
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
      "Dieta de acuerdo a tu meta. También contamos con cocina donde te facilitamos elaborarla, por si así lo requieres al hacer presencial tu entreno.",
    icono: "comidas",
  },
  {
    titulo: "Rutina de entrenamiento personalizada",
    detalle:
      "Un programa hecho para ti, de acuerdo a tus prioridades y tu enfoque.",
    icono: "rutina",
  },
  {
    titulo: "Corrección de ejercicios y técnica",
    detalle:
      "Para que entrenes seguro y cada repetición cuente. Siempre estoy al pendiente de cada una.",
    icono: "tecnica",
  },
  {
    titulo: "Mediciones y seguimiento",
    detalle:
      "Evaluación al arrancar y control durante todo el reto, con la finalidad de que sigas motivada semana con semana.",
    icono: "mediciones",
  },
  {
    titulo: "Suplementación",
    detalle:
      "Con certificación en nutrición fitness y suplementación deportiva, y la experiencia de más de 18 años.",
    icono: "suplementacion",
  },
  {
    titulo: "Entreno presencial y en línea",
    detalle: "Entrenas en el gym o desde donde estés. El programa es el mismo.",
    icono: "modalidad",
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
    detalle:
      "Mi gym es exclusivo para mi gente, que entrena solo para mis retos y personales. No abierto al público: tendrás la comodidad de vestir como quieras sin sentirte observada.",
  },
  {
    titulo: "Exclusivo de mujeres",
    detalle: "Solo mujeres, siempre.",
  },
  {
    titulo: "Con cocina propia",
    detalle:
      "Contamos con cocina propia donde te facilitamos tus alimentos, en caso de requerir el servicio, para facilitarte tu progreso y meta.",
  },
];
