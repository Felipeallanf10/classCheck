const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('🔥 Limpando banco de dados completo...\n');

  try {
    // Deletar em ordem respeitando foreign keys
    const tables = [
      'logAtividade',
      'notificacao',
      'checkIn',
      'usuarioBadge',
      'badge',
      'usuarioConquista',
      'conquista',
      'historicoEmocional',
      'alertaSocioemocional',
      'respostaSocioemocional',
      'sessaoAdaptativa',
      'regraAdaptacao',
      'bancoPerguntasAdaptativo',
      'perguntaSocioemocional',
      'questionarioSocioemocional',
      'avaliacaoProfessor',
      'avaliacaoDidatica',
      'avaliacaoSocioemocional',
      'avaliacao',
      'aulaFavorita',
      'humorRegistro',
      'aula',
      'evento',
      'usuario',
      'professor'
    ];

    for (const table of tables) {
      try {
        console.log(`🧹 Deletando ${table}...`);
        await prisma[table].deleteMany({});
        console.log(`✅ ${table} deletado`);
      } catch (error) {
        if (error.code !== 'P2021') { // Ignora se tabela não existe
          console.log(`⚠️  Erro ao deletar ${table}:`, error.message);
        }
      }
    }

    console.log('\n✅ Banco de dados limpo com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
