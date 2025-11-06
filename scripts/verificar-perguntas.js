const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificar() {
  try {
    // Buscar questionário 'Impacto Socioemocional da Aula'
    const questionario = await prisma.questionarioSocioemocional.findFirst({
      where: {
        titulo: { contains: 'Impacto Socioemocional' }
      },
      include: {
        perguntas: {
          select: {
            id: true,
            texto: true,
            ativo: true,
            ordem: true,
            categoria: true,
            dominio: true
          },
          orderBy: {
            ordem: 'asc'
          }
        }
      }
    });
    
    if (!questionario) {
      console.log('❌ Questionário não encontrado!');
      return;
    }
    
    console.log('\n=== QUESTIONÁRIO ===');
    console.log('ID:', questionario.id);
    console.log('Título:', questionario.titulo);
    console.log('Total de perguntas:', questionario.perguntas.length);
    console.log('Perguntas ATIVAS:', questionario.perguntas.filter(p => p.ativo).length);
    console.log('Perguntas INATIVAS:', questionario.perguntas.filter(p => !p.ativo).length);
    
    console.log('\n=== LISTA DE PERGUNTAS ===');
    questionario.perguntas.forEach((p, i) => {
      const status = p.ativo ? '✅ ATIVA  ' : '❌ INATIVA';
      console.log(`${i+1}. ${status} [${p.id.substring(0, 8)}] ${p.texto.substring(0, 70)}...`);
    });
    
    // Verificar se há apenas 1 pergunta ativa (o que causaria o bug)
    const ativas = questionario.perguntas.filter(p => p.ativo);
    if (ativas.length === 1) {
      console.log('\n🚨 PROBLEMA ENCONTRADO!');
      console.log('Apenas 1 pergunta está ativa. Isso faz o questionário terminar após 1 resposta.');
      console.log('A única pergunta ativa é:', ativas[0].id, '-', ativas[0].texto.substring(0, 50));
    } else if (ativas.length === 0) {
      console.log('\n🚨 PROBLEMA CRÍTICO!');
      console.log('Nenhuma pergunta está ativa neste questionário!');
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificar();
