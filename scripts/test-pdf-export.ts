/**
 * Script de Teste: Exportação de Relatórios PDF
 * 
 * Testa a geração de PDFs com dados mockados para validar:
 * - Formatação correta
 * - Tabelas com autoTable
 * - Multi-página
 * - Escalas clínicas
 * - Alertas
 * 
 * Uso: ts-node scripts/test-pdf-export.ts
 */

import { gerarRelatorioPDF } from '../src/lib/export/pdf-generator';
import * as fs from 'fs';
import * as path from 'path';

async function testarExportacaoPDF() {
  console.log('🧪 Iniciando teste de exportação PDF...\n');

  // Dados mockados completos
  const dadosMock = {
    usuario: {
      nome: 'João da Silva Teste',
      email: 'joao.teste@classcheck.com',
      matricula: '202401234',
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
      AUTOESTIMA: {
        media: 3.5,
        minimo: 2.5,
        maximo: 4.2,
        desvio: 0.5,
        tendencia: 'SUBINDO' as const,
        total_avaliacoes: 10,
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
    alertas: {
      total: 5,
      porNivel: {
        BAIXA: 2,
        MEDIA: 2,
        ALTA: 1,
      },
      criticos: [
        {
          tipo: 'ANSIEDADE',
          data: new Date('2025-01-15'),
          descricao: 'Score GAD-7 indica ansiedade moderada (score: 12)',
        },
        {
          tipo: 'ESTRESSE',
          data: new Date('2025-01-20'),
          descricao: 'Nível de estresse elevado detectado em múltiplas respostas',
        },
      ],
    },
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
  console.log(`   - Alertas: ${dadosMock.alertas.total}`);
  console.log(`   - Escalas clínicas: ${Object.keys(dadosMock.interpretacoes).length}\n`);

  try {
    console.log('🔧 Gerando PDF...');
    const blob = await gerarRelatorioPDF(dadosMock);
    
    console.log('✅ PDF gerado com sucesso!');
    console.log(`   - Tamanho: ${(blob.size / 1024).toFixed(2)} KB\n`);

    // Salvar arquivo para inspeção manual
    const outputPath = path.join(__dirname, '..', 'test-relatorio.pdf');
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`💾 Arquivo salvo em: ${outputPath}`);
    console.log('📄 Abra o arquivo para validar:');
    console.log('   - Cabeçalho com logo e título');
    console.log('   - Tabela de scores por categoria');
    console.log('   - Tabela de evolução de theta');
    console.log('   - Seção de escalas clínicas (PHQ-9, GAD-7, WHO-5)');
    console.log('   - Resumo de alertas');
    console.log('   - Rodapé com página e data\n');
    
    console.log('✅ Teste concluído com sucesso!');
    return true;
  } catch (erro) {
    console.error('❌ Erro ao gerar PDF:', erro);
    if (erro instanceof Error) {
      console.error('   Mensagem:', erro.message);
      console.error('   Stack:', erro.stack);
    }
    return false;
  }
}

// Executar teste
testarExportacaoPDF()
  .then((sucesso) => {
    process.exit(sucesso ? 0 : 1);
  })
  .catch((erro) => {
    console.error('❌ Erro fatal:', erro);
    process.exit(1);
  });
