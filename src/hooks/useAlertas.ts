/**
 * Hook para gerenciar alertas com TanStack Query
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Alerta, AlertaFiltros, ResumoAlertas } from '@/types/alerta';

interface UseAlertasOptions {
  filtros?: AlertaFiltros;
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * Hook para buscar lista de alertas
 */
export function useAlertas(options: UseAlertasOptions = {}) {
  const { filtros, enabled = true, refetchInterval } = options;

  return useQuery({
    queryKey: ['alertas', filtros],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filtros?.nivel?.length) {
        params.append('nivel', filtros.nivel.join(','));
      }
      if (filtros?.tipo?.length) {
        params.append('tipo', filtros.tipo.join(','));
      }
      if (filtros?.status?.length) {
        params.append('status', filtros.status.join(','));
      }
      if (filtros?.sessaoId) {
        params.append('sessaoId', filtros.sessaoId);
      }
      if (filtros?.usuarioId) {
        params.append('usuarioId', filtros.usuarioId);
      }

      const response = await fetch(`/api/alertas?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao buscar alertas');
      }

      const data = await response.json();
      return data.alertas || []; // Extrair array de alertas do objeto de resposta
    },
    enabled,
    refetchInterval,
  });
}

/**
 * Hook para buscar um alerta específico
 */
export function useAlerta(alertaId: string, enabled = true) {
  return useQuery({
    queryKey: ['alerta', alertaId],
    queryFn: async () => {
      const response = await fetch(`/api/alertas/${alertaId}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar alerta');
      }

      return response.json() as Promise<Alerta>;
    },
    enabled: enabled && !!alertaId,
  });
}

/**
 * Hook para buscar resumo de alertas
 */
export function useResumoAlertas(usuarioId?: string) {
  return useQuery({
    queryKey: ['alertas', 'resumo', usuarioId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (usuarioId) {
        params.append('usuarioId', usuarioId);
      }

      const response = await fetch(`/api/alertas/resumo?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar resumo de alertas');
      }

      return response.json() as Promise<ResumoAlertas>;
    },
    refetchInterval: 30000, // Atualiza a cada 30s
  });
}

/**
 * Hook para marcar alerta como visualizado
 */
export function useMarcarAlertaVisualizado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertaId: string) => {
      const response = await fetch(`/api/alertas/${alertaId}/visualizar`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Erro ao marcar alerta como visualizado');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas', 'resumo'] });
    },
  });
}

/**
 * Hook para atualizar status do alerta
 */
export function useAtualizarStatusAlerta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      alertaId,
      status,
    }: {
      alertaId: string;
      status: string;
    }) => {
      const response = await fetch(`/api/alertas/${alertaId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do alerta');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      queryClient.invalidateQueries({ queryKey: ['alertas', 'resumo'] });
    },
  });
}

/**
 * Hook para buscar ajuda (envia notificação para responsáveis)
 */
export function useBuscarAjuda() {
  return useMutation({
    mutationFn: async ({
      alertaId,
      mensagem,
    }: {
      alertaId: string;
      mensagem?: string;
    }) => {
      const response = await fetch(`/api/alertas/${alertaId}/buscar-ajuda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem }),
      });

      if (!response.ok) {
        throw new Error('Erro ao solicitar ajuda');
      }

      return response.json();
    },
  });
}
