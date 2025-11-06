const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function limparSessaoProblematica() {
  try {
    console.log('\n🧹 Limpando sessão problemática...');
    
    // Deletar respostas da sessão
    const sessaoId = 'd005c1bd-974c-4977-80c2-90648bf72ed2';
    
    const deletedRespostas = await prisma.respostaSocioemocional.deleteMany({
      where: { sessaoId }
    });
    
    console.log(`✅ ${deletedRespostas.count} respostas deletadas`);
    
    // Resetar estado da sessão
    await prisma.sessaoAdaptativa.update({
      where: { id: sessaoId },
      data: {
        status: 'EM_ANDAMENTO',
        perguntasApresentadas: [],
        proximaPergunta: null,
        thetaEstimado: 0,
        erroEstimacao: 1,
        confianca: 0.5,
        finalizadoEm: null
      }
    });
    
    console.log('✅ Sessão resetada!');
    console.log('\n💡 Agora você pode responder o questionário novamente do início.');
    console.log('As perguntas virão apenas do questionário original (sem banco adaptativo).');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

limparSessaoProblematica();
