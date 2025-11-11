import { AuthenticatedUser } from './auth'

/**
 * Tipos de permissões do sistema
 */
export type Permission =
  // Usuários
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'users:update_own'
  
  // Avaliações
  | 'avaliacoes:read'
  | 'avaliacoes:create'
  | 'avaliacoes:update_own'
  | 'avaliacoes:delete_own'
  | 'avaliacoes:read_all'
  
  // Humor
  | 'humor:read_own'
  | 'humor:create'
  | 'humor:update_own'
  | 'humor:delete_own'
  | 'humor:read_all'
  
  // Favoritos
  | 'favoritos:read_own'
  | 'favoritos:create'
  | 'favoritos:delete_own'
  
  // Relatórios
  | 'relatorios:read_own'
  | 'relatorios:read_turma'
  | 'relatorios:read_all'
  
  // Eventos
  | 'eventos:read'
  | 'eventos:create'
  | 'eventos:update'
  | 'eventos:delete'
  
  // Aulas
  | 'aulas:read'
  | 'aulas:create'
  | 'aulas:update'
  | 'aulas:delete'
  
  // Professores
  | 'professores:read'
  | 'professores:create'
  | 'professores:update'
  | 'professores:delete'

/**
 * Permissões base para ALUNO
 */
const ALUNO_PERMISSIONS: Permission[] = [
  // Usuários: apenas ler e atualizar próprio perfil
  'users:read',
  'users:update_own',
  
  // Avaliações: criar e gerenciar próprias
  'avaliacoes:read',
  'avaliacoes:create',
  'avaliacoes:update_own',
  'avaliacoes:delete_own',
  
  // Humor: criar e gerenciar próprio
  'humor:read_own',
  'humor:create',
  'humor:update_own',
  'humor:delete_own',
  
  // Favoritos: gerenciar próprios
  'favoritos:read_own',
  'favoritos:create',
  'favoritos:delete_own',
  
  // Relatórios: apenas próprios
  'relatorios:read_own',
  
  // Eventos: apenas ler
  'eventos:read',
  
  // Aulas: apenas ler
  'aulas:read',
  
  // Professores: apenas ler
  'professores:read',
]

/**
 * Mapeamento de permissões por role
 */
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ALUNO: ALUNO_PERMISSIONS,
  
  PROFESSOR: [
    // Todas permissões de ALUNO
    ...ALUNO_PERMISSIONS,
    
    // Avaliações: ler todas de suas aulas
    'avaliacoes:read_all',
    
    // Humor: ler todos de seus alunos
    'humor:read_all',
    
    // Relatórios: ler de sua turma
    'relatorios:read_turma',
    
    // Eventos: criar eventos
    'eventos:create',
    'eventos:update',
    
    // Aulas: criar e gerenciar próprias aulas
    'aulas:create',
    'aulas:update',
  ],
  
  ADMIN: [
    // Usuários: acesso total
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    
    // Avaliações: acesso total
    'avaliacoes:read',
    'avaliacoes:read_all',
    
    // Humor: acesso total
    'humor:read_own',
    'humor:read_all',
    
    // Favoritos: acesso total
    'favoritos:read_own',
    
    // Relatórios: acesso total
    'relatorios:read_own',
    'relatorios:read_turma',
    'relatorios:read_all',
    
    // Eventos: acesso total
    'eventos:read',
    'eventos:create',
    'eventos:update',
    'eventos:delete',
    
    // Aulas: acesso total
    'aulas:read',
    'aulas:create',
    'aulas:update',
    'aulas:delete',
    
    // Professores: acesso total
    'professores:read',
    'professores:create',
    'professores:update',
    'professores:delete',
  ],
}

/**
 * Verifica se o usuário tem uma permissão específica
 * @param user Usuário autenticado
 * @param permission Permissão a verificar
 * @returns true se o usuário tem a permissão
 */
export function hasPermission(
  user: AuthenticatedUser,
  permission: Permission
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  return rolePermissions.includes(permission)
}

/**
 * Verifica se o usuário tem alguma das permissões especificadas
 * @param user Usuário autenticado
 * @param permissions Lista de permissões
 * @returns true se o usuário tem pelo menos uma das permissões
 */
export function hasAnyPermission(
  user: AuthenticatedUser,
  permissions: Permission[]
): boolean {
  return permissions.some(permission => hasPermission(user, permission))
}

/**
 * Verifica se o usuário tem todas as permissões especificadas
 * @param user Usuário autenticado
 * @param permissions Lista de permissões
 * @returns true se o usuário tem todas as permissões
 */
export function hasAllPermissions(
  user: AuthenticatedUser,
  permissions: Permission[]
): boolean {
  return permissions.every(permission => hasPermission(user, permission))
}

/**
 * Verifica se o usuário pode acessar recurso de outro usuário
 * @param user Usuário autenticado
 * @param resourceUserId ID do dono do recurso
 * @param permission Permissão requerida para acesso geral
 * @param ownPermission Permissão para acessar próprio recurso
 * @returns true se tem permissão
 */
export function canAccessUserResource(
  user: AuthenticatedUser,
  resourceUserId: number,
  permission: Permission,
  ownPermission?: Permission
): boolean {
  // Se é o próprio usuário
  if (user.id === resourceUserId) {
    return ownPermission ? hasPermission(user, ownPermission) : true
  }
  
  // Se não é o próprio, precisa ter permissão geral
  return hasPermission(user, permission)
}

/**
 * Lança erro se o usuário não tem permissão
 * @param user Usuário autenticado
 * @param permission Permissão requerida
 * @throws Error se não tem permissão
 */
export function requirePermission(
  user: AuthenticatedUser,
  permission: Permission
): void {
  if (!hasPermission(user, permission)) {
    throw new Error('FORBIDDEN')
  }
}

/**
 * Lança erro se o usuário não pode acessar o recurso
 * @param user Usuário autenticado
 * @param resourceUserId ID do dono do recurso
 * @param permission Permissão requerida
 * @param ownPermission Permissão para próprio recurso
 * @throws Error se não tem permissão
 */
export function requireResourceAccess(
  user: AuthenticatedUser,
  resourceUserId: number,
  permission: Permission,
  ownPermission?: Permission
): void {
  if (!canAccessUserResource(user, resourceUserId, permission, ownPermission)) {
    throw new Error('FORBIDDEN')
  }
}

/**
 * Helper para verificar permissões de professor
 * Verifica se o usuário é professor ou admin
 */
export function requireProfessorOrAdmin(user: AuthenticatedUser): void {
  if (user.role !== 'PROFESSOR' && user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN')
  }
}

/**
 * Helper para verificar permissões de admin
 */
export function requireAdmin(user: AuthenticatedUser): void {
  if (user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN')
  }
}

/**
 * Lista todas as permissões de um usuário
 * @param user Usuário autenticado
 * @returns Array de permissões
 */
export function getUserPermissions(user: AuthenticatedUser): Permission[] {
  return ROLE_PERMISSIONS[user.role] || []
}

/**
 * Verifica se um usuário pode gerenciar avaliações
 * @param user Usuário autenticado
 * @param avaliacaoUserId ID do usuário da avaliação
 * @returns true se pode gerenciar
 */
export function canManageAvaliacao(
  user: AuthenticatedUser,
  avaliacaoUserId: number
): boolean {
  // Próprio usuário pode gerenciar sua avaliação
  if (user.id === avaliacaoUserId) {
    return hasPermission(user, 'avaliacoes:update_own')
  }
  
  // Admin pode gerenciar qualquer avaliação
  return user.role === 'ADMIN'
}

/**
 * Verifica se um usuário pode gerenciar humor
 * @param user Usuário autenticado
 * @param humorUserId ID do usuário do registro de humor
 * @returns true se pode gerenciar
 */
export function canManageHumor(
  user: AuthenticatedUser,
  humorUserId: number
): boolean {
  // Próprio usuário pode gerenciar seu humor
  if (user.id === humorUserId) {
    return hasPermission(user, 'humor:update_own')
  }
  
  // Admin pode gerenciar qualquer humor
  return user.role === 'ADMIN'
}

/**
 * Verifica se um usuário pode gerenciar favorito
 * @param user Usuário autenticado
 * @param favoritoUserId ID do usuário do favorito
 * @returns true se pode gerenciar
 */
export function canManageFavorito(
  user: AuthenticatedUser,
  favoritoUserId: number
): boolean {
  // Próprio usuário pode gerenciar seus favoritos
  if (user.id === favoritoUserId) {
    return hasPermission(user, 'favoritos:delete_own')
  }
  
  // Admin pode gerenciar qualquer favorito
  return user.role === 'ADMIN'
}
