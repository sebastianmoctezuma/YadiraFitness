"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
    <header
      className={`fixed inset-x-0 top-0 z-nav transition-all duration-300 ease-out-quart ${
        conScroll ? "glass py-2.5" : "border-b border-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-baseline gap-1.5 leading-none"
          onClick={() => setMenuAbierto(false)}
        >
          <span
            className="text-lg font-extrabold uppercase tracking-[-0.02em] sm:text-xl"
            style={{ fontVariationSettings: '"wdth" 112' }}
          >
            Yadira
          </span>
          <span
            className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-ink-muted"
            style={{ fontVariationSettings: '"wdth" 88' }}
          >
            Fitness
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 lg:flex"
        >
          {navegacion.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-ink-muted transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-brand after:transition-[width] after:duration-300 after:ease-out-quart hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#retos"
            className="hidden rounded-full bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-brand sm:inline-flex"
          >
            Empezar mi reto
          </Link>

          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-ink/15 lg:hidden"
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
        className="fixed inset-0 z-overlay overflow-y-auto bg-bg px-5 pt-24 pb-10 lg:hidden"
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
