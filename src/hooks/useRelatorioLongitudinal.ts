/**
 * Hook para buscar dados de relatório longitudinal
 * Retorna evolução temporal das avaliações do usuário
 */

import { useQuery } from '@tanstack/react-query';
import { format, subDays, parseISO } from 'date-fns';

export interface DadoTemporal {
  data: string;
  valencia: number;
  ativacao: number;
  confianca: number;
  estadoPrimario: string;
  totalAvaliacoes: number;
}

export interface RelatorioLongitudinalData {
  dadosTemporais: DadoTemporal[];
  estatisticas: {
    valenciaMedia: number;
    ativacaoMedia: number;
    confiancaMedia: number;
    tendencia: 'crescente' | 'estavel' | 'decrescente';
    variacaoPercentual: number;
  };
  periodo: {
    inicio: Date;
    fim: Date;
  };
}

async function fetchRelatorioLongitudinal(
  usuarioId: number,
  diasRetroativos: number = 30
): Promise<RelatorioLongitudinalData> {
  const hoje = new Date();
  const inicio = subDays(hoje, diasRetroativos);

  const params = new URLSearchParams({
    usuarioId: usuarioId.toString(),
    periodoInicio: inicio.toISOString(),
    periodoFim: hoje.toISOString(),
  });

  const response = await fetch(`/api/analytics/relatorio-longitudinal?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao buscar relatório longitudinal');
  }

  return response.json();
}

export function useRelatorioLongitudinal(
  usuarioId: number,
  diasRetroativos: number = 30
) {
  return useQuery({
    queryKey: ['relatorio-longitudinal', usuarioId, diasRetroativos],
    queryFn: () => fetchRelatorioLongitudinal(usuarioId, diasRetroativos),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
