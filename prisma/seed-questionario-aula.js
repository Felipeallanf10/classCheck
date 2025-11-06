/**
 * Seed: Questionário "Impacto Socioemocional da Aula"
 * Contexto: AULA
 * Duração: 2-3 minutos
 * Perguntas: 3-5 (adaptativas)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedQuestionarioAula() {
  console.log('📚 Criando questionário "Impacto Socioemocional da Aula"...');

  // Limpar dados existentes
  await prisma.perguntaSocioemocional.deleteMany({
    where: { questionarioId: 'questionario-impacto-aula' }
  });
  await prisma.regraAdaptacao.deleteMany({
    where: { questionarioId: 'questionario-impacto-aula' }
  });
  await prisma.questionarioSocioemocional.deleteMany({
    where: { id: 'questionario-impacto-aula' }
  });

  // 1. Criar o questionário
  const questionario = await prisma.questionarioSocioemocional.create({
    data: {
      id: 'questionario-impacto-aula',
      titulo: 'Impacto Socioemocional da Aula',
      descricao: 'Avaliação rápida sobre como você se sentiu durante esta aula',
      versao: '1.0',
      tipo: 'AVALIACAO_POS_AULA',
      contextoPrincipal: 'AULA',
      duracaoEstimada: 2,
      categorias: ['BEM_ESTAR', 'ANSIEDADE', 'CONCENTRACAO', 'INCLUSAO'],
      adaptativo: true,
      nivelAdaptacao: 'MEDIO',
      instrucoes: 'Responda algumas perguntas rápidas sobre como você se sentiu nesta aula. Isso nos ajuda a melhorar a experiência de aprendizado.',
      instrucoesFinais: 'Obrigado por compartilhar! Sua avaliação nos ajuda a criar um ambiente melhor para todos.',
      ativo: true,
      oficial: true,
      publicado: true,
      publicadoEm: new Date(),
    },
  });

  console.log(`✅ Questionário criado: ${questionario.id}`);

  // 2. Criar perguntas base (sempre aplicadas)
  const perguntas = [
    {
      id: 'aula-p1-emoji',
      questionarioId: questionario.id,
      texto: 'Como você se sentiu durante esta aula?',
      textoAuxiliar: 'Escolha o emoji que melhor representa seu sentimento',
      categoria: 'BEM_ESTAR',
      dominio: 'FELIZ',
      tipoPergunta: 'EMOJI_PICKER',
      obrigatoria: true,
      ordem: 1,
      opcoes: [
        { valor: 1, label: '😫', texto: 'Muito mal' },
        { valor: 2, label: '😔', texto: 'Mal' },
        { valor: 3, label: '😐', texto: 'Neutro' },
        { valor: 4, label: '🙂', texto: 'Bem' },
        { valor: 5, label: '😊', texto: 'Muito bem' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.2,
      discriminacao: 1.5,
      peso: 1.0,
    },
    {
      id: 'aula-p2-ansiedade',
      questionarioId: questionario.id,
      texto: 'Qual foi seu nível de ansiedade durante a aula?',
      textoAuxiliar: 'Arraste o controle para indicar o nível (0 = nada ansioso, 10 = muito ansioso)',
      categoria: 'ANSIEDADE',
      dominio: 'ANSIOSO',
      tipoPergunta: 'SLIDER_NUMERICO',
      obrigatoria: true,
      ordem: 2,
      valorMinimo: 0,
      valorMaximo: 10,
      dificuldade: 0.3,
      discriminacao: 1.8,
      peso: 1.5, // Peso maior para ansiedade (mais importante)
    },
    {
      id: 'aula-p3-inclusao',
      questionarioId: questionario.id,
      texto: 'Você se sentiu incluído e confortável para participar?',
      textoAuxiliar: null,
      categoria: 'BEM_ESTAR',
      dominio: 'CALMO',
      tipoPergunta: 'LIKERT_5',
      obrigatoria: true,
      ordem: 3,
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo' },
        { valor: 3, label: 'Neutro' },
        { valor: 4, label: 'Concordo' },
        { valor: 5, label: 'Concordo totalmente' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.4,
      discriminacao: 1.2,
      peso: 1.0,
    },
    {
      id: 'aula-p4-concentracao',
      questionarioId: questionario.id,
      texto: 'Você conseguiu se concentrar durante a aula?',
      textoAuxiliar: null,
      categoria: 'CONCENTRACAO',
      dominio: 'CALMO',
      tipoPergunta: 'LIKERT_5',
      obrigatoria: false,
      ordem: 4,
      opcoes: [
        { valor: 1, label: 'Nada' },
        { valor: 2, label: 'Pouco' },
        { valor: 3, label: 'Mais ou menos' },
        { valor: 4, label: 'Bem' },
        { valor: 5, label: 'Muito bem' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.3,
      discriminacao: 1.3,
      peso: 0.8,
    },
  ];

  for (const pergunta of perguntas) {
    await prisma.perguntaSocioemocional.create({
      data: pergunta,
    });
    console.log(`  ✅ Pergunta criada: ${pergunta.id}`);
  }

  // 3. Criar perguntas adaptativas (condicionais)
  const perguntasAdaptativas = [
    {
      id: 'aula-p5-causa-ansiedade',
      questionarioId: questionario.id,
      texto: 'O que causou essa ansiedade?',
      textoAuxiliar: 'Selecione todas as opções que se aplicam',
      categoria: 'ANSIEDADE',
      dominio: 'ANSIOSO',
      tipoPergunta: 'MULTIPLA_ESCOLHA',
      obrigatoria: false,
      ordem: 999, // Ordem alta = inserida dinamicamente
      opcoes: [
        { valor: 'dificuldade', label: 'Conteúdo muito difícil' },
        { valor: 'ritmo', label: 'Ritmo muito rápido' },
        { valor: 'chamado', label: 'Medo de ser chamado' },
        { valor: 'avaliacao', label: 'Pressão da avaliação' },
        { valor: 'colegas', label: 'Relação com colegas' },
        { valor: 'outro', label: 'Outro motivo' },
      ],
      dificuldade: 0.6,
      discriminacao: 1.5,
      peso: 1.2,
    },
    {
      id: 'aula-p6-falta-inclusao',
      questionarioId: questionario.id,
      texto: 'Por que você não se sentiu incluído?',
      textoAuxiliar: 'Sua resposta é anônima e nos ajuda a melhorar',
      categoria: 'BEM_ESTAR',
      dominio: 'TRISTE',
      tipoPergunta: 'TEXTO_CURTO',
      obrigatoria: false,
      ordem: 998,
      valorMinimo: 10, // mínimo 10 caracteres
      valorMaximo: 200,
      dificuldade: 0.7,
      discriminacao: 1.1,
      peso: 0.9,
    },
  ];

  for (const pergunta of perguntasAdaptativas) {
    await prisma.perguntaSocioemocional.create({
      data: pergunta,
    });
    console.log(`  ✅ Pergunta adaptativa criada: ${pergunta.id}`);
  }

  // 4. Criar regras de adaptação
  const regras = [
    {
      id: 'regra-aula-ansiedade-alta',
      questionarioId: questionario.id,
      nome: 'Ansiedade Alta - Investigar Causa',
      descricao: 'Se ansiedade > 7, perguntar causa',
      prioridade: 10,
      condicoes: {
        all: [
          {
            fact: 'resposta',
            operator: 'greaterThan',
            value: 7,
            path: '$.valor',
          },
          {
            fact: 'respostaAtual',
            operator: 'equal',
            value: 'aula-p2-ansiedade',
            path: '$.perguntaId',
          },
        ],
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'aula-p5-causa-ansiedade',
            prioridade: 1,
          },
        },
        {
          type: 'GERAR_ALERTA',
          params: {
            tipo: 'RISCO_MODERADO',
            nivel: 'LARANJA',
            categoria: 'ANSIEDADE',
            mensagem: 'Aluno relatou alta ansiedade durante a aula',
          },
        },
      ],
      tipoCondicao: 'MAIOR_QUE',
      tipoAcao: ['INSERIR_PERGUNTA', 'CRIAR_ALERTA'],
      ativo: true,
    },
    {
      id: 'regra-aula-falta-inclusao',
      questionarioId: questionario.id,
      nome: 'Falta de Inclusão - Investigar',
      descricao: 'Se inclusão <= 2, perguntar motivo',
      prioridade: 9,
      condicoes: {
        all: [
          {
            fact: 'resposta',
            operator: 'lessThanInclusive',
            value: 2,
            path: '$.valor',
          },
          {
            fact: 'respostaAtual',
            operator: 'equal',
            value: 'aula-p3-inclusao',
            path: '$.perguntaId',
          },
        ],
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'aula-p6-falta-inclusao',
            prioridade: 1,
          },
        },
        {
          type: 'GERAR_ALERTA',
          params: {
            tipo: 'PADRAO_PREOCUPANTE',
            nivel: 'AMARELO',
            categoria: 'BEM_ESTAR',
            mensagem: 'Aluno não se sentiu incluído na aula',
          },
        },
      ],
      tipoCondicao: 'MENOR_OU_IGUAL',
      tipoAcao: ['INSERIR_PERGUNTA', 'CRIAR_ALERTA'],
      ativo: true,
    },
  ];

  for (const regra of regras) {
    await prisma.regraAdaptacao.create({
      data: regra,
    });
    console.log(`  ✅ Regra criada: ${regra.id}`);
  }

  console.log('✅ Questionário "Impacto Socioemocional da Aula" criado com sucesso!');
  console.log(`   - 4 perguntas base`);
  console.log(`   - 2 perguntas adaptativas`);
  console.log(`   - 2 regras de adaptação`);
}

// Executar se chamado diretamente
if (require.main === module) {
  seedQuestionarioAula()
    .catch((error) => {
      console.error('❌ Erro ao criar questionário:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedQuestionarioAula };
