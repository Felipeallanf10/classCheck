import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Rotas públicas que não requerem autenticação
 */
const PUBLIC_ROUTES = [
  '/api/auth',
  '/api/professores', // GET apenas (listagem pública)
  '/api/aulas', // GET apenas (listagem pública)
]

/**
 * Rotas que requerem autenticação
 */
const PROTECTED_ROUTES = [
  '/api/usuarios',
  '/api/avaliacoes',
  '/api/humor',
  '/api/favoritos',
  '/api/eventos',
  '/api/calendario',
  '/api/relatorios',
  '/api/questionario',
]

/**
 * Rotas que requerem role específica
 */
const ADMIN_ONLY_ROUTES = [
  '/api/usuarios', // POST, PUT, DELETE requer ADMIN
]

const PROFESSOR_ROUTES = [
  '/api/relatorios', // Acesso completo para professores
]

/**
 * Verifica se a rota é pública
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Verifica se a rota é protegida
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Verifica se a rota requer admin
 */
function requiresAdmin(pathname: string, method: string): boolean {
  // Rotas de usuários: apenas ADMIN pode criar, editar ou deletar
  if (pathname.startsWith('/api/usuarios')) {
    return ['POST', 'PUT', 'DELETE'].includes(method)
  }
  
  return false
}

/**
 * Middleware principal de autenticação
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  // ========================================
  // 1. Permitir rotas públicas
  // ========================================
  if (isPublicRoute(pathname)) {
    // Apenas GET é público para professores e aulas
    if (pathname.startsWith('/api/professores') || pathname.startsWith('/api/aulas')) {
      if (method !== 'GET') {
        // POST, PUT, DELETE requerem autenticação
        const token = await getToken({ 
          req: request, 
          secret: process.env.NEXTAUTH_SECRET 
        })

        if (!token) {
          return NextResponse.json(
            { error: 'Não autenticado. Faça login para acessar este recurso.' },
            { status: 401 }
          )
        }
      }
    }
    
    return NextResponse.next()
  }

  // ========================================
  // 2. Proteger rotas que requerem autenticação
  // ========================================
  if (isProtectedRoute(pathname)) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado. Faça login para acessar este recurso.' },
        { status: 401 }
      )
    }

    // Verificar se rota requer ADMIN
    if (requiresAdmin(pathname, method)) {
      if (token.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Você não tem permissão para executar esta ação. Apenas administradores.' },
          { status: 403 }
        )
      }
    }

    // Adicionar informações do usuário nos headers para usar nas APIs
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', String(token.sub))
    requestHeaders.set('x-user-email', String(token.email))
    requestHeaders.set('x-user-role', String(token.role))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // ========================================
  // 3. Outras rotas passam sem validação
  // ========================================
  return NextResponse.next()
}

/**
 * Configuração do matcher
 * Define quais rotas o middleware deve processar
 */
export const config = {
  matcher: [
    /*
     * Match all API routes except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/api/:path*',
  ],
}
