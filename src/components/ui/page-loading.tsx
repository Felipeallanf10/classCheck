import * as React from "react"
import { cn } from "@/lib/utils"
import { SpinnerOverlay, Spinner } from "@/components/ui/spinner"
import { cva, type VariantProps } from "class-variance-authority"

// ✨ PAGE LOADING VARIANTS
const pageLoadingVariants = cva(
  "fixed inset-0 z-modal flex items-center justify-center",
  {
    variants: {
      variant: {
        overlay: "bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80",
        solid: "bg-white dark:bg-neutral-900",
        transparent: "bg-transparent"
      },
      animation: {
        fade: "animate-in fade-in duration-300",
        slide: "animate-in slide-in-from-top-4 duration-500",
        zoom: "animate-in zoom-in-95 duration-300"
      }
    },
    defaultVariants: {
      variant: "overlay",
      animation: "fade"
    }
  }
)

export interface PageLoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageLoadingVariants> {
  /**
   * Texto para mostrar durante o loading
   */
  text?: string
  /**
   * Subtexto adicional
   */
  subText?: string
  /**
   * Se deve mostrar o componente
   */
  show?: boolean
  /**
   * Tamanho do spinner
   */
  spinnerSize?: "sm" | "md" | "lg" | "xl"
  /**
   * Logo personalizado (substitui o spinner)
   */
  logo?: React.ReactNode
  /**
   * Se deve bloquear interações
   */
  blocking?: boolean
}

const PageLoading = React.forwardRef<HTMLDivElement, PageLoadingProps>(
  (
    {
      className,
      variant,
      animation,
      text = "Carregando...",
      subText,
      show = true,
      spinnerSize = "xl",
      logo,
      blocking = true,
      ...props
    },
    ref
  ) => {
    if (!show) return null

    return (
      <div
        ref={ref}
        className={cn(
          pageLoadingVariants({ variant, animation }),
          !blocking && "pointer-events-none",
          className
        )}
        role="dialog"
        aria-modal={blocking}
        aria-label="Carregando página"
        {...props}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Logo ou Spinner */}
          {logo || <Spinner size={spinnerSize} variant="primary" />}
          
          {/* Texto principal */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              {text}
            </h3>
            
            {subText && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {subText}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
)
PageLoading.displayName = "PageLoading"

// 🚀 APP LOADING (para primeira carga da aplicação)
export interface AppLoadingProps extends PageLoadingProps {
  /**
   * Progresso da carga (0-100)
   */
  progress?: number
  /**
   * Lista de etapas sendo carregadas
   */
  steps?: string[]
  /**
   * Etapa atual
   */
  currentStep?: number
}

const AppLoading = React.forwardRef<HTMLDivElement, AppLoadingProps>(
  (
    {
      progress,
      steps = [],
      currentStep = 0,
      text = "Inicializando ClassCheck...",
      subText = "Carregando componentes e dados",
      logo,
      ...props
    },
    ref
  ) => {
    const currentStepText = steps[currentStep]

    return (
      <PageLoading
        ref={ref}
        text={text}
        subText={currentStepText || subText}
        variant="solid"
        logo={
          logo || (
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">CC</span>
              </div>
              {progress !== undefined && (
                <div className="absolute -bottom-2 left-0 right-0">
                  <div className="h-1 bg-neutral-200 rounded-full dark:bg-neutral-700">
                    <div 
                      className="h-1 bg-primary-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        }
        {...props}
      />
    )
  }
)
AppLoading.displayName = "AppLoading"

// 📱 ROUTE LOADING (para mudanças de rota)
export interface RouteLoadingProps extends PageLoadingProps {
  /**
   * Nome da rota sendo carregada
   */
  routeName?: string
  /**
   * Se deve mostrar uma versão minimalista
   */
  minimal?: boolean
}

const RouteLoading = React.forwardRef<HTMLDivElement, RouteLoadingProps>(
  (
    {
      routeName,
      minimal = false,
      text,
      variant = "transparent",
      spinnerSize = "lg",
      ...props
    },
    ref
  ) => {
    const loadingText = text || (routeName ? `Carregando ${routeName}...` : "Carregando página...")

    if (minimal) {
      return (
        <div className="fixed top-0 left-0 right-0 z-banner">
          <div className="h-1 bg-primary-500 animate-pulse" />
        </div>
      )
    }

    return (
      <PageLoading
        ref={ref}
        text={loadingText}
        variant={variant}
        spinnerSize={spinnerSize}
        animation="slide"
        {...props}
      />
    )
  }
)
RouteLoading.displayName = "RouteLoading"

// 🔄 COMPONENT LOADING (para componentes individuais)
export interface ComponentLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Se deve mostrar o loading
   */
  show?: boolean
  /**
   * Tamanho do container
   */
  size?: "sm" | "md" | "lg" | "full"
  /**
   * Texto opcional
   */
  text?: string
  /**
   * Se deve centralizar o conteúdo
   */
  center?: boolean
}

const ComponentLoading = React.forwardRef<HTMLDivElement, ComponentLoadingProps>(
  (
    {
      className,
      show = true,
      size = "md",
      text,
      center = true,
      ...props
    },
    ref
  ) => {
    if (!show) return null

    const sizeClasses = {
      sm: "h-24",
      md: "h-32",
      lg: "h-48",
      full: "h-full min-h-[200px]"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center space-y-3",
          sizeClasses[size],
          center && "justify-center",
          className
        )}
        {...props}
      >
        <Spinner size="md" />
        {text && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {text}
          </p>
        )}
      </div>
    )
  }
)
ComponentLoading.displayName = "ComponentLoading"

// 📤 EXPORTS
export {
  PageLoading,
  AppLoading,
  RouteLoading,
  ComponentLoading,
  pageLoadingVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Loading de página completa
 * <PageLoading text="Carregando dados..." />
 * 
 * // Loading da aplicação com progresso
 * <AppLoading 
 *   progress={75} 
 *   steps={['Carregando...', 'Conectando...', 'Finalizing...']}
 *   currentStep={1}
 * />
 * 
 * // Loading de rota simples
 * <RouteLoading routeName="Dashboard" />
 * 
 * // Loading minimalista
 * <RouteLoading minimal />
 * 
 * // Loading de componente
 * <ComponentLoading size="lg" text="Buscando aulas..." />
 */
