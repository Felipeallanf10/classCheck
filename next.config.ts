import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  
  // Configurações de desenvolvimento
  env: {
    CUSTOM_KEY: 'my-value',
  },
};

export default nextConfig;
