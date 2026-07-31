import Image from "next/image";
import { Boton } from "@/components/ui/boton";
import { retos } from "@/lib/retos";

const proximaFecha = new Date(retos[0].fechaInicio + "T00:00:00").toLocaleDateString(
  "es-MX",
  { day: "numeric", month: "long" },
);

export function Hero() {
  return (
    <section className="relative min-h-[92svh] w-full overflow-hidden bg-bg">
      <Image
        src="https://images.unsplash.com/photo-1649887974297-4be052375a67?auto=format&fit=crop&w=2000&q=80"
        alt="Mujer haciendo sentadillas en un estudio luminoso de paredes blancas y ventanales altos"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />

      {/* Velo para garantizar el contraste del titular sobre la foto.
          En móvil el sujeto ocupa todo el encuadre, así que el velo baja en
          vertical; en pantallas anchas se va a la izquierda y deja la foto
          limpia del lado donde está ella. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,oklch(1_0_0/0.94)_0%,oklch(1_0_0/0.92)_52%,oklch(1_0_0/0.72)_78%,oklch(1_0_0/0.25)_100%)] sm:bg-[linear-gradient(100deg,oklch(1_0_0/0.97)_0%,oklch(1_0_0/0.93)_34%,oklch(1_0_0/0.58)_52%,oklch(1_0_0/0.05)_72%)]"
      />

      <div className="relative mx-auto flex min-h-[92svh] max-w-[88rem] flex-col justify-end px-5 pt-28 pb-12 sm:px-8 sm:pb-16">
        {/* Cortes de línea explícitos: dejados al navegador, "días." quedaba
            huérfano en su propio renglón. */}
        <h1 className="type-display max-w-[16ch] text-display text-ink">
          No es una dieta.
          <br />
          Es un <span className="mark">reto</span>
          <br />
          de 90 días.
        </h1>

        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-muted sm:text-lg">
          Plan de alimentación y entrenamiento hechos para tu cuerpo, tus
          horarios y lo que sí te gusta comer. Con alguien del otro lado
          cada semana.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Boton href="#retos">Elegir mi reto</Boton>
          <Boton href="#resultados" variante="secundario">
            Ver resultados
          </Boton>
        </div>

        {/* Liquid glass sobre la fotografía: aquí sí tiene función, deja ver la
            imagen debajo mientras mantiene legible el dato. */}
        <div className="glass mt-10 flex w-fit items-center gap-3 rounded-full py-3 pr-6 pl-5">
          <span
            aria-hidden
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand ring-4 ring-brand/25"
          />
          <span className="text-sm font-medium text-ink">
            Próxima generación:{" "}
            <span className="font-bold">{proximaFecha}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
