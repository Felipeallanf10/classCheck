/**
 * Script de Teste: Exportação de Relatórios Excel
 * 
 * Testa a geração de arquivos Excel com dados mockados para validar:
 * - 6 abas (Resumo, Scores, Escalas Clínicas, Evolução, Respostas, Alertas)
 * - Formatação de colunas
 * - Cálculos e estatísticas
 * 
 * Uso: ts-node scripts/test-excel-export.ts
 */

import { gerarRelatorioExcel } from '../src/lib/export/excel-generator';
import * as fs from 'fs';
import * as path from 'path';

async function testarExportacaoExcel() {
  console.log('🧪 Iniciando teste de exportação Excel...\n');

  // Dados mockados completos
  const dadosMock = {
    usuario: {
      nome: 'Maria Santos Teste',
      email: 'maria.teste@classcheck.com',
      matricula: '202401235',
    },
    periodo: {
      inicio: new Date('2025-01-01'),
      fim: new Date('2025-01-31'),
    },
    scoresPorCategoria: {
      ANSIEDADE: {
        media: 2.8,
        minimo: 1.2,
        maximo: 4.1,
        desvio: 0.8,
        tendencia: 'DESCENDO' as const,
        total_avaliacoes: 15,
      },
      DEPRESSAO: {
        media: 2.1,
        minimo: 0.5,
        maximo: 3.9,
        desvio: 1.1,
        tendencia: 'ESTAVEL' as const,
        total_avaliacoes: 15,
      },
      ESTRESSE: {
        media: 3.2,
        minimo: 2.0,
        maximo: 4.5,
        desvio: 0.7,
        tendencia: 'SUBINDO' as const,
        total_avaliacoes: 12,
      },
      RELACIONAMENTOS: {
        media: 3.8,
        minimo: 3.0,
        maximo: 4.5,
        desvio: 0.4,
        tendencia: 'SUBINDO' as const,
        total_avaliacoes: 8,
      },
    },
    thetaEvolucao: [
      { data: new Date('2025-01-05'), theta: -0.5, erro: 0.45, confianca: 0.69, perguntasRespondidas: 12 },
      { data: new Date('2025-01-10'), theta: -0.2, erro: 0.38, confianca: 0.72, perguntasRespondidas: 15 },
      { data: new Date('2025-01-15'), theta: 0.1, erro: 0.32, confianca: 0.76, perguntasRespondidas: 18 },
      { data: new Date('2025-01-20'), theta: 0.4, erro: 0.28, confianca: 0.78, perguntasRespondidas: 20 },
      { data: new Date('2025-01-25'), theta: 0.6, erro: 0.25, confianca: 0.80, perguntasRespondidas: 22 },
      { data: new Date('2025-01-30'), theta: 0.8, erro: 0.22, confianca: 0.82, perguntasRespondidas: 25 },
    ],
    respostas: [
      {
        data: new Date('2025-01-05'),
        pergunta: 'Como você tem se sentido em relação ao seu humor geral?',
        resposta: 3,
        categoria: 'HUMOR_GERAL',
        valorNormalizado: 0.6,
      },
      {
        data: new Date('2025-01-05'),
        pergunta: 'Com que frequência você se sentiu nervoso ou ansioso?',
        resposta: 2,
        categoria: 'ANSIEDADE',
        valorNormalizado: 0.4,
      },
      {
        data: new Date('2025-01-10'),
        pergunta: 'Você tem tido problemas para dormir?',
        resposta: 1,
        categoria: 'SONO',
        valorNormalizado: 0.2,
      },
      {
        data: new Date('2025-01-15'),
        pergunta: 'Como avalia seus relacionamentos com colegas?',
        resposta: 4,
        categoria: 'RELACIONAMENTOS',
        valorNormalizado: 0.8,
      },
      {
        data: new Date('2025-01-20'),
        pergunta: 'Você se sente sobrecarregado com suas atividades?',
        resposta: 3,
        categoria: 'ESTRESSE',
        valorNormalizado: 0.6,
      },
    ],
    alertas: [
      {
        data: new Date('2025-01-15'),
        tipo: 'ANSIEDADE',
        severidade: 'ALTA' as const,
        descricao: 'Score GAD-7 indica ansiedade moderada (score: 12)',
        status: 'PENDENTE',
      },
      {
        data: new Date('2025-01-20'),
        tipo: 'ESTRESSE',
        severidade: 'MEDIA' as const,
        descricao: 'Nível de estresse elevado detectado em múltiplas respostas',
        status: 'EM_ACOMPANHAMENTO',
      },
      {
        data: new Date('2025-01-10'),
        tipo: 'SONO',
        severidade: 'BAIXA' as const,
        descricao: 'Dificuldades pontuais com sono reportadas',
        status: 'RESOLVIDO',
      },
    ],
    interpretacoes: {
      phq9: {
        score: 8,
        categoria: 'Depressão Leve',
        nivelAlerta: 'MEDIA' as const,
        descricao: 'Sintomas depressivos leves detectados. Recomenda-se monitoramento.',
      },
      gad7: {
        score: 12,
        categoria: 'Ansiedade Moderada',
        nivelAlerta: 'ALTA' as const,
        descricao: 'Sintomas de ansiedade moderada. Recomenda-se avaliação profissional.',
      },
      who5: {
        score: 45,
        categoria: 'Bem-estar Reduzido',
        nivelAlerta: 'MEDIA' as const,
        descricao: 'Bem-estar abaixo do ideal. Sugere-se investigação adicional.',
      },
    },
  };

  console.log('📊 Dados mockados preparados:');
  console.log(`   - Usuário: ${dadosMock.usuario.nome}`);
  console.log(`   - Período: ${dadosMock.periodo.inicio.toLocaleDateString()} a ${dadosMock.periodo.fim.toLocaleDateString()}`);
  console.log(`   - Categorias: ${Object.keys(dadosMock.scoresPorCategoria).length}`);
  console.log(`   - Evolução theta: ${dadosMock.thetaEvolucao.length} pontos`);
  console.log(`   - Respostas: ${dadosMock.respostas.length}`);
  console.log(`   - Alertas: ${dadosMock.alertas.length}`);
  console.log(`   - Escalas clínicas: ${Object.keys(dadosMock.interpretacoes).length}\n`);

  try {
    console.log('🔧 Gerando Excel...');
    const buffer = await gerarRelatorioExcel(dadosMock);
    
    console.log('✅ Excel gerado com sucesso!');
    console.log(`   - Tamanho: ${(buffer.byteLength / 1024).toFixed(2)} KB\n`);

    // Salvar arquivo para inspeção manual
    const outputPath = path.join(__dirname, '..', 'test-relatorio.xlsx');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`💾 Arquivo salvo em: ${outputPath}`);
    console.log('📄 Abra o arquivo para validar as 6 abas:');
    console.log('   1. Resumo - Dados do usuário e período');
    console.log('   2. Scores por Categoria - Estatísticas por categoria');
    console.log('   3. Escalas Clínicas - PHQ-9, GAD-7, WHO-5');
    console.log('   4. Evolução Temporal - Theta ao longo do tempo');
    console.log('   5. Respostas Detalhadas - Todas as respostas');
    console.log('   6. Alertas - Histórico de alertas\n');
    
    console.log('✅ Teste concluído com sucesso!');
    console.log('💡 Dica: Abra o arquivo no Excel ou LibreOffice Calc para verificar formatação');
    return true;
  } catch (erro) {
    console.error('❌ Erro ao gerar Excel:', erro);
    if (erro instanceof Error) {
      console.error('   Mensagem:', erro.message);
      console.error('   Stack:', erro.stack);
    }
    return false;
  }
}

// Executar teste
testarExportacaoExcel()
  .then((sucesso) => {
    process.exit(sucesso ? 0 : 1);
  })
  .catch((erro) => {
    console.error('❌ Erro fatal:', erro);
    process.exit(1);
  });
