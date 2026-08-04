const claims = [
  "Gym privado exclusivo de mujeres",
  "Entrenamiento personal",
  "Presencial y en línea",
  "Cocina propia para tu dieta",
  "Entrenamientos a puerta cerrada",
];

export function Marquesina() {
  return (
    <div className="overflow-hidden border-y border-line bg-surface-2 py-4">
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
                className="flex items-center gap-8 px-8 text-sm whitespace-nowrap text-ink"
              >
                {claim}
                <span aria-hidden className="text-brand-text/50">
                  ✿
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
