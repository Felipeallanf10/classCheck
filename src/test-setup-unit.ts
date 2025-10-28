// Setup específico para testes UNITÁRIOS (com mock do Prisma)
import { vi } from 'vitest';

// Criar classe mock do PrismaClient
class MockPrismaClient {
  usuario = {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  
  sessaoAdaptativa = {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  
  respostaAdaptativa = {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  };
  
  respostaSocioemocional = {
    create: vi.fn(),
    findMany: vi.fn(),
    deleteMany: vi.fn(),
  };
  
  perguntaQuestionario = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  };
  
  bancoPerguntasAdaptativo = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
  };
  
  $connect = vi.fn();
  $disconnect = vi.fn();
  $transaction = vi.fn();
}

// Mockar o módulo @prisma/client
vi.mock('@prisma/client', () => ({
  PrismaClient: MockPrismaClient,
}));
