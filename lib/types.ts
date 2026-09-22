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
  /** Cuánto dura, tal como se anuncia: 30 días, 90 días, 4 semanas. */
  duracion: { numero: number; unidad: "días" | "semanas" };
  tagline: string;
  descripcion: string;
  /** Precio publicado, en pesos. La fecha de inicio sigue sin definirse y la
      interfaz no muestra nada cuando falta. */
  precioMXN?: number;
  /** Precio de lista cuando hay promoción: se tacha junto al vigente. Su sola
      presencia enciende la etiqueta de promoción, sin escribirla a mano. */
  precioAntes?: number;
  fechaInicio?: string;
  /** Si el botón de pago está disponible; el cierre de cupos hoy es manual. */
  ventaAbierta: boolean;
  /** Texto libre del badge junto al nombre ("El más completo y más pedido"). */
  etiqueta?: string;
  modalidad: "presencial" | "online" | "ambas";
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
  /** Clave semántica del dibujo que lo acompaña; el SVG vive en el componente. */
  icono?: string;
};
