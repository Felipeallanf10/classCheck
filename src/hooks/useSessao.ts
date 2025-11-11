/**
 * Hook para gerenciar sessão de avaliação
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SessaoDetalhes } from '@/types/sessao';
import type { ValorResposta } from '@/types/pergunta';

interface SubmeterRespostaParams {
  sessaoId: string;
  perguntaId: string;
  resposta: ValorResposta;
  tempoResposta?: number;
}

interface AtualizarSessaoParams {
  sessaoId: string;
  acao: 'pausar' | 'retomar' | 'finalizar';
}

/**
 * Hook para buscar detalhes da sessão
 */
export function useSessao(sessaoId: string, enabled = true) {
  return useQuery({
    queryKey: ['sessao', sessaoId],
    queryFn: async () => {
      const response = await fetch(`/api/sessoes/${sessaoId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao buscar sessão');
      }

      const responseData = await response.json();
      
      // A API retorna { success: true, sessao: {...} }
      const data = responseData.sessao || responseData;
      
      // Converter datas
      return {
        ...data,
        iniciadoEm: new Date(data.iniciadoEm),
        pausadoEm: data.pausadoEm ? new Date(data.pausadoEm) : null,
        finalizadoEm: data.finalizadoEm ? new Date(data.finalizadoEm) : null,
      } as SessaoDetalhes;
    },
    enabled: enabled && !!sessaoId,
    refetchInterval: false, // Desabilita auto-refresh automático
    staleTime: 2000, // Considera dados frescos por 2 segundos
  });
}

/**
 * Hook para submeter resposta
 */
export function useSubmeterResposta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessaoId,
      perguntaId,
      resposta,
      tempoResposta = 10,
    }: SubmeterRespostaParams) => {
      const response = await fetch(`/api/sessoes/${sessaoId}/resposta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perguntaId,
          valor: resposta, // Corrigido: API espera 'valor', não 'resposta'
          tempoResposta,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || error.error || 'Erro ao submeter resposta');
      }

      return response.json();
    },
    onSuccess: async (_, variables) => {
      // Invalida e refetch imediato da sessão para atualizar
      await queryClient.invalidateQueries({ queryKey: ['sessao', variables.sessaoId] });
      await queryClient.refetchQueries({ queryKey: ['sessao', variables.sessaoId] });
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
}

/**
 * Hook para pausar/retomar/finalizar sessão
 */
export function useAtualizarSessao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessaoId, acao }: AtualizarSessaoParams) => {
      const response = await fetch(`/api/sessoes/${sessaoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: acao }), // Corrigido: API espera 'action', não 'acao'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || error.error || `Erro ao ${acao} sessão`);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessao', variables.sessaoId] });
    },
  });
}

/**
 * Hook para calcular tempo decorrido
 */
export function useTempoDecorrido(iniciadoEm?: Date, pausadoEm?: Date | null) {
  const [tempo, setTempo] = React.useState(0);

  React.useEffect(() => {
    if (!iniciadoEm) return;

    const calcularTempo = () => {
      const agora = pausadoEm || new Date();
      const diff = agora.getTime() - iniciadoEm.getTime();
      setTempo(Math.floor(diff / 1000)); // em segundos
    };

    // Calcula imediatamente
    calcularTempo();

    // Atualiza a cada segundo se não estiver pausado
    if (!pausadoEm) {
      const interval = setInterval(calcularTempo, 1000);
      return () => clearInterval(interval);
    }
  }, [iniciadoEm, pausadoEm]);

  return tempo;
}

// Adicionar import do React que estava faltando
import React from 'react';
