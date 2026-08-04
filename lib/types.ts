/**
 * Modelo de datos del sitio.
 *
 * Estos tipos son deliberadamente la forma que tendrán las tablas de Supabase.
 * Hoy los datos viven en archivos (`lib/retos.ts`); cuando conectemos la base,
 * cambia el origen pero no cambian los componentes.
 */

/** Un reto del programa. Tabla futura: `retos`. */
export type Reto = {
  /** Identificador en la URL: /retos/reto-90-dias */
  slug: string;
  nombre: string;
  duracionDias: 30 | 90;
  tagline: string;
  descripcion: string;
  /**
   * Precio y fecha de inicio siguen sin definirse, así que son opcionales y la
   * interfaz no muestra nada cuando faltan. Publicar un precio provisional es
   * peor que no publicar ninguno.
   */
  precioMXN?: number;
  fechaInicio?: string;
  temporada?: number;
  modalidad: "presencial" | "online" | "ambas";
  imagen: string;
  imagenAlt: string;
  destacado?: boolean;
  activo: boolean;
};

export const etiquetaModalidad: Record<Reto["modalidad"], string> = {
  presencial: "Presencial",
  online: "En línea",
  ambas: "Presencial y en línea",
};

/** Una prestación del programa o un tipo de entrenamiento. */
export type Punto = {
  titulo: string;
  detalle: string;
};
