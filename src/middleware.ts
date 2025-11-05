import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redireciona root para o dashboard apropriado baseado no role
    if (path === "/" && token) {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url))
      } else if (token.role === "PROFESSOR") {
        return NextResponse.redirect(new URL("/professor", req.url))
      } else {
        return NextResponse.redirect(new URL("/aluno", req.url))
      }
    }

    // Proteção de rotas de admin
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Proteção de rotas de professor
    if (path.startsWith("/professor") && token?.role !== "PROFESSOR" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Proteção de rotas de aluno
    if (path.startsWith("/aluno") && token?.role !== "ALUNO" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

// Configuração de quais rotas o middleware deve proteger
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /login (página de login)
     * - /cadastro (página de cadastro)
     * - /reset-password (página de recuperação de senha)
     * - /api/auth/* (rotas de autenticação)
     * - /_next/* (arquivos do Next.js)
     * - /favicon.ico, /robots.txt (arquivos estáticos)
     */
    "/((?!login|cadastro|reset-password|api/auth|_next|favicon.ico|robots.txt|emotions).*)",
  ],
}
