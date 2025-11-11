import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // NÃO redirecionar `/` - é a landing page pública
    // Usuários logados podem ver a landing page normalmente

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
     * - / (landing page pública)
     * - /login (página de login)
     * - /cadastro (página de cadastro)
     * - /reset-password (página de recuperação de senha)
     * - /api/auth/* (rotas de autenticação)
     * - /_next/* (arquivos do Next.js)
     * - /favicon.ico, /robots.txt (arquivos estáticos)
     */
    "/((?!^/$|login|cadastro|reset-password|api/auth|_next|favicon.ico|robots.txt|emotions).*)",
  ],
}
