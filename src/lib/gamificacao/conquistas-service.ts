/**
 * Serviço de Conquistas
 * Gerencia verificação e desbloqueio de conquistas
 */

import { prisma } from '@/lib/prisma';

/**
 * Interface para verificar conquistas
 */
interface VerificarConquistasParams {
  usuarioId: number;
  acao?: string;
}

/**
 * Tipos de conquistas disponíveis
 */
export const TIPOS_CONQUISTA = {
  // Conquistas de XP
  PRIMEIRO_XP: 'PRIMEIRO_XP',
  XP_100: 'XP_100',
  XP_500: 'XP_500',
  XP_1000: 'XP_1000',
  XP_5000: 'XP_5000',
  
  // Conquistas de Nível
  NIVEL_5: 'NIVEL_5',
  NIVEL_10: 'NIVEL_10',
  NIVEL_20: 'NIVEL_20',
  NIVEL_50: 'NIVEL_50',
  
  // Conquistas de Streak
  STREAK_3: 'STREAK_3',
  STREAK_7: 'STREAK_7',
  STREAK_14: 'STREAK_14',
  STREAK_30: 'STREAK_30',
  
  // Conquistas de Avaliações
  PRIMEIRA_AVALIACAO: 'PRIMEIRA_AVALIACAO',
  AVALIACOES_10: 'AVALIACOES_10',
  AVALIACOES_50: 'AVALIACOES_50',
  AVALIACOES_100: 'AVALIACOES_100',
  
  // Conquistas Especiais
  MADRUGADOR: 'MADRUGADOR', // Avaliação antes das 7h
  NOTURNO: 'NOTURNO', // Avaliação depois das 22h
  FIM_DE_SEMANA: 'FIM_DE_SEMANA', // Avaliar no fim de semana
  PERFEITO: 'PERFEITO', // 7 dias seguidos com avaliações
  TOP_3: 'TOP_3', // Ficar no Top 3 do ranking
};

/**
 * Verifica e desbloqueia conquistas para um usuário
 */
export async function verificarConquistas(
  params: VerificarConquistasParams
): Promise<any[]> {
  const { usuarioId, acao } = params;

  // Busca perfil
  const perfil = await prisma.perfilGamificacao.findUnique({
    where: { usuarioId },
    include: {
      conquistasDesbloqueadas: {
        include: {
          conquista: true,
        },
      },
    },
  });

  if (!perfil) {
    return [];
  }

  const conquistasDesbloqueadas: any[] = [];

  // Conquistas de XP
  if (perfil.xpTotal >= 100 && !temConquista(perfil, 'XP_100')) {
    const conquista = await desbloquearConquista(usuarioId, 'XP_100');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.xpTotal >= 500 && !temConquista(perfil, 'XP_500')) {
    const conquista = await desbloquearConquista(usuarioId, 'XP_500');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.xpTotal >= 1000 && !temConquista(perfil, 'XP_1000')) {
    const conquista = await desbloquearConquista(usuarioId, 'XP_1000');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.xpTotal >= 5000 && !temConquista(perfil, 'XP_5000')) {
    const conquista = await desbloquearConquista(usuarioId, 'XP_5000');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }

  // Conquistas de Nível
  if (perfil.nivel >= 5 && !temConquista(perfil, 'NIVEL_5')) {
    const conquista = await desbloquearConquista(usuarioId, 'NIVEL_5');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.nivel >= 10 && !temConquista(perfil, 'NIVEL_10')) {
    const conquista = await desbloquearConquista(usuarioId, 'NIVEL_10');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.nivel >= 20 && !temConquista(perfil, 'NIVEL_20')) {
    const conquista = await desbloquearConquista(usuarioId, 'NIVEL_20');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.nivel >= 50 && !temConquista(perfil, 'NIVEL_50')) {
    const conquista = await desbloquearConquista(usuarioId, 'NIVEL_50');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }

  // Conquistas de Streak
  if (perfil.streakAtual >= 3 && !temConquista(perfil, 'STREAK_3')) {
    const conquista = await desbloquearConquista(usuarioId, 'STREAK_3');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.streakAtual >= 7 && !temConquista(perfil, 'STREAK_7')) {
    const conquista = await desbloquearConquista(usuarioId, 'STREAK_7');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.streakAtual >= 14 && !temConquista(perfil, 'STREAK_14')) {
    const conquista = await desbloquearConquista(usuarioId, 'STREAK_14');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.streakAtual >= 30 && !temConquista(perfil, 'STREAK_30')) {
    const conquista = await desbloquearConquista(usuarioId, 'STREAK_30');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }

  // Conquistas de Avaliações
  if (perfil.totalAvaliacoes === 1 && !temConquista(perfil, 'PRIMEIRA_AVALIACAO')) {
    const conquista = await desbloquearConquista(usuarioId, 'PRIMEIRA_AVALIACAO');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.totalAvaliacoes >= 10 && !temConquista(perfil, 'AVALIACOES_10')) {
    const conquista = await desbloquearConquista(usuarioId, 'AVALIACOES_10');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.totalAvaliacoes >= 50 && !temConquista(perfil, 'AVALIACOES_50')) {
    const conquista = await desbloquearConquista(usuarioId, 'AVALIACOES_50');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }
  
  if (perfil.totalAvaliacoes >= 100 && !temConquista(perfil, 'AVALIACOES_100')) {
    const conquista = await desbloquearConquista(usuarioId, 'AVALIACOES_100');
    if (conquista) conquistasDesbloqueadas.push(conquista);
  }

  // Conquistas especiais baseadas na hora
  if (acao === 'AVALIAR_AULA') {
    const hora = new Date().getHours();
    
    if (hora < 7 && !temConquista(perfil, 'MADRUGADOR')) {
      const conquista = await desbloquearConquista(usuarioId, 'MADRUGADOR');
      if (conquista) conquistasDesbloqueadas.push(conquista);
    }
    
    if (hora >= 22 && !temConquista(perfil, 'NOTURNO')) {
      const conquista = await desbloquearConquista(usuarioId, 'NOTURNO');
      if (conquista) conquistasDesbloqueadas.push(conquista);
    }
    
    const diaSemana = new Date().getDay();
    if ((diaSemana === 0 || diaSemana === 6) && !temConquista(perfil, 'FIM_DE_SEMANA')) {
      const conquista = await desbloquearConquista(usuarioId, 'FIM_DE_SEMANA');
      if (conquista) conquistasDesbloqueadas.push(conquista);
    }
  }

  return conquistasDesbloqueadas;
}

/**
 * Verifica se usuário já tem uma conquista
 */
function temConquista(perfil: any, tipo: string): boolean {
  return perfil.conquistasDesbloqueadas.some(
    (c: any) => c.conquista.tipo === tipo
  );
}

/**
 * Desbloqueia uma conquista para o usuário
 */
async function desbloquearConquista(usuarioId: number, tipo: string) {
  try {
    // Busca perfil
    const perfil = await prisma.perfilGamificacao.findUnique({
      where: { usuarioId },
    });

    if (!perfil) {
      return null;
    }

    // Busca conquista
    const conquista = await prisma.conquista.findFirst({
      where: { tipo },
    });

    if (!conquista) {
      console.warn(`Conquista ${tipo} não encontrada no banco`);
      return null;
    }

    // Cria relacionamento
    const conquistaUsuario = await prisma.conquistaUsuario.create({
      data: {
        perfilId: perfil.id,
        conquistaId: conquista.id,
        desbloqueadaEm: new Date(),
      },
      include: {
        conquista: true,
      },
    });

    return conquistaUsuario;
  } catch (error) {
    console.error(`Erro ao desbloquear conquista ${tipo}:`, error);
    return null;
  }
}

/**
 * Busca todas as conquistas de um usuário
 */
export async function buscarConquistasUsuario(usuarioId: number) {
  const perfil = await prisma.perfilGamificacao.findUnique({
    where: { usuarioId },
    include: {
      conquistasDesbloqueadas: {
        include: {
          conquista: true,
        },
        orderBy: {
          desbloqueadaEm: 'desc',
        },
      },
    },
  });

  if (!perfil) {
    return [];
  }

  return perfil.conquistasDesbloqueadas;
}

/**
 * Busca todas as conquistas disponíveis
 */
export async function buscarTodasConquistas() {
  return prisma.conquista.findMany({
    orderBy: [
      { categoria: 'asc' },
      { xpRecompensa: 'asc' },
    ],
  });
}

/**
 * Busca progresso das conquistas de um usuário
 */
export async function buscarProgressoConquistas(usuarioId: number) {
  const perfil = await prisma.perfilGamificacao.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    return [];
  }

  const todasConquistas = await buscarTodasConquistas();
  const conquistasUsuario = await buscarConquistasUsuario(usuarioId);
  
  const idsDesbloqueadas = new Set(
    conquistasUsuario.map((c: any) => c.conquistaId)
  );

  return todasConquistas.map((conquista) => {
    const desbloqueada = idsDesbloqueadas.has(conquista.id);
    let progresso = 0;

    // Calcula progresso para conquistas não desbloqueadas
    if (!desbloqueada) {
      switch (conquista.tipo) {
        case 'XP_100':
          progresso = Math.min((perfil.xpTotal / 100) * 100, 100);
          break;
        case 'XP_500':
          progresso = Math.min((perfil.xpTotal / 500) * 100, 100);
          break;
        case 'XP_1000':
          progresso = Math.min((perfil.xpTotal / 1000) * 100, 100);
          break;
        case 'XP_5000':
          progresso = Math.min((perfil.xpTotal / 5000) * 100, 100);
          break;
        case 'NIVEL_5':
          progresso = Math.min((perfil.nivel / 5) * 100, 100);
          break;
        case 'NIVEL_10':
          progresso = Math.min((perfil.nivel / 10) * 100, 100);
          break;
        case 'NIVEL_20':
          progresso = Math.min((perfil.nivel / 20) * 100, 100);
          break;
        case 'NIVEL_50':
          progresso = Math.min((perfil.nivel / 50) * 100, 100);
          break;
        case 'STREAK_3':
          progresso = Math.min((perfil.streakAtual / 3) * 100, 100);
          break;
        case 'STREAK_7':
          progresso = Math.min((perfil.streakAtual / 7) * 100, 100);
          break;
        case 'STREAK_14':
          progresso = Math.min((perfil.streakAtual / 14) * 100, 100);
          break;
        case 'STREAK_30':
          progresso = Math.min((perfil.streakAtual / 30) * 100, 100);
          break;
        case 'AVALIACOES_10':
          progresso = Math.min((perfil.totalAvaliacoes / 10) * 100, 100);
          break;
        case 'AVALIACOES_50':
          progresso = Math.min((perfil.totalAvaliacoes / 50) * 100, 100);
          break;
        case 'AVALIACOES_100':
          progresso = Math.min((perfil.totalAvaliacoes / 100) * 100, 100);
          break;
        default:
          progresso = 0;
      }
    } else {
      progresso = 100;
    }

    return {
      ...conquista,
      desbloqueada,
      progresso: Math.round(progresso),
    };
  });
}
