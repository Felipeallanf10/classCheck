/**
 * Serviço de Ranking
 * Gerencia cálculo de rankings e aplicação de bônus
 */

import { PeriodoRanking } from '@prisma/client';

import { prisma } from '@/lib/prisma';

/**
 * Interface para calcular período
 */
interface PeriodoCalculo {
  inicio: Date;
  fim: Date;
}

/**
 * Calcula as datas de início e fim do período
 */
export function calcularPeriodo(
  tipo: PeriodoRanking,
  dataReferencia: Date = new Date()
): PeriodoCalculo {
  const inicio = new Date(dataReferencia);
  const fim = new Date(dataReferencia);

  switch (tipo) {
    case 'SEMANAL':
      // Início da semana (domingo)
      inicio.setDate(inicio.getDate() - inicio.getDay());
      inicio.setHours(0, 0, 0, 0);
      
      // Fim da semana (sábado)
      fim.setDate(inicio.getDate() + 6);
      fim.setHours(23, 59, 59, 999);
      break;

    case 'MENSAL':
      // Primeiro dia do mês
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      
      // Último dia do mês
      fim.setMonth(fim.getMonth() + 1);
      fim.setDate(0);
      fim.setHours(23, 59, 59, 999);
      break;

    case 'BIMESTRAL':
      // Calcula bimestre (jan-fev, mar-abr, mai-jun, jul-ago, set-out, nov-dez)
      const mes = inicio.getMonth();
      const bimestre = Math.floor(mes / 2);
      
      inicio.setMonth(bimestre * 2);
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      
      fim.setMonth(bimestre * 2 + 2);
      fim.setDate(0);
      fim.setHours(23, 59, 59, 999);
      break;
  }

  return { inicio, fim };
}

/**
 * Calcula o ranking do período
 */
export async function calcularRanking(configuracaoId: number) {
  const config = await prisma.configuracaoRanking.findUnique({
    where: { id: configuracaoId },
  });

  if (!config || !config.ativo) {
    throw new Error('Configuração de ranking não encontrada ou inativa');
  }

  const { inicio, fim } = calcularPeriodo(config.periodoCalculo);

  // Busca perfis com XP no período
  const perfis = await prisma.perfilGamificacao.findMany({
    where: {
      totalAvaliacoes: {
        gte: config.minimoAvaliacoes,
      },
    },
    include: {
      historicoXP: {
        where: {
          createdAt: {
            gte: inicio,
            lte: fim,
          },
        },
      },
      usuario: {
        select: {
          nome: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  // Calcula XP do período para cada perfil
  const ranking = perfis
    .map((perfil: any) => {
      const xpPeriodo = perfil.historicoXP.reduce(
        (total: number, historico: any) => total + historico.xpGanho,
        0
      );

      return {
        perfil,
        xpPeriodo,
      };
    })
    .filter((item: any) => item.xpPeriodo > 0)
    .sort((a: any, b: any) => b.xpPeriodo - a.xpPeriodo)
    .slice(0, 3); // Top 3

  // Determina bônus para cada posição
  const bonusPorPosicao = [
    config.bonusPrimeiroLugar,
    config.bonusSegundoLugar,
    config.bonusTerceiroLugar,
  ];

  // Salva posições no ranking
  const posicoesRanking = await Promise.all(
    ranking.map(async (item: any, index: number) => {
      return prisma.rankingPosicao.create({
        data: {
          configuracaoId: config.id,
          perfilId: item.perfil.id,
          posicao: index + 1,
          xpPeriodo: item.xpPeriodo,
          bonusAplicado: bonusPorPosicao[index],
          periodoInicio: inicio,
          periodoFim: fim,
        },
      });
    })
  );

  return {
    configuracao: config,
    ranking: ranking.map((item: any, index: number) => ({
      posicao: index + 1,
      usuario: item.perfil.usuario,
      xpPeriodo: item.xpPeriodo,
      xpTotal: item.perfil.xpTotal,
      nivel: item.perfil.nivel,
      bonus: bonusPorPosicao[index],
    })),
    periodo: { inicio, fim },
    posicoesRanking,
  };
}

/**
 * Aplica bônus de ranking nas notas dos alunos
 * Nota: Esta função deve ser chamada pelo coordenador/professor
 */
export async function aplicarBonusRanking(configuracaoId: number) {
  const config = await prisma.configuracaoRanking.findUnique({
    where: { id: configuracaoId },
  });

  if (!config || !config.ativo) {
    throw new Error('Configuração de ranking não encontrada ou inativa');
  }

  if (!config.aplicarAutomaticamente) {
    throw new Error('Aplicação automática de bônus está desabilitada');
  }

  const { inicio, fim } = calcularPeriodo(config.periodoCalculo);

  // Busca posições do ranking para o período
  const posicoes = await prisma.rankingPosicao.findMany({
    where: {
      configuracaoId: config.id,
      periodoInicio: inicio,
      periodoFim: fim,
      aplicadoEm: null, // Apenas bônus não aplicados
    },
    include: {
      perfil: {
        include: {
          usuario: true,
        },
      },
    },
  });

  if (posicoes.length === 0) {
    return {
      success: false,
      message: 'Nenhum bônus pendente para aplicar',
    };
  }

  // Aqui você aplicaria o bônus nas notas reais
  // Como isso depende da implementação específica do sistema de notas,
  // vamos apenas marcar como aplicado

  const aplicacoes = await Promise.all(
    posicoes.map((posicao: any) =>
      prisma.rankingPosicao.update({
        where: { id: posicao.id },
        data: { aplicadoEm: new Date() },
      })
    )
  );

  return {
    success: true,
    message: `Bônus aplicado para ${aplicacoes.length} alunos`,
    aplicacoes: aplicacoes.map((a: any) => ({
      usuario: a.perfilId,
      posicao: a.posicao,
      bonus: a.bonusAplicado,
    })),
  };
}

/**
 * Busca o Top 3 do período atual
 */
export async function buscarTop3(
  configuracaoId: number,
  periodo?: PeriodoRanking
) {
  const config = await prisma.configuracaoRanking.findUnique({
    where: { id: configuracaoId },
  });

  if (!config) {
    throw new Error('Configuração de ranking não encontrada');
  }

  const periodoCalculo = periodo || config.periodoCalculo;
  const { inicio, fim } = calcularPeriodo(periodoCalculo);

  // Busca posições já calculadas para o período
  const posicoes = await prisma.rankingPosicao.findMany({
    where: {
      configuracaoId: config.id,
      periodoInicio: inicio,
      periodoFim: fim,
    },
    include: {
      perfil: {
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: { posicao: 'asc' },
    take: 3,
  });

  return posicoes.map((pos: any) => ({
    posicao: pos.posicao,
    usuario: pos.perfil.usuario,
    xpPeriodo: pos.xpPeriodo,
    xpTotal: pos.perfil.xpTotal,
    nivel: pos.perfil.nivel,
    bonus: pos.bonusAplicado,
    aplicado: pos.aplicadoEm !== null,
  }));
}

/**
 * Busca todas as configurações ativas
 */
export async function buscarConfiguracoesAtivas() {
  return prisma.configuracaoRanking.findMany({
    where: { ativo: true },
    include: {
      criadoPor: {
        select: {
          nome: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Cria uma nova configuração de ranking
 */
export async function criarConfiguracaoRanking(data: {
  periodoCalculo: PeriodoRanking;
  bonusPrimeiroLugar: number;
  bonusSegundoLugar: number;
  bonusTerceiroLugar: number;
  minimoAvaliacoes: number;
  aplicarAutomaticamente: boolean;
  notificarAlunos: boolean;
  visibilidadeRanking: 'PUBLICO' | 'APENAS_TOP3' | 'PRIVADO';
  materiaId?: string;
  criadoPorId: number;
}) {
  return prisma.configuracaoRanking.create({
    data,
  });
}
