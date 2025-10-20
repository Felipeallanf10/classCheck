/**
 * Seed de Conquistas
 * Popula o banco com as conquistas padrão do sistema
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CONQUISTAS_PADRAO = [
  // Conquistas de XP
  {
    tipo: 'XP_100',
    nome: 'Primeiros Passos',
    descricao: 'Alcance 100 XP',
    icone: '🎯',
    categoria: 'XP',
    xpRecompensa: 10,
  },
  {
    tipo: 'XP_500',
    nome: 'Ganhando Ritmo',
    descricao: 'Alcance 500 XP',
    icone: '🚀',
    categoria: 'XP',
    xpRecompensa: 50,
  },
  {
    tipo: 'XP_1000',
    nome: 'Milionário de XP',
    descricao: 'Alcance 1000 XP',
    icone: '💎',
    categoria: 'XP',
    xpRecompensa: 100,
  },
  {
    tipo: 'XP_5000',
    nome: 'Lendário',
    descricao: 'Alcance 5000 XP',
    icone: '👑',
    categoria: 'XP',
    xpRecompensa: 500,
  },

  // Conquistas de Nível
  {
    tipo: 'NIVEL_5',
    nome: 'Aprendiz',
    descricao: 'Alcance o nível 5',
    icone: '📚',
    categoria: 'NIVEL',
    xpRecompensa: 25,
  },
  {
    tipo: 'NIVEL_10',
    nome: 'Estudante Dedicado',
    descricao: 'Alcance o nível 10',
    icone: '🎓',
    categoria: 'NIVEL',
    xpRecompensa: 50,
  },
  {
    tipo: 'NIVEL_20',
    nome: 'Mestre do Conhecimento',
    descricao: 'Alcance o nível 20',
    icone: '🧙',
    categoria: 'NIVEL',
    xpRecompensa: 100,
  },
  {
    tipo: 'NIVEL_50',
    nome: 'Grande Sábio',
    descricao: 'Alcance o nível 50',
    icone: '🏆',
    categoria: 'NIVEL',
    xpRecompensa: 500,
  },

  // Conquistas de Streak
  {
    tipo: 'STREAK_3',
    nome: 'Consistência',
    descricao: 'Mantenha um streak de 3 dias',
    icone: '🔥',
    categoria: 'STREAK',
    xpRecompensa: 15,
  },
  {
    tipo: 'STREAK_7',
    nome: 'Semana Perfeita',
    descricao: 'Mantenha um streak de 7 dias',
    icone: '⭐',
    categoria: 'STREAK',
    xpRecompensa: 50,
  },
  {
    tipo: 'STREAK_14',
    nome: 'Duas Semanas Fortes',
    descricao: 'Mantenha um streak de 14 dias',
    icone: '💪',
    categoria: 'STREAK',
    xpRecompensa: 100,
  },
  {
    tipo: 'STREAK_30',
    nome: 'Mestre da Disciplina',
    descricao: 'Mantenha um streak de 30 dias',
    icone: '🌟',
    categoria: 'STREAK',
    xpRecompensa: 300,
  },

  // Conquistas de Avaliações
  {
    tipo: 'PRIMEIRA_AVALIACAO',
    nome: 'Primeira Impressão',
    descricao: 'Faça sua primeira avaliação',
    icone: '✨',
    categoria: 'AVALIACOES',
    xpRecompensa: 10,
  },
  {
    tipo: 'AVALIACOES_10',
    nome: 'Opinião Importa',
    descricao: 'Faça 10 avaliações',
    icone: '📝',
    categoria: 'AVALIACOES',
    xpRecompensa: 25,
  },
  {
    tipo: 'AVALIACOES_50',
    nome: 'Crítico Experiente',
    descricao: 'Faça 50 avaliações',
    icone: '🎬',
    categoria: 'AVALIACOES',
    xpRecompensa: 100,
  },
  {
    tipo: 'AVALIACOES_100',
    nome: 'Especialista em Feedback',
    descricao: 'Faça 100 avaliações',
    icone: '🏅',
    categoria: 'AVALIACOES',
    xpRecompensa: 250,
  },

  // Conquistas Especiais
  {
    tipo: 'MADRUGADOR',
    nome: 'Madrugador',
    descricao: 'Faça uma avaliação antes das 7h',
    icone: '🌅',
    categoria: 'ESPECIAL',
    xpRecompensa: 20,
  },
  {
    tipo: 'NOTURNO',
    nome: 'Coruja Noturna',
    descricao: 'Faça uma avaliação depois das 22h',
    icone: '🦉',
    categoria: 'ESPECIAL',
    xpRecompensa: 20,
  },
  {
    tipo: 'FIM_DE_SEMANA',
    nome: 'Dedicação Extra',
    descricao: 'Faça uma avaliação no fim de semana',
    icone: '🎯',
    categoria: 'ESPECIAL',
    xpRecompensa: 15,
  },
  {
    tipo: 'TOP_3',
    nome: 'Top 3',
    descricao: 'Fique entre os 3 melhores do ranking',
    icone: '🥇',
    categoria: 'RANKING',
    xpRecompensa: 100,
  },
];

export async function seedConquistas() {
  console.log('🌱 Iniciando seed de conquistas...');

  for (const conquista of CONQUISTAS_PADRAO) {
    try {
      await prisma.conquista.upsert({
        where: { tipo: conquista.tipo },
        update: conquista,
        create: conquista,
      });
      console.log(`✅ Conquista "${conquista.nome}" criada/atualizada`);
    } catch (error) {
      console.error(`❌ Erro ao criar conquista "${conquista.nome}":`, error);
    }
  }

  console.log('✨ Seed de conquistas concluído!');
}

// Executar se chamado diretamente
if (require.main === module) {
  seedConquistas()
    .then(() => prisma.$disconnect())
    .catch((error) => {
      console.error(error);
      prisma.$disconnect();
      process.exit(1);
    });
}
