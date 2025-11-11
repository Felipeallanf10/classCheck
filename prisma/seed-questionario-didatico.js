/**
 * Seed: Questionário "Avaliação Didática da Aula"
 * Contexto: AULA (complementar ao questionário socioemocional)
 * Duração: 2-3 minutos
 * Perguntas: 4-6 (fixas + adaptativas)
 * 
 * Este questionário é apresentado APÓS o questionário socioemocional
 * e foca nos aspectos pedagógicos e didáticos da aula.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedQuestionarioDidatico() {
  console.log('📚 Criando questionário "Avaliação Didática da Aula"...');

  // Limpar dados existentes
  await prisma.perguntaSocioemocional.deleteMany({
    where: { questionarioId: 'questionario-didatico-aula' }
  });
  await prisma.regraAdaptacao.deleteMany({
    where: { questionarioId: 'questionario-didatico-aula' }
  });
  await prisma.questionarioSocioemocional.deleteMany({
    where: { id: 'questionario-didatico-aula' }
  });

  // 1. Criar o questionário
  const questionario = await prisma.questionarioSocioemocional.create({
    data: {
      id: 'questionario-didatico-aula',
      titulo: 'Avaliação Didática da Aula',
      descricao: 'Avalie os aspectos pedagógicos e de ensino desta aula',
      versao: '1.0',
      tipo: 'AVALIACAO_POS_AULA',
      contextoPrincipal: 'AULA',
      duracaoEstimada: 3,
      categorias: ['CONCENTRACAO'], // Categorias não se aplicam 100% aqui, mas mantemos para consistência
      adaptativo: false, // Questionário fixo (não adaptativo)
      nivelAdaptacao: 'BAIXO',
      instrucoes: 'Agora, ajude-nos a melhorar a qualidade das aulas avaliando os aspectos didáticos.',
      instrucoesFinais: 'Obrigado! Sua avaliação é essencial para aprimorarmos o ensino.',
      ativo: true,
      oficial: true,
      publicado: true,
      publicadoEm: new Date(),
    },
  });

  console.log(`✅ Questionário criado: ${questionario.id}`);

  // 2. Criar perguntas do questionário didático
  const perguntas = [
    {
      id: 'didatico-p1-compreensao',
      questionarioId: questionario.id,
      texto: 'O quanto você compreendeu o conteúdo apresentado?',
      textoAuxiliar: 'Seja honesto, isso nos ajuda a adaptar o ensino',
      categoria: 'CONCENTRACAO',
      dominio: 'CALMO',
      tipoPergunta: 'LIKERT_5',
      obrigatoria: true,
      ordem: 1,
      opcoes: [
        { valor: 1, label: 'Não entendi nada' },
        { valor: 2, label: 'Entendi pouco' },
        { valor: 3, label: 'Entendi parcialmente' },
        { valor: 4, label: 'Entendi bem' },
        { valor: 5, label: 'Entendi completamente' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.3,
      discriminacao: 1.5,
      peso: 2.0, // Alta importância
    },
    {
      id: 'didatico-p2-ritmo',
      questionarioId: questionario.id,
      texto: 'Como você avalia o ritmo da aula?',
      textoAuxiliar: null,
      categoria: 'CONCENTRACAO',
      dominio: 'CALMO',
      tipoPergunta: 'LIKERT_5',
      obrigatoria: true,
      ordem: 2,
      opcoes: [
        { valor: 1, label: 'Muito lento' },
        { valor: 2, label: 'Um pouco lento' },
        { valor: 3, label: 'Adequado' },
        { valor: 4, label: 'Um pouco rápido' },
        { valor: 5, label: 'Muito rápido' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.2,
      discriminacao: 1.3,
      peso: 1.5,
    },
    {
      id: 'didatico-p3-recursos',
      questionarioId: questionario.id,
      texto: 'Os recursos didáticos (slides, exemplos, atividades) foram adequados?',
      textoAuxiliar: null,
      categoria: 'CONCENTRACAO',
      dominio: 'FELIZ',
      tipoPergunta: 'LIKERT_5',
      obrigatoria: true,
      ordem: 3,
      opcoes: [
        { valor: 1, label: 'Muito inadequados' },
        { valor: 2, label: 'Inadequados' },
        { valor: 3, label: 'Neutros' },
        { valor: 4, label: 'Adequados' },
        { valor: 5, label: 'Muito adequados' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.3,
      discriminacao: 1.4,
      peso: 1.5,
    },
    {
      id: 'didatico-p4-engajamento',
      questionarioId: questionario.id,
      texto: 'Qual foi seu nível de engajamento durante a aula?',
      textoAuxiliar: 'Engajamento = atenção, participação, interesse',
      categoria: 'BEM_ESTAR',
      dominio: 'ANIMADO',
      tipoPergunta: 'SLIDER_NUMERICO',
      obrigatoria: true,
      ordem: 4,
      valorMinimo: 0,
      valorMaximo: 10,
      dificuldade: 0.3,
      discriminacao: 1.6,
      peso: 1.8,
    },
    {
      id: 'didatico-p5-ponto-positivo',
      questionarioId: questionario.id,
      texto: 'O que funcionou bem nesta aula?',
      textoAuxiliar: 'Destaque algo positivo (opcional)',
      categoria: 'BEM_ESTAR',
      dominio: 'FELIZ',
      tipoPergunta: 'TEXTO_CURTO',
      obrigatoria: false,
      ordem: 5,
      valorMinimo: 0,
      valorMaximo: 300,
      dificuldade: 0.4,
      discriminacao: 1.0,
      peso: 0.5,
    },
    {
      id: 'didatico-p6-sugestao',
      questionarioId: questionario.id,
      texto: 'Como esta aula poderia ter sido melhor?',
      textoAuxiliar: 'Sugestões são muito valiosas (opcional)',
      categoria: 'CONCENTRACAO',
      dominio: 'CALMO',
      tipoPergunta: 'TEXTO_CURTO',
      obrigatoria: false,
      ordem: 6,
      valorMinimo: 0,
      valorMaximo: 300,
      dificuldade: 0.5,
      discriminacao: 1.0,
      peso: 0.5,
    },
  ];

  for (const pergunta of perguntas) {
    await prisma.perguntaSocioemocional.create({
      data: pergunta,
    });
    console.log(`  ✅ Pergunta criada: ${pergunta.id}`);
  }

  console.log('\n✅ Questionário Didático criado com sucesso!\n');
  console.log('📊 Resumo:');
  console.log(`   - ID: ${questionario.id}`);
  console.log(`   - ${perguntas.length} perguntas criadas`);
  console.log(`   - Tipo: ${questionario.tipo}`);
  console.log(`   - Adaptativo: ${questionario.adaptativo ? 'Sim' : 'Não'}\n`);
}

async function main() {
  try {
    await seedQuestionarioDidatico();
  } catch (error) {
    console.error('❌ Erro ao criar questionário didático:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

module.exports = { seedQuestionarioDidatico };
