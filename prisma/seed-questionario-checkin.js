/**
 * Seed: Questionário "Check-in Diário"
 * Contexto: CHECK_IN
 * Duração: 1-2 minutos
 * Perguntas: 3-4 (muito rápido)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedQuestionarioCheckIn() {
  console.log('☀️ Criando questionário "Check-in Diário"...');

  // Limpar dados existentes
  await prisma.perguntaSocioemocional.deleteMany({
    where: { questionarioId: 'questionario-checkin-diario' }
  });
  await prisma.regraAdaptacao.deleteMany({
    where: { questionarioId: 'questionario-checkin-diario' }
  });
  await prisma.questionarioSocioemocional.deleteMany({
    where: { id: 'questionario-checkin-diario' }
  });

  // 1. Criar o questionário
  const questionario = await prisma.questionarioSocioemocional.create({
    data: {
      id: 'questionario-checkin-diario',
      titulo: 'Check-in Diário',
      descricao: 'Como você está se sentindo hoje?',
      versao: '1.0',
      tipo: 'CHECK_IN_DIARIO',
      contextoPrincipal: 'CHECK_IN',
      duracaoEstimada: 1,
      categorias: ['BEM_ESTAR', 'HUMOR', 'SONO', 'ENERGIA'],
      adaptativo: true,
      nivelAdaptacao: 'BAIXO',
      instrucoes: 'Responda rapidamente como você está se sentindo hoje. Leva menos de 2 minutos!',
      instrucoesFinais: 'Obrigado! Acompanhe sua jornada emocional ao longo do tempo.',
      ativo: true,
      oficial: true,
      publicado: true,
      publicadoEm: new Date(),
    },
  });

  console.log(`✅ Questionário criado: ${questionario.id}`);

  // 2. Criar perguntas
  const perguntas = [
    {
      id: 'checkin-p1-humor',
      questionarioId: questionario.id,
      texto: 'Como você se sente agora?',
      textoAuxiliar: 'Clique no quadrante que melhor representa seu estado',
      categoria: 'BEM_ESTAR',
      dominio: 'FELIZ',
      tipoPergunta: 'EMOJI_PICKER', // TODO: Implementar CIRCUMPLEX
      obrigatoria: true,
      ordem: 1,
      opcoes: [
        // Quadrantes do Circumplex
        { valor: 'feliz', label: 'Feliz', valencia: 1, ativacao: 1 },
        { valor: 'animado', label: 'Animado', valencia: 0.8, ativacao: 1 },
        { valor: 'calmo', label: 'Calmo', valencia: 1, ativacao: -0.5 },
        { valor: 'relaxado', label: 'Relaxado', valencia: 0.7, ativacao: -0.8 },
        { valor: 'triste', label: 'Triste', valencia: -1, ativacao: -0.5 },
        { valor: 'cansado', label: 'Cansado', valencia: -0.5, ativacao: -1 },
        { valor: 'ansioso', label: 'Ansioso', valencia: -0.7, ativacao: 0.8 },
        { valor: 'estressado', label: 'Estressado', valencia: -0.9, ativacao: 1 },
      ],
      dificuldade: 0.2,
      discriminacao: 1.7,
      peso: 1.5,
    },
    {
      id: 'checkin-p2-sono',
      questionarioId: questionario.id,
      texto: 'Como foi sua qualidade de sono ontem?',
      textoAuxiliar: null,
      categoria: 'SONO',
      dominio: 'CANSADO',
      tipoPergunta: 'LIKERT_5',
      obrigatoria: true,
      ordem: 2,
      opcoes: [
        { valor: 1, label: 'Muito ruim' },
        { valor: 2, label: 'Ruim' },
        { valor: 3, label: 'Razoável' },
        { valor: 4, label: 'Boa' },
        { valor: 5, label: 'Excelente' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.3,
      discriminacao: 1.4,
      peso: 1.2,
    },
    {
      id: 'checkin-p3-energia',
      questionarioId: questionario.id,
      texto: 'Qual é seu nível de energia hoje?',
      textoAuxiliar: 'Arraste o controle de 0 (sem energia) a 10 (muita energia)',
      categoria: 'ENERGIA',
      dominio: 'ANIMADO',
      tipoPergunta: 'SLIDER_NUMERICO',
      obrigatoria: true,
      ordem: 3,
      valorMinimo: 0,
      valorMaximo: 10,
      dificuldade: 0.2,
      discriminacao: 1.5,
      peso: 1.0,
    },
    {
      id: 'checkin-p4-estresse',
      questionarioId: questionario.id,
      texto: 'Você está se sentindo estressado?',
      textoAuxiliar: null,
      categoria: 'ESTRESSE',
      dominio: 'ESTRESSADO',
      tipoPergunta: 'SIM_NAO',
      obrigatoria: false,
      ordem: 4,
      opcoes: [
        { valor: true, label: 'Sim' },
        { valor: false, label: 'Não' },
      ],
      dificuldade: 0.4,
      discriminacao: 1.2,
      peso: 0.8,
    },
  ];

  for (const pergunta of perguntas) {
    await prisma.perguntaSocioemocional.create({
      data: pergunta,
    });
    console.log(`  ✅ Pergunta criada: ${pergunta.id}`);
  }

  // 3. Criar perguntas adaptativas
  const perguntasAdaptativas = [
    {
      id: 'checkin-p5-causa-estresse',
      questionarioId: questionario.id,
      texto: 'O que está te estressando?',
      textoAuxiliar: 'Selecione todas as opções que se aplicam',
      categoria: 'ESTRESSE',
      dominio: 'ESTRESSADO',
      tipoPergunta: 'MULTIPLA_SELECAO',
      obrigatoria: false,
      ordem: 999,
      opcoes: [
        { valor: 'estudos', label: 'Estudos/Provas' },
        { valor: 'trabalho', label: 'Trabalho' },
        { valor: 'familia', label: 'Família' },
        { valor: 'relacionamentos', label: 'Relacionamentos' },
        { valor: 'financeiro', label: 'Questões financeiras' },
        { valor: 'saude', label: 'Saúde' },
        { valor: 'outro', label: 'Outro' },
      ],
      dificuldade: 0.5,
      discriminacao: 1.3,
      peso: 1.0,
    },
    {
      id: 'checkin-p6-sono-detalhes',
      questionarioId: questionario.id,
      texto: 'Quais fatores mais afetaram seu sono?',
      textoAuxiliar: 'Selecione todas as opções que se aplicam',
      categoria: 'SONO',
      dominio: 'CANSADO',
      tipoPergunta: 'MULTIPLA_SELECAO',
      obrigatoria: false,
      ordem: 1000,
      opcoes: [
        { valor: 'dificuldade_iniciar', label: 'Dificuldade para pegar no sono' },
        { valor: 'despertares', label: 'Acordei várias vezes' },
        { valor: 'pesadelos', label: 'Pesadelos' },
        { valor: 'ambiente', label: 'Ambiente desfavorável (barulho, luz, calor)' },
        { valor: 'dor', label: 'Dor/desconforto' },
        { valor: 'preocupacoes', label: 'Preocupações/ruminações' },
      ],
      dificuldade: 0.3,
      discriminacao: 1.2,
      peso: 1.0,
    },
    {
      id: 'checkin-p6-sono-tempo',
      questionarioId: questionario.id,
      texto: 'Quantas horas você dormiu ontem?',
      textoAuxiliar: 'Arraste de 0 a 12 horas',
      categoria: 'SONO',
      dominio: 'CANSADO',
      tipoPergunta: 'SLIDER_NUMERICO',
      obrigatoria: false,
      ordem: 1001,
      valorMinimo: 0,
      valorMaximo: 12,
      dificuldade: 0.4,
      discriminacao: 1.1,
      peso: 0.8,
    },
    {
      id: 'checkin-p7-estrategias-coping',
      questionarioId: questionario.id,
      texto: 'O que você fez para lidar com isso hoje?',
      textoAuxiliar: 'Selecione todas as opções que se aplicam',
      categoria: 'ESTRESSE',
      dominio: 'ESTRESSADO',
      tipoPergunta: 'MULTIPLA_SELECAO',
      obrigatoria: false,
      ordem: 1002,
      opcoes: [
        { valor: 'respiracao', label: 'Respiração/relaxamento' },
        { valor: 'pausa', label: 'Pausa/descanso' },
        { valor: 'atividade_fisica', label: 'Atividade física' },
        { valor: 'conversar', label: 'Conversei com alguém' },
        { valor: 'mindfulness', label: 'Mindfulness/meditação' },
        { valor: 'planejamento', label: 'Planejei as tarefas' },
        { valor: 'outro', label: 'Outro' },
      ],
      dificuldade: 0.5,
      discriminacao: 1.3,
      peso: 0.8,
    },
    {
      id: 'checkin-p8-suporte-social',
      questionarioId: questionario.id,
      texto: 'Sinto que tenho apoio de pessoas próximas quando preciso',
      textoAuxiliar: null,
      categoria: 'BEM_ESTAR',
      dominio: 'CALMO',
      tipoPergunta: 'LIKERT_5',
      obrigatoria: false,
      ordem: 1003,
      opcoes: [
        { valor: 1, label: 'Nada' },
        { valor: 2, label: 'Pouco' },
        { valor: 3, label: 'Moderado' },
        { valor: 4, label: 'Bom' },
        { valor: 5, label: 'Muito' },
      ],
      valorMinimo: 1,
      valorMaximo: 5,
      dificuldade: 0.4,
      discriminacao: 1.2,
      peso: 0.7,
    },
    {
      id: 'checkin-p9-risco-autoagressao',
      questionarioId: questionario.id,
      texto: 'Você teve pensamentos de se machucar nas últimas 24h?',
      textoAuxiliar: null,
      categoria: 'PENSAMENTOS_NEGATIVOS',
      dominio: 'DEPRIMIDO',
      tipoPergunta: 'SIM_NAO',
      obrigatoria: false,
      ordem: 1004,
      opcoes: [
        { valor: true, label: 'Sim' },
        { valor: false, label: 'Não' },
      ],
      dificuldade: 0.8,
      discriminacao: 1.8,
      peso: 2.0,
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
      id: 'regra-checkin-estresse-sim',
      questionarioId: questionario.id,
      nome: 'Estresse Detectado - Investigar Causa',
      descricao: 'Se respondeu "Sim" para estresse, perguntar causa',
      prioridade: 10,
      condicoes: {
        all: [
          {
            fact: 'resposta',
            operator: 'equal',
            value: true,
            path: '$.valor',
          },
          {
            fact: 'respostaAtual',
            operator: 'equal',
            value: 'checkin-p4-estresse',
            path: '$.perguntaId',
          },
        ],
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'checkin-p5-causa-estresse',
            prioridade: 1,
          },
        },
      ],
      tipoCondicao: 'VALOR_EXATO',
      tipoAcao: ['INSERIR_PERGUNTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-padrao-preocupante',
      questionarioId: questionario.id,
      nome: 'Padrão Preocupante - 3 Dias Seguidos',
      descricao: 'Se humor negativo (valencia < -0.5) por 3 dias consecutivos, gerar alerta',
      prioridade: 15,
      condicoes: {
        all: [
          {
            fact: 'mediasHistoricas',
            operator: 'trendDown',
            value: {
              dias: 3,
              threshold: -0.5,
              categoria: 'humor',
            },
          },
        ],
      },
      acoes: [
        {
          type: 'GERAR_ALERTA',
          params: {
            tipo: 'PADRAO_PREOCUPANTE',
            nivel: 'AMARELO',
            categoria: 'BEM_ESTAR',
            mensagem: 'Padrão de humor baixo detectado nos últimos 3 dias',
            recomendacoes: [
              'Considere fazer um questionário WHO-5 completo',
              'Procure conversar com alguém de confiança',
            ],
          },
        },
        {
          type: 'SUGERIR_QUESTIONARIO',
          params: {
            questionarioId: 'who-5',
            motivo: 'Aprofundar avaliação de bem-estar',
          },
        },
      ],
      tipoCondicao: 'TENDENCIA',
      tipoAcao: ['CRIAR_ALERTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-sono-ruim',
      questionarioId: questionario.id,
      nome: 'Sono Ruim - Alerta',
      descricao: 'Se sono <= 2 (ruim), gerar alerta',
      prioridade: 8,
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
            value: 'checkin-p2-sono',
            path: '$.perguntaId',
          },
        ],
      },
      acoes: [
        {
          type: 'GERAR_ALERTA',
          params: {
            tipo: 'RISCO_MODERADO',
            nivel: 'AMARELO',
            categoria: 'SONO',
            mensagem: 'Qualidade de sono abaixo do recomendado',
            recomendacoes: [
              'Mantenha horários regulares de sono',
              'Evite telas 1h antes de dormir',
              'Pratique relaxamento antes de dormir',
            ],
          },
        },
      ],
      tipoCondicao: 'MENOR_OU_IGUAL',
      tipoAcao: ['CRIAR_ALERTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-sono-seguimento-ruim',
      questionarioId: questionario.id,
      nome: 'Sono Ruim - Investigar Detalhes',
      descricao: 'Se sono <= 2, perguntar detalhes do sono',
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
            value: 'checkin-p2-sono',
            path: '$.perguntaId',
          },
        ],
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'checkin-p6-sono-detalhes',
            prioridade: 1,
          },
        },
      ],
      tipoCondicao: 'MENOR_OU_IGUAL',
      tipoAcao: ['INSERIR_PERGUNTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-apos-sono-detalhes',
      questionarioId: questionario.id,
      nome: 'Após Sono Detalhes - Perguntar Tempo',
      descricao: 'Após detalhe do sono, perguntar horas dormidas',
      prioridade: 8,
      condicoes: {
        all: [
          {
            fact: 'respostaAtual',
            operator: 'equal',
            value: 'checkin-p6-sono-detalhes',
            path: '$.perguntaId',
          },
          {
            fact: 'resposta',
            operator: 'greaterThan',
            value: 0,
            path: '$.valorLength',
          },
        ],
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'checkin-p6-sono-tempo',
            prioridade: 1,
          },
        },
      ],
      tipoCondicao: 'MULTIPLAS_RESPOSTAS',
      tipoAcao: ['INSERIR_PERGUNTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-coping-apos-causa',
      questionarioId: questionario.id,
      nome: 'Após Causa do Estresse - Coping',
      descricao: 'Se selecionou causas de estresse, perguntar estratégias de enfrentamento',
      prioridade: 9,
      condicoes: {
        all: [
          {
            fact: 'respostaAtual',
            operator: 'equal',
            value: 'checkin-p5-causa-estresse',
            path: '$.perguntaId',
          },
          {
            fact: 'resposta',
            operator: 'greaterThan',
            value: 0,
            path: '$.valorLength',
          },
        ],
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'checkin-p7-estrategias-coping',
            prioridade: 1,
          },
        },
      ],
      tipoCondicao: 'MULTIPLAS_RESPOSTAS',
      tipoAcao: ['INSERIR_PERGUNTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-suporte-social-necessario',
      questionarioId: questionario.id,
      nome: 'Causas Relacionais - Suporte Social',
      descricao: 'Se causa do estresse envolver família/relacionamentos, avaliar suporte social',
      prioridade: 9,
      condicoes: {
        any: [
          {
            all: [
              { fact: 'respostaAtual', operator: 'equal', value: 'checkin-p5-causa-estresse', path: '$.perguntaId' },
              { fact: 'resposta', operator: 'includesValue', value: 'familia', path: '$.valor' },
            ]
          },
          {
            all: [
              { fact: 'respostaAtual', operator: 'equal', value: 'checkin-p5-causa-estresse', path: '$.perguntaId' },
              { fact: 'resposta', operator: 'includesValue', value: 'relacionamentos', path: '$.valor' },
            ]
          }
        ]
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'checkin-p8-suporte-social',
            prioridade: 1,
          },
        },
      ],
      tipoCondicao: 'CONTEM_TEXTO',
      tipoAcao: ['INSERIR_PERGUNTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-triagem-risco',
      questionarioId: questionario.id,
      nome: 'Baixa Energia + Humor Negativo - Triagem de Risco',
      descricao: 'Se energia muito baixa e humor negativo, perguntar sobre risco',
      prioridade: 12,
      condicoes: {
        all: [
          { fact: 'respostaAtual', operator: 'equal', value: 'checkin-p3-energia', path: '$.perguntaId' },
          { fact: 'resposta', operator: 'lessThanInclusive', value: 2, path: '$.valor' },
          { any: [
            { fact: 'respostas', operator: 'contains', value: { perguntaId: 'checkin-p1-humor', valor: 'triste' } },
            { fact: 'respostas', operator: 'contains', value: { perguntaId: 'checkin-p1-humor', valor: 'estressado' } },
            { fact: 'respostas', operator: 'contains', value: { perguntaId: 'checkin-p1-humor', valor: 'ansioso' } },
          ]}
        ]
      },
      acoes: [
        {
          type: 'INSERIR_PERGUNTA',
          params: {
            perguntaId: 'checkin-p9-risco-autoagressao',
            prioridade: 1,
          },
        },
        {
          type: 'GERAR_ALERTA',
          params: {
            tipo: 'TRIAGEM_RISCO',
            nivel: 'LARANJA',
            categoria: 'PENSAMENTOS_NEGATIVOS',
            mensagem: 'Conjunto de sinais preocupantes detectados (energia muito baixa + humor negativo)'
          }
        }
      ],
      tipoCondicao: 'MULTIPLAS_RESPOSTAS',
      tipoAcao: ['INSERIR_PERGUNTA', 'CRIAR_ALERTA'],
      ativo: true,
    },
    {
      id: 'regra-checkin-risco-confirmado',
      questionarioId: questionario.id,
      nome: 'Risco Autoagressão Confirmado',
      descricao: 'Se respondeu SIM para risco de autoagressão, gerar alerta vermelho e finalizar',
      prioridade: 20,
      condicoes: {
        all: [
          { fact: 'respostaAtual', operator: 'equal', value: 'checkin-p9-risco-autoagressao', path: '$.perguntaId' },
          { fact: 'resposta', operator: 'equal', value: true, path: '$.valor' }
        ]
      },
      acoes: [
        {
          type: 'GERAR_ALERTA',
          params: {
            tipo: 'RISCO_ALTO',
            nivel: 'VERMELHO',
            categoria: 'PENSAMENTOS_NEGATIVOS',
            mensagem: 'Resposta positiva para ideias de autoagressão nas últimas 24h',
          },
        },
        {
          type: 'FINALIZAR_QUESTIONARIO',
          params: {},
        }
      ],
      tipoCondicao: 'VALOR_EXATO',
      tipoAcao: ['CRIAR_ALERTA', 'FINALIZAR_QUESTIONARIO'],
      ativo: true,
    },
  ];

  for (const regra of regras) {
    await prisma.regraAdaptacao.create({
      data: regra,
    });
    console.log(`  ✅ Regra criada: ${regra.id}`);
  }

  console.log('✅ Questionário "Check-in Diário" criado com sucesso!');
  console.log(`   - 4 perguntas base`);
  console.log(`   - 6 perguntas adaptativas`);
  console.log(`   - 9 regras de adaptação`);
}

// Executar se chamado diretamente
if (require.main === module) {
  seedQuestionarioCheckIn()
    .catch((error) => {
      console.error('❌ Erro ao criar questionário:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedQuestionarioCheckIn };
