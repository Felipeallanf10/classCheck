/**
 * Gerador de Relatórios em PDF
 * 
 * Gera relatórios socioemocionais profissionais em PDF usando jsPDF
 * Inclui: informações do usuário, scores por categoria, evolução temporal, alertas
 * 
 * @module pdf-generator
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DadosRelatorioPDF {
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
      tendencia: 'SUBINDO' | 'ESTAVEL' | 'DESCENDO';
    }
  >;
  thetaEvolucao: Array<{
    data: Date;
    theta: number;
    confianca: number;
  }>;
  alertas: {
    total: number;
    porNivel: Record<string, number>;
    criticos: Array<{
      tipo: string;
      data: Date;
      descricao: string;
    }>;
  };
  interpretacoes?: {
    phq9?: { score: number; categoria: string; nivelAlerta: string };
    gad7?: { score: number; categoria: string; nivelAlerta: string };
    who5?: { score: number; categoria: string; nivelAlerta: string };
  };
}

/**
 * Gera relatório socioemocional em PDF
 * 
 * @param dados Dados do relatório
 * @returns Promise<Blob> Arquivo PDF gerado
 */
export async function gerarRelatorioPDF(dados: DadosRelatorioPDF): Promise<Blob> {
  const doc = new jsPDF();

  // ========== CABEÇALHO ==========
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246); // primary-500
  doc.text('ClassCheck', 20, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Relatório Socioemocional', 20, 30);

  // ========== INFORMAÇÕES DO USUÁRIO ==========
  doc.setFontSize(11);
  doc.setTextColor(64, 64, 64);
  doc.text(`Aluno: ${dados.usuario.nome}`, 20, 42);
  doc.text(`Email: ${dados.usuario.email}`, 20, 48);
  if (dados.usuario.matricula) {
    doc.text(`Matrícula: ${dados.usuario.matricula}`, 20, 54);
  }
  doc.text(
    `Período: ${dados.periodo.inicio.toLocaleDateString('pt-BR')} - ${dados.periodo.fim.toLocaleDateString('pt-BR')}`,
    20,
    dados.usuario.matricula ? 60 : 54
  );

  // Linha separadora
  const inicioConteudo = dados.usuario.matricula ? 68 : 62;
  doc.setDrawColor(220, 220, 220);
  doc.line(20, inicioConteudo, 190, inicioConteudo);

  // ========== TABELA DE SCORES POR CATEGORIA ==========
  let yPosition = inicioConteudo + 10;
  
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('Scores por Categoria', 20, yPosition);

  const tabelaScores = Object.entries(dados.scoresPorCategoria).map(([cat, score]) => [
    cat.replace(/_/g, ' '),
    score.media.toFixed(2),
    score.minimo.toFixed(2),
    score.maximo.toFixed(2),
    getTendenciaIcon(score.tendencia),
  ]);

  autoTable(doc, {
    head: [['Categoria', 'Média', 'Mínimo', 'Máximo', 'Tendência']],
    body: tabelaScores,
    startY: yPosition + 5,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // ========== ESCALAS CLÍNICAS (se disponíveis) ==========
  const finalY1 = (doc as any).lastAutoTable.finalY || yPosition + 60;

  if (dados.interpretacoes) {
    yPosition = finalY1 + 15;

    // Nova página se necessário
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(13);
    doc.text('Escalas Clínicas Validadas', 20, yPosition);

    const escalasData = [];

    if (dados.interpretacoes.phq9) {
      escalasData.push([
        'PHQ-9 (Depressão)',
        dados.interpretacoes.phq9.score.toString(),
        dados.interpretacoes.phq9.categoria,
        dados.interpretacoes.phq9.nivelAlerta,
      ]);
    }

    if (dados.interpretacoes.gad7) {
      escalasData.push([
        'GAD-7 (Ansiedade)',
        dados.interpretacoes.gad7.score.toString(),
        dados.interpretacoes.gad7.categoria,
        dados.interpretacoes.gad7.nivelAlerta,
      ]);
    }

    if (dados.interpretacoes.who5) {
      escalasData.push([
        'WHO-5 (Bem-Estar)',
        dados.interpretacoes.who5.score.toString(),
        dados.interpretacoes.who5.categoria,
        dados.interpretacoes.who5.nivelAlerta,
      ]);
    }

    if (escalasData.length > 0) {
      autoTable(doc, {
        head: [['Escala', 'Score', 'Categoria', 'Nível']],
        body: escalasData,
        startY: yPosition + 5,
        theme: 'striped',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
        },
      });
    }
  }

  // ========== EVOLUÇÃO DE THETA ==========
  const finalY2 = (doc as any).lastAutoTable.finalY || yPosition + 50;
  yPosition = finalY2 + 15;

  // Nova página se necessário
  if (yPosition > 230) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(13);
  doc.text('Evolução do Estado Emocional (Theta)', 20, yPosition);

  const tabelaTheta = dados.thetaEvolucao.slice(-10).map((item) => [
    item.data.toLocaleDateString('pt-BR'),
    item.theta.toFixed(3),
    `${(item.confianca * 100).toFixed(1)}%`,
    interpretarTheta(item.theta),
  ]);

  autoTable(doc, {
    head: [['Data', 'Theta', 'Confiança', 'Interpretação']],
    body: tabelaTheta,
    startY: yPosition + 5,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      3: { halign: 'center' },
    },
  });

  // ========== RESUMO DE ALERTAS ==========
  const finalY3 = (doc as any).lastAutoTable.finalY || yPosition + 80;
  yPosition = finalY3 + 15;

  // Nova página se necessário
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(13);
  doc.text('Resumo de Alertas', 20, yPosition);

  doc.setFontSize(10);
  doc.text(`Total de alertas gerados: ${dados.alertas.total}`, 25, yPosition + 8);

  yPosition += 15;

  // Alertas por nível
  Object.entries(dados.alertas.porNivel).forEach(([nivel, qtd]) => {
    const cor = getNivelCorAlerta(nivel);
    doc.setTextColor(cor[0], cor[1], cor[2]);
    doc.text(`${nivel}: ${qtd}`, 25, yPosition);
    yPosition += 6;
  });

  doc.setTextColor(0, 0, 0);

  // Alertas críticos
  if (dados.alertas.criticos.length > 0) {
    yPosition += 5;

    // Nova página se necessário
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38); // red-600
    doc.text('! Alertas Criticos', 25, yPosition);

    yPosition += 6;

    const alertasCriticos = dados.alertas.criticos.slice(0, 5).map((alerta) => [
      alerta.data.toLocaleDateString('pt-BR'),
      alerta.tipo.replace(/_/g, ' '),
      alerta.descricao.substring(0, 60) + (alerta.descricao.length > 60 ? '...' : ''),
    ]);

    autoTable(doc, {
      head: [['Data', 'Tipo', 'Descrição']],
      body: alertasCriticos,
      startY: yPosition,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
      },
    });
  }

  // ========== RODAPÉ EM TODAS AS PÁGINAS ==========
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);

    doc.text(
      `Página ${i} de ${totalPages}`,
      105,
      285,
      { align: 'center' }
    );

    doc.text(
      `ClassCheck - Sistema de Avaliação Socioemocional Adaptativa`,
      20,
      290
    );

    doc.text(
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      190,
      290,
      { align: 'right' }
    );
  }

  return doc.output('blob');
}

/**
 * Converte tendência em ícone/texto
 */
function getTendenciaIcon(tendencia: 'SUBINDO' | 'ESTAVEL' | 'DESCENDO'): string {
  switch (tendencia) {
    case 'SUBINDO':
      return '^ Subindo';
    case 'DESCENDO':
      return 'v Descendo';
    case 'ESTAVEL':
      return '= Estavel';
    default:
      return '-';
  }
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
 * Retorna cor RGB para nível de alerta
 */
function getNivelCorAlerta(nivel: string): [number, number, number] {
  switch (nivel.toUpperCase()) {
    case 'VERMELHO':
    case 'CRÍTICO':
      return [220, 38, 38]; // red-600
    case 'LARANJA':
    case 'ALTO':
      return [249, 115, 22]; // orange-500
    case 'AMARELO':
    case 'MÉDIO':
      return [234, 179, 8]; // yellow-500
    case 'VERDE':
    case 'BAIXO':
      return [34, 197, 94]; // green-500
    default:
      return [100, 116, 139]; // slate-500
  }
}
