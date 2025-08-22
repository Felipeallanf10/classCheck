import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Search,
  FileX,
  Users,
  BookOpen,
  Calendar,
  Heart,
  Star,
  MessageCircle,
  TrendingDown,
  Database,
  Server,
  Globe
} from "lucide-react"

// ✨ EMPTY STATE VARIANTS
const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center space-y-4 py-12 px-6",
  {
    variants: {
      size: {
        sm: "py-8 px-4",
        default: "py-12 px-6",
        lg: "py-16 px-8"
      },
      variant: {
        default: "text-muted-foreground",
        subtle: "text-muted-foreground/70",
        prominent: "text-foreground"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

// 🎯 TYPES
export interface EmptyStateProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  /**
   * Ícone do estado vazio
   */
  icon?: React.ReactNode
  /**
   * Título principal
   */
  title: string
  /**
   * Descrição/subtítulo
   */
  description?: string
  /**
   * Ação primária
   */
  action?: React.ReactNode
  /**
   * Ação secundária
   */
  secondaryAction?: React.ReactNode
  /**
   * Ilustração customizada (substitui ícone)
   */
  illustration?: React.ReactNode
}

// 🎪 EMPTY STATE COMPONENT
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      size,
      variant,
      icon,
      title,
      description,
      action,
      secondaryAction,
      illustration,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size, variant }), className)}
        {...props}
      >
        {/* Ilustração ou ícone */}
        {illustration || (
          <div className="text-muted-foreground/50 mb-4">
            {icon || <FileX className="h-16 w-16" />}
          </div>
        )}

        {/* Título */}
        <h3 className="text-lg font-semibold">{title}</h3>

        {/* Descrição */}
        {description && (
          <p className="text-sm max-w-sm">{description}</p>
        )}

        {/* Ações */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

// 📊 STATUS INDICATOR VARIANTS
const statusIndicatorVariants = cva(
  "inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium",
  {
    variants: {
      variant: {
        success: "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200",
        warning: "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200",
        error: "bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200",
        info: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
        neutral: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base"
      }
    },
    defaultVariants: {
      variant: "neutral",
      size: "default"
    }
  }
)

export interface StatusIndicatorProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  /**
   * Ícone do status
   */
  icon?: React.ReactNode
  /**
   * Texto do status
   */
  children: React.ReactNode
  /**
   * Se deve mostrar indicador pulsante
   */
  pulse?: boolean
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      children,
      pulse,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(statusIndicatorVariants({ variant, size }), className)}
        {...props}
      >
        {/* Indicador pulsante */}
        {pulse && (
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            {
              "bg-success-500": variant === "success",
              "bg-warning-500": variant === "warning", 
              "bg-danger-500": variant === "error",
              "bg-primary-500": variant === "info",
              "bg-neutral-500": variant === "neutral"
            }
          )} />
        )}
        
        {/* Ícone */}
        {icon && <span>{icon}</span>}
        
        {/* Texto */}
        <span>{children}</span>
      </div>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

// 🚨 ERROR STATE COMPONENT
export interface ErrorStateProps extends Omit<EmptyStateProps, 'icon' | 'variant'> {
  /**
   * Tipo de erro
   */
  type?: "network" | "server" | "notFound" | "permission" | "generic"
  /**
   * Callback para tentar novamente
   */
  onRetry?: () => void
  /**
   * Se está tentando novamente
   */
  isRetrying?: boolean
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      type = "generic",
      title,
      description,
      onRetry,
      isRetrying,
      action,
      ...props
    },
    ref
  ) => {
    const errorConfig = {
      network: {
        icon: <WifiOff className="h-16 w-16" />,
        defaultTitle: "Sem conexão",
        defaultDescription: "Verifique sua conexão com a internet e tente novamente."
      },
      server: {
        icon: <Server className="h-16 w-16" />,
        defaultTitle: "Erro no servidor",
        defaultDescription: "Nossos servidores estão temporariamente indisponíveis."
      },
      notFound: {
        icon: <Search className="h-16 w-16" />,
        defaultTitle: "Não encontrado",
        defaultDescription: "O conteúdo que você procura não foi encontrado."
      },
      permission: {
        icon: <XCircle className="h-16 w-16" />,
        defaultTitle: "Acesso negado",
        defaultDescription: "Você não tem permissão para acessar este conteúdo."
      },
      generic: {
        icon: <AlertCircle className="h-16 w-16" />,
        defaultTitle: "Algo deu errado",
        defaultDescription: "Ocorreu um erro inesperado. Tente novamente."
      }
    }

    const config = errorConfig[type]
    const finalTitle = title || config.defaultTitle
    const finalDescription = description || config.defaultDescription

    const retryAction = onRetry && (
      <Button 
        onClick={onRetry}
        disabled={isRetrying}
        className="min-w-[120px]"
      >
        {isRetrying ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Tentando...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </>
        )}
      </Button>
    )

    return (
      <EmptyState
        ref={ref}
        icon={config.icon}
        title={finalTitle}
        description={finalDescription}
        action={action || retryAction}
        variant="prominent"
        {...props}
      />
    )
  }
)
ErrorState.displayName = "ErrorState"

// 🎓 CLASSCHECK EMPTY STATES
export interface ClassCheckEmptyStateProps extends Omit<EmptyStateProps, 'icon' | 'title' | 'description'> {
  /**
   * Tipo de conteúdo vazio específico do ClassCheck
   */
  type: 
    | "aulas"
    | "professores" 
    | "avaliacoes"
    | "favoritos"
    | "inscricoes"
    | "mensagens"
    | "notificacoes"
    | "pesquisa"
    | "calendario"
  /**
   * Callback para ação principal
   */
  onAction?: () => void
  /**
   * Texto customizado para ação
   */
  actionText?: string
}

const ClassCheckEmptyState = React.forwardRef<HTMLDivElement, ClassCheckEmptyStateProps>(
  (
    {
      type,
      onAction,
      actionText,
      action,
      ...props
    },
    ref
  ) => {
    const emptyStateConfig = {
      aulas: {
        icon: <BookOpen className="h-16 w-16" />,
        title: "Nenhuma aula encontrada",
        description: "Ainda não há aulas disponíveis. Que tal ser o primeiro a criar uma?",
        actionText: "Criar primeira aula"
      },
      professores: {
        icon: <Users className="h-16 w-16" />,
        title: "Nenhum professor encontrado",
        description: "Não encontramos professores com os critérios selecionados.",
        actionText: "Limpar filtros"
      },
      avaliacoes: {
        icon: <Star className="h-16 w-16" />,
        title: "Nenhuma avaliação ainda",
        description: "Esta aula ainda não possui avaliações. Seja o primeiro a avaliar!",
        actionText: "Avaliar aula"
      },
      favoritos: {
        icon: <Heart className="h-16 w-16" />,
        title: "Nenhum favorito",
        description: "Você ainda não favoritou nenhuma aula. Explore e encontre suas favoritas!",
        actionText: "Explorar aulas"
      },
      inscricoes: {
        icon: <Calendar className="h-16 w-16" />,
        title: "Nenhuma inscrição",
        description: "Você ainda não se inscreveu em nenhuma aula. Comece sua jornada de aprendizado!",
        actionText: "Buscar aulas"
      },
      mensagens: {
        icon: <MessageCircle className="h-16 w-16" />,
        title: "Nenhuma mensagem",
        description: "Sua caixa de mensagens está vazia. Entre em contato com professores e colegas!",
        actionText: "Encontrar professores"
      },
      notificacoes: {
        icon: <Info className="h-16 w-16" />,
        title: "Nenhuma notificação",
        description: "Você está em dia! Não há notificações pendentes.",
        actionText: null
      },
      pesquisa: {
        icon: <Search className="h-16 w-16" />,
        title: "Nenhum resultado encontrado",
        description: "Tente usar palavras-chave diferentes ou explore nossas categorias.",
        actionText: "Explorar categorias"
      },
      calendario: {
        icon: <Calendar className="h-16 w-16" />,
        title: "Nenhuma aula agendada",
        description: "Você não tem aulas agendadas para este período. Que tal se inscrever em alguma?",
        actionText: "Buscar aulas"
      }
    }

    const config = emptyStateConfig[type]
    const finalAction = action || (onAction && config.actionText && (
      <Button onClick={onAction}>
        {actionText || config.actionText}
      </Button>
    ))

    return (
      <EmptyState
        ref={ref}
        icon={config.icon}
        title={config.title}
        description={config.description}
        action={finalAction}
        {...props}
      />
    )
  }
)
ClassCheckEmptyState.displayName = "ClassCheckEmptyState"

// 🔄 CONNECTION STATUS
export interface ConnectionStatusProps {
  /**
   * Se está online
   */
  isOnline?: boolean
  /**
   * Se deve mostrar sempre (mesmo quando online)
   */
  alwaysShow?: boolean
  /**
   * Callback quando tentar reconectar
   */
  onRetry?: () => void
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isOnline = true,
  alwaysShow = false,
  onRetry
}) => {
  const [shouldShow, setShouldShow] = React.useState(!isOnline || alwaysShow)

  React.useEffect(() => {
    if (isOnline && !alwaysShow) {
      // Auto-hide após 3 segundos quando volta online
      const timer = setTimeout(() => {
        setShouldShow(false)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShouldShow(true)
    }
  }, [isOnline, alwaysShow])

  if (!shouldShow) return null

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 transition-all duration-300",
      isOnline ? "animate-in fade-in slide-in-from-bottom-2" : "animate-pulse"
    )}>
      <StatusIndicator
        variant={isOnline ? "success" : "error"}
        icon={isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        pulse={!isOnline}
        className="shadow-lg"
      >
        <span className="mr-2">
          {isOnline ? "Conectado" : "Sem conexão"}
        </span>
        {!isOnline && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-auto p-1 text-current hover:bg-white/20"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </StatusIndicator>
    </div>
  )
}

// 📤 EXPORTS
export {
  EmptyState,
  StatusIndicator,
  ErrorState,
  ClassCheckEmptyState,
  ConnectionStatus,
  emptyStateVariants,
  statusIndicatorVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Empty state básico
 * <EmptyState
 *   icon={<BookOpen className="h-16 w-16" />}
 *   title="Nenhuma aula encontrada"
 *   description="Crie sua primeira aula para começar."
 *   action={<Button>Criar aula</Button>}
 * />
 * 
 * // Error state com retry
 * <ErrorState
 *   type="network"
 *   onRetry={() => window.location.reload()}
 *   isRetrying={isLoading}
 * />
 * 
 * // ClassCheck empty states
 * <ClassCheckEmptyState
 *   type="favoritos"
 *   onAction={() => router.push('/aulas')}
 * />
 * 
 * // Status indicators
 * <StatusIndicator variant="success" icon={<CheckCircle />}>
 *   Operação concluída
 * </StatusIndicator>
 * 
 * <StatusIndicator variant="error" pulse>
 *   Erro de conexão
 * </StatusIndicator>
 * 
 * // Connection status
 * <ConnectionStatus
 *   isOnline={navigator.onLine}
 *   onRetry={() => window.location.reload()}
 * />
 */
