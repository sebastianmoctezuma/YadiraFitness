import { NextResponse } from "next/server";
import { COOKIE_PANEL, llaveValida } from "@/lib/panel";

/**
 * La puerta del panel. El enlace que le llega a Yadira por WhatsApp apunta
 * aquí con la llave; se cambia por una cookie larga y se la manda al panel
 * con la URL ya limpia, para que la llave no quede en su historial ni en lo
 * que comparta por accidente.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const llave = url.searchParams.get("k") ?? undefined;

  if (!llaveValida(llave)) {
    // Mismo 404 que cualquier ruta inexistente: no se confirma que exista.
    return new NextResponse(null, { status: 404 });
  }

  const respuesta = NextResponse.redirect(new URL("/panel", url.origin), 303);
  respuesta.cookies.set(COOKIE_PANEL, llave!, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/panel",
    maxAge: 60 * 60 * 24 * 180,
  });
  return respuesta;
}
