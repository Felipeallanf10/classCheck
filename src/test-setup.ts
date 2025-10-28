// Declaração de tipos para compatibilidade
interface MockFunction {
  (): any;
  mockReturnValue?: (value: any) => MockFunction;
  mockImplementation?: (fn: Function) => MockFunction;
}

// Mock simples que funciona tanto com Jest quanto Vitest
const createMockFn = (): MockFunction => {
  const fn: any = () => {};
  fn.mockReturnValue = (value: any) => fn;
  fn.mockImplementation = (implementation: Function) => fn;
  return fn;
};

// Setup para testes psicométricos
if (typeof global !== 'undefined') {
  (global as any).ResizeObserver = class ResizeObserver {
    constructor(cb: any) {
      this.cb = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    cb: any;
  }
}

// Mock para localStorage (usado para persistir dados de sessão) - apenas no browser
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: createMockFn(),
      setItem: createMockFn(),
      removeItem: createMockFn(),
      clear: createMockFn(),
    },
    writable: true,
  })
}

// Mock para crypto.randomUUID (usado para IDs de sessão)
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Date.now(),
  },
})

// Mock do Prisma Client para testes UNITÁRIOS
// Os testes de integração devem usar o Prisma real e não importar este setup
import { vi } from 'vitest';
