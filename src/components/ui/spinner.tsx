import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// ✨ VARIANTS DO SPINNER
const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6", 
        lg: "h-8 w-8",
        xl: "h-12 w-12"
      },
      variant: {
        default: "text-primary-500",
        primary: "text-primary-500",
        success: "text-success-500",
        warning: "text-warning-500", 
        danger: "text-danger-500",
        neutral: "text-neutral-500",
        white: "text-white"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Texto para screen readers
   */
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "Carregando...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ size, variant }), className)}
        role="status"
        aria-label={label}
        {...props}
      >
        <span className="sr-only">{label}</span>
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

// 🎯 SPINNER COM OVERLAY (para page loading)
export interface SpinnerOverlayProps extends SpinnerProps {
  /**
   * Se deve mostrar o overlay de fundo
   */
  overlay?: boolean
  /**
   * Texto opcional para mostrar abaixo do spinner
   */
  text?: string
}

const SpinnerOverlay = React.forwardRef<HTMLDivElement, SpinnerOverlayProps>(
  ({ overlay = true, text, size = "xl", ...props }, ref) => {
    const content = (
      <div className="flex flex-col items-center justify-center gap-3">
        <Spinner ref={ref} size={size} {...props} />
        {text && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {text}
          </p>
        )}
      </div>
    )

    if (overlay) {
      return (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80">
          {content}
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center p-8">
        {content}
      </div>
    )
  }
)
SpinnerOverlay.displayName = "SpinnerOverlay"

// 🔄 SPINNING DOTS (variação alternativa)
export interface SpinningDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "success" | "warning" | "danger"
}

const SpinningDots = React.forwardRef<HTMLDivElement, SpinningDotsProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const dotClasses = cn(
      "inline-block rounded-full bg-current animate-bounce",
      {
        "h-2 w-2": size === "sm",
        "h-3 w-3": size === "md", 
        "h-4 w-4": size === "lg"
      },
      {
        "text-primary-500": variant === "default" || variant === "primary",
        "text-success-500": variant === "success",
        "text-warning-500": variant === "warning",
        "text-danger-500": variant === "danger"
      }
    )

    return (
      <div
        ref={ref}
        className={cn("flex space-x-1", className)}
        role="status"
        aria-label="Carregando..."
        {...props}
      >
        <div className={dotClasses} style={{ animationDelay: '0ms' }} />
        <div className={dotClasses} style={{ animationDelay: '150ms' }} />
        <div className={dotClasses} style={{ animationDelay: '300ms' }} />
        <span className="sr-only">Carregando...</span>
      </div>
    )
  }
)
SpinningDots.displayName = "SpinningDots"

// 📤 EXPORTS
export { Spinner, SpinnerOverlay, SpinningDots, spinnerVariants }

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Spinner básico
 * <Spinner />
 * 
 * // Spinner com tamanho e cor
 * <Spinner size="lg" variant="success" />
 * 
 * // Spinner de página inteira
 * <SpinnerOverlay text="Carregando dados..." />
 * 
 * // Spinner sem overlay
 * <SpinnerOverlay overlay={false} />
 * 
 * // Dots animados
 * <SpinningDots size="lg" variant="primary" />
 */
