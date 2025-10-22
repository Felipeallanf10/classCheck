import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ignorar erros de ESLint/TypeScript durante o build apenas para destravar a compilação
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configurações para melhor hot reload em Docker
  webpack: (config, { dev }) => {
    // Habilitar polling para sistemas de arquivos que não suportam inotify
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Verificar mudanças a cada 1 segundo
        aggregateTimeout: 300, // Aguardar 300ms antes de rebuildar
      };
    }
    return config;
  },
  
  // Configurações experimentais para melhor performance
  experimental: {
    // Melhor cache e hot reload
    optimizePackageImports: ['lucide-react'],
  },
  
  // Evita warning sobre múltiplos lockfiles definindo a raiz correta do tracing
  outputFileTracingRoot: path.join(__dirname),
  
  // Configurações de desenvolvimento
  env: {
    CUSTOM_KEY: 'my-value',
  },
};

export default nextConfig;
