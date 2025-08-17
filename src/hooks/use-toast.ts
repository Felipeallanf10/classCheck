import * as React from "react"

// 🍞 TIPOS DO TOAST
export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  action?: React.ReactNode
  duration?: number
  closable?: boolean
  showIcon?: boolean
  icon?: React.ReactNode
  onClose?: () => void
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  toast: {
    success: (message: string | Pick<Toast, "title" | "description">) => string
    error: (message: string | Pick<Toast, "title" | "description">) => string
    warning: (message: string | Pick<Toast, "title" | "description">) => string
    info: (message: string | Pick<Toast, "title" | "description">) => string
    loading: (message: string, options?: { successMessage?: string }) => {
      id: string
      complete: (successMessage?: string) => void
      error: (errorMessage?: string) => void
    }
  }
}

// 🎯 CONTEXT
const ToastContext = React.createContext<ToastContextType | null>(null)

// 📱 HOOK USE-TOAST
export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider")
  }
  return context
}

// 🔧 GERADOR DE ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 🏗️ PROVIDER
export interface ToastProviderProps {
  children: React.ReactNode
  /**
   * Duração padrão em ms (0 = não remove automaticamente)
   */
  defaultDuration?: number
  /**
   * Máximo de toasts simultâneos
   */
  maxToasts?: number
}

export function ToastProvider({
  children,
  defaultDuration = 5000,
  maxToasts = 5
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  // ➕ ADICIONAR TOAST
  const addToast = React.useCallback((toast: Omit<Toast, "id">): string => {
    const id = generateId()
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      // Limita o número de toasts
      return updated.slice(0, maxToasts)
    })

    // Auto-remove se duration > 0
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [defaultDuration, maxToasts])

  // ➖ REMOVER TOAST
  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // 🧹 LIMPAR TODOS
  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  // 🎪 MÉTODOS HELPER
  const toastHelpers = React.useMemo(() => ({
    success: (message: string | Pick<Toast, "title" | "description">): string => {
      const toastData = typeof message === "string" 
        ? { description: message }
        : message

      return addToast({
        ...toastData,
        variant: "success"
      })
    },

    error: (message: string | Pick<Toast, "title" | "description">): string => {
      const toastData = typeof message === "string" 
        ? { description: message }
        : message

      return addToast({
        ...toastData,
        variant: "error"
      })
    },

    warning: (message: string | Pick<Toast, "title" | "description">): string => {
      const toastData = typeof message === "string" 
        ? { description: message }
        : message

      return addToast({
        ...toastData,
        variant: "warning"
      })
    },

    info: (message: string | Pick<Toast, "title" | "description">): string => {
      const toastData = typeof message === "string" 
        ? { description: message }
        : message

      return addToast({
        ...toastData,
        variant: "info"
      })
    },

    loading: (
      message: string, 
      options?: { successMessage?: string }
    ) => {
      const id = addToast({
        description: message,
        variant: "info",
        duration: 0, // Não remove automaticamente
        closable: false,
        icon: React.createElement("div", {
          className: "animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
        })
      })

      return {
        id,
        complete: (successMessage?: string) => {
          removeToast(id)
          if (successMessage || options?.successMessage) {
            toastHelpers.success(successMessage || options!.successMessage!)
          }
        },
        error: (errorMessage?: string) => {
          removeToast(id)
          if (errorMessage) {
            toastHelpers.error(errorMessage)
          }
        }
      }
    }
  }), [addToast, removeToast])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    toast: toastHelpers
  }

  return React.createElement(
    ToastContext.Provider,
    { value },
    children
  )
}

// 🎯 HOOK SHORTCUT PARA CASOS ESPECÍFICOS DO CLASSCHECK
export function useClassCheckToast() {
  const { toast } = useToast()

  return {
    // 📚 Toasts específicos para aulas
    aulaAvaliada: (nomeAula: string) => 
      toast.success({
        title: "Aula avaliada!",
        description: `Sua avaliação de "${nomeAula}" foi registrada.`
      }),

    aulaFavoritada: (nomeAula: string) => 
      toast.success({
        title: "Aula favoritada!",
        description: `"${nomeAula}" foi adicionada aos seus favoritos.`
      }),

    aulaDesfavoritada: (nomeAula: string) => 
      toast.info({
        title: "Aula removida dos favoritos",
        description: `"${nomeAula}" foi removida dos seus favoritos.`
      }),

    // 👨‍🏫 Toasts para professores
    professorSeguido: (nomeProfessor: string) => 
      toast.success({
        title: "Professor seguido!",
        description: `Agora você segue ${nomeProfessor}.`
      }),

    // 💾 Toasts para dados
    dadosSalvos: () => 
      toast.success("Dados salvos com sucesso!"),

    erroConexao: () => 
      toast.error({
        title: "Erro de conexão",
        description: "Verifique sua internet e tente novamente."
      }),

    erroPermissao: () => 
      toast.error({
        title: "Sem permissão",
        description: "Você não tem permissão para esta ação."
      }),

    // 🔄 Loading específicos
    salvandoAvaliacao: (aulaName: string) => {
      return toast.loading(`Salvando avaliação de "${aulaName}"...`, {
        successMessage: "Avaliação salva com sucesso!"
      })
    },

    carregandoDados: () => {
      return toast.loading("Carregando dados...", {
        successMessage: "Dados carregados!"
      })
    }
  }
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // 1. Setup no app
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <YourApp />
 *       <ToastDisplay />
 *     </ToastProvider>
 *   )
 * }
 * 
 * // 2. Hook básico
 * function Component() {
 *   const { toast } = useToast()
 * 
 *   const handleSubmit = () => {
 *     toast.success("Dados salvos!")
 *     toast.error("Algo deu errado")
 *     toast.warning("Cuidado!")
 *     toast.info("Informação importante")
 *   }
 * }
 * 
 * // 3. Loading toast
 * function Component() {
 *   const { toast } = useToast()
 * 
 *   const handleSubmit = async () => {
 *     const loadingToast = toast.loading("Salvando...")
 *     
 *     try {
 *       await saveData()
 *       loadingToast.complete("Salvo com sucesso!")
 *     } catch (error) {
 *       loadingToast.error("Erro ao salvar")
 *     }
 *   }
 * }
 * 
 * // 4. ClassCheck específico
 * function AulaComponent() {
 *   const classToast = useClassCheckToast()
 * 
 *   const handleAvaliar = () => {
 *     const loading = classToast.salvandoAvaliacao("Matemática Básica")
 *     // ... lógica de salvar
 *     loading.complete()
 *   }
 * 
 *   const handleFavoritar = () => {
 *     classToast.aulaFavoritada("Matemática Básica")
 *   }
 * }
 */
