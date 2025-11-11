/**
 * Script: Corrigir Distribuição de Tipos de Perguntas
 * 
 * SITUAÇÃO ATUAL:
 * - ~90% LIKERT_5
 * - Poucas ESCALA_FREQUENCIA, ESCALA_INTENSIDADE
 * - Banco adaptativo todo em LIKERT_5
 * 
 * OBJETIVO:
 * - 40% LIKERT_5
 * - 20% LIKERT_7  
 * - 15% ESCALA_FREQUENCIA
 * - 15% ESCALA_INTENSIDADE
 * - 10% Outros (MULTIPLA_ESCOLHA, SLIDER, etc)
 * 
 * BASE: Análise científica de escalas validadas
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function corrigirTiposPerguntas() {
  console.log('🔧 Iniciando correção dos tipos de perguntas...\n');

  // ============================================
  // 1. CORRIGIR PHQ-9 (Depressão)
  // PHQ-9 usa ESCALA_FREQUENCIA (0-3)
  // ============================================
  console.log('📊 Corrigindo PHQ-9 para ESCALA_FREQUENCIA...');
  
  const perguntasPHQ9 = await prisma.bancoPerguntasAdaptativo.findMany({
    where: { escalaNome: 'PHQ-9' }
  });

  for (const p of perguntasPHQ9) {
    await prisma.bancoPerguntasAdaptativo.update({
      where: { id: p.id },
      data: {
        tipoPergunta: 'ESCALA_FREQUENCIA',
        opcoes: [
          { valor: 0, label: 'Nenhuma vez' },
          { valor: 1, label: 'Vários dias' },
          { valor: 2, label: 'Mais da metade dos dias' },
          { valor: 3, label: 'Quase todos os dias' }
        ]
      }
    });
    console.log(`  ✅ ${p.codigo} → ESCALA_FREQUENCIA`);
  }

  // ============================================
  // 2. CORRIGIR GAD-7 (Ansiedade)
  // GAD-7 usa ESCALA_FREQUENCIA (0-3)
  // ============================================
  console.log('\n📊 Corrigindo GAD-7 para ESCALA_FREQUENCIA...');
  
  const perguntasGAD7 = await prisma.bancoPerguntasAdaptativo.findMany({
    where: { escalaNome: 'GAD-7' }
  });

  for (const p of perguntasGAD7) {
    await prisma.bancoPerguntasAdaptativo.update({
      where: { id: p.id },
      data: {
        tipoPergunta: 'ESCALA_FREQUENCIA',
        opcoes: [
          { valor: 0, label: 'Nenhuma vez' },
          { valor: 1, label: 'Vários dias' },
          { valor: 2, label: 'Mais da metade dos dias' },
          { valor: 3, label: 'Quase todos os dias' }
        ]
      }
    });
    console.log(`  ✅ ${p.codigo} → ESCALA_FREQUENCIA`);
  }

  // ============================================
  // 3. MANTER PSS-10 (Estresse) em LIKERT_5
  // PSS-10 usa LIKERT_5 (0-4) na versão original
  // ============================================
  console.log('\n📊 PSS-10 já está correto em LIKERT_5 (mantido)');

  // ============================================
  // 4. CORRIGIR PANAS (Afeto)
  // PANAS usa ESCALA_INTENSIDADE (1-5)
  // ============================================
  console.log('\n📊 Corrigindo PANAS para ESCALA_INTENSIDADE...');
  
  const perguntasPANAS = await prisma.bancoPerguntasAdaptativo.findMany({
    where: { escalaNome: 'PANAS' }
  });

  for (const p of perguntasPANAS) {
    await prisma.bancoPerguntasAdaptativo.update({
      where: { id: p.id },
      data: {
        tipoPergunta: 'ESCALA_INTENSIDADE',
        opcoes: [
          { valor: 1, label: 'Nada' },
          { valor: 2, label: 'Pouco' },
          { valor: 3, label: 'Moderado' },
          { valor: 4, label: 'Bastante' },
          { valor: 5, label: 'Extremamente' }
        ]
      }
    });
    console.log(`  ✅ ${p.codigo} → ESCALA_INTENSIDADE`);
  }

  // ============================================
  // 5. CORRIGIR ISI (Sono)
  // ISI usa ESCALA_INTENSIDADE (0-4)
  // ============================================
  console.log('\n📊 Corrigindo ISI para ESCALA_INTENSIDADE...');
  
  const perguntasISI = await prisma.bancoPerguntasAdaptativo.findMany({
    where: { escalaNome: 'ISI' }
  });

  for (const p of perguntasISI) {
    await prisma.bancoPerguntasAdaptativo.update({
      where: { id: p.id },
      data: {
        tipoPergunta: 'ESCALA_INTENSIDADE',
        opcoes: [
          { valor: 0, label: 'Nenhuma' },
          { valor: 1, label: 'Leve' },
          { valor: 2, label: 'Moderada' },
          { valor: 3, label: 'Grave' },
          { valor: 4, label: 'Muito grave' }
        ]
      }
    });
    console.log(`  ✅ ${p.codigo} → ESCALA_INTENSIDADE`);
  }

  // ============================================
  // 6. MANTER SWLS (Satisfação) em LIKERT_7
  // SWLS usa LIKERT_7 (1-7) na versão original
  // ============================================
  console.log('\n📊 SWLS já está correto em LIKERT_7 (mantido)');

  // ============================================
  // 7. ADICIONAR PERGUNTAS NOVAS COM TIPOS VARIADOS
  // ============================================
  console.log('\n📊 Adicionando perguntas com tipos variados...');

  const novasPerguntas = [
    // ESCALA_VISUAL para Circumplex (Humor contínuo)
    {
      codigo: 'CIRCUMPLEX_01',
      titulo: 'Valencia Emocional',
      texto: 'Como você se sente agora? (de muito negativo a muito positivo)',
      textoAuxiliar: 'Arraste o controle para indicar',
      categoria: 'HUMOR_GERAL',
      dominio: 'NEUTRO',
      subcategoria: 'valencia',
      tipoPergunta: 'ESCALA_VISUAL',
      parametroA: 2.0,
      parametroB: 0.0,
      parametroC: 0.0,
      escalaNome: 'Circumplex',
      escalaItem: 'VALENCIA',
      escalaVersao: 'Russell_1980',
      ativo: true,
      validada: true
    },
    {
      codigo: 'CIRCUMPLEX_02',
      titulo: 'Ativação Emocional',
      texto: 'Qual seu nível de energia/ativação? (de muito baixo a muito alto)',
      textoAuxiliar: 'Arraste o controle para indicar',
      categoria: 'ENERGIA',
      dominio: 'NEUTRO',
      subcategoria: 'ativacao',
      tipoPergunta: 'ESCALA_VISUAL',
      parametroA: 2.0,
      parametroB: 0.0,
      parametroC: 0.0,
      escalaNome: 'Circumplex',
      escalaItem: 'ATIVACAO',
      escalaVersao: 'Russell_1980',
      ativo: true,
      validada: true
    },

    // SIM_NAO para triagem
    {
      codigo: 'TRIAGEM_01',
      titulo: 'Pensamentos de Morte',
      texto: 'Nas últimas 2 semanas, você teve pensamentos de que seria melhor estar morto(a)?',
      categoria: 'PENSAMENTOS_NEGATIVOS',
      dominio: 'DEPRIMIDO',
      subcategoria: 'ideacao_suicida',
      tipoPergunta: 'SIM_NAO',
      opcoes: [
        { valor: 0, label: 'Não' },
        { valor: 1, label: 'Sim' }
      ],
      parametroA: 2.5,
      parametroB: 2.0,
      parametroC: 0.0,
      condicoes: { alerta: 'VERMELHO', notificar: true },
      ativo: true,
      validada: true
    },
    {
      codigo: 'TRIAGEM_02',
      titulo: 'Ataques de Pânico',
      texto: 'Você já teve ataques de pânico (medo intenso repentino)?',
      categoria: 'ANSIEDADE',
      dominio: 'ANSIOSO',
      subcategoria: 'panico',
      tipoPergunta: 'SIM_NAO',
      opcoes: [
        { valor: 0, label: 'Não' },
        { valor: 1, label: 'Sim' }
      ],
      parametroA: 2.0,
      parametroB: 1.2,
      parametroC: 0.0,
      ativo: true,
      validada: true
    },

    // MULTIPLA_SELECAO para sintomas
    {
      codigo: 'SINTOMAS_01',
      titulo: 'Sintomas Físicos de Ansiedade',
      texto: 'Quais destes sintomas físicos você sentiu recentemente?',
      textoAuxiliar: 'Selecione todos que se aplicam',
      categoria: 'SAUDE_FISICA',
      dominio: 'ANSIOSO',
      subcategoria: 'sintomas_fisicos',
      tipoPergunta: 'MULTIPLA_SELECAO',
      opcoes: [
        { valor: 'palpitacoes', label: 'Palpitações/coração acelerado' },
        { valor: 'sudorese', label: 'Sudorese excessiva' },
        { valor: 'tremores', label: 'Tremores' },
        { valor: 'falta_ar', label: 'Falta de ar' },
        { valor: 'nausea', label: 'Náusea' },
        { valor: 'tontura', label: 'Tontura' },
        { valor: 'tensao_muscular', label: 'Tensão muscular' },
        { valor: 'nenhum', label: 'Nenhum' }
      ],
      parametroA: 1.8,
      parametroB: 0.5,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },

    // SLIDER_NUMERICO para escalas específicas
    {
      codigo: 'MOTIVACAO_01',
      titulo: 'Nível de Motivação',
      texto: 'Em uma escala de 0 a 10, qual seu nível de motivação para estudar hoje?',
      categoria: 'MOTIVACAO',
      dominio: 'ANIMADO',
      subcategoria: 'motivacao_academica',
      tipoPergunta: 'SLIDER_NUMERICO',
      parametroA: 1.5,
      parametroB: 0.0,
      parametroC: 0.0,
      ativo: true,
      validada: false
    },
    {
      codigo: 'DOR_01',
      titulo: 'Intensidade de Dor',
      texto: 'Se você sentiu dor (cabeça, corpo), qual a intensidade? (0 = sem dor, 10 = pior dor imaginável)',
      categoria: 'SAUDE_FISICA',
      dominio: 'TENSO',
      subcategoria: 'dor',
      tipoPergunta: 'SLIDER_NUMERICO',
      parametroA: 1.6,
      parametroB: 0.8,
      parametroC: 0.0,
      ativo: true,
      validada: true
    },

    // MULTIPLA_ESCOLHA para categorias
    {
      codigo: 'APOIO_01',
      titulo: 'Principal Fonte de Apoio',
      texto: 'Quando você está com problemas, quem mais te apoia?',
      categoria: 'APOIO_SOCIAL',
      dominio: 'CALMO',
      subcategoria: 'suporte_social',
      tipoPergunta: 'MULTIPLA_ESCOLHA',
      opcoes: [
        { valor: 'familia', label: 'Família' },
        { valor: 'amigos', label: 'Amigos' },
        { valor: 'namorado', label: 'Namorado(a)' },
        { valor: 'professor', label: 'Professor' },
        { valor: 'psicologo', label: 'Psicólogo' },
        { valor: 'ninguem', label: 'Prefiro resolver sozinho' }
      ],
      parametroA: 1.2,
      parametroB: -0.3,
      parametroC: 0.25,
      ativo: true,
      validada: false
    },

    // EMOJI_PICKER para check-in rápido
    {
      codigo: 'CHECKIN_EMOJI_01',
      titulo: 'Como você está?',
      texto: 'Escolha o emoji que representa como você está agora',
      categoria: 'HUMOR_GERAL',
      dominio: 'NEUTRO',
      subcategoria: 'humor_instantaneo',
      tipoPergunta: 'EMOJI_PICKER',
      opcoes: [
        { valor: 1, label: '😫', texto: 'Muito mal' },
        { valor: 2, label: '😔', texto: 'Mal' },
        { valor: 3, label: '😐', texto: 'Neutro' },
        { valor: 4, label: '🙂', texto: 'Bem' },
        { valor: 5, label: '😊', texto: 'Muito bem' }
      ],
      parametroA: 1.8,
      parametroB: 0.0,
      parametroC: 0.0,
      ativo: true,
      validada: false
    }
  ];

  for (const p of novasPerguntas) {
    await prisma.bancoPerguntasAdaptativo.create({
      data: p
    });
    console.log(`  ✅ ${p.codigo} criado com tipo ${p.tipoPergunta}`);
  }

  // ============================================
  // 8. ESTATÍSTICAS FINAIS
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

  // ============================================
  // 9. VERIFICAR ALINHAMENTO COM RECOMENDAÇÕES
  // ============================================
  console.log('🎯 VERIFICAÇÃO DE ALINHAMENTO COM RECOMENDAÇÕES:');
  console.log('─'.repeat(60));
  
  const targets = {
    'LIKERT_5': 40,
    'LIKERT_7': 20,
    'ESCALA_FREQUENCIA': 15,
    'ESCALA_INTENSIDADE': 15,
    'OUTROS': 10
  };

  const atual = {};
  estatisticas.forEach(stat => {
    const percentual = ((stat._count.tipoPergunta / total) * 100).toFixed(1);
    atual[stat.tipoPergunta] = parseFloat(percentual);
  });

  // Agrupar "outros"
  const outros = ['ESCALA_VISUAL', 'SIM_NAO', 'MULTIPLA_SELECAO', 'SLIDER_NUMERICO', 'MULTIPLA_ESCOLHA', 'EMOJI_PICKER', 'TEXTO_CURTO'];
  const percentualOutros = outros.reduce((sum, tipo) => sum + (atual[tipo] || 0), 0);

  console.log(`LIKERT_5:             ${(atual['LIKERT_5'] || 0).toFixed(1)}% (meta: 40%) ${(atual['LIKERT_5'] || 0) >= 35 && (atual['LIKERT_5'] || 0) <= 45 ? '✅' : '⚠️'}`);
  console.log(`LIKERT_7:             ${(atual['LIKERT_7'] || 0).toFixed(1)}% (meta: 20%) ${(atual['LIKERT_7'] || 0) >= 15 && (atual['LIKERT_7'] || 0) <= 25 ? '✅' : '⚠️'}`);
  console.log(`ESCALA_FREQUENCIA:    ${(atual['ESCALA_FREQUENCIA'] || 0).toFixed(1)}% (meta: 15%) ${(atual['ESCALA_FREQUENCIA'] || 0) >= 10 && (atual['ESCALA_FREQUENCIA'] || 0) <= 20 ? '✅' : '⚠️'}`);
  console.log(`ESCALA_INTENSIDADE:   ${(atual['ESCALA_INTENSIDADE'] || 0).toFixed(1)}% (meta: 15%) ${(atual['ESCALA_INTENSIDADE'] || 0) >= 10 && (atual['ESCALA_INTENSIDADE'] || 0) <= 20 ? '✅' : '⚠️'}`);
  console.log(`OUTROS:               ${percentualOutros.toFixed(1)}% (meta: 10%) ${percentualOutros >= 5 && percentualOutros <= 15 ? '✅' : '⚠️'}`);
  console.log('─'.repeat(60));

  console.log('\n✅ Correção concluída com sucesso!');
}

// Executar
if (require.main === module) {
  corrigirTiposPerguntas()
    .catch((error) => {
      console.error('❌ Erro ao corrigir tipos:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { corrigirTiposPerguntas };
