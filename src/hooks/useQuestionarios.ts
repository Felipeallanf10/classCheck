/**
 * Hook para buscar questionários usando TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import type { QuestionarioFiltros, QuestionariosResponse } from '@/types/questionario';

const fetchQuestionarios = async (filtros?: QuestionarioFiltros): Promise<QuestionariosResponse> => {
  const params = new URLSearchParams();

  if (filtros?.tipo) params.append('tipo', filtros.tipo);
  if (filtros?.categoria) params.append('categoria', filtros.categoria);
  if (filtros?.adaptativo !== undefined) params.append('adaptativo', String(filtros.adaptativo));
  if (filtros?.ativo !== undefined) params.append('ativo', String(filtros.ativo));
  if (filtros?.oficial !== undefined) params.append('oficial', String(filtros.oficial));

  const queryString = params.toString();
  const url = `/api/questionarios${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.erro || 'Erro ao buscar questionários');
  }

  return response.json();
};

export function useQuestionarios(filtros?: QuestionarioFiltros) {
  return useQuery({
    queryKey: ['questionarios', filtros],
    queryFn: () => fetchQuestionarios(filtros),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente cacheTime)
  });
}
