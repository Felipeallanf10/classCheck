import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

/**
 * Verifica se o usuário tem permissão baseado no role
 */
export async function checkRole(allowedRoles: Role[]): Promise<{
  authorized: boolean
  userId?: number
  userRole?: Role
  error?: NextResponse
}> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return {
        authorized: false,
        error: NextResponse.json(
          { erro: 'Não autenticado. Faça login para continuar.' },
          { status: 401 }
        ),
      }
    }

    const userRole = session.user.role
    const userId = parseInt(session.user.id)

    if (!allowedRoles.includes(userRole)) {
      return {
        authorized: false,
        userId,
        userRole,
        error: NextResponse.json(
          { 
            erro: 'Acesso negado. Você não tem permissão para acessar este recurso.',
            role_requerido: allowedRoles,
            seu_role: userRole
          },
          { status: 403 }
        ),
      }
    }

    return {
      authorized: true,
      userId,
      userRole,
    }
  } catch (error) {
    console.error('Erro ao verificar role:', error)
    return {
      authorized: false,
      error: NextResponse.json(
        { erro: 'Erro ao verificar permissões' },
        { status: 500 }
      ),
    }
  }
}

/**
 * Verifica se o usuário está autenticado
 */
export async function requireAuth(): Promise<{
  authenticated: boolean
  userId?: number
  userRole?: Role
  error?: NextResponse
}> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return {
        authenticated: false,
        error: NextResponse.json(
          { erro: 'Não autenticado. Faça login para continuar.' },
          { status: 401 }
        ),
      }
    }

    return {
      authenticated: true,
      userId: parseInt(session.user.id),
      userRole: session.user.role,
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error)
    return {
      authenticated: false,
      error: NextResponse.json(
        { erro: 'Erro ao verificar autenticação' },
        { status: 500 }
      ),
    }
  }
}

/**
 * Wrapper para proteger rotas de API por role
 * Uso: export async function POST(req: Request) {
 *   return withRoleProtection(['ADMIN', 'PROFESSOR'], async (userId, userRole) => {
 *     // sua lógica aqui
 *   })
 * }
 */
export async function withRoleProtection(
  allowedRoles: Role[],
  handler: (userId: number, userRole: Role, request: Request) => Promise<NextResponse>,
  request?: Request
) {
  const { authorized, userId, userRole, error } = await checkRole(allowedRoles)

  if (!authorized || !userId || !userRole) {
    return error!
  }

  return handler(userId, userRole, request!)
}

/**
 * Wrapper para proteger rotas que só precisam de autenticação (qualquer role)
 */
export async function withAuth(
  handler: (userId: number, userRole: Role, request: Request) => Promise<NextResponse>,
  request?: Request
) {
  const { authenticated, userId, userRole, error } = await requireAuth()

  if (!authenticated || !userId || !userRole) {
    return error!
  }

  return handler(userId, userRole, request!)
}
