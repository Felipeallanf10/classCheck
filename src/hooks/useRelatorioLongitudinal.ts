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
  let inicio: Date;
  let fim: Date;

  // Se diasRetroativos for 90+ (trimestre ou semestre), busca desde início de novembro
  // Caso contrário, usa dias retroativos normais
  if (diasRetroativos >= 90) {
    // Busca desde 1º de novembro de 2025
    inicio = new Date(2025, 10, 1); // Mês 10 = novembro (zero-indexed)
    fim = hoje;
  } else if (diasRetroativos >= 30) {
    // Para período mensal, busca todo novembro
    inicio = new Date(2025, 10, 1);
    fim = new Date(2025, 10, 30, 23, 59, 59);
  } else {
    // Para períodos curtos (semana), usa dias retroativos
    inicio = subDays(hoje, diasRetroativos);
    fim = hoje;
  }

  const params = new URLSearchParams({
    usuarioId: usuarioId.toString(),
    periodoInicio: inicio.toISOString(),
    periodoFim: fim.toISOString(),
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
