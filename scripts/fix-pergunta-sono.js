const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function corrigirPerguntaSono() {
  try {
    console.log('\n🔍 Buscando pergunta de sono no banco adaptativo...');
    
    const perguntaSono = await prisma.bancoPerguntasAdaptativo.findFirst({
      where: {
        OR: [
          { titulo: { contains: 'sono' } },
          { texto: { contains: 'sono' } }
        ]
      }
    });
    
    if (!perguntaSono) {
      console.log('❌ Pergunta não encontrada!');
      return;
    }
    
    console.log('\n📋 Pergunta encontrada:');
    console.log('ID:', perguntaSono.id);
    console.log('Título:', perguntaSono.titulo);
    console.log('Tipo atual:', perguntaSono.tipoPergunta);
    console.log('Opções atuais:', perguntaSono.opcoes);
    
    // Corrigir tipo e opções
    console.log('\n✏️ Corrigindo tipo e opções...');
    
    const opcoesCorretas = [
      "Muito insatisfeito",
      "Insatisfeito", 
      "Neutro",
      "Satisfeito",
      "Muito satisfeito"
    ];
    
    await prisma.bancoPerguntasAdaptativo.update({
      where: { id: perguntaSono.id },
      data: {
        tipoPergunta: 'ESCALA_LIKERT',
        opcoes: opcoesCorretas
      }
    });
    
    console.log('\n✅ Pergunta corrigida!');
    console.log('Novo tipo: ESCALA_LIKERT');
    console.log('Novas opções:', opcoesCorretas);
    
    // Desativar uso do banco adaptativo temporariamente
    console.log('\n⚠️ IMPORTANTE: O banco adaptativo está causando erro de Foreign Key');
    console.log('Recomendo desativar o uso do banco até implementar solução completa.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

corrigirPerguntaSono();
