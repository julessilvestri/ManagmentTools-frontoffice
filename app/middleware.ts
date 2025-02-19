import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Liste des routes protégées
const protectedRoutes = ["/chat", "/tasks"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Récupère le token JWT depuis les cookies

  // Vérifie si l'utilisateur tente d'accéder à une route protégée sans être authentifié
  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirige vers login
  }

  return NextResponse.next(); // Autorise la navigation
}

// Appliquer le middleware à toutes les pages
export const config = {
  matcher: ["/chat/:path*", "/tasks/:path*"], // Appliquer aux pages chat et tasks
};
