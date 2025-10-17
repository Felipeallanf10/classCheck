/**
 * Hook customizado para gamificação
 * Gerencia estado e ações relacionadas a XP e ranking
 */

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface PerfilGamificacao {
  xpTotal: number
  nivel: number
  xpAtual: number
  xpProximoNivel: number
  progresso: number
  streakAtual: number
  melhorStreak: number
  totalAvaliacoes: number
  avaliacoesConsecutivas: number
}

interface XPGanhoResponse {
  xpGanho: number
  xpTotal: number
  nivelAtual: number
  nivelAnterior: number
  subiuNivel: boolean
  multiplicadorAplicado: number
  detalhesMultiplicadores: Array<{ tipo: string; multiplicador: number }>
  streakAtual: number
}

export function useGamificacao(usuarioId: number) {
  const [perfil, setPerfil] = useState<PerfilGamificacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Busca o perfil de gamificação do usuário
   */
  const fetchPerfil = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/gamificacao/perfil/${usuarioId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar perfil de gamificação')
      }

      const data = await response.json()
      setPerfil(data)
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(mensagem)
      console.error('Erro ao buscar perfil:', err)
    } finally {
      setLoading(false)
    }
  }, [usuarioId])

  /**
   * Registra XP por avaliação completa
   */
  const registrarAvaliacaoCompleta = async (aulaId: number): Promise<XPGanhoResponse | null> => {
    try {
      const response = await fetch('/api/gamificacao/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          acao: 'AVALIACAO_COMPLETA',
          aulaId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao registrar XP')
      }

      const data: XPGanhoResponse = await response.json()

      // Atualiza o perfil local
      await fetchPerfil()

      // Mostra notificação de XP ganho
      mostrarNotificacaoXP(data)

      return data
    } catch (err) {
      console.error('Erro ao registrar XP:', err)
      toast.error('Erro ao registrar XP')
      return null
    }
  }

  /**
   * Registra XP por avaliação rápida
   */
  const registrarAvaliacaoRapida = async (aulaId: number): Promise<XPGanhoResponse | null> => {
    try {
      const response = await fetch('/api/gamificacao/xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId,
          acao: 'AVALIACAO_RAPIDA',
          aulaId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao registrar XP')
      }

      const data: XPGanhoResponse = await response.json()

      // Atualiza o perfil local
      await fetchPerfil()

      // Mostra notificação de XP ganho
      mostrarNotificacaoXP(data)

      return data
    } catch (err) {
      console.error('Erro ao registrar XP:', err)
      toast.error('Erro ao registrar XP')
      return null
    }
  }

  /**
   * Mostra notificação de XP ganho
   */
  function mostrarNotificacaoXP(data: XPGanhoResponse) {
    if (data.subiuNivel) {
      toast.success(`🎉 Parabéns! Você subiu para o Nível ${data.nivelAtual}!`, {
        description: `+${data.xpGanho} XP ganhos`,
        duration: 5000,
      })
    } else {
      let descricao = `+${data.xpGanho} XP`
      
      if (data.multiplicadorAplicado > 1) {
        descricao += ` (${data.multiplicadorAplicado.toFixed(1)}x multiplicador)`
      }

      if (data.streakAtual > 1) {
        descricao += ` | 🔥 ${data.streakAtual} dias de streak!`
      }

      toast.success('XP Ganho!', {
        description: descricao,
        duration: 3000,
      })
    }

    // Mostra detalhes dos multiplicadores se houver
    if (data.detalhesMultiplicadores.length > 0) {
      const detalhes = data.detalhesMultiplicadores
        .map(d => `• ${d.tipo}: ${d.multiplicador}x`)
        .join('\n')
      
      toast.info('Multiplicadores Ativos', {
        description: detalhes,
        duration: 4000,
      })
    }
  }

  /**
   * Recarrega o perfil
   */
  const recarregar = useCallback(() => {
    fetchPerfil()
  }, [fetchPerfil])

  // Carrega o perfil ao montar o componente
  useEffect(() => {
    fetchPerfil()
  }, [fetchPerfil])

  return {
    perfil,
    loading,
    error,
    registrarAvaliacaoCompleta,
    registrarAvaliacaoRapida,
    recarregar,
  }
}
