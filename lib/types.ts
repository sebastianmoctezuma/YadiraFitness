/**
 * Modelo de datos del sitio.
 *
 * Estos tipos son deliberadamente la forma que tendrán las tablas de Supabase.
 * Hoy los datos viven en archivos (`lib/retos.ts`); cuando conectemos la base,
 * cambia el origen pero no cambian los componentes.
 */

/** Un reto que se vende en la landing. Tabla futura: `retos`. */
export type Reto = {
  /** Identificador en la URL: /retos/reto-90-dias */
  slug: string;
  nombre: string;
  /** Gancho corto para la tarjeta del catálogo. */
  tagline: string;
  duracionDias: 30 | 60 | 90;
  /** Precio en pesos, entero, sin centavos. */
  precioMXN: number;
  /** Precio tachado para mostrar un descuento. Omitir si no aplica. */
  precioAnteriorMXN?: number;
  /** Fecha ISO (YYYY-MM-DD) en que arranca la generación actual. */
  fechaInicio: string;
  descripcion: string;
  incluye: string[];
  /** Para quién es y para quién no. Baja las devoluciones. */
  paraTi: string[];
  imagen: string;
  imagenAlt: string;
  /** Destaca una sola tarjeta en el catálogo. */
  destacado?: boolean;
  activo: boolean;
};

/** Par antes/después. Requiere consentimiento firmado de la persona. */
export type Transformacion = {
  id: string;
  nombre: string;
  retoSlug: string;
  /** Resultado en palabras de la persona, no una cifra inventada. */
  resultado: string;
  antesSrc: string;
  despuesSrc: string;
  alt: string;
};

export type Testimonio = {
  id: string;
  nombre: string;
  reto: string;
  cita: string;
  avatarSrc: string;
};

export type PreguntaFrecuente = {
  pregunta: string;
  respuesta: string;
};
