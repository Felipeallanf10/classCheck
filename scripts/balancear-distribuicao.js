/**
 * Script: Adicionar Perguntas para Balancear Distribuição
 * 
 * SITUAÇÃO APÓS PRIMEIRA CORREÇÃO:
 * - ESCALA_INTENSIDADE: 40.3% (muito alto, meta 15%)
 * - ESCALA_FREQUENCIA: 28.4% (alto, meta 15%)
 * - LIKERT_5: 10.4% (baixo, meta 40%)
 * - LIKERT_7: 7.5% (baixo, meta 20%)
 * 
 * AÇÃO: Adicionar ~30 perguntas em LIKERT_5 e ~15 em LIKERT_7
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function balancearDistribuicao() {
  console.log('⚖️ Balanceando distribuição de tipos de perguntas...\n');

  // ============================================
  // ADICIONAR PERGUNTAS LIKERT_5 (para chegar a 40%)
  // ============================================
  console.log('📊 Adicionando perguntas LIKERT_5...');

  const perguntasLikert5 = [
    // Concentração e Desempenho Acadêmico
    {
      codigo: 'CONC_01',
      titulo: 'Capacidade de Concentração',
      texto: 'Como está sua capacidade de se concentrar nos estudos?',
      categoria: 'CONCENTRACAO',
      dominio: 'CALMO',
      subcategoria: 'foco',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Muito ruim' },
        { valor: 2, label: 'Ruim' },
        { valor: 3, label: 'Regular' },
        { valor: 4, label: 'Boa' },
        { valor: 5, label: 'Excelente' }
      ],
      parametroA: 1.6,
      parametroB: 0.0,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'DESEM_01',
      titulo: 'Satisfação com Desempenho',
      texto: 'Você está satisfeito(a) com seu desempenho acadêmico?',
      categoria: 'DESEMPENHO_ACADEMICO',
      dominio: 'CONTENTE',
      subcategoria: 'satisfacao_academica',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Muito insatisfeito' },
        { valor: 2, label: 'Insatisfeito' },
        { valor: 3, label: 'Neutro' },
        { valor: 4, label: 'Satisfeito' },
        { valor: 5, label: 'Muito satisfeito' }
      ],
      parametroA: 1.5,
      parametroB: -0.2,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Relacionamentos
    {
      codigo: 'REL_01',
      titulo: 'Qualidade dos Relacionamentos',
      texto: 'Como você avalia a qualidade dos seus relacionamentos com colegas?',
      categoria: 'RELACIONAMENTOS',
      dominio: 'FELIZ',
      subcategoria: 'relacoes_sociais',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Muito ruim' },
        { valor: 2, label: 'Ruim' },
        { valor: 3, label: 'Regular' },
        { valor: 4, label: 'Boa' },
        { valor: 5, label: 'Excelente' }
      ],
      parametroA: 1.4,
      parametroB: -0.3,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'REL_02',
      titulo: 'Sentimento de Pertencimento',
      texto: 'Você se sente parte do grupo/turma?',
      categoria: 'RELACIONAMENTOS',
      dominio: 'CALMO',
      subcategoria: 'pertencimento',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.7,
      parametroB: -0.1,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Autoestima
    {
      codigo: 'AUTO_01',
      titulo: 'Autoconfiança',
      texto: 'Eu me sinto confiante sobre minhas habilidades',
      categoria: 'AUTOESTIMA',
      dominio: 'FELIZ',
      subcategoria: 'autoconfianca',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo' },
        { valor: 3, label: 'Neutro' },
        { valor: 4, label: 'Concordo' },
        { valor: 5, label: 'Concordo totalmente' }
      ],
      parametroA: 1.8,
      parametroB: 0.1,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'AUTO_02',
      titulo: 'Autovalorização',
      texto: 'Eu me sinto uma pessoa de valor',
      categoria: 'AUTOESTIMA',
      dominio: 'CONTENTE',
      subcategoria: 'autovalor',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo' },
        { valor: 3, label: 'Neutro' },
        { valor: 4, label: 'Concordo' },
        { valor: 5, label: 'Concordo totalmente' }
      ],
      parametroA: 1.9,
      parametroB: 0.3,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Energia e Fadiga
    {
      codigo: 'ENER_01',
      titulo: 'Nível de Energia',
      texto: 'Como está seu nível de energia no dia a dia?',
      categoria: 'ENERGIA',
      dominio: 'ANIMADO',
      subcategoria: 'vitalidade',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Muito baixo' },
        { valor: 2, label: 'Baixo' },
        { valor: 3, label: 'Moderado' },
        { valor: 4, label: 'Alto' },
        { valor: 5, label: 'Muito alto' }
      ],
      parametroA: 1.6,
      parametroB: -0.4,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'FAD_01',
      titulo: 'Fadiga Mental',
      texto: 'Você se sente mentalmente esgotado(a)?',
      categoria: 'FADIGA',
      dominio: 'CANSADO',
      subcategoria: 'fadiga_mental',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.7,
      parametroB: 0.2,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Sono - Qualidade
    {
      codigo: 'SONO_01',
      titulo: 'Qualidade do Sono',
      texto: 'Como você avalia a qualidade do seu sono?',
      categoria: 'SONO',
      dominio: 'RELAXADO',
      subcategoria: 'qualidade_sono',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Péssima' },
        { valor: 2, label: 'Ruim' },
        { valor: 3, label: 'Regular' },
        { valor: 4, label: 'Boa' },
        { valor: 5, label: 'Excelente' }
      ],
      parametroA: 1.5,
      parametroB: -0.2,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'SONO_02',
      titulo: 'Suficiência do Sono',
      texto: 'Você sente que dorme o suficiente?',
      categoria: 'SONO',
      dominio: 'CALMO',
      subcategoria: 'suficiencia_sono',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.4,
      parametroB: -0.3,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Motivação
    {
      codigo: 'MOTIV_01',
      titulo: 'Motivação para Aprender',
      texto: 'Você se sente motivado(a) para aprender coisas novas?',
      categoria: 'MOTIVACAO',
      dominio: 'ENTUSIASMADO',
      subcategoria: 'motivacao_aprendizado',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.6,
      parametroB: -0.2,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'MOTIV_02',
      titulo: 'Perseverança',
      texto: 'Você persiste mesmo quando as coisas ficam difíceis?',
      categoria: 'MOTIVACAO',
      dominio: 'ANIMADO',
      subcategoria: 'persistencia',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.7,
      parametroB: 0.1,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Irritabilidade
    {
      codigo: 'IRRIT_01',
      titulo: 'Facilidade para Irritar',
      texto: 'Você tem se irritado com facilidade?',
      categoria: 'IRRITABILIDADE',
      dominio: 'IRRITADO',
      subcategoria: 'irritacao',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.6,
      parametroB: 0.3,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Apoio Social
    {
      codigo: 'APOIO_02',
      titulo: 'Percepção de Apoio',
      texto: 'Você sente que tem pessoas que te apoiam quando precisa?',
      categoria: 'APOIO_SOCIAL',
      dominio: 'CALMO',
      subcategoria: 'suporte_disponivel',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.5,
      parametroB: -0.5,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Bem-estar geral
    {
      codigo: 'BEM_01',
      titulo: 'Sensação de Bem-estar',
      texto: 'De modo geral, você se sente bem?',
      categoria: 'BEM_ESTAR',
      dominio: 'FELIZ',
      subcategoria: 'bem_estar_geral',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.8,
      parametroB: -0.3,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'BEM_02',
      titulo: 'Esperança no Futuro',
      texto: 'Você se sente esperançoso(a) em relação ao futuro?',
      categoria: 'BEM_ESTAR',
      dominio: 'FELIZ',
      subcategoria: 'otimismo',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Nunca' },
        { valor: 2, label: 'Raramente' },
        { valor: 3, label: 'Às vezes' },
        { valor: 4, label: 'Frequentemente' },
        { valor: 5, label: 'Sempre' }
      ],
      parametroA: 1.7,
      parametroB: -0.1,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // Saúde Física
    {
      codigo: 'SAUDE_01',
      titulo: 'Condição Física Geral',
      texto: 'Como você avalia sua saúde física no geral?',
      categoria: 'SAUDE_FISICA',
      dominio: 'ANIMADO',
      subcategoria: 'saude_geral',
      tipoPergunta: 'LIKERT_5',
      opcoes: [
        { valor: 1, label: 'Muito ruim' },
        { valor: 2, label: 'Ruim' },
        { valor: 3, label: 'Regular' },
        { valor: 4, label: 'Boa' },
        { valor: 5, label: 'Excelente' }
      ],
      parametroA: 1.3,
      parametroB: -0.4,
      parametroC: 0.0,
      ativo: true,
      validada: false
    }
  ];

  for (const p of perguntasLikert5) {
    await prisma.bancoPerguntasAdaptativo.create({
      data: p
    });
    console.log(`  ✅ ${p.codigo} criado (LIKERT_5)`);
  }

  // ============================================
  // ADICIONAR PERGUNTAS LIKERT_7 (para chegar a 20%)
  // ============================================
  console.log('\n📊 Adicionando perguntas LIKERT_7...');

  const perguntasLikert7 = [
    {
      codigo: 'SATISF_01',
      titulo: 'Satisfação com a Vida Social',
      texto: 'Quão satisfeito você está com sua vida social?',
      categoria: 'RELACIONAMENTOS',
      dominio: 'FELIZ',
      subcategoria: 'satisfacao_social',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Extremamente insatisfeito' },
        { valor: 2, label: 'Muito insatisfeito' },
        { valor: 3, label: 'Insatisfeito' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Satisfeito' },
        { valor: 6, label: 'Muito satisfeito' },
        { valor: 7, label: 'Extremamente satisfeito' }
      ],
      parametroA: 1.7,
      parametroB: 0.0,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'SATISF_02',
      titulo: 'Satisfação com Família',
      texto: 'Quão satisfeito você está com suas relações familiares?',
      categoria: 'RELACIONAMENTOS',
      dominio: 'CALMO',
      subcategoria: 'satisfacao_familiar',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Extremamente insatisfeito' },
        { valor: 2, label: 'Muito insatisfeito' },
        { valor: 3, label: 'Insatisfeito' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Satisfeito' },
        { valor: 6, label: 'Muito satisfeito' },
        { valor: 7, label: 'Extremamente satisfeito' }
      ],
      parametroA: 1.6,
      parametroB: -0.2,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'AUTO_03',
      titulo: 'Aceitação de Si Mesmo',
      texto: 'Eu me aceito como eu sou',
      categoria: 'AUTOESTIMA',
      dominio: 'CONTENTE',
      subcategoria: 'autoaceitacao',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 1.9,
      parametroB: 0.2,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'ANSI_01',
      titulo: 'Preocupação com Futuro',
      texto: 'Eu me preocupo excessivamente com o futuro',
      categoria: 'ANSIEDADE',
      dominio: 'ANSIOSO',
      subcategoria: 'ansiedade_futuro',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 1.8,
      parametroB: 0.3,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'BEM_03',
      titulo: 'Felicidade Geral',
      texto: 'De modo geral, eu me considero uma pessoa feliz',
      categoria: 'BEM_ESTAR',
      dominio: 'FELIZ',
      subcategoria: 'felicidade_geral',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 1.9,
      parametroB: -0.1,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'MOTIV_03',
      titulo: 'Propósito de Vida',
      texto: 'Eu sinto que minha vida tem propósito e significado',
      categoria: 'MOTIVACAO',
      dominio: 'FELIZ',
      subcategoria: 'proposito',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 1.8,
      parametroB: 0.1,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'REL_03',
      titulo: 'Qualidade de Amizades',
      texto: 'Eu tenho amizades profundas e significativas',
      categoria: 'RELACIONAMENTOS',
      dominio: 'CALMO',
      subcategoria: 'profundidade_amizades',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 1.6,
      parametroB: -0.1,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'DEPR_01',
      titulo: 'Humor Deprimido Geral',
      texto: 'Eu me sinto triste ou deprimido(a) com frequência',
      categoria: 'DEPRESSAO',
      dominio: 'DEPRIMIDO',
      subcategoria: 'humor_deprimido',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 2.0,
      parametroB: 0.5,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'CONC_02',
      titulo: 'Capacidade de Foco Prolongado',
      texto: 'Consigo manter o foco por períodos prolongados',
      categoria: 'CONCENTRACAO',
      dominio: 'CALMO',
      subcategoria: 'foco_prolongado',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 1.7,
      parametroB: 0.2,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'ESTR_01',
      titulo: 'Capacidade de Lidar com Estresse',
      texto: 'Eu lido bem com situações estressantes',
      categoria: 'ESTRESSE',
      dominio: 'CALMO',
      subcategoria: 'coping',
      tipoPergunta: 'LIKERT_7',
      opcoes: [
        { valor: 1, label: 'Discordo totalmente' },
        { valor: 2, label: 'Discordo muito' },
        { valor: 3, label: 'Discordo' },
        { valor: 4, label: 'Neutro' },
        { valor: 5, label: 'Concordo' },
        { valor: 6, label: 'Concordo muito' },
        { valor: 7, label: 'Concordo totalmente' }
      ],
      parametroA: 1.8,
      parametroB: 0.0,
      parametroC: 0.0,
      ativo: true,
      validada: false
    }
  ];

  for (const p of perguntasLikert7) {
    await prisma.bancoPerguntasAdaptativo.create({
      data: p
    });
    console.log(`  ✅ ${p.codigo} criado (LIKERT_7)`);
  }

  // ============================================
  // ESTATÍSTICAS FINAIS
  // ============================================
  console.log('\n📊 Calculando estatísticas finais...\n');

  const estatisticas = await prisma.bancoPerguntasAdaptativo.groupBy({
    by: ['tipoPergunta'],
    _count: {
      tipoPergunta: true
    }
  });

  const total = await prisma.bancoPerguntasAdaptativo.count();

  console.log('📈 DISTRIBUIÇÃO FINAL:');
  console.log('─'.repeat(60));
  
  estatisticas
    .sort((a, b) => b._count.tipoPergunta - a._count.tipoPergunta)
    .forEach(stat => {
      const percentual = ((stat._count.tipoPergunta / total) * 100).toFixed(1);
      const barra = '█'.repeat(Math.floor(percentual / 2));
      console.log(`${stat.tipoPergunta.padEnd(25)} ${stat._count.tipoPergunta.toString().padStart(3)} (${percentual}%) ${barra}`);
    });
  
  console.log('─'.repeat(60));
  console.log(`TOTAL: ${total} perguntas\n`);

  console.log('🎯 VERIFICAÇÃO FINAL:');
  console.log('─'.repeat(60));

  const atual = {};
  estatisticas.forEach(stat => {
    const percentual = ((stat._count.tipoPergunta / total) * 100).toFixed(1);
    atual[stat.tipoPergunta] = parseFloat(percentual);
  });

  const outros = ['ESCALA_VISUAL', 'SIM_NAO', 'MULTIPLA_SELECAO', 'SLIDER_NUMERICO', 'MULTIPLA_ESCOLHA', 'EMOJI_PICKER'];
  const percentualOutros = outros.reduce((sum, tipo) => sum + (atual[tipo] || 0), 0);

  console.log(`LIKERT_5:             ${(atual['LIKERT_5'] || 0).toFixed(1)}% (meta: 40%) ${(atual['LIKERT_5'] || 0) >= 35 && (atual['LIKERT_5'] || 0) <= 45 ? '✅' : '⚠️'}`);
  console.log(`LIKERT_7:             ${(atual['LIKERT_7'] || 0).toFixed(1)}% (meta: 20%) ${(atual['LIKERT_7'] || 0) >= 15 && (atual['LIKERT_7'] || 0) <= 25 ? '✅' : '⚠️'}`);
  console.log(`ESCALA_FREQUENCIA:    ${(atual['ESCALA_FREQUENCIA'] || 0).toFixed(1)}% (meta: 15%) ${(atual['ESCALA_FREQUENCIA'] || 0) >= 10 && (atual['ESCALA_FREQUENCIA'] || 0) <= 20 ? '✅' : '⚠️'}`);
  console.log(`ESCALA_INTENSIDADE:   ${(atual['ESCALA_INTENSIDADE'] || 0).toFixed(1)}% (meta: 15%) ${(atual['ESCALA_INTENSIDADE'] || 0) >= 10 && (atual['ESCALA_INTENSIDADE'] || 0) <= 20 ? '✅' : '⚠️'}`);
  console.log(`OUTROS:               ${percentualOutros.toFixed(1)}% (meta: 10%) ${percentualOutros >= 5 && percentualOutros <= 15 ? '✅' : '⚠️'}`);
  console.log('─'.repeat(60));

  console.log('\n✅ Balanceamento concluído com sucesso!');
}

if (require.main === module) {
  balancearDistribuicao()
    .catch((error) => {
      console.error('❌ Erro ao balancear:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { balancearDistribuicao };
