import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { rateLimitMiddleware } from "@/lib/middleware/rate-limit" // Desabilitado temporariamente

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Debug apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Path:', path, 'Token exists:', !!token)
    }

    // Rate limiting desabilitado temporariamente até ser testado adequadamente
    // TODO: Reativar rate limiting após implementar solução com Redis para produção
    // if (!path.startsWith('/api/auth')) {
    //   const rateLimitResponse = await rateLimitMiddleware(req as unknown as NextRequest)
    //   if (rateLimitResponse) {
    //     return rateLimitResponse
    //   }
    // }

    // Se é a landing page (/) e não está logado, permitir acesso
    if (path === '/' && !token) {
      return NextResponse.next()
    }

    // NÃO redirecionar `/` - é a landing page pública
    // Usuários logados podem ver a landing page normalmente

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Debug apenas em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log('[Auth] Checking path:', path, 'Token exists:', !!token)
        }
        
        // Landing page é sempre autorizada
        if (path === '/') {
          return true
        }
        
        // Outras rotas precisam de token
        return !!token
      },
    },
  }
)

// Configuração de quais rotas o middleware deve verificar
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - /login (página de login)
     * - /cadastro (página de cadastro)
     * - /reset-password (página de recuperação de senha)
     * - /api/auth/* (rotas de autenticação)
     * - /_next/* (arquivos do Next.js)
     * - /favicon.ico, /robots.txt, etc (arquivos estáticos)
     * 
     * Nota: / (landing page) é verificada mas sempre autorizada no callback
     */
    "/((?!login|cadastro|reset-password|api/auth|_next|favicon.ico|robots.txt|emotions|.*\\..*).*)",
  ],
}
