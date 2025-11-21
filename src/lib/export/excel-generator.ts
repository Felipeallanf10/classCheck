/**
 * Gerador de Relatórios em Excel/CSV
 * 
 * Gera relatórios socioemocionais em planilhas Excel com múltiplas abas
 * Abas: Resumo, Scores por Categoria, Evolução Temporal, Respostas Detalhadas, Alertas
 * 
 * @module excel-generator
 */

import * as XLSX from 'xlsx';

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
 * Gera relatório socioemocional em Excel (.xlsx)
 * 
 * @param dados Dados do relatório
 * @returns ArrayBuffer do arquivo Excel
 */
export function gerarRelatorioExcel(dados: DadosRelatorioExcel): ArrayBuffer {
  const wb = XLSX.utils.book_new();

  // ========== ABA 1: RESUMO ==========
  const abaResumo = criarAbaResumo(dados);
  const wsResumo = XLSX.utils.aoa_to_sheet(abaResumo);
  
  // Largura das colunas
  wsResumo['!cols'] = [{ wch: 25 }, { wch: 40 }];
  
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

  // ========== ABA 2: SCORES POR CATEGORIA ==========
  const abaScores = criarAbaScores(dados);
  const wsScores = XLSX.utils.aoa_to_sheet(abaScores);
  
  wsScores['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 18 }];
  
  XLSX.utils.book_append_sheet(wb, wsScores, 'Scores por Categoria');

  // ========== ABA 3: ESCALAS CLÍNICAS ==========
  if (dados.interpretacoes) {
    const abaEscalas = criarAbaEscalasClinicas(dados);
    const wsEscalas = XLSX.utils.aoa_to_sheet(abaEscalas);
    
    wsEscalas['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 50 }];
    
    XLSX.utils.book_append_sheet(wb, wsEscalas, 'Escalas Clínicas');
  }

  // ========== ABA 4: EVOLUÇÃO TEMPORAL ==========
  const abaEvolucao = criarAbaEvolucao(dados);
  const wsEvolucao = XLSX.utils.aoa_to_sheet(abaEvolucao);
  
  wsEvolucao['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 20 }];
  
  XLSX.utils.book_append_sheet(wb, wsEvolucao, 'Evolução Temporal');

  // ========== ABA 5: RESPOSTAS DETALHADAS ==========
  const abaRespostas = criarAbaRespostas(dados);
  const wsRespostas = XLSX.utils.aoa_to_sheet(abaRespostas);
  
  wsRespostas['!cols'] = [{ wch: 12 }, { wch: 50 }, { wch: 20 }, { wch: 18 }, { wch: 15 }];
  
  XLSX.utils.book_append_sheet(wb, wsRespostas, 'Respostas Detalhadas');

  // ========== ABA 6: ALERTAS ==========
  const abaAlertas = criarAbaAlertas(dados);
  const wsAlertas = XLSX.utils.aoa_to_sheet(abaAlertas);
  
  wsAlertas['!cols'] = [{ wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 50 }, { wch: 15 }];
  
  XLSX.utils.book_append_sheet(wb, wsAlertas, 'Alertas');

  // Gerar arquivo
  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}

/**
 * Cria aba de resumo
 */
function criarAbaResumo(dados: DadosRelatorioExcel): any[][] {
  return [
    ['RELATÓRIO SOCIOEMOCIONAL - CLASSCHECK'],
    [''],
    ['Informações do Aluno'],
    ['Nome:', dados.usuario.nome],
    ['Email:', dados.usuario.email],
    ...(dados.usuario.matricula ? [['Matrícula:', dados.usuario.matricula]] : []),
    [''],
    ['Período do Relatório'],
    ['Data Inicial:', dados.periodo.inicio.toLocaleDateString('pt-BR')],
    ['Data Final:', dados.periodo.fim.toLocaleDateString('pt-BR')],
    [''],
    ['Estatísticas Gerais'],
    ['Total de Categorias Avaliadas:', Object.keys(dados.scoresPorCategoria).length],
    ['Total de Avaliações:', dados.thetaEvolucao.length],
    ['Total de Respostas:', dados.respostas.length],
    ['Total de Alertas:', dados.alertas.length],
    [''],
    ['Gerado em:', new Date().toLocaleString('pt-BR')],
  ];
}

/**
 * Cria aba de scores por categoria
 */
function criarAbaScores(dados: DadosRelatorioExcel): any[][] {
  const linhas: any[][] = [
    ['SCORES POR CATEGORIA'],
    [''],
    ['Categoria', 'Média', 'Mínimo', 'Máximo', 'Desvio Padrão', 'Tendência', 'Nº Avaliações'],
  ];

  Object.entries(dados.scoresPorCategoria).forEach(([categoria, stats]) => {
    linhas.push([
      categoria.replace(/_/g, ' '),
      stats.media.toFixed(2),
      stats.minimo.toFixed(2),
      stats.maximo.toFixed(2),
      stats.desvio.toFixed(2),
      stats.tendencia,
      stats.total_avaliacoes,
    ]);
  });

  return linhas;
}

/**
 * Cria aba de escalas clínicas
 */
function criarAbaEscalasClinicas(dados: DadosRelatorioExcel): any[][] {
  const linhas: any[][] = [
    ['ESCALAS CLÍNICAS VALIDADAS'],
    [''],
    ['Escala', 'Score', 'Categoria', 'Nível de Alerta', 'Descrição'],
  ];

  if (dados.interpretacoes?.phq9) {
    linhas.push([
      'PHQ-9 (Depressão)',
      dados.interpretacoes.phq9.score,
      dados.interpretacoes.phq9.categoria,
      dados.interpretacoes.phq9.nivelAlerta,
      dados.interpretacoes.phq9.descricao,
    ]);
  }

  if (dados.interpretacoes?.gad7) {
    linhas.push([
      'GAD-7 (Ansiedade)',
      dados.interpretacoes.gad7.score,
      dados.interpretacoes.gad7.categoria,
      dados.interpretacoes.gad7.nivelAlerta,
      dados.interpretacoes.gad7.descricao,
    ]);
  }

  if (dados.interpretacoes?.who5) {
    linhas.push([
      'WHO-5 (Bem-Estar)',
      dados.interpretacoes.who5.score,
      dados.interpretacoes.who5.categoria,
      dados.interpretacoes.who5.nivelAlerta,
      dados.interpretacoes.who5.descricao,
    ]);
  }

  return linhas;
}

/**
 * Cria aba de evolução temporal
 */
function criarAbaEvolucao(dados: DadosRelatorioExcel): any[][] {
  const linhas: any[][] = [
    ['EVOLUÇÃO TEMPORAL DO ESTADO EMOCIONAL'],
    [''],
    ['Data', 'Theta (θ)', 'Erro Padrão', 'Confiança (%)', 'Perguntas Respondidas', 'Interpretação'],
  ];

  dados.thetaEvolucao.forEach((item) => {
    linhas.push([
      item.data.toLocaleDateString('pt-BR'),
      item.theta.toFixed(3),
      item.erro.toFixed(3),
      (item.confianca * 100).toFixed(1),
      item.perguntasRespondidas,
      interpretarTheta(item.theta),
    ]);
  });

  return linhas;
}

/**
 * Cria aba de respostas detalhadas
 */
function criarAbaRespostas(dados: DadosRelatorioExcel): any[][] {
  const linhas: any[][] = [
    ['RESPOSTAS DETALHADAS'],
    [''],
    ['Data', 'Pergunta', 'Resposta', 'Categoria', 'Valor Normalizado'],
  ];

  dados.respostas.forEach((resposta) => {
    linhas.push([
      resposta.data.toLocaleDateString('pt-BR'),
      resposta.pergunta,
      typeof resposta.resposta === 'number' ? resposta.resposta.toString() : resposta.resposta,
      resposta.categoria.replace(/_/g, ' '),
      resposta.valorNormalizado.toFixed(2),
    ]);
  });

  return linhas;
}

/**
 * Cria aba de alertas
 */
function criarAbaAlertas(dados: DadosRelatorioExcel): any[][] {
  const linhas: any[][] = [
    ['ALERTAS SOCIOEMOTIONAIS'],
    [''],
    ['Data', 'Tipo', 'Severidade', 'Descrição', 'Status'],
  ];

  dados.alertas.forEach((alerta) => {
    linhas.push([
      alerta.data.toLocaleDateString('pt-BR'),
      alerta.tipo.replace(/_/g, ' '),
      alerta.severidade,
      alerta.descricao,
      alerta.status,
    ]);
  });

  return linhas;
}

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
