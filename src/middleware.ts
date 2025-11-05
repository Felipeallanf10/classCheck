import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redireciona root `/` para dashboard apropriado baseado no role
    if (path === "/" && token) {
      if (token.role === "ADMIN" || token.role === "PROFESSOR") {
        return NextResponse.redirect(new URL("/analytics", req.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
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
