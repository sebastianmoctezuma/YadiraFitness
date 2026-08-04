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

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Marquesina />
        <Coach />
        <Retos />
        <Incluye />
        <Entrenamientos />
        <Estudio />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
