/**
 * Hook para buscar avaliações do usuário
 */

'use client';

import { useQuery } from '@tanstack/react-query';

export interface AvaliacaoAula {
  id: number;
  aulaId: number;
  aulaTitulo: string;
  aulaMateria: string;
  aulaData: Date;
  professor: string;
  professorId: number;
  data: Date;
  socioemocional: {
    valencia: number;
    ativacao: number;
    estadoPrimario: string;
    confianca: number;
    totalPerguntas: number;
  } | null;
  didatica: {
    compreensaoConteudo: number;
    ritmoAula: number;
    recursosDidaticos: number;
    engajamento: number;
    pontoPositivo: string | null;
    sugestao: string | null;
  } | null;
}

export interface AvaliacaoProfessor {
  id: number;
  professor: string;
  professorId: number;
  materia: string;
  periodo: string;
  data: Date;
  dominioConteudo: number;
  clarezaExplicacao: number;
  pontualidade: number;
  organizacao: number;
  acessibilidade: number;
  empatia: number;
  comentario: string | null;
}

export interface CheckIn {
  id: string;
  data: Date;
  scores: Record<string, number>;
}

export interface EstatisticasAvaliacoes {
  totalAvaliacoesAulas: number;
  totalCheckIns: number;
  totalAvaliacoesProfessores: number;
  sequenciaAtual: number;
  mediaHumor: number;
  disciplinaFavorita: string;
}

export interface MinhasAvaliacoesData {
  avaliacoesAulas: AvaliacaoAula[];
  avaliacoesProfessores: AvaliacaoProfessor[];
  checkIns: CheckIn[];
  estatisticas: EstatisticasAvaliacoes;
}

/**
 * Hook para buscar todas as avaliações do usuário
 */
export function useMinhasAvaliacoes(usuarioId: number) {
  return useQuery({
    queryKey: ['minhas-avaliacoes', usuarioId],
    queryFn: async (): Promise<MinhasAvaliacoesData> => {
      const response = await fetch(`/api/avaliacoes/minhas?usuarioId=${usuarioId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao buscar avaliações');
      }

      const data = await response.json();

      // Converter datas
      return {
        ...data,
        avaliacoesAulas: data.avaliacoesAulas.map((av: any) => ({
          ...av,
          aulaData: new Date(av.aulaData),
          data: new Date(av.data),
        })),
        avaliacoesProfessores: data.avaliacoesProfessores.map((av: any) => ({
          ...av,
          data: new Date(av.data),
        })),
        checkIns: data.checkIns.map((ci: any) => ({
          ...ci,
          data: new Date(ci.data),
        })),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });
}
