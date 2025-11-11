/**
 * @file queries.ts
 * @description Funções de consulta e análise de dados do banco para relatórios analíticos
 * @author ClassCheck v3.0
 * @date 2025-11-02
 */

import { prisma } from '../prisma';
import { SessaoAdaptativa, RespostaSocioemocional, CategoriaPergunta } from '@prisma/client';

/**
 * Interface para período de análise
 */
export interface PeriodoAnalise {
  inicio: Date;
  fim: Date;
}

/**
 * Interface para sessão com respostas
 */
export interface SessaoComRespostas extends SessaoAdaptativa {
  respostas: RespostaSocioemocional[];
}

/**
 * Interface para scores por categoria
 */
export interface ScoresPorCategoria {
  categoria: CategoriaPergunta;
  score: number;
  count: number;
  media: number;
}

/**
 * Interface para tendência
 */
export interface Tendencia {
  categoria: CategoriaPergunta;
  direcao: 'ascendente' | 'descendente' | 'estavel';
  variacao: number; // percentual de mudança
  confianca: number; // 0-1
}

/**
 * Busca sessões de um usuário em um período específico
 * @param usuarioId ID do usuário
 * @param periodo Período de análise (início e fim)
 * @returns Array de sessões com respostas
 */
export async function buscarSessoesUsuario(
  usuarioId: number,
  periodo: PeriodoAnalise
): Promise<SessaoComRespostas[]> {
  try {
    const sessoes = await prisma.sessaoAdaptativa.findMany({
      where: {
        usuarioId,
        iniciadoEm: {
          gte: periodo.inicio,
          lte: periodo.fim,
        },
        status: 'FINALIZADA',
      },
      include: {
        respostas: {
          include: {
            pergunta: true,
            perguntaBanco: true,
          },
        },
      },
      orderBy: {
        iniciadoEm: 'asc',
      },
    });

    return sessoes as SessaoComRespostas[];
  } catch (error) {
    console.error('[buscarSessoesUsuario] Erro ao buscar sessões:', error);
    throw new Error('Falha ao buscar sessões do usuário');
  }
}

/**
 * Calcula scores agregados por categoria socioemocional
 * @param sessoes Array de sessões com respostas
 * @returns Array de scores por categoria
 */
export async function calcularScoresPorCategoria(
  sessoes: SessaoComRespostas[]
): Promise<ScoresPorCategoria[]> {
  const scoresPorCategoria = new Map<CategoriaPergunta, number[]>();

  // Agregar scores por categoria
  for (const sessao of sessoes) {
    for (const resposta of sessao.respostas) {
      const categoria = resposta.categoria;
      
      if (!categoria) continue;

      if (!scoresPorCategoria.has(categoria)) {
        scoresPorCategoria.set(categoria, []);
      }

      // Adicionar score da resposta (usar valorNumerico ou valorNormalizado)
      const score = resposta.valorNumerico || resposta.valorNormalizado || 0;
      scoresPorCategoria.get(categoria)!.push(score);
    }
  }

  // Calcular médias
  const resultado: ScoresPorCategoria[] = [];

  for (const [categoria, scores] of scoresPorCategoria.entries()) {
    const soma = scores.reduce((acc, score) => acc + score, 0);
    const count = scores.length;
    const media = count > 0 ? soma / count : 0;

    resultado.push({
      categoria,
      score: soma,
      count,
      media,
    });
  }

  return resultado.sort((a, b) => b.media - a.media);
}

/**
 * Calcula tendência de evolução por categoria
 * @param sessoes Array de sessões ordenadas por data
 * @returns Array de tendências por categoria
 */
export async function calcularTendencia(
  sessoes: SessaoComRespostas[]
): Promise<Tendencia[]> {
  if (sessoes.length < 2) {
    return [];
  }

  const metade = Math.floor(sessoes.length / 2);
  const sessoesAnteriores = sessoes.slice(0, metade);
  const sessoesRecentes = sessoes.slice(metade);

  const scoresAnteriores = await calcularScoresPorCategoria(sessoesAnteriores);
  const scoresRecentes = await calcularScoresPorCategoria(sessoesRecentes);

  const tendencias: Tendencia[] = [];

  // Mapear scores anteriores
  const mapAnteriores = new Map(
    scoresAnteriores.map(s => [s.categoria, s.media])
  );

  for (const scoreRecente of scoresRecentes) {
    const mediaAnterior = mapAnteriores.get(scoreRecente.categoria) || 0;
    const mediaRecente = scoreRecente.media;

    const variacao = mediaAnterior > 0 
      ? ((mediaRecente - mediaAnterior) / mediaAnterior) * 100 
      : 0;

    let direcao: 'ascendente' | 'descendente' | 'estavel';
    
    if (Math.abs(variacao) < 5) {
      direcao = 'estavel';
    } else if (variacao > 0) {
      direcao = 'ascendente';
    } else {
      direcao = 'descendente';
    }

    // Calcular confiança baseada no número de amostras
    const confianca = Math.min(
      (scoreRecente.count + (mapAnteriores.get(scoreRecente.categoria) || 0)) / 20,
      1.0
    );

    tendencias.push({
      categoria: scoreRecente.categoria,
      direcao,
      variacao,
      confianca,
    });
  }

  return tendencias;
}

/**
 * Busca histórico de theta (habilidade estimada) do usuário
 * @param usuarioId ID do usuário
 * @param limite Número máximo de registros
 * @returns Array de valores theta ordenados por data
 */
export async function buscarHistoricoTheta(
  usuarioId: number,
  limite: number = 30
): Promise<Array<{ data: Date; theta: number; sessaoId: string }>> {
  try {
    const sessoes = await prisma.sessaoAdaptativa.findMany({
      where: {
        usuarioId,
        status: 'FINALIZADA',
        thetaEstimado: { not: null },
      },
      select: {
        id: true,
        thetaEstimado: true,
        iniciadoEm: true,
      },
      orderBy: {
        iniciadoEm: 'desc',
      },
      take: limite,
    });

    return sessoes
      .map((s) => ({
        data: s.iniciadoEm,
        theta: s.thetaEstimado ?? 0,
        sessaoId: s.id,
      }))
      .reverse();
  } catch (error) {
    console.error('[buscarHistoricoTheta] Erro:', error);
    return [];
  }
}

/**
 * Calcula estatísticas agregadas de um usuário
 * @param usuarioId ID do usuário
 * @param periodo Período de análise
 * @returns Objeto com estatísticas agregadas
 */
export async function calcularEstatisticasUsuario(
  usuarioId: number,
  periodo: PeriodoAnalise
) {
  const sessoes = await buscarSessoesUsuario(usuarioId, periodo);
  
  const totalSessoes = sessoes.length;
  const totalRespostas = sessoes.reduce((acc, s) => acc + s.respostas.length, 0);
  
  const thetaValues = sessoes
    .map(s => s.thetaEstimado)
    .filter((t): t is number => t !== null);
  
  const thetaMedio = thetaValues.length > 0
    ? thetaValues.reduce((acc, t) => acc + t, 0) / thetaValues.length
    : 0;

  const scoresPorCategoria = await calcularScoresPorCategoria(sessoes);
  const tendencias = await calcularTendencia(sessoes);

  return {
    totalSessoes,
    totalRespostas,
    thetaMedio,
    scoresPorCategoria,
    tendencias,
    ultimaSessao: sessoes[sessoes.length - 1],
  };
}
