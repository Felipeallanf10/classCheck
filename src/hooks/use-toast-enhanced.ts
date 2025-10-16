'use client'

import { useToast as useToastOriginal } from "@/hooks/use-toast"

// Hook melhorado que usa os métodos já existentes do toast
export function useToastEnhanced() {
  const { toast } = useToastOriginal()

  return {
    // Usa os métodos existentes
    ...toast,
    
    // Helper para toast de promise
    promise: async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: any) => string)
      }
    ) => {
      const loadingToast = toast.loading(messages.loading)

      try {
        const data = await promise
        
        const successMessage = typeof messages.success === 'function' 
          ? messages.success(data) 
          : messages.success

        loadingToast.complete(successMessage)
        return data
      } catch (error) {
        const errorMessage = typeof messages.error === 'function' 
          ? messages.error(error) 
          : messages.error

        loadingToast.error(errorMessage)
        throw error
      }
    }
  }
}

// Mensagens pré-definidas para ações comuns
export const ToastMessages = {
  // Avaliações
  avaliacaoSalva: {
    title: "✅ Avaliação salva com sucesso!",
    description: "Obrigado por avaliar. Suas contribuições são valiosas."
  },
  avaliacaoErro: {
    title: "❌ Erro ao salvar avaliação",
    description: "Tente novamente em alguns instantes."
  },
  avaliacaoJaFeita: {
    title: "⚠️ Você já avaliou este item",
    description: "Só é permitida uma avaliação por mês."
  },

  // Dados carregados
  dadosCarregados: {
    title: "✓ Dados atualizados",
    description: "As informações foram recarregadas."
  },
  erroCarregar: {
    title: "❌ Erro ao carregar dados",
    description: "Verifique sua conexão e tente novamente."
  },

  // Ações genéricas
  sucessoGenerico: {
    title: "✓ Ação concluída",
    description: "A operação foi realizada com sucesso."
  },
  erroGenerico: {
    title: "❌ Algo deu errado",
    description: "Por favor, tente novamente."
  },

  // Navegação
  redirecionando: {
    title: "↗️ Redirecionando...",
    description: "Aguarde um momento."
  },

  // Cópia
  copiado: {
    title: "📋 Copiado!",
    description: "O texto foi copiado para a área de transferência."
  }
}
