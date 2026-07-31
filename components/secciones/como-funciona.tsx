import { Reveal } from "@/components/ui/reveal";

/**
 * Aquí los números sí son información: es una secuencia real y el orden
 * importa. No son marcadores decorativos de sección.
 */
const pasos = [
  {
    titulo: "Eliges tu reto y pagas",
    texto:
      "Pago en línea con tarjeta u OXXO. Va por Stripe: yo nunca veo tus datos bancarios.",
  },
  {
    titulo: "Me cuentas de ti",
    texto:
      "Te llega un cuestionario corto: peso, rutina, horarios, lesiones y qué comidas no piensas dejar.",
  },
  {
    titulo: "Recibes tu plan y arrancamos",
    texto:
      "En menos de 48 horas tienes dieta y rutina en tu WhatsApp. De ahí en adelante nos vemos cada semana.",
  },
];

export function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-y border-line bg-surface py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <Reveal>
          <h2 className="type-h2 max-w-[16ch] text-h2 text-ink">
            De pagar a entrenar, en 48 horas
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
          {pasos.map((paso, i) => (
            <Reveal as="li" key={paso.titulo} delay={i * 110}>
              <div className="flex items-center gap-4">
                <span
                  className="type-display text-[2.75rem] text-brand-text"
                  style={{ fontVariationSettings: '"wdth" 118' }}
                >
                  {i + 1}
                </span>
                <span aria-hidden className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-5 text-h3 font-bold tracking-[-0.02em] text-ink">
                {paso.titulo}
              </h3>
              <p className="mt-3 max-w-[38ch] text-[0.95rem] leading-relaxed text-ink-muted">
                {paso.texto}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
