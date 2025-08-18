/**
 * 📚 DESIGN SYSTEM - ÍNDICE DE COMPONENTES
 * 
 * Este arquivo centraliza todas as exportações dos componentes
 * do design system para facilitar as importações.
 * 
 * Organizado por categorias conforme especificado no PROMPT.md
 */

// 🎨 DESIGN TOKENS
export * from '../../lib/design-tokens'

// 🔄 LOADING COMPONENTS
export * from './spinner'
export * from './loading-skeleton'
export * from './loading-button'
export * from './page-loading'

// 🍞 TOAST SYSTEM
export * from './toast'
export * from './toast-display'

// 📝 ADVANCED INPUTS
export * from './enhanced-input'
export * from './enhanced-textarea'
export * from './masked-input'

// 🏫 CLASSCHECK SPECIFIC
export * from '../classcheck/aula-card-v2'
export * from '../classcheck/professor-card'
export * from '../classcheck/avaliacao-card'

// 📊 STATES & FEEDBACK
export * from './feedback-states'
export * from './metrics-progress'

// 🚀 ADVANCED COMPONENTS
export * from './advanced-components'
export * from './analytics-dashboard'
export * from './configuration-panel'

// 🎯 EXISTING UI COMPONENTS (shadcn/ui) - Only non-conflicting ones
export * from './avatar'
export * from './badge'
export * from './breadcrumb'
export * from './button'
export * from './calendar'
export * from './card'
export * from './chart'
export * from './collapsible'
export * from './dialog'
export * from './drawer'
export * from './dropdown-menu'
export * from './progress'
export * from './scroll-area'
export * from './select'
export * from './separator'
export * from './sheet'
export * from './sidebar'
export * from './toggle'
export * from './tooltip'

// Re-export specific components to avoid conflicts
export { Input as BasicInput } from './input'
export { Textarea as BasicTextarea } from './textarea'
export { Skeleton as BasicSkeleton } from './skeleton'

/**
 * 📚 GUIA DE USO:
 * 
 * // Importar componentes específicos
 * import { Spinner, LoadingButton, Toast } from '@/components/ui'
 * 
 * // Importar hooks
 * import { useToast } from '@/hooks/use-toast'
 * 
 * // Importar componentes ClassCheck
 * import { AulaCard, ProfessorCard } from '@/components/ui'
 * 
 * // Importar design tokens
 * import { designTokens } from '@/components/ui'
 */
