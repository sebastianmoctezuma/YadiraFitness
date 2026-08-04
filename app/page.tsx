import { BarraMovil } from "@/components/secciones/barra-movil";
import { Coach } from "@/components/secciones/coach";
import { CtaFinal } from "@/components/secciones/cta-final";
import { Entrenamientos } from "@/components/secciones/entrenamientos";
import { Estudio } from "@/components/secciones/estudio";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Hero } from "@/components/secciones/hero";
import { Incluye } from "@/components/secciones/incluye";
import { Marquesina } from "@/components/secciones/marquesina";
import { Retos } from "@/components/secciones/retos";
import { Transformaciones } from "@/components/secciones/transformaciones";

/**
 * Orden de lectura: quién es → qué vende → qué incluye → cómo se entrena →
 * dónde → reservar. Cada tema aparece una sola vez.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido" className="pb-24 lg:pb-0">
        <Hero />
        <Marquesina />
        <Coach />
        <Retos />
        <Transformaciones />
        <Incluye />
        <Entrenamientos />
        <Estudio />
        <CtaFinal />
      </main>
      <Footer />
      <BarraMovil />
    </>
  );
}
