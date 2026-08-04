"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { navegacion, site } from "@/lib/site";

export function Header() {
  const [conScroll, setConScroll] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const alScrollear = () => setConScroll(window.scrollY > 24);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  // Bloquea el scroll de fondo mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAbierto(false);
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-nav px-3 pt-3 sm:px-5 sm:pt-5">
      {/* Pastilla de vidrio flotante. El vidrio está siempre presente porque
          es lo que la hace legible sobre cualquier sección; al hacer scroll
          solo se ciñe un poco y gana sombra. */}
      {/* `relative z-10` mantiene la pastilla por encima del panel del menú.
          Sin esto el panel se pintaba sobre el botón de cerrar y el menú se
          quedaba abierto sin manera de salir en móvil. */}
      <div
        className={`glass-nav relative z-10 mx-auto flex max-w-[84rem] items-center justify-between gap-4 rounded-full transition-all duration-500 ease-out-quart ${
          conScroll ? "px-3 py-2 sm:px-4" : "px-4 py-2.5 sm:px-6 sm:py-3"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setMenuAbierto(false)}
        >
          {/* Vidrio oscuro bajo el logo: sobre el vidrio claro del navbar el
              amarillo se lavaba. Un fondo oscuro translúcido lo devuelve a su
              color sin recolorear el archivo. */}
          <span
            className={`glass-logo flex shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-out-quart ${
              conScroll ? "h-10 w-10" : "h-11 w-11 sm:h-12 sm:w-12"
            }`}
          >
            <Logo
              className={`w-auto transition-all duration-500 ease-out-quart ${
                conScroll ? "h-7" : "h-8 sm:h-9"
              }`}
            />
          </span>
          <span
            className="text-base font-extrabold uppercase tracking-[-0.02em] text-ink sm:text-lg"
            style={{ fontVariationSettings: '"wdth" 112' }}
          >
            Yadira
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 lg:flex"
        >
          {navegacion.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              // Tinta plena, no el gris secundario: sobre vidrio el fondo
              // cambia bajo los enlaces en cada sección y el gris se perdía.
              className="relative text-sm font-medium text-ink transition-colors hover:text-brand-text after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-[width] after:duration-300 after:ease-out-quart hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#retos"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-brand hover:text-ink sm:inline-flex"
          >
            Empezar mi reto
          </Link>

          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-ink/15 transition-colors hover:bg-ink/5 lg:hidden"
          >
            <span
              className={`block h-[2px] w-4 bg-ink transition-transform duration-300 ease-out-quart ${
                menuAbierto ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-4 bg-ink transition-transform duration-300 ease-out-quart ${
                menuAbierto ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        hidden={!menuAbierto}
        className="fixed inset-0 overflow-y-auto bg-bg px-5 pt-28 pb-10 lg:hidden"
      >
        <nav aria-label="Navegación móvil" className="flex flex-col">
          {navegacion.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuAbierto(false)}
              className="type-h2 border-b border-line py-5 text-[1.6rem] text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="#retos"
          onClick={() => setMenuAbierto(false)}
          className="mt-8 flex items-center justify-center rounded-full bg-brand px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-ink"
        >
          Empezar mi reto
        </Link>
        <p className="mt-6 text-sm text-ink-muted">
          {site.ciudad} · Presencial y en línea
        </p>
      </div>
    </header>
  );
}
