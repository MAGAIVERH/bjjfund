import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de verificação
  const publicRoutes = [
    "/",
    "/authentication",
    "/login",
    "/register",
    "/api/auth",
    "/api/select-role",
  ];

  // Se for rota pública, permite acesso
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Isso evita o erro do Edge Runtime com módulos Node.js
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Se não tem cookie de sessão e está tentando acessar rota protegida
  if (!sessionCookie && !pathname.startsWith("/select-role")) {
    const url = request.nextUrl.clone();
    url.pathname = "/authentication";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
