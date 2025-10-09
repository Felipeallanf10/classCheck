import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚀 CONFIGURAÇÃO OTIMIZADA PARA TURBOPACK
  
  // ⚡ OTIMIZAÇÕES DE IMPORTS (principais bibliotecas pesadas)
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
  
  // ⚡ DEVELOPMENT OTIMIZADO
  compress: false, // Desabilitar compressão em dev
};

export default nextConfig;
