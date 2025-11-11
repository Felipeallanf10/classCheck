const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkQuestionarios() {
  console.log('\n📊 Verificando Questionários...\n');
  
  const questionarios = await prisma.questionarioSocioemocional.findMany({
    include: {
      _count: {
        select: { perguntas: true }
      }
    },
    orderBy: { titulo: 'asc' }
  });
  
  console.log(`Total de questionários: ${questionarios.length}\n`);
  
  questionarios.forEach(q => {
    console.log(`📋 ${q.titulo}`);
    console.log(`   ID: ${q.id}`);
    console.log(`   Perguntas: ${q._count.perguntas}`);
    console.log(`   Tipo: ${q.tipo}`);
    console.log(`   Publicado: ${q.publicado ? '✅' : '❌'}`);
    console.log(`   Ativo: ${q.ativo ? '✅' : '❌'}`);
    console.log('');
  });
  
  // Verificar perguntas
  const totalPerguntas = await prisma.perguntaSocioemocional.count();
  console.log(`\n🔍 Total de perguntas no banco: ${totalPerguntas}`);
  
  // Verificar perguntas órfãs
  const perguntasOrfas = await prisma.perguntaSocioemocional.count({
    where: {
      questionarioId: null
    }
  });
  console.log(`⚠️  Perguntas sem questionário: ${perguntasOrfas}`);
  
  await prisma.$disconnect();
}

checkQuestionarios().catch(console.error);
