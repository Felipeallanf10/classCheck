/**
 * Sistema de Cálculo de XP
 * Gerencia o cálculo de pontos de experiência e níveis
 */

// Tabela de XP por ação
export const TABELA_XP = {
  AVALIACAO_COMPLETA: 100,
  AVALIACAO_RAPIDA: 50,
  PRIMEIRO_DIA: 20,
  STREAK_5_DIAS: 50,
  STREAK_10_DIAS: 100,
  STREAK_30_DIAS: 300,
} as const;

// Multiplicadores de XP
export const MULTIPLICADORES = {
  PRIMEIRA_AVALIACAO_DIA: 1.5,
  STREAK_ATIVO: 1.2,
  FIM_DE_SEMANA: 1.3,
  AVALIACOES_CONSECUTIVAS: 1.1,
} as const;

// Níveis e requisitos de XP
export const NIVEIS = [
  { nivel: 1, xpMinimo: 0, xpProximo: 100 },
  { nivel: 2, xpMinimo: 100, xpProximo: 250 },
  { nivel: 3, xpMinimo: 250, xpProximo: 500 },
  { nivel: 4, xpMinimo: 500, xpProximo: 850 },
  { nivel: 5, xpMinimo: 850, xpProximo: 1300 },
  { nivel: 6, xpMinimo: 1300, xpProximo: 1900 },
  { nivel: 7, xpMinimo: 1900, xpProximo: 2600 },
  { nivel: 8, xpMinimo: 2600, xpProximo: 3500 },
  { nivel: 9, xpMinimo: 3500, xpProximo: 4600 },
  { nivel: 10, xpMinimo: 4600, xpProximo: 6000 },
] as const;

/**
 * Calcula o nível baseado no XP total
 */
export function calcularNivel(xpTotal: number): {
  nivel: number;
  xpAtual: number;
  xpProximoNivel: number;
  progresso: number;
} {
  let nivelAtual = 1;
  
  for (const nivel of NIVEIS) {
    if (xpTotal >= nivel.xpMinimo) {
      nivelAtual = nivel.nivel;
    } else {
      break;
    }
  }

  const infoNivel = NIVEIS.find(n => n.nivel === nivelAtual) || NIVEIS[0];
  const xpAtual = xpTotal - infoNivel.xpMinimo;
  const xpProximoNivel = infoNivel.xpProximo - infoNivel.xpMinimo;
  const progresso = (xpAtual / xpProximoNivel) * 100;

  return {
    nivel: nivelAtual,
    xpAtual,
    xpProximoNivel,
    progresso: Math.min(progresso, 100),
  };
}

/**
 * Calcula o XP ganho com multiplicadores aplicados
 */
export function calcularXPComMultiplicadores(params: {
  xpBase: number;
  primeiraAvaliacaoDia: boolean;
  streakAtivo: boolean;
  fimDeSemana: boolean;
  avaliacoesConsecutivas: number;
}): {
  xpFinal: number;
  multiplicadorTotal: number;
  detalhes: Array<{ tipo: string; multiplicador: number }>;
} {
  let multiplicadorTotal = 1.0;
  const detalhes: Array<{ tipo: string; multiplicador: number }> = [];

  if (params.primeiraAvaliacaoDia) {
    multiplicadorTotal *= MULTIPLICADORES.PRIMEIRA_AVALIACAO_DIA;
    detalhes.push({
      tipo: 'Primeira avaliação do dia',
      multiplicador: MULTIPLICADORES.PRIMEIRA_AVALIACAO_DIA,
    });
  }

  if (params.streakAtivo) {
    multiplicadorTotal *= MULTIPLICADORES.STREAK_ATIVO;
    detalhes.push({
      tipo: 'Streak ativo',
      multiplicador: MULTIPLICADORES.STREAK_ATIVO,
    });
  }

  if (params.fimDeSemana) {
    multiplicadorTotal *= MULTIPLICADORES.FIM_DE_SEMANA;
    detalhes.push({
      tipo: 'Final de semana',
      multiplicador: MULTIPLICADORES.FIM_DE_SEMANA,
    });
  }

  if (params.avaliacoesConsecutivas >= 3) {
    multiplicadorTotal *= MULTIPLICADORES.AVALIACOES_CONSECUTIVAS;
    detalhes.push({
      tipo: 'Avaliações consecutivas',
      multiplicador: MULTIPLICADORES.AVALIACOES_CONSECUTIVAS,
    });
  }

  const xpFinal = Math.round(params.xpBase * multiplicadorTotal);

  return {
    xpFinal,
    multiplicadorTotal,
    detalhes,
  };
}

/**
 * Verifica se é fim de semana
 */
export function ehFimDeSemana(data: Date = new Date()): boolean {
  const diaSemana = data.getDay();
  return diaSemana === 0 || diaSemana === 6;
}

/**
 * Formata XP para exibição
 */
export function formatarXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`;
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`;
  }
  return xp.toString();
}
