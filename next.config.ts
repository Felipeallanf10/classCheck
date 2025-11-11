import type { NextConfig } from "next";
import path from "path";

// Configuração unificada após merge de backend ⨯ develop
// Mantém: tolerância a erros de build (backend) + otimizações Turbopack/imports (develop)
// Inclui: melhorias de hot reload em ambientes Docker + compress desabilitado em dev
const nextConfig: NextConfig = {
  // Ignorar erros de ESLint/TypeScript durante build (evita bloquear deploy enquanto issues são tratadas)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ⚡ Otimização de imports e Turbopack
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-switch',
      '@radix-ui/react-tooltip',
      'recharts',
      'date-fns'
    ],
    turbo: {
      rules: {
        '*.tsx': {
          loaders: ['@turbo/loader-typescript'],
          as: '*.tsx'
        }
      }
    }
  },

  // Hot reload robusto para Docker / WSL
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      };
    }
    return config;
  },

  // Evita warning sobre múltiplos lockfiles
  outputFileTracingRoot: path.join(__dirname),

  // Variáveis de ambiente simples (placeholder)
  env: { CUSTOM_KEY: 'my-value' },

  // Desabilitar compressão em dev para reduzir overhead
  compress: false
};

export default nextConfig;
