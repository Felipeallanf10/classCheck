// Setup de testes para Vitest
// Configuração para ambiente Node (backend)

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
global.ResizeObserver = class ResizeObserver {
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  cb: any;
}

// Mock para localStorage (apenas se window estiver disponível - testes frontend)
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
if (typeof global.crypto === 'undefined') {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-' + Date.now(),
    },
  })
}
