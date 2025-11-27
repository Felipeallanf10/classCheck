/**
 * Script de Teste Manual - Interpretação de Escalas Clínicas
 * 
 * Execute: npx tsx scripts/test-interpretacao-manual.ts
 */

import {
  interpretarPHQ9,
  interpretarGAD7,
  interpretarWHO5,
  analisarAlertasCombinados,
  calcularScoreEscala,
} from '../src/lib/escalas/interpretacao-clinica';

console.log('🧪 TESTE MANUAL - Interpretação de Escalas Clínicas\n');
console.log('=' .repeat(70));

// ============================================================================
// TESTE 1: PHQ-9 (Depressão)
// ============================================================================
console.log('\n📋 TESTE 1: PHQ-9 - Patient Health Questionnaire (Depressão)');
console.log('-'.repeat(70));

const casosTestePHQ9 = [
  { score: 2, descricao: 'Score baixo (sem depressão)' },
  { score: 7, descricao: 'Score leve' },
  { score: 12, descricao: 'Score moderado' },
  { score: 17, descricao: 'Score moderadamente grave' },
  { score: 24, descricao: 'Score grave' },
  { score: 5, item9: 2, descricao: 'Score leve MAS com pensamentos suicidas' },
];

casosTestePHQ9.forEach(({ score, descricao, item9 }) => {
  console.log(`\n🔹 Caso: ${descricao}`);
  console.log(`   Score: ${score}${item9 ? ` | Item 9: ${item9}` : ''}`);
  
  const resultado = interpretarPHQ9(score, item9);
  
  console.log(`   ┌─ Categoria: ${resultado.categoria}`);
  console.log(`   ├─ Alerta: ${resultado.nivelAlerta}`);
  console.log(`   ├─ Percentual: ${resultado.percentual}%`);
  console.log(`   ├─ Descrição: ${resultado.descricao}`);
  console.log(`   ├─ Recomendação: ${resultado.recomendacao}`);
  console.log(`   └─ Ação Imediata: ${resultado.requerAcaoImediata ? '⚠️ SIM' : '✓ Não'}`);
});

// ============================================================================
// TESTE 2: GAD-7 (Ansiedade)
// ============================================================================
console.log('\n\n📋 TESTE 2: GAD-7 - Generalized Anxiety Disorder (Ansiedade)');
console.log('-'.repeat(70));

const casosTesteGAD7 = [
  { score: 3, descricao: 'Score mínimo' },
  { score: 8, descricao: 'Score leve' },
  { score: 13, descricao: 'Score moderado' },
  { score: 19, descricao: 'Score grave' },
];

casosTesteGAD7.forEach(({ score, descricao }) => {
  console.log(`\n🔹 Caso: ${descricao}`);
  console.log(`   Score: ${score}`);
  
  const resultado = interpretarGAD7(score);
  
  console.log(`   ┌─ Categoria: ${resultado.categoria}`);
  console.log(`   ├─ Alerta: ${resultado.nivelAlerta}`);
  console.log(`   ├─ Percentual: ${resultado.percentual}%`);
  console.log(`   ├─ Descrição: ${resultado.descricao}`);
  console.log(`   ├─ Recomendação: ${resultado.recomendacao}`);
  console.log(`   └─ Ação Imediata: ${resultado.requerAcaoImediata ? '⚠️ SIM' : '✓ Não'}`);
});

// ============================================================================
// TESTE 3: WHO-5 (Bem-Estar)
// ============================================================================
console.log('\n\n📋 TESTE 3: WHO-5 - Well-Being Index (Bem-Estar)');
console.log('-'.repeat(70));

const casosTesteWHO5 = [
  { score: 5, descricao: 'Bem-estar muito baixo (20%)' },
  { score: 10, descricao: 'Bem-estar baixo (40%)' },
  { score: 15, descricao: 'Bem-estar moderado (60%)' },
  { score: 22, descricao: 'Bem-estar alto (88%)' },
];

casosTesteWHO5.forEach(({ score, descricao }) => {
  console.log(`\n🔹 Caso: ${descricao}`);
  console.log(`   Score: ${score}/25`);
  
  const resultado = interpretarWHO5(score);
  
  console.log(`   ┌─ Categoria: ${resultado.categoria}`);
  console.log(`   ├─ Alerta: ${resultado.nivelAlerta}`);
  console.log(`   ├─ Percentual: ${resultado.percentual}%`);
  console.log(`   ├─ Descrição: ${resultado.descricao}`);
  console.log(`   ├─ Recomendação: ${resultado.recomendacao}`);
  console.log(`   └─ Ação Imediata: ${resultado.requerAcaoImediata ? '⚠️ SIM' : '✓ Não'}`);
});

// ============================================================================
// TESTE 4: Análise Combinada
// ============================================================================
console.log('\n\n📋 TESTE 4: Análise Combinada de Múltiplas Escalas');
console.log('-'.repeat(70));

const casosCombinados = [
  {
    nome: 'Perfil saudável',
    phq9: 3,
    gad7: 2,
    who5: 20,
  },
  {
    nome: 'Ansiedade moderada isolada',
    phq9: 4,
    gad7: 12,
    who5: 18,
  },
  {
    nome: 'Depressão e ansiedade graves',
    phq9: 20,
    gad7: 18,
    who5: 6,
  },
  {
    nome: 'Risco crítico (pensamentos suicidas)',
    phq9: 8,
    phq9Item9: 3,
    gad7: 15,
    who5: 8,
  },
];

casosCombinados.forEach(({ nome, phq9, phq9Item9, gad7, who5 }) => {
  console.log(`\n🔹 ${nome}`);
  console.log(`   Scores: PHQ-9=${phq9}${phq9Item9 ? `(item9=${phq9Item9})` : ''}, GAD-7=${gad7}, WHO-5=${who5}`);
  
  const resultadoPHQ9 = interpretarPHQ9(phq9, phq9Item9);
  const resultadoGAD7 = interpretarGAD7(gad7);
  const resultadoWHO5 = interpretarWHO5(who5);
  
  const combinado = analisarAlertasCombinados(resultadoPHQ9, resultadoGAD7, resultadoWHO5);
  
  console.log(`   ┌─ Nível Máximo: ${combinado.nivelMaximo}`);
  console.log(`   ├─ Requer Ação Imediata: ${combinado.requerAcaoImediata ? '⚠️ SIM' : '✓ Não'}`);
  console.log(`   └─ Mensagem: ${combinado.mensagemConsolidada}`);
});

// ============================================================================
// TESTE 5: Cálculo de Score (Simulação de Respostas)
// ============================================================================
console.log('\n\n📋 TESTE 5: Cálculo de Score a partir de Respostas');
console.log('-'.repeat(70));

const simulacoesRespostas = [
  {
    escala: 'PHQ-9',
    respostas: [1, 1, 0, 2, 1, 0, 1, 0, 0], // 9 respostas
    descricao: 'Depressão leve',
  },
  {
    escala: 'GAD-7',
    respostas: [2, 3, 2, 2, 1, 2, 3], // 7 respostas
    descricao: 'Ansiedade moderada',
  },
  {
    escala: 'WHO-5',
    respostas: [3, 4, 3, 2, 3], // 5 respostas (0-4)
    descricao: 'Bem-estar moderado',
  },
];

simulacoesRespostas.forEach(({ escala, respostas, descricao }) => {
  console.log(`\n🔹 ${escala} - ${descricao}`);
  console.log(`   Respostas: [${respostas.join(', ')}]`);
  
  const respostasFormatadas = respostas.map(valor => ({ valor }));
  const score = calcularScoreEscala(respostasFormatadas);
  
  console.log(`   ┌─ Score calculado: ${score}`);
  
  // Interpretar baseado na escala
  let interpretacao;
  if (escala === 'PHQ-9') {
    interpretacao = interpretarPHQ9(score);
    console.log(`   ├─ Categoria: ${interpretacao.categoria}`);
    console.log(`   └─ Alerta: ${interpretacao.nivelAlerta}`);
  } else if (escala === 'GAD-7') {
    interpretacao = interpretarGAD7(score);
    console.log(`   ├─ Categoria: ${interpretacao.categoria}`);
    console.log(`   └─ Alerta: ${interpretacao.nivelAlerta}`);
  } else if (escala === 'WHO-5') {
    interpretacao = interpretarWHO5(score);
    console.log(`   ├─ Categoria: ${interpretacao.categoria}`);
    console.log(`   └─ Alerta: ${interpretacao.nivelAlerta}`);
  }
});

// ============================================================================
// RESUMO FINAL
// ============================================================================
console.log('\n\n' + '='.repeat(70));
console.log('✅ TESTES CONCLUÍDOS COM SUCESSO!');
console.log('='.repeat(70));

console.log('\n📊 Resumo dos Testes:');
console.log('  ✓ PHQ-9: 6 casos testados (incluindo risco suicida)');
console.log('  ✓ GAD-7: 4 casos testados');
console.log('  ✓ WHO-5: 4 casos testados');
console.log('  ✓ Análise combinada: 4 perfis testados');
console.log('  ✓ Cálculo de scores: 3 simulações');

console.log('\n🎯 Próximos Passos:');
console.log('  1. Verificar perguntas no Prisma Studio');
console.log('  2. Testar integração com sistema adaptativo (IRT)');
console.log('  3. Fazer merge para develop se tudo OK');

console.log('\n💡 Comandos Úteis:');
console.log('  - Abrir Prisma Studio: npm run db:studio');
console.log('  - Executar seed novamente: npm run db:seed:escalas');
console.log('  - Rodar testes unitários: npm test -- interpretacao-clinica');
console.log('');
