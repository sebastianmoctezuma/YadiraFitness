import { Reveal } from "@/components/ui/reveal";

const rasgos = [
  {
    titulo: "Privado y a puerta cerrada",
    detalle:
      "Nadie entra a mirar. El estudio se cierra durante los entrenamientos.",
  },
  {
    titulo: "Exclusivo de mujeres",
    detalle: "Solo mujeres, siempre. Es la razón por la que muchas se quedan.",
  },
  {
    titulo: "Con cocina propia",
    detalle:
      "Tu dieta se elabora aquí mismo, así que comer bien deja de ser el problema.",
  },
];

export function Estudio() {
  return (
    <section id="estudio" className="scroll-mt-28 bg-bg pb-24 sm:pb-32">
      <div className="mx-auto max-w-[84rem] px-5 sm:px-8">
        <Reveal className="relative overflow-hidden rounded-[var(--radius-suave)] bg-brand px-7 py-14 sm:px-14 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-[var(--radius-blob)] bg-bg/40 blur-2xl"
          />

          <div className="relative">
            <p className="type-etiqueta text-ink/75">El estudio</p>
            <h2 className="type-h2 mt-4 max-w-[18ch] text-h2 text-ink">
              Un espacio donde entrenar sin sentirte observada
            </h2>

            <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-3">
              {rasgos.map((rasgo) => (
                <li key={rasgo.titulo}>
                  <h3 className="text-base font-medium text-ink">
                    {rasgo.titulo}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-[1.75] text-ink/85">
                    {rasgo.detalle}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
