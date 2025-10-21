/**
 * Serviço de XP
 * Gerencia a lógica de negócio para ganho de XP e progressão
 */

import {
  TABELA_XP,
  calcularNivel,
  calcularXPComMultiplicadores,
  ehFimDeSemana,
} from './xp-calculator';

import { prisma } from '@/lib/prisma';
import { verificarConquistas } from './conquistas-service';

/**
 * Interface para adicionar XP
 */
interface AdicionarXPParams {
  usuarioId: number;
  acao: keyof typeof TABELA_XP;
  aulaId?: number;
  descricao?: string;
}

/**
 * Interface de resposta ao adicionar XP
 */
interface AdicionarXPResponse {
  xpGanho: number;
  xpTotal: number;
  nivelAtual: number;
  nivelAnterior: number;
  subiuNivel: boolean;
  multiplicadorAplicado: number;
  detalhesMultiplicadores: Array<{ tipo: string; multiplicador: number }>;
  streakAtual: number;
}

/**
 * Adiciona XP para um usuário
 */
export async function adicionarXP(
  params: AdicionarXPParams
): Promise<AdicionarXPResponse> {
  const { usuarioId, acao, aulaId, descricao } = params;

  // Busca ou cria perfil de gamificação
  let perfil = await prisma.perfilGamificacao.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    perfil = await prisma.perfilGamificacao.create({
      data: {
        usuarioId,
        xpTotal: 0,
        nivel: 1,
        streakAtual: 0,
        melhorStreak: 0,
        totalAvaliacoes: 0,
        avaliacoesConsecutivas: 0,
      },
    });
  }

  const nivelAnterior = perfil.nivel;
  const xpBase = TABELA_XP[acao];

  // Verifica se é primeira avaliação do dia
  const primeiraAvaliacaoDia = await ehPrimeiraAvaliacaoDoDia(usuarioId);

  // Calcula multiplicadores
  const { xpFinal, multiplicadorTotal, detalhes } = calcularXPComMultiplicadores({
    xpBase,
    primeiraAvaliacaoDia,
    streakAtivo: perfil.streakAtual > 0,
    fimDeSemana: ehFimDeSemana(),
    avaliacoesConsecutivas: perfil.avaliacoesConsecutivas,
  });

  // Atualiza XP total
  const novoXPTotal = perfil.xpTotal + xpFinal;
  const { nivel: novoNivel } = calcularNivel(novoXPTotal);

  // Atualiza streak
  const novoStreak = await atualizarStreak(usuarioId, perfil);

  const novasAvaliacoesConsecutivas = (() => {
    if (!primeiraAvaliacaoDia) {
      return perfil.avaliacoesConsecutivas;
    }

    if (novoStreak.reiniciou) {
      return 1;
    }

    return perfil.avaliacoesConsecutivas + 1;
  })();

  const agora = new Date();

  const dadosPerfil = {
    xpTotal: novoXPTotal,
    nivel: novoNivel,
    streakAtual: novoStreak.streakAtual,
    melhorStreak: novoStreak.melhorStreak,
    ultimaAtividade: agora,
    totalAvaliacoes: { increment: 1 },
    avaliacoesConsecutivas: novasAvaliacoesConsecutivas,
  };

  const dadosHistorico = {
    perfilId: perfil.id,
    xpGanho: xpFinal,
    acao,
    descricao: descricao || `Ganhou ${xpFinal} XP por ${acao}`,
    aulaId,
    multiplicador: multiplicadorTotal,
  };

  // Garante atomicidade entre atualização do perfil e histórico
  await prisma.$transaction([
    prisma.perfilGamificacao.update({
      where: { usuarioId },
      data: dadosPerfil,
    }),
    prisma.historicoXP.create({
      data: dadosHistorico,
    }),
  ]);

  // Verifica conquistas de forma assíncrona (não bloqueia a resposta)
  verificarConquistas({ usuarioId, acao }).catch((error) => {
    console.error('Erro ao verificar conquistas:', error);
  });

  return {
    xpGanho: xpFinal,
    xpTotal: novoXPTotal,
    nivelAtual: novoNivel,
    nivelAnterior,
    subiuNivel: novoNivel > nivelAnterior,
    multiplicadorAplicado: multiplicadorTotal,
    detalhesMultiplicadores: detalhes,
    streakAtual: novoStreak.streakAtual,
  };
}

/**
 * Verifica se é a primeira avaliação do dia
 */
async function ehPrimeiraAvaliacaoDoDia(usuarioId: number): Promise<boolean> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const perfil = await prisma.perfilGamificacao.findUnique({
    where: { usuarioId },
    select: { ultimaAtividade: true },
  });

  if (!perfil?.ultimaAtividade) {
    return true;
  }

  const ultimaAtividade = new Date(perfil.ultimaAtividade);
  ultimaAtividade.setHours(0, 0, 0, 0);

  return hoje > ultimaAtividade;
}

/**
 * Atualiza o streak do usuário
 */
async function atualizarStreak(
  usuarioId: number,
  perfil: {
    streakAtual: number;
    melhorStreak: number;
    ultimaAtividade: Date | null;
  }
): Promise<{ streakAtual: number; melhorStreak: number; reiniciou: boolean }> {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (!perfil.ultimaAtividade) {
    return {
      streakAtual: 1,
      melhorStreak: Math.max(1, perfil.melhorStreak),
      reiniciou: false,
    };
  }

  const ultimaAtividade = new Date(perfil.ultimaAtividade);
  ultimaAtividade.setHours(0, 0, 0, 0);

  const diferencaDias = Math.floor(
    (hoje.getTime() - ultimaAtividade.getTime()) / (1000 * 60 * 60 * 24)
  );

  let novoStreak = perfil.streakAtual;

  let reiniciou = false;

  if (diferencaDias === 0) {
    // Mesmo dia, mantém streak
    novoStreak = perfil.streakAtual;
  } else if (diferencaDias === 1) {
    // Dia consecutivo, incrementa streak
    novoStreak = perfil.streakAtual + 1;
  } else {
    // Quebrou o streak, reinicia
    novoStreak = 1;
    reiniciou = true;
  }

  const melhorStreak = Math.max(novoStreak, perfil.melhorStreak);

  return {
    streakAtual: novoStreak,
    melhorStreak,
    reiniciou,
  };
}

/**
 * Busca o perfil de gamificação do usuário
 */
export async function buscarPerfilGamificacao(usuarioId: number) {
  const perfil = await prisma.perfilGamificacao.findUnique({
    where: { usuarioId },
    include: {
      usuario: {
        select: {
          nome: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!perfil) {
    return null;
  }

  const infoNivel = calcularNivel(perfil.xpTotal);

  return {
    ...perfil,
    ...infoNivel,
  };
}

/**
 * Busca o histórico de XP do usuário
 */
export async function buscarHistoricoXP(usuarioId: number, limite: number = 20) {
  const perfil = await prisma.perfilGamificacao.findUnique({
    where: { usuarioId },
    select: { id: true },
  });

  if (!perfil) {
    return [];
  }

  return prisma.historicoXP.findMany({
    where: { perfilId: perfil.id },
    include: {
      aula: {
        select: {
          titulo: true,
          materia: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limite,
  });
}
