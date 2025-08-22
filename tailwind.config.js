

import { designTokens } from './src/lib/design-tokens'

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // App Router
    "./src/pages/**/*.{js,ts,jsx,tsx}", // Pages Router (opcional)
    "./src/components/**/*.{js,ts,jsx,tsx}", // Componentes reutilizáveis
    "./src/**/*.{js,ts,jsx,tsx}", // Todos os arquivos src
  ],
  theme: {
    extend: {
      // 🎨 CORES DOS DESIGN TOKENS
      colors: {
        primary: designTokens.colors.primary,
        success: designTokens.colors.success,
        warning: designTokens.colors.warning,
        danger: designTokens.colors.danger,
        neutral: designTokens.colors.neutral,
      },
      
      // 🔤 TIPOGRAFIA
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      letterSpacing: designTokens.typography.letterSpacing,
      
      // 📐 ESPAÇAMENTOS  
      spacing: designTokens.spacing,
      
      // 🌟 SOMBRAS
      boxShadow: designTokens.shadows,
      
      // 🔄 BORDER RADIUS
      borderRadius: designTokens.borderRadius,
      
      // 📱 BREAKPOINTS (screens)
      screens: designTokens.breakpoints,
      
      // ⚡ ANIMATIONS
      transitionDuration: designTokens.animations.duration,
      transitionTimingFunction: designTokens.animations.easing,
      
      // 🎯 Z-INDEX
      zIndex: designTokens.zIndex,
    },
  },
  darkMode: 'class', // ou 'media' se quiser automático
  plugins: [],
}
  