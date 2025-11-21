/**
 * @file log-adaptativo-service.ts
 * @description Serviço para registrar logs técnicos de adaptação (CAT/IRT)
 * @author ClassCheck v3.0
 * @date 2025-11-02
 */

import { prisma } from '@/lib/prisma';

export interface RegistroLogAdaptativo {
  sessaoId: string;
  usuarioId: number;
  perguntaId: string;
  perguntaBancoId?: string;
  regraAplicada: string;
  motivoSelecao?: string;
  algoritmo?: 'IRT' | 'REGRA' | 'HIBRIDO' | 'ALEATORIO';
  thetaAtual?: number;
  informacaoFisher?: number;
  parametroA?: number;
  parametroB?: number;
  parametroC?: number;
  perguntasDisponiveis?: number;
  categoria?: string;
  dominio?: string;
  respostaValor?: any;
  thetaAposResposta?: number;
  erroAposResposta?: number;
  gatilhosAtivados?: string[];
  condicoesAvaliadas?: any;
  ordem: number;
  tempoDecisao?: number;
  cacheHit?: boolean;
  fonte?: string;
}

/**
 * Registra log de decisão adaptativa
 */
export async function registrarLogAdaptativo(
  dados: RegistroLogAdaptativo
): Promise<void> {
  try {
    await prisma.logAdaptativo.create({
      data: {
        sessaoId: dados.sessaoId,
        usuarioId: dados.usuarioId,
        perguntaId: dados.perguntaId,
        perguntaBancoId: dados.perguntaBancoId,
        regraAplicada: dados.regraAplicada,
        motivoSelecao: dados.motivoSelecao,
        algoritmo: dados.algoritmo || 'IRT',
        thetaAtual: dados.thetaAtual,
        informacaoFisher: dados.informacaoFisher,
        parametroA: dados.parametroA,
        parametroB: dados.parametroB,
        parametroC: dados.parametroC,
        perguntasDisponiveis: dados.perguntasDisponiveis,
        categoria: dados.categoria,
        dominio: dados.dominio,
        respostaValor: dados.respostaValor,
        thetaAposResposta: dados.thetaAposResposta,
        erroAposResposta: dados.erroAposResposta,
        gatilhosAtivados: dados.gatilhosAtivados || [],
        condicoesAvaliadas: dados.condicoesAvaliadas,
        ordem: dados.ordem,
        tempoDecisao: dados.tempoDecisao,
        cacheHit: dados.cacheHit || false,
        fonte: dados.fonte,
      },
    });

    console.log(`[LogAdaptativo] Registrado log para pergunta ${dados.perguntaId} na sessão ${dados.sessaoId}`);
  } catch (error) {
    console.error('[registrarLogAdaptativo] Erro ao registrar log:', error);
    // Não interromper fluxo principal se log falhar
  }
}

/**
 * Busca logs de uma sessão
 */
export async function buscarLogsSessao(sessaoId: string) {
  return await prisma.logAdaptativo.findMany({
    where: { sessaoId },
    orderBy: { ordem: 'asc' },
  });
}

/**
 * Busca logs de um usuário em um período
 */
export async function buscarLogsUsuario(
  usuarioId: number,
  inicio: Date,
  fim: Date
) {
  return await prisma.logAdaptativo.findMany({
    where: {
      usuarioId,
      timestamp: {
        gte: inicio,
        lte: fim,
      },
    },
    orderBy: { timestamp: 'desc' },
  });
}

/**
 * Estatísticas de algoritmos usados
 */
export async function estatisticasAlgoritmos(periodo?: { inicio: Date; fim: Date }) {
  const where = periodo
    ? {
        timestamp: {
          gte: periodo.inicio,
          lte: periodo.fim,
        },
      }
    : {};

  const logs = await prisma.logAdaptativo.findMany({
    where,
    select: {
      algoritmo: true,
      regraAplicada: true,
    },
  });

  const estatisticas = logs.reduce((acc, log) => {
    const alg = log.algoritmo || 'DESCONHECIDO';
    acc[alg] = (acc[alg] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return estatisticas;
}

/**
 * Análise de performance de seleção
 */
export async function analisarPerformanceSelecao(sessaoId: string) {
  const logs = await prisma.logAdaptativo.findMany({
    where: { sessaoId },
    orderBy: { ordem: 'asc' },
  });

  const tempoMedio = logs.length > 0
    ? logs.reduce((sum, log) => sum + (log.tempoDecisao || 0), 0) / logs.length
    : 0;

  const informacaoMedia = logs.length > 0
    ? logs
        .filter(log => log.informacaoFisher !== null)
        .reduce((sum, log) => sum + (log.informacaoFisher || 0), 0) /
      logs.filter(log => log.informacaoFisher !== null).length
    : 0;

  const cacheHitRate = logs.length > 0
    ? (logs.filter(log => log.cacheHit).length / logs.length) * 100
    : 0;

  return {
    totalPerguntas: logs.length,
    tempoMedioDecisao: tempoMedio,
    informacaoMediaFisher: informacaoMedia,
    cacheHitRate,
    distribuicaoFontes: logs.reduce((acc, log) => {
      const fonte = log.fonte || 'DESCONHECIDA';
      acc[fonte] = (acc[fonte] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
