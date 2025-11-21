/**
 * Gerador de Relatórios em Excel/CSV com formatação profissional
 * 
 * Gera relatórios socioemocionais em planilhas Excel com múltiplas abas
 * Abas: Resumo, Scores por Categoria, Evolução Temporal, Respostas Detalhadas, Alertas
 * 
 * @module excel-generator
 */

import ExcelJS from 'exceljs';

// Estilos para células (ExcelJS)
const ESTILOS = {
  cabecalho: {
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FF4472C4' },
    },
    font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
    alignment: { horizontal: 'center' as const, vertical: 'middle' as const },
    border: {
      top: { style: 'thin' as const },
      bottom: { style: 'thin' as const },
      left: { style: 'thin' as const },
      right: { style: 'thin' as const },
    },
  },
  titulo: {
    font: { bold: true, size: 14, color: { argb: 'FF2F5496' } },
    alignment: { horizontal: 'left' as const, vertical: 'middle' as const },
  },
  subtitulo: {
    font: { bold: true, size: 11, color: { argb: 'FF44546A' } },
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFD9E1F2' },
    },
    alignment: { horizontal: 'left' as const, vertical: 'middle' as const },
  },
  celulaNormal: {
    alignment: { horizontal: 'left' as const, vertical: 'middle' as const },
    border: {
      top: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
      bottom: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
      left: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
      right: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
    },
  },
  celulaNumero: {
    alignment: { horizontal: 'right' as const, vertical: 'middle' as const },
    border: {
      top: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
      bottom: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
      left: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
      right: { style: 'thin' as const, color: { argb: 'FFD0D0D0' } },
    },
  },
  alertaAlto: {
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFFFC7CE' },
    },
    font: { color: { argb: 'FF9C0006' }, bold: true },
  },
  alertaMedio: {
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFFFEB9C' },
    },
    font: { color: { argb: 'FF9C6500' } },
  },
  alertaBaixo: {
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFC6EFCE' },
    },
    font: { color: { argb: 'FF006100' } },
  },
  tendenciaPositiva: {
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFC6EFCE' },
    },
    font: { color: { argb: 'FF006100' }, bold: true },
  },
  tendenciaNegativa: {
    fill: {
      type: 'pattern' as const,
      pattern: 'solid' as const,
      fgColor: { argb: 'FFFFC7CE' },
    },
    font: { color: { argb: 'FF9C0006' }, bold: true },
  },
};

export interface DadosRelatorioExcel {
  usuario: {
    nome: string;
    email: string;
    matricula?: string;
  };
  periodo: {
    inicio: Date;
    fim: Date;
  };
  scoresPorCategoria: Record<
    string,
    {
      media: number;
      minimo: number;
      maximo: number;
      desvio: number;
      tendencia: 'SUBINDO' | 'ESTAVEL' | 'DESCENDO';
      total_avaliacoes: number;
    }
  >;
  thetaEvolucao: Array<{
    data: Date;
    theta: number;
    erro: number;
    confianca: number;
    perguntasRespondidas: number;
  }>;
  respostas: Array<{
    data: Date;
    pergunta: string;
    resposta: string | number;
    categoria: string;
    valorNormalizado: number;
  }>;
  alertas: Array<{
    data: Date;
    tipo: string;
    severidade: string;
    descricao: string;
    status: string;
  }>;
  interpretacoes?: {
    phq9?: { score: number; categoria: string; nivelAlerta: string; descricao: string };
    gad7?: { score: number; categoria: string; nivelAlerta: string; descricao: string };
    who5?: { score: number; categoria: string; nivelAlerta: string; descricao: string };
  };
}

/**
 * Gera relatório socioemocional em Excel (.xlsx) com formatação profissional
 * 
 * @param dados Dados do relatório
 * @returns ArrayBuffer do arquivo Excel
 */
export async function gerarRelatorioExcel(dados: DadosRelatorioExcel): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ClassCheck';
  workbook.created = new Date();

  // ========== ABA 1: RESUMO ==========
  await criarAbaResumoFormatada(workbook, dados);

  // ========== ABA 2: SCORES POR CATEGORIA ==========
  await criarAbaScoresFormatada(workbook, dados);

  // ========== ABA 3: ESCALAS CLÍNICAS ==========
  if (dados.interpretacoes) {
    await criarAbaEscalasFormatada(workbook, dados);
  }

  // ========== ABA 4: EVOLUÇÃO TEMPORAL ==========
  await criarAbaEvolucaoFormatada(workbook, dados);

  // ========== ABA 5: RESPOSTAS DETALHADAS ==========
  await criarAbaRespostasFormatada(workbook, dados);

  // ========== ABA 6: ALERTAS ==========
  await criarAbaAlertasFormatada(workbook, dados);

  // Gerar arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

// ========== FUNÇÕES FORMATADAS (ExcelJS) ==========

/**
 * Cria aba de resumo com formatação profissional
 */
async function criarAbaResumoFormatada(workbook: ExcelJS.Workbook, dados: DadosRelatorioExcel): Promise<void> {
  const worksheet = workbook.addWorksheet('Resumo');

  // Título
  worksheet.getCell('A1').value = 'RELATÓRIO SOCIOEMOCIONAL - CLASSCHECK';
  worksheet.getCell('A1').style = ESTILOS.titulo;
  worksheet.mergeCells('A1:B1');

  // Informações do Aluno
  let row = 3;
  worksheet.getCell(`A${row}`).value = 'Informações do Aluno';
  worksheet.getCell(`A${row}`).style = ESTILOS.subtitulo;
  worksheet.mergeCells(`A${row}:B${row}`);
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Nome:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = dados.usuario.nome;
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Email:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = dados.usuario.email;

  // Período
  row += 2;
  worksheet.getCell(`A${row}`).value = 'Período do Relatório';
  worksheet.getCell(`A${row}`).style = ESTILOS.subtitulo;
  worksheet.mergeCells(`A${row}:B${row}`);
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Data Inicial:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = dados.periodo.inicio.toLocaleDateString('pt-BR');
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Data Final:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = dados.periodo.fim.toLocaleDateString('pt-BR');

  // Estatísticas
  row += 2;
  worksheet.getCell(`A${row}`).value = 'Estatísticas Gerais';
  worksheet.getCell(`A${row}`).style = ESTILOS.subtitulo;
  worksheet.mergeCells(`A${row}:B${row}`);
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Total de Categorias Avaliadas:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = Object.keys(dados.scoresPorCategoria).length;
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Total de Avaliações:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = dados.thetaEvolucao.length;
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Total de Respostas:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = dados.respostas.length;
  
  row++;
  worksheet.getCell(`A${row}`).value = 'Total de Alertas:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = dados.alertas.length;

  // Rodapé
  row += 2;
  worksheet.getCell(`A${row}`).value = 'Gerado em:';
  worksheet.getCell(`A${row}`).font = { bold: true };
  worksheet.getCell(`B${row}`).value = new Date().toLocaleString('pt-BR');

  // Larguras
  worksheet.getColumn(1).width = 30;
  worksheet.getColumn(2).width = 45;
}

/**
 * Cria aba de scores com formatação e cores
 */
async function criarAbaScoresFormatada(workbook: ExcelJS.Workbook, dados: DadosRelatorioExcel): Promise<void> {
  const worksheet = workbook.addWorksheet('Scores por Categoria');

  // Título
  worksheet.getCell('A1').value = 'SCORES POR CATEGORIA';
  worksheet.getCell('A1').style = ESTILOS.titulo;
  worksheet.mergeCells('A1:G1');

  // Cabeçalho
  const headerRow = worksheet.getRow(3);
  headerRow.values = ['Categoria', 'Média', 'Mínimo', 'Máximo', 'Desvio Padrão', 'Tendência', 'Nº Avaliações'];
  headerRow.eachCell((cell) => {
    cell.style = ESTILOS.cabecalho;
  });

  // Dados
  let row = 4;
  Object.entries(dados.scoresPorCategoria).forEach(([categoria, stats]) => {
    const dataRow = worksheet.getRow(row);
    const tendenciaTexto = stats.tendencia === 'SUBINDO' ? 'SUBINDO' : stats.tendencia === 'DESCENDO' ? 'DESCENDO' : 'ESTAVEL';
    
    dataRow.values = [
      categoria.replace(/_/g, ' '),
      parseFloat(stats.media.toFixed(2)),
      parseFloat(stats.minimo.toFixed(2)),
      parseFloat(stats.maximo.toFixed(2)),
      parseFloat(stats.desvio.toFixed(2)),
      tendenciaTexto,
      stats.total_avaliacoes,
    ];

    // Aplicar estilos
    dataRow.getCell(1).style = ESTILOS.celulaNormal;
    [2, 3, 4, 5, 7].forEach(col => {
      dataRow.getCell(col).style = ESTILOS.celulaNumero;
      dataRow.getCell(col).numFmt = '0.00';
    });

    // Tendência com cor
    const tendenciaCell = dataRow.getCell(6);
    tendenciaCell.style = ESTILOS.celulaNormal;
    if (stats.tendencia === 'SUBINDO') {
      tendenciaCell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.tendenciaPositiva };
    } else if (stats.tendencia === 'DESCENDO') {
      tendenciaCell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.tendenciaNegativa };
    }

    row++;
  });

  // Larguras
  worksheet.getColumn(1).width = 22;
  worksheet.getColumn(2).width = 10;
  worksheet.getColumn(3).width = 10;
  worksheet.getColumn(4).width = 10;
  worksheet.getColumn(5).width = 14;
  worksheet.getColumn(6).width = 16;
  worksheet.getColumn(7).width = 15;
}

async function criarAbaEscalasFormatada(workbook: ExcelJS.Workbook, dados: DadosRelatorioExcel): Promise<void> {
  const worksheet = workbook.addWorksheet('Escalas Clínicas');

  worksheet.getCell('A1').value = 'ESCALAS CLÍNICAS VALIDADAS';
  worksheet.getCell('A1').style = ESTILOS.titulo;
  worksheet.mergeCells('A1:E1');

  const headerRow = worksheet.getRow(3);
  headerRow.values = ['Escala', 'Score', 'Categoria', 'Nível', 'Descrição'];
  headerRow.eachCell((cell) => { cell.style = ESTILOS.cabecalho; });

  let row = 4;
  const escalas = [
    dados.interpretacoes?.phq9 && { nome: 'PHQ-9 (Depressão)', ...dados.interpretacoes.phq9 },
    dados.interpretacoes?.gad7 && { nome: 'GAD-7 (Ansiedade)', ...dados.interpretacoes.gad7 },
    dados.interpretacoes?.who5 && { nome: 'WHO-5 (Bem-Estar)', ...dados.interpretacoes.who5 },
  ].filter(Boolean);

  escalas.forEach((escala: any) => {
    const dataRow = worksheet.getRow(row);
    dataRow.values = [escala.nome, escala.score, escala.categoria, escala.nivelAlerta, escala.descricao];
    
    dataRow.eachCell((cell, colNum) => {
      cell.style = ESTILOS.celulaNormal;
      if (colNum === 4) {
        if (escala.nivelAlerta.includes('ALTA') || escala.nivelAlerta.includes('VERMELHO')) {
          cell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.alertaAlto };
        } else if (escala.nivelAlerta.includes('MEDIA') || escala.nivelAlerta.includes('LARANJA')) {
          cell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.alertaMedio };
        } else {
          cell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.alertaBaixo };
        }
      }
    });
    row++;
  });

  worksheet.getColumn(1).width = 25;
  worksheet.getColumn(2).width = 8;
  worksheet.getColumn(3).width = 22;
  worksheet.getColumn(4).width = 15;
  worksheet.getColumn(5).width = 60;
}

async function criarAbaEvolucaoFormatada(workbook: ExcelJS.Workbook, dados: DadosRelatorioExcel): Promise<void> {
  const worksheet = workbook.addWorksheet('Evolução Temporal');

  worksheet.getCell('A1').value = 'EVOLUÇÃO TEMPORAL DO ESTADO EMOCIONAL';
  worksheet.getCell('A1').style = ESTILOS.titulo;
  worksheet.mergeCells('A1:F1');

  const headerRow = worksheet.getRow(3);
  headerRow.values = ['Data', 'Theta (θ)', 'Erro', 'Confiança', 'Perguntas', 'Interpretação'];
  headerRow.eachCell((cell) => { cell.style = ESTILOS.cabecalho; });

  let row = 4;
  dados.thetaEvolucao.forEach(item => {
    const dataRow = worksheet.getRow(row);
    dataRow.values = [
      item.data.toLocaleDateString('pt-BR'),
      parseFloat(item.theta.toFixed(3)),
      parseFloat(item.erro.toFixed(3)),
      `${(item.confianca * 100).toFixed(1)}%`,
      item.perguntasRespondidas,
      interpretarTheta(item.theta),
    ];
    dataRow.eachCell((cell) => { cell.style = ESTILOS.celulaNormal; });
    row++;
  });

  worksheet.getColumn(1).width = 12;
  worksheet.getColumn(2).width = 10;
  worksheet.getColumn(3).width = 8;
  worksheet.getColumn(4).width = 12;
  worksheet.getColumn(5).width = 12;
  worksheet.getColumn(6).width = 18;
}

async function criarAbaRespostasFormatada(workbook: ExcelJS.Workbook, dados: DadosRelatorioExcel): Promise<void> {
  const worksheet = workbook.addWorksheet('Respostas Detalhadas');

  worksheet.getCell('A1').value = 'RESPOSTAS DETALHADAS';
  worksheet.getCell('A1').style = ESTILOS.titulo;
  worksheet.mergeCells('A1:E1');

  const headerRow = worksheet.getRow(3);
  headerRow.values = ['Data', 'Pergunta', 'Resposta', 'Categoria', 'Normalizado'];
  headerRow.eachCell((cell) => { cell.style = ESTILOS.cabecalho; });

  let row = 4;
  dados.respostas.forEach(resposta => {
    const dataRow = worksheet.getRow(row);
    dataRow.values = [
      resposta.data.toLocaleDateString('pt-BR'),
      resposta.pergunta,
      typeof resposta.resposta === 'number' ? resposta.resposta : resposta.resposta.toString(),
      resposta.categoria.replace(/_/g, ' '),
      parseFloat(resposta.valorNormalizado.toFixed(2)),
    ];
    dataRow.eachCell((cell) => { cell.style = ESTILOS.celulaNormal; });
    row++;
  });

  worksheet.getColumn(1).width = 12;
  worksheet.getColumn(2).width = 55;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 20;
  worksheet.getColumn(5).width = 12;
}

async function criarAbaAlertasFormatada(workbook: ExcelJS.Workbook, dados: DadosRelatorioExcel): Promise<void> {
  const worksheet = workbook.addWorksheet('Alertas');

  worksheet.getCell('A1').value = 'ALERTAS SOCIOEMOCIONAIS';
  worksheet.getCell('A1').style = ESTILOS.titulo;
  worksheet.mergeCells('A1:E1');

  const headerRow = worksheet.getRow(3);
  headerRow.values = ['Data', 'Tipo', 'Severidade', 'Descrição', 'Status'];
  headerRow.eachCell((cell) => { cell.style = ESTILOS.cabecalho; });

  let row = 4;
  dados.alertas.forEach(alerta => {
    const dataRow = worksheet.getRow(row);
    dataRow.values = [
      alerta.data.toLocaleDateString('pt-BR'),
      alerta.tipo.replace(/_/g, ' '),
      alerta.severidade,
      alerta.descricao,
      alerta.status,
    ];
    
    dataRow.eachCell((cell, colNum) => {
      cell.style = ESTILOS.celulaNormal;
      if (colNum === 3) {
        if (alerta.severidade.includes('ALTA') || alerta.severidade.includes('VERMELHO')) {
          cell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.alertaAlto };
        } else if (alerta.severidade.includes('MEDIA') || alerta.severidade.includes('LARANJA') || alerta.severidade.includes('AMARELO')) {
          cell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.alertaMedio };
        } else {
          cell.style = { ...ESTILOS.celulaNormal, ...ESTILOS.alertaBaixo };
        }
      }
    });
    row++;
  });

  worksheet.getColumn(1).width = 12;
  worksheet.getColumn(2).width = 20;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 55;
  worksheet.getColumn(5).width = 15;
}

// ========== FUNÇÕES AUXILIARES ==========

/**
 * Interpreta valor de theta
 */
function interpretarTheta(theta: number): string {
  if (theta < -1.5) return 'Muito Baixo';
  if (theta < -0.5) return 'Baixo';
  if (theta < 0.5) return 'Normal';
  if (theta < 1.5) return 'Elevado';
  return 'Muito Elevado';
}

/**
 * Gera relatório em formato CSV simples
 * 
 * @param dados Dados do relatório
 * @returns string CSV
 */
export function gerarRelatorioCSV(dados: DadosRelatorioExcel): string {
  const linhas: string[] = [
    'RELATÓRIO SOCIOEMOCIONAL - CLASSCHECK',
    '',
    `Aluno,${dados.usuario.nome}`,
    `Email,${dados.usuario.email}`,
    `Período,${dados.periodo.inicio.toLocaleDateString('pt-BR')} - ${dados.periodo.fim.toLocaleDateString('pt-BR')}`,
    '',
    'SCORES POR CATEGORIA',
    'Categoria,Média,Mínimo,Máximo,Tendência',
  ];

  Object.entries(dados.scoresPorCategoria).forEach(([cat, stats]) => {
    linhas.push(`${cat},${stats.media.toFixed(2)},${stats.minimo.toFixed(2)},${stats.maximo.toFixed(2)},${stats.tendencia}`);
  });

  linhas.push('');
  linhas.push('EVOLUÇÃO TEMPORAL');
  linhas.push('Data,Theta,Confiança');

  dados.thetaEvolucao.forEach((item) => {
    linhas.push(`${item.data.toLocaleDateString('pt-BR')},${item.theta.toFixed(3)},${(item.confianca * 100).toFixed(1)}%`);
  });

  return linhas.join('\n');
}
