import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

// ✨ TOAST VARIANTS
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border shadow-xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-slate-200 bg-white/95 text-slate-900 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100",
        success: "border-green-200 bg-green-50/95 text-green-900 dark:border-green-800 dark:bg-green-950/95 dark:text-green-100",
        error: "border-red-200 bg-red-50/95 text-red-900 dark:border-red-800 dark:bg-red-950/95 dark:text-red-100", 
        warning: "border-yellow-200 bg-yellow-50/95 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/95 dark:text-yellow-100",
        info: "border-blue-200 bg-blue-50/95 text-blue-900 dark:border-blue-800 dark:bg-blue-950/95 dark:text-blue-100"
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
        className={cn(toastVariants({ variant }), "p-4 pr-8 min-w-[350px]", className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="flex items-start space-x-3 w-full">
          {/* Ícone */}
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon || <IconComponent className="h-5 w-5" />}
            </div>
          )}

          {/* Conteúdo */}
          <div className="flex-1 min-w-0 space-y-1">
            {title && (
              <div className="text-sm font-semibold leading-tight">
                {title}
              </div>
            )}
            {description && (
              <div className={cn(
                "text-sm leading-relaxed",
                variant === "default" ? "opacity-80" : "opacity-90"
              )}>
                {description}
              </div>
            )}
            {children}
          </div>

          {/* Ação */}
          {action && (
            <div className="flex-shrink-0 ml-3">
              {action}
            </div>
          )}
        </div>

        {/* Botão fechar */}
        {closable && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1.5 text-current/60 opacity-70 transition-all hover:text-current hover:opacity-100 hover:bg-current/10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-current/20 group-hover:opacity-100"
            aria-label="Fechar notificação"
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
      "top-left": "top-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "top-right": "top-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
      "bottom-right": "bottom-4 right-4"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed flex flex-col space-y-3 w-full max-w-sm pointer-events-none",
          "z-[100] toast-container",
          positionClasses[position],
          className
        )}
        style={{ 
          zIndex: 100,
          pointerEvents: 'none'
        }}
        {...props}
      >
        <div className="space-y-3 pointer-events-auto">
          {children}
        </div>
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
