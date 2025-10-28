const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarProximaPergunta() {
  try {
    // Buscar última sessão
    const sessao = await prisma.sessaoAdaptativa.findFirst({
      where: {
        questionario: {
          titulo: { contains: 'Impacto Socioemocional' }
        }
      },
      orderBy: {
        iniciadoEm: 'desc'
      }
    });
    
    if (!sessao) {
      console.log('❌ Nenhuma sessão encontrada!');
      return;
    }
    
    console.log('\n=== CAMPO proximaPergunta ===');
    console.log('Valor:', sessao.proximaPergunta);
    console.log('Tipo:', typeof sessao.proximaPergunta);
    console.log('É null?', sessao.proximaPergunta === null);
    console.log('É undefined?', sessao.proximaPergunta === undefined);
    console.log('É string vazia?', sessao.proximaPergunta === '');
    
    if (sessao.proximaPergunta) {
      console.log('\n=== TENTANDO BUSCAR A PERGUNTA ===');
      
      // Tentar buscar em PerguntaSocioemocional
      const perguntaSocioemocional = await prisma.perguntaSocioemocional.findUnique({
        where: { id: sessao.proximaPergunta }
      });
      
      console.log('Encontrada em PerguntaSocioemocional?', !!perguntaSocioemocional);
      
      if (perguntaSocioemocional) {
        console.log('ID:', perguntaSocioemocional.id);
        console.log('Texto:', perguntaSocioemocional.texto.substring(0, 60) + '...');
        console.log('Categoria:', perguntaSocioemocional.categoria);
        console.log('Ativo:', perguntaSocioemocional.ativo);
      } else {
        console.log('\n❌ PROBLEMA! proximaPergunta aponta para ID inexistente em PerguntaSocioemocional');
        
        // Tentar buscar no BancoPerguntasAdaptativo
        const perguntaBanco = await prisma.bancoPerguntasAdaptativo.findUnique({
          where: { id: sessao.proximaPergunta }
        });
        
        console.log('Encontrada em BancoPerguntasAdaptativo?', !!perguntaBanco);
        
        if (perguntaBanco) {
          console.log('\n🚨 BUG ENCONTRADO!');
          console.log('A próxima pergunta está no banco adaptativo, mas a API busca apenas em PerguntaSocioemocional!');
          console.log('ID:', perguntaBanco.id);
          console.log('Título:', perguntaBanco.titulo.substring(0, 60) + '...');
          console.log('Categoria:', perguntaBanco.categoria);
        }
      }
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarProximaPergunta();
