const claims = [
  "Gym privado exclusivo de mujeres",
  "Entrenamiento personal",
  "Presencial y en línea",
  "Cocina propia para tu dieta",
  "Entrenamientos a puerta cerrada",
];

/**
 * Franja amarilla. Corta el mesh del hero y ancla la marca antes del resto.
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
                className="flex items-center gap-8 px-8 text-[0.78rem] font-bold tracking-[0.16em] whitespace-nowrap text-ink uppercase"
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
