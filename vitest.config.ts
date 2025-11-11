import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    // Setup padrão (sem mock do Prisma) para testes de integração
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'out'],
    testTimeout: 15000, // 15 segundos para testes que fazem queries pesadas
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
