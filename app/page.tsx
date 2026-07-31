import { Coach } from "@/components/secciones/coach";
import { ComoFunciona } from "@/components/secciones/como-funciona";
import { CtaFinal } from "@/components/secciones/cta-final";
import { Faq } from "@/components/secciones/faq";
import { Footer } from "@/components/secciones/footer";
import { Header } from "@/components/secciones/header";
import { Hero } from "@/components/secciones/hero";
import { Marquesina } from "@/components/secciones/marquesina";
import { Nutricion } from "@/components/secciones/nutricion";
import { Retos } from "@/components/secciones/retos";
import { Testimonios } from "@/components/secciones/testimonios";
import { Transformaciones } from "@/components/secciones/transformaciones";
import { preguntas, testimonios, transformaciones } from "@/lib/retos";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Marquesina />
        <Retos />
        <ComoFunciona />
        <Nutricion />
        <Coach />
        <Transformaciones items={transformaciones} />
        <Testimonios items={testimonios} />
        <Faq items={preguntas} />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
