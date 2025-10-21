export default {
  test: {
    environment: 'node',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
}
