import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

// ✨ TOAST VARIANTS
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border border-neutral-200 bg-white p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-neutral-800 dark:bg-neutral-950",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        success: "border-success-200 bg-success-50 text-success-900 dark:border-success-800 dark:bg-success-950 dark:text-success-100",
        error: "border-danger-200 bg-danger-50 text-danger-900 dark:border-danger-800 dark:bg-danger-950 dark:text-danger-100", 
        warning: "border-warning-200 bg-warning-50 text-warning-900 dark:border-warning-800 dark:bg-warning-950 dark:text-warning-100",
        info: "border-primary-200 bg-primary-50 text-primary-900 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-100"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// 🎯 TOAST ICONS
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info
}

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  /**
   * Título do toast
   */
  title?: string
  /**
   * Descrição/conteúdo do toast
   */
  description?: string
  /**
   * Ação personalizada (botão)
   */
  action?: React.ReactNode
  /**
   * Se deve mostrar o botão de fechar
   */
  closable?: boolean
  /**
   * Callback ao fechar
   */
  onClose?: () => void
  /**
   * Se deve mostrar o ícone
   */
  showIcon?: boolean
  /**
   * Ícone personalizado
   */
  icon?: React.ReactNode
  /**
   * Duração em ms (0 = não remove automaticamente)
   */
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      action,
      closable = true,
      onClose,
      showIcon = true,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const IconComponent = toastIcons[variant as keyof typeof toastIcons] || toastIcons.default

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="flex items-start space-x-3">
          {/* Ícone */}
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon || <IconComponent className="h-5 w-5" />}
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-semibold">
                {title}
              </div>
            )}
            {description && (
              <div className={cn(
                "text-sm opacity-90",
                title && "mt-1"
              )}>
                {description}
              </div>
            )}
            {children}
          </div>

          {/* Ação */}
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>

        {/* Botão fechar */}
        {closable && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-current/50 opacity-0 transition-opacity hover:text-current hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-current group-hover:opacity-100"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

// 📱 TOAST PRESETS (para facilitar uso)
export interface ToastPresetProps extends Omit<ToastProps, 'variant'> {}

const SuccessToast = React.forwardRef<HTMLDivElement, ToastPresetProps>(
  (props, ref) => <Toast ref={ref} variant="success" {...props} />
)
SuccessToast.displayName = "SuccessToast"

const ErrorToast = React.forwardRef<HTMLDivElement, ToastPresetProps>(
  (props, ref) => <Toast ref={ref} variant="error" {...props} />
)
ErrorToast.displayName = "ErrorToast"

const WarningToast = React.forwardRef<HTMLDivElement, ToastPresetProps>(
  (props, ref) => <Toast ref={ref} variant="warning" {...props} />
)
WarningToast.displayName = "WarningToast"

const InfoToast = React.forwardRef<HTMLDivElement, ToastPresetProps>(
  (props, ref) => <Toast ref={ref} variant="info" {...props} />
)
InfoToast.displayName = "InfoToast"

// 🎪 TOAST CONTAINER
export interface ToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Posição dos toasts
   */
  position?: 
    | "top-left" 
    | "top-center" 
    | "top-right"
    | "bottom-left" 
    | "bottom-center" 
    | "bottom-right"
  /**
   * Máximo de toasts simultâneos
   */
  limit?: number
  /**
   * Offset da borda em pixels
   */
  offset?: number
}

const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  (
    {
      className,
      position = "top-right",
      offset = 16,
      children,
      ...props
    },
    ref
  ) => {
    const positionClasses = {
      "top-left": `top-${offset}px left-${offset}px`,
      "top-center": `top-${offset}px left-1/2 transform -translate-x-1/2`,
      "top-right": `top-${offset}px right-${offset}px`,
      "bottom-left": `bottom-${offset}px left-${offset}px`,
      "bottom-center": `bottom-${offset}px left-1/2 transform -translate-x-1/2`,
      "bottom-right": `bottom-${offset}px right-${offset}px`
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-toast flex flex-col space-y-2 w-full max-w-sm",
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ToastContainer.displayName = "ToastContainer"

// 🎯 TOAST COM LOADING
export interface LoadingToastProps extends ToastProps {
  /**
   * Se está carregando
   */
  loading?: boolean
  /**
   * Texto durante loading
   */
  loadingText?: string
  /**
   * Texto após completar
   */
  successText?: string
  /**
   * Callback quando termina loading
   */
  onComplete?: () => void
}

const LoadingToast = React.forwardRef<HTMLDivElement, LoadingToastProps>(
  (
    {
      loading = false,
      loadingText = "Processando...",
      successText = "Concluído!",
      onComplete,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(loading)

    React.useEffect(() => {
      setIsLoading(loading)
      if (!loading && onComplete) {
        onComplete()
      }
    }, [loading, onComplete])

    return (
      <Toast
        ref={ref}
        variant={isLoading ? "info" : "success"}
        description={isLoading ? loadingText : successText}
        icon={
          isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : undefined
        }
        closable={!isLoading}
        {...props}
      />
    )
  }
)
LoadingToast.displayName = "LoadingToast"

// 📤 EXPORTS
export {
  Toast,
  SuccessToast,
  ErrorToast,
  WarningToast,
  InfoToast,
  ToastContainer,
  LoadingToast,
  toastVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Toast básico
 * <Toast 
 *   title="Sucesso!" 
 *   description="Dados salvos com sucesso." 
 *   variant="success"
 * />
 * 
 * // Toast com ação
 * <Toast 
 *   title="Erro ao salvar"
 *   description="Falha na conexão com servidor."
 *   variant="error"
 *   action={<button>Tentar novamente</button>}
 * />
 * 
 * // Presets
 * <SuccessToast title="Tudo certo!" description="Operação realizada." />
 * <ErrorToast title="Ops!" description="Algo deu errado." />
 * 
 * // Container
 * <ToastContainer position="top-right">
 *   {toasts.map(toast => <Toast key={toast.id} {...toast} />)}
 * </ToastContainer>
 * 
 * // Loading toast
 * <LoadingToast 
 *   loading={isSubmitting}
 *   loadingText="Salvando..."
 *   successText="Salvo com sucesso!"
 * />
 */
