// Configuração temporária do Prisma Client
// Comentado até que o banco de dados seja configurado

// import { PrismaClient } from '@prisma/client'

// Mock do Prisma para desenvolvimento sem banco
const mockPrisma = {
  avaliacaoSocioemocional: {
    create: async (data: any) => {
      console.log('Mock: Avaliação criada', data)
      return { id: `mock_${Date.now()}`, ...data.data }
    },
    findMany: async (query: any) => {
      console.log('Mock: Buscando avaliações', query)
      return []
    }
  },
  usuario: {
    findMany: async () => [],
    create: async (data: any) => ({ id: 1, ...data.data })
  },
  aula: {
    findMany: async () => [],
    create: async (data: any) => ({ id: 1, ...data.data })
  }
}

// Exporta o mock temporariamente
export const prisma = mockPrisma as any

// TODO: Quando o banco estiver configurado, descomente o código abaixo:
/*
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
*/
