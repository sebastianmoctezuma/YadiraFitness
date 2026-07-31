const claims = [
  "Plan de alimentación personalizado",
  "Seguimiento por WhatsApp cada semana",
  "Rutinas para gimnasio o para casa",
  "Pago seguro con tarjeta u OXXO",
  "Sin alimentos prohibidos",
];

/**
 * Franja amarilla. Es la primera vez que el color toma toda la superficie:
 * corta el blanco del hero y ancla la marca antes del catálogo.
 */
export function Marquesina() {
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-brand py-3.5">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copia) => (
          <ul
            key={copia}
            aria-hidden={copia === 1}
            className="flex shrink-0 items-center"
          >
            {claims.map((claim) => (
              <li
                key={claim}
                className="flex items-center gap-8 px-8 text-[0.78rem] font-bold uppercase tracking-[0.16em] whitespace-nowrap text-ink"
              >
                {claim}
                <span aria-hidden className="text-ink/40">
                  ✳
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
