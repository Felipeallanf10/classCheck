import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest } from 'next/server'

/**
 * Tipo do usuário autenticado
 */
export interface AuthenticatedUser {
  id: number
  email: string
  nome: string
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN'
  avatar?: string | null
}

/**
 * Busca o usuário autenticado da sessão
 * @returns Usuário autenticado ou null
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return null
    }

    // Converter session.user para AuthenticatedUser
    return {
      id: parseInt(session.user.id || '0'),
      email: session.user.email || '',
      nome: session.user.name || '',
      role: (session.user.role as 'ALUNO' | 'PROFESSOR' | 'ADMIN') || 'ALUNO',
      avatar: session.user.image
    }
  } catch (error) {
    console.error('Erro ao buscar usuário autenticado:', error)
    return null
  }
}

/**
 * Verifica se há um usuário autenticado
 * Lança erro 401 se não autenticado
 * @returns Usuário autenticado
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()
  
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  
  return user
}

/**
 * Verifica se o usuário tem uma role específica
 * @param user Usuário autenticado
 * @param roles Roles permitidas
 * @returns true se o usuário tem uma das roles
 */
export function hasRole(
  user: AuthenticatedUser,
  roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[]
): boolean {
  return roles.includes(user.role)
}

/**
 * Verifica se o usuário tem permissão de admin
 * @param user Usuário autenticado
 * @returns true se for admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === 'ADMIN'
}

/**
 * Verifica se o usuário tem permissão de professor
 * @param user Usuário autenticado
 * @returns true se for professor ou admin
 */
export function isProfessor(user: AuthenticatedUser): boolean {
  return user.role === 'PROFESSOR' || user.role === 'ADMIN'
}

/**
 * Verifica se o usuário é dono do recurso
 * @param user Usuário autenticado
 * @param resourceUserId ID do usuário dono do recurso
 * @returns true se for dono ou admin
 */
export function isOwnerOrAdmin(
  user: AuthenticatedUser,
  resourceUserId: number
): boolean {
  return user.id === resourceUserId || user.role === 'ADMIN'
}

/**
 * Helper para lidar com erros de autenticação em API routes
 */
export function handleAuthError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return {
        error: 'Não autenticado. Faça login para acessar este recurso.',
        status: 401
      }
    }
    
    if (error.message === 'FORBIDDEN') {
      return {
        error: 'Você não tem permissão para acessar este recurso.',
        status: 403
      }
    }
  }
  
  return {
    error: 'Erro interno do servidor',
    status: 500
  }
}

/**
 * Wrapper para proteger API routes
 * Uso: await withAuth(async (user) => { ... })
 */
export async function withAuth<T>(
  handler: (user: AuthenticatedUser) => Promise<T>
): Promise<T> {
  const user = await requireAuth()
  return handler(user)
}

/**
 * Wrapper para proteger API routes com verificação de role
 * Uso: await withRoles(['ADMIN'], async (user) => { ... })
 */
export async function withRoles<T>(
  roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[],
  handler: (user: AuthenticatedUser) => Promise<T>
): Promise<T> {
  const user = await requireAuth()
  
  if (!hasRole(user, roles)) {
    throw new Error('FORBIDDEN')
  }
  
  return handler(user)
}
