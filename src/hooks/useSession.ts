"use client"

import { useSession as useNextAuthSession } from "next-auth/react"
import { Role } from "@prisma/client"

export function useSession() {
  const session = useNextAuthSession()

  return {
    ...session,
    // Helpers para verificar roles
    isAluno: session?.data?.user?.role === "ALUNO",
    isProfessor: session?.data?.user?.role === "PROFESSOR",
    isAdmin: session?.data?.user?.role === "ADMIN",
    
    // Helper para verificar se tem permissão de professor (professor ou admin)
    isProfessorOrAdmin: 
      session?.data?.user?.role === "PROFESSOR" || 
      session?.data?.user?.role === "ADMIN",
    
    // Dados do usuário com tipos corretos
    userId: session?.data?.user?.id,
    userRole: session?.data?.user?.role as Role | undefined,
    userMateria: session?.data?.user?.materia,
  }
}
