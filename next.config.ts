import type { NextConfig } from "next";

// Configuração otimizada para WSL2
// Foco em velocidade máxima de compilação
const nextConfig: NextConfig = {
  // Ignorar erros de ESLint/TypeScript durante build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ⚡ Otimização de imports
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
  },

  // Webpack config para hot reload em WSL
  webpack: (config, { dev, isServer }) => {
    // Hot reload otimizado para WSL2
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before reloading
      };
    }
    return config;
  },

  // Desabilitar compressão em dev
  compress: false,

  // Cache agressivo
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
