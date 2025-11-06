/**
 * Configuração temporária de usuário atual
 * 
 * TODO: Substituir por autenticação real (NextAuth, Clerk, etc.)
 * 
 * Este arquivo centraliza o ID do usuário atual em todas as APIs
 * para facilitar testes e desenvolvimento.
 * 
 * Para trocar de usuário, basta alterar o CURRENT_USER_ID abaixo.
 */

/**
 * ID do usuário atual (temporário para desenvolvimento)
 * 
 * Opções disponíveis no seed:
 * - ID 1: João Silva (aluno@teste.com) - seed-aulas.js
 * - ID 52: Usuário atual de testes
 */
export const CURRENT_USER_ID = 52

/**
 * Função helper para pegar o ID do usuário atual
 * No futuro, esta função buscará da sessão/auth
 */
export function getCurrentUserId(): number {
  // TODO: Implementar busca real da sessão
  // const session = await getServerSession()
  // return session.user.id
  
  return CURRENT_USER_ID
}

/**
 * Informações do usuário para debug
 */
export const USER_INFO = {
  1: { nome: 'João Silva', email: 'aluno@teste.com', seed: 'seed-aulas.js' },
  3: { nome: 'Usuário Atual', email: 'usuario@atual.com', seed: 'database' },
}
