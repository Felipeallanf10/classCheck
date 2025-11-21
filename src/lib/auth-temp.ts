/**
 * Configuração de autenticação
 * 
 * Este arquivo centraliza a obtenção do ID do usuário autenticado
 * para uso nas APIs.
 */

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Função helper para pegar o ID do usuário atual da sessão
 * Retorna o ID do usuário autenticado ou lança erro se não autenticado
 */
export async function getCurrentUserId(): Promise<number> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado')
  }
  
  return parseInt(session.user.id)
}

/**
 * Função helper para pegar o ID do usuário com fallback
 * Útil para testes e desenvolvimento
 */
export async function getCurrentUserIdOrDefault(defaultId: number = 52): Promise<number> {
  try {
    const session = await getServerSession(authOptions)
    return session?.user?.id ? parseInt(session.user.id) : defaultId
  } catch {
    return defaultId
  }
}

/**
 * Informações do usuário para debug
 */
export const USER_INFO = {
  1: { nome: 'Admin', email: 'admin@classcheck.com' },
  2: { nome: 'Prof. Matemática', email: 'prof.matematica@classcheck.com' },
  3: { nome: 'Aluno Teste', email: 'aluno@teste.com' },
}

