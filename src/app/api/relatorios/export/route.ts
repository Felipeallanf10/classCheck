/**
 * API Route - Exportação de Relatórios
 * 
 * Endpoint para exportar dados analíticos em formatos CSV e JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CategoriaPergunta } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface ExportParams {
  usuarioId?: number;
  formato: 'csv' | 'json';
  tipo: 'sessoes' | 'metricas' | 'alertas' | 'completo';
  dataInicio?: string;
  dataFim?: string;
  categoria?: CategoriaPergunta;
}

/**
 * Converte array de objetos para CSV
 */
function converterParaCSV(dados: any[], colunas: string[]): string {
  const cabecalho = colunas.join(',');
  
  const linhas = dados.map(item => {
    return colunas.map(coluna => {
      const valor = item[coluna];
      
      // Tratar valores que podem conter vírgulas ou quebras de linha
      if (valor === null || valor === undefined) {
        return '';
      }
      
      const valorStr = String(valor);
      if (valorStr.includes(',') || valorStr.includes('\n') || valorStr.includes('"')) {
        return `"${valorStr.replace(/"/g, '""')}"`;
      }
      
      return valorStr;
    }).join(',');
  });

  return [cabecalho, ...linhas].join('\n');
}

/**
 * Exporta sessões adaptativas
 */
async function exportarSessoes(
  usuarioId?: number,
  dataInicio?: Date,
  dataFim?: Date
) {
  const sessoes = await prisma.sessaoAdaptativa.findMany({
    where: {
      ...(usuarioId && { usuarioId }),
      ...(dataInicio && dataFim && {
        iniciadoEm: {
          gte: dataInicio,
          lte: dataFim
        }
      })
    },
    include: {
      respostas: true
    },
    orderBy: {
      iniciadoEm: 'desc'
    },
    take: 1000 // Limite de segurança
  });

  return sessoes.map(s => ({
    id: s.id,
    usuarioId: s.usuarioId,
    questionarioId: s.questionarioId,
    status: s.status,
    iniciadoEm: s.iniciadoEm?.toISOString(),
    finalizadoEm: s.finalizadoEm?.toISOString(),
    thetaEstimado: s.thetaEstimado,
    erroEstimacao: s.erroEstimacao,
    confianca: s.confianca,
    progresso: s.progresso,
    totalPerguntas: s.respostas.length,
    contextoTipo: s.contextoTipo
  }));
}

/**
 * Exporta métricas agregadas
 */
async function exportarMetricas(
  usuarioId?: number,
  dataInicio?: Date,
  dataFim?: Date,
  categoria?: CategoriaPergunta
) {
  // TODO: Usar metricaSocioemocional após rodar prisma generate
  // Por enquanto, agregamos na memória a partir das sessões
  
  const sessoes = await prisma.sessaoAdaptativa.findMany({
    where: {
      ...(usuarioId && { usuarioId }),
      ...(dataInicio && dataFim && {
        iniciadoEm: {
          gte: dataInicio,
          lte: dataFim
        }
      }),
      status: 'FINALIZADA'
    },
    include: {
      respostas: {
        where: categoria ? { categoria } : {},
        select: {
          valorNumerico: true,
          categoria: true,
          valencia: true,
          ativacao: true
        }
      }
    },
    orderBy: {
      iniciadoEm: 'desc'
    },
    take: 1000
  });

  // Agregar por categoria
  const metricas: any[] = [];
  const categorias = categoria ? [categoria] : Object.values(CategoriaPergunta);

  for (const cat of categorias) {
    const respostasCat = sessoes.flatMap(s => 
      s.respostas.filter(r => r.categoria === cat)
    );

    if (respostasCat.length === 0) continue;

    const scores = respostasCat
      .map(r => r.valorNumerico)
      .filter((v): v is number => v !== null);
    
    if (scores.length === 0) continue;

    const scoreMedio = scores.reduce((a, b) => a + b, 0) / scores.length;
    const scoreMinimo = Math.min(...scores);
    const scoreMaximo = Math.max(...scores);
    
    // Calcular desvio padrão
    const variancia = scores.reduce((sum, val) => sum + Math.pow(val - scoreMedio, 2), 0) / scores.length;
    const desvioPadrao = Math.sqrt(variancia);

    // Média de valência e ativação
    const valencias = respostasCat
      .map(r => r.valencia)
      .filter((v): v is number => v !== null);
    const ativacoes = respostasCat
      .map(r => r.ativacao)
      .filter((v): v is number => v !== null);

    const valenciaMedia = valencias.length > 0 
      ? valencias.reduce((a, b) => a + b, 0) / valencias.length 
      : null;
    const ativacaoMedia = ativacoes.length > 0 
      ? ativacoes.reduce((a, b) => a + b, 0) / ativacoes.length 
      : null;

    metricas.push({
      usuarioId: usuarioId || null,
      categoria: cat,
      granularidade: 'AGREGADO',
      periodoInicio: dataInicio?.toISOString(),
      periodoFim: dataFim?.toISOString(),
      scoreMedio,
      scoreMinimo,
      scoreMaximo,
      desvioPadrao,
      valenciaMedia,
      ativacaoMedia,
      totalSessoes: sessoes.length,
      totalRespostas: respostasCat.length
    });
  }

  return metricas;
}

/**
 * Exporta alertas
 */
async function exportarAlertas(
  usuarioId?: number,
  dataInicio?: Date,
  dataFim?: Date
) {
  const alertas = await prisma.alertaSocioemocional.findMany({
    where: {
      ...(usuarioId && { usuarioId }),
      ...(dataInicio && dataFim && {
        criadoEm: {
          gte: dataInicio,
          lte: dataFim
        }
      })
    },
    orderBy: {
      criadoEm: 'desc'
    },
    take: 1000
  });

  return alertas.map(a => ({
    id: a.id,
    usuarioId: a.usuarioId,
    sessaoId: a.sessaoId,
    nivel: a.nivel,
    tipo: a.tipo,
    categoria: a.categoria,
    titulo: a.titulo,
    descricao: a.descricao,
    scoreTotal: a.scoreTotal,
    scoreDominio: a.scoreDominio,
    desvioMedia: a.desvioMedia,
    status: a.status,
    recomendacoes: Array.isArray(a.recomendacoes) ? (a.recomendacoes as string[]).join('; ') : a.recomendacoes,
    criadoEm: a.criadoEm.toISOString(),
    lido: a.lido,
    acao: a.acao,
    resolvidoEm: a.resolvidoEm?.toISOString()
  }));
}

/**
 * Exporta relatório completo
 */
async function exportarCompleto(
  usuarioId?: number,
  dataInicio?: Date,
  dataFim?: Date
) {
  const [sessoes, metricas, alertas] = await Promise.all([
    exportarSessoes(usuarioId, dataInicio, dataFim),
    exportarMetricas(usuarioId, dataInicio, dataFim),
    exportarAlertas(usuarioId, dataInicio, dataFim)
  ]);

  return {
    sessoes,
    metricas,
    alertas,
    metadados: {
      geradoEm: new Date().toISOString(),
      usuarioId,
      periodoInicio: dataInicio?.toISOString(),
      periodoFim: dataFim?.toISOString(),
      totalSessoes: sessoes.length,
      totalMetricas: metricas.length,
      totalAlertas: alertas.length
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros
    const usuarioIdParam = searchParams.get('usuarioId');
    const formato = (searchParams.get('formato') || 'json') as 'csv' | 'json';
    const tipo = (searchParams.get('tipo') || 'sessoes') as ExportParams['tipo'];
    const dataInicioParam = searchParams.get('dataInicio');
    const dataFimParam = searchParams.get('dataFim');
    const categoriaParam = searchParams.get('categoria');

    // Validações
    if (formato !== 'csv' && formato !== 'json') {
      return NextResponse.json(
        { error: 'Formato inválido. Use "csv" ou "json"' },
        { status: 400 }
      );
    }

    const usuarioId = usuarioIdParam ? parseInt(usuarioIdParam) : undefined;
    const dataInicio = dataInicioParam ? new Date(dataInicioParam) : undefined;
    const dataFim = dataFimParam ? new Date(dataFimParam) : undefined;
    const categoria = categoriaParam as CategoriaPergunta | undefined;

    // Buscar dados
    let dados: any;
    let nomeArquivo: string;

    switch (tipo) {
      case 'sessoes':
        dados = await exportarSessoes(usuarioId, dataInicio, dataFim);
        nomeArquivo = 'sessoes';
        break;
      
      case 'metricas':
        dados = await exportarMetricas(usuarioId, dataInicio, dataFim, categoria);
        nomeArquivo = 'metricas';
        break;
      
      case 'alertas':
        dados = await exportarAlertas(usuarioId, dataInicio, dataFim);
        nomeArquivo = 'alertas';
        break;
      
      case 'completo':
        dados = await exportarCompleto(usuarioId, dataInicio, dataFim);
        nomeArquivo = 'relatorio-completo';
        break;
      
      default:
        return NextResponse.json(
          { error: 'Tipo de exportação inválido' },
          { status: 400 }
        );
    }

    // Formato de resposta
    if (formato === 'csv') {
      if (tipo === 'completo') {
        return NextResponse.json(
          { error: 'Formato CSV não suportado para relatório completo. Use formato JSON.' },
          { status: 400 }
        );
      }

      const colunas = dados.length > 0 ? Object.keys(dados[0]) : [];
      const csv = converterParaCSV(dados, colunas);

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${nomeArquivo}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Formato JSON
    return NextResponse.json(dados, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${nomeArquivo}-${new Date().toISOString().split('T')[0]}.json"`
      }
    });

  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao exportar dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
