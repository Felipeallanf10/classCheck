const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugUltimaSessao() {
  try {
    // Buscar última sessão do questionário "Impacto Socioemocional"
    const sessao = await prisma.sessaoAdaptativa.findFirst({
      where: {
        questionario: {
          titulo: { contains: 'Impacto Socioemocional' }
        }
      },
      include: {
        questionario: {
          select: {
            id: true,
            titulo: true,
            adaptativo: true
          }
        },
        respostas: {
          include: {
            pergunta: {
              select: {
                id: true,
                texto: true,
                categoria: true,
                ativo: true
              }
            }
          },
          orderBy: {
            ordem: 'asc'
          }
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
    
    console.log('\n=== SESSÃO ===');
    console.log('ID:', sessao.id);
    console.log('Status:', sessao.status);
    console.log('Questionário:', sessao.questionario.titulo);
    console.log('Adaptativo:', sessao.questionario.adaptativo);
    console.log('Iniciado em:', sessao.iniciadoEm);
    console.log('Finalizado em:', sessao.finalizadoEm || 'Em andamento');
    
    console.log('\n=== RESPOSTAS ===');
    console.log('Total de respostas:', sessao.respostas.length);
    sessao.respostas.forEach((r, i) => {
      console.log(`${i+1}. Ordem ${r.ordem}: ${r.pergunta.texto.substring(0, 60)}...`);
      console.log(`   Valor: ${r.valor}, Normalizado: ${r.valorNormalizado}`);
    });
    
    console.log('\n=== ESTADO DA SESSÃO ===');
    console.log('Perguntas apresentadas:', sessao.perguntasApresentadas.length);
    console.log('Lista:', sessao.perguntasApresentadas);
    console.log('Próxima pergunta:', sessao.proximaPergunta || 'Nenhuma');
    console.log('Theta estimado:', sessao.thetaEstimado);
    console.log('Erro de estimação:', sessao.erroEstimacao);
    console.log('Confiança:', sessao.confianca);
    
    // Verificar quantas perguntas ainda disponíveis
    const perguntasDisponiveis = await prisma.perguntaSocioemocional.count({
      where: {
        questionarioId: sessao.questionarioId,
        ativo: true,
        NOT: {
          id: { in: sessao.perguntasApresentadas }
        }
      }
    });
    
    console.log('\n=== PERGUNTAS DISPONÍVEIS ===');
    console.log('Perguntas NÃO apresentadas ainda:', perguntasDisponiveis);
    
    if (perguntasDisponiveis === 0 && sessao.respostas.length < 5) {
      console.log('\n🚨 PROBLEMA ENCONTRADO!');
      console.log('Todas as perguntas foram marcadas como "apresentadas" mas apenas', sessao.respostas.length, 'foram respondidas!');
      console.log('Isso causa término prematuro do questionário.');
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugUltimaSessao();
