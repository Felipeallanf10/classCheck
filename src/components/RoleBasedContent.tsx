"use client"

import { useSession } from "next-auth/react"
import { Role } from "@prisma/client"
import { ReactNode } from "react"

interface RoleBasedContentProps {
  children: ReactNode
  allowedRoles: Role[]
  fallback?: ReactNode
}

/**
 * Componente para mostrar/ocultar conteúdo baseado no role do usuário
 * Use este componente para filtrar partes da UI sem bloquear a página inteira
 */
export function RoleBasedContent({ 
  children, 
  allowedRoles,
  fallback = null
}: RoleBasedContentProps) {
  const { data: session } = useSession()

  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook para verificar permissões do usuário atual
 */
export function usePermissions() {
  const { data: session } = useSession()

  const hasRole = (roles: Role | Role[]) => {
    if (!session?.user?.role) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(session.user.role)
  }

  const isAluno = hasRole("ALUNO")
  const isProfessor = hasRole("PROFESSOR")
  const isAdmin = hasRole("ADMIN")
  const isProfessorOrAdmin = hasRole(["PROFESSOR", "ADMIN"])

  return {
    role: session?.user?.role,
    hasRole,
    isAluno,
    isProfessor,
    isAdmin,
    isProfessorOrAdmin,
  }
}
