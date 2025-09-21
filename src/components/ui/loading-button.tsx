import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cva, type VariantProps } from "class-variance-authority"

// ✨ LOADING BUTTON VARIANTS
const loadingButtonVariants = cva(
  "relative transition-all duration-200",
  {
    variants: {
      loadingVariant: {
        spinner: "",
        dots: "",
        pulse: "animate-pulse"
      }
    },
    defaultVariants: {
      loadingVariant: "spinner"
    }
  }
)

export interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants>,
    VariantProps<typeof loadingButtonVariants> {
  /**
   * Se o botão está em estado de loading
   */
  loading?: boolean
  /**
   * Texto alternativo durante loading
   */
  loadingText?: string
  /**
   * Posição do spinner/loading indicator
   */
  spinnerPosition?: "left" | "right" | "center"
  /**
   * Desabilitar o botão durante loading
   */
  disableWhileLoading?: boolean
  /**
   * Se deve usar como child (do Radix)
   */
  asChild?: boolean
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      loading = false,
      loadingText,
      loadingVariant = "spinner",
      spinnerPosition = "left",
      disableWhileLoading = true,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || (loading && disableWhileLoading)

    // 🎯 RENDER CONTENT
    const renderContent = () => {
      if (!loading) {
        return children
      }

      const spinner = <Spinner size="sm" className="text-current" />
      const text = loadingText || children
      
      if (loadingVariant === "pulse") {
        return text
      }

      if (spinnerPosition === "center") {
        return (
          <div className="flex items-center justify-center">
            {spinner}
          </div>
        )
      }

      if (spinnerPosition === "right") {
        return (
          <div className="flex items-center justify-center space-x-2">
            <span>{text}</span>
            {spinner}
          </div>
        )
      }

      // Default: left
      return (
        <div className="flex items-center justify-center space-x-2">
          {spinner}
          <span>{text}</span>
        </div>
      )
    }

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          loadingButtonVariants({ loadingVariant }),
          loading && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        {renderContent()}
      </Button>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

// 🎯 SUBMIT BUTTON (para forms)
export interface SubmitButtonProps extends LoadingButtonProps {
  /**
   * Se deve mostrar loading automaticamente baseado no form state
   */
  autoLoading?: boolean
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ autoLoading = true, type = "submit", ...props }, ref) => {
    return (
      <LoadingButton
        ref={ref}
        type={type}
        {...props}
      />
    )
  }
)
SubmitButton.displayName = "SubmitButton"

// 🔄 ASYNC BUTTON (executa ação async)
export interface AsyncButtonProps extends Omit<LoadingButtonProps, 'loading' | 'onClick' | 'onError'> {
  /**
   * Função async a ser executada
   */
  onClick?: () => Promise<void> | void
  /**
   * Callback executado no sucesso
   */
  onSuccess?: () => void
  /**
   * Callback executado no erro
   */
  onError?: (error: Error) => void
}

const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ onClick, onSuccess, onError, children, ...props }, ref) => {
    const [loading, setLoading] = React.useState(false)

    const handleClick = async () => {
      if (!onClick || loading) return

      try {
        setLoading(true)
        await onClick()
        onSuccess?.()
      } catch (error) {
        onError?.(error as Error)
      } finally {
        setLoading(false)
      }
    }

    return (
      <LoadingButton
        ref={ref}
        loading={loading}
        onClick={handleClick}
        {...props}
      >
        {children}
      </LoadingButton>
    )
  }
)
AsyncButton.displayName = "AsyncButton"

// 📱 BUTTONS ESPECÍFICOS DO CLASSCHECK

// 🎯 AVALIAR BUTTON
export interface AvaliarButtonProps extends LoadingButtonProps {
  aulaId?: string
  onAvaliar?: (aulaId: string) => Promise<void>
}

const AvaliarButton = React.forwardRef<HTMLButtonElement, AvaliarButtonProps>(
  ({ aulaId, onAvaliar, ...props }, ref) => {
    const [loading, setLoading] = React.useState(false)

    const handleAvaliar = async () => {
      if (!aulaId || !onAvaliar) return

      try {
        setLoading(true)
        await onAvaliar(aulaId)
      } catch (error) {
        console.error('Erro ao avaliar:', error)
      } finally {
        setLoading(false)
      }
    }

    return (
      <LoadingButton
        ref={ref}
        loading={loading}
        onClick={handleAvaliar}
        size="sm"
        variant="default"
        {...props}
      >
        Avaliar
      </LoadingButton>
    )
  }
)
AvaliarButton.displayName = "AvaliarButton"

// ❤️ FAVORITAR BUTTON
export interface FavoritarButtonProps extends LoadingButtonProps {
  isFavorited?: boolean
  itemId?: string
  onToggleFavorite?: (itemId: string, isFavorited: boolean) => Promise<void>
}

const FavoritarButton = React.forwardRef<HTMLButtonElement, FavoritarButtonProps>(
  ({ isFavorited = false, itemId, onToggleFavorite, children, ...props }, ref) => {
    const [loading, setLoading] = React.useState(false)
    const [favorited, setFavorited] = React.useState(isFavorited)

    const handleToggle = async () => {
      if (!itemId || !onToggleFavorite) return

      try {
        setLoading(true)
        await onToggleFavorite(itemId, favorited)
        setFavorited(!favorited)
      } catch (error) {
        console.error('Erro ao favoritar:', error)
      } finally {
        setLoading(false)
      }
    }

    return (
      <LoadingButton
        ref={ref}
        loading={loading}
        onClick={handleToggle}
        variant={favorited ? "default" : "outline"}
        size="sm"
        {...props}
      >
        {children || (favorited ? "❤️ Favoritado" : "🤍 Favoritar")}
      </LoadingButton>
    )
  }
)
FavoritarButton.displayName = "FavoritarButton"

// 📤 EXPORTS
export {
  LoadingButton,
  SubmitButton,
  AsyncButton,
  AvaliarButton,
  FavoritarButton,
  loadingButtonVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Botão com loading básico
 * <LoadingButton loading={isLoading}>
 *   Salvar
 * </LoadingButton>
 * 
 * // Botão com texto diferente durante loading
 * <LoadingButton loading={isLoading} loadingText="Salvando...">
 *   Salvar
 * </LoadingButton>
 * 
 * // Botão async que executa ação
 * <AsyncButton
 *   onClick={async () => await saveData()}
 *   onSuccess={() => toast.success('Salvo!')}
 *   onError={(error) => toast.error(error.message)}
 * >
 *   Salvar
 * </AsyncButton>
 * 
 * // Botão de submit para forms
 * <SubmitButton loading={form.formState.isSubmitting}>
 *   Enviar
 * </SubmitButton>
 * 
 * // Botões específicos do ClassCheck
 * <AvaliarButton aulaId="123" onAvaliar={handleAvaliar} />
 * <FavoritarButton
 *   isFavorited={false}
 *   itemId="123"
 *   onToggleFavorite={handleToggleFavorite}
 * />
 */
