

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
      
      // Animações customizadas para feedback
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.4s ease-out',
        'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      
      // 🎯 Z-INDEX
      zIndex: designTokens.zIndex,
    },
  },
  darkMode: 'class', // ou 'media' se quiser automático
  plugins: [],
}
  