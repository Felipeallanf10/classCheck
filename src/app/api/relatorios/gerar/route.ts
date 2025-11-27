/**
 * API Route: Exportação de Relatórios Completos (PDF/Excel)
 * 
 * GET /api/relatorios/gerar?usuarioId=123&formato=pdf&inicio=2025-01-01&fim=2025-12-31
 * 
 * Query Params:
 * - usuarioId: ID do usuário (required)
 * - formato: 'pdf' | 'excel' | 'csv' (required)
 * - inicio: Data inicial ISO (opcional, padrão: -30 dias)
 * - fim: Data final ISO (opcional, padrão: hoje)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { gerarRelatorioPDF } from '@/lib/export/pdf-generator';
import { gerarRelatorioExcel, gerarRelatorioCSV } from '@/lib/export/excel-generator';
import { interpretarPHQ9, interpretarGAD7, interpretarWHO5 } from '@/lib/escalas/interpretacao-clinica';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validar parâmetros obrigatórios
    const usuarioId = searchParams.get('usuarioId');
    const formato = searchParams.get('formato');
    
    if (!usuarioId) {
      return NextResponse.json(
        { erro: 'Parâmetro usuarioId é obrigatório' },
        { status: 400 }
      );
    }
    
    if (!formato || !['pdf', 'excel', 'csv'].includes(formato)) {
      return NextResponse.json(
        { erro: 'Parâmetro formato deve ser: pdf, excel ou csv' },
        { status: 400 }
      );
    }
    
    // Datas do período (padrão: últimos 30 dias)
    const fim = searchParams.get('fim')
      ? new Date(searchParams.get('fim')!)
      : new Date();
    
    const inicio = searchParams.get('inicio')
      ? new Date(searchParams.get('inicio')!)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Buscar dados do usuário
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(usuarioId) },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
    
    if (!usuario) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 404 }
      );
    }
    
    // Buscar sessões do período
    const sessoes = await prisma.sessaoAdaptativa.findMany({
      where: {
        usuarioId: parseInt(usuarioId),
        iniciadoEm: {
          gte: inicio,
          lte: fim,
        },
        status: 'FINALIZADA',
      },
      include: {
        respostas: {
          include: {
            perguntaBanco: {
              select: {
                texto: true,
                categoria: true,
                escalaNome: true,
              },
            },
          },
        },
      },
      orderBy: { iniciadoEm: 'asc' },
    });
    
    // Buscar alertas do período
    const alertas = await prisma.alertaSocioemocional.findMany({
      where: {
        usuarioId: parseInt(usuarioId),
        criadoEm: {
          gte: inicio,
          lte: fim,
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
    
    // Calcular scores por categoria
    const scoresPorCategoria: any = {};
    sessoes.forEach((sessao) => {
      sessao.respostas.forEach((resposta) => {
        const cat = resposta.perguntaBanco?.categoria || 'OUTROS';
        if (!scoresPorCategoria[cat]) {
          scoresPorCategoria[cat] = {
            valores: [],
            total: 0,
          };
        }
        if (resposta.valorNormalizado !== null && resposta.valorNormalizado !== undefined) {
          scoresPorCategoria[cat].valores.push(resposta.valorNormalizado);
          scoresPorCategoria[cat].total++;
        }
      });
    });
    
    // Calcular estatísticas por categoria
    const scoresCalculados: any = {};
    Object.entries(scoresPorCategoria).forEach(([cat, data]: [string, any]) => {
      const valores = data.valores;
      const media = valores.reduce((a: number, b: number) => a + b, 0) / valores.length;
      const minimo = Math.min(...valores);
      const maximo = Math.max(...valores);
      
      // Calcular desvio padrão
      const variancia = valores.reduce((a: number, v: number) => a + Math.pow(v - media, 2), 0) / valores.length;
      const desvio = Math.sqrt(variancia);
      
      // Calcular tendência (últimos 5 vs primeiros 5)
      let tendencia: 'SUBINDO' | 'ESTAVEL' | 'DESCENDO' = 'ESTAVEL';
      if (valores.length >= 10) {
        const primeiraMetade = valores.slice(0, Math.floor(valores.length / 2));
        const segundaMetade = valores.slice(Math.floor(valores.length / 2));
        const mediaPrimeira = primeiraMetade.reduce((a: number, b: number) => a + b, 0) / primeiraMetade.length;
        const mediaSegunda = segundaMetade.reduce((a: number, b: number) => a + b, 0) / segundaMetade.length;
        
        if (mediaSegunda > mediaPrimeira + 0.1) tendencia = 'SUBINDO';
        else if (mediaSegunda < mediaPrimeira - 0.1) tendencia = 'DESCENDO';
      }
      
      scoresCalculados[cat] = {
        media,
        minimo,
        maximo,
        desvio,
        tendencia,
        total_avaliacoes: data.total,
      };
    });
    
    // Evolução de theta
    const thetaEvolucao = sessoes.map((sessao) => ({
      data: sessao.iniciadoEm,
      theta: sessao.thetaEstimado || 0,
      erro: sessao.erroEstimacao || 0,
      confianca: sessao.confianca || (1 / (1 + (sessao.erroEstimacao || 1))),
      perguntasRespondidas: sessao.respostas.length,
    }));
    
    // Respostas detalhadas
    const respostas = sessoes.flatMap((sessao) =>
      sessao.respostas.map((resp) => ({
        data: resp.respondidoEm,
        pergunta: resp.perguntaBanco?.texto || 'Pergunta não encontrada',
        resposta: typeof resp.valor === 'string' || typeof resp.valor === 'number' 
          ? resp.valor 
          : resp.valorNumerico || resp.valorTexto || 0,
        categoria: resp.perguntaBanco?.categoria || 'OUTROS',
        valorNormalizado: resp.valorNormalizado || 0,
      }))
    );
    
    // Processar interpretações de escalas clínicas
    const interpretacoes: any = {};
    
    // PHQ-9
    const respostasPHQ9 = sessoes.flatMap((s) =>
      s.respostas.filter((r) => r.perguntaBanco?.escalaNome === 'PHQ-9')
    );
    if (respostasPHQ9.length >= 9) {
      const scorePHQ9 = respostasPHQ9.slice(-9).reduce((sum, r) => sum + (typeof r.valor === 'number' ? r.valor : r.valorNumerico || 0), 0);
      const item9Val = respostasPHQ9.find((r) => r.perguntaBanco?.texto?.includes('ferir'))?.valorNumerico;
      const item9 = item9Val !== null ? item9Val : undefined;
      const interpretacao = interpretarPHQ9(scorePHQ9, item9);
      interpretacoes.phq9 = {
        score: scorePHQ9,
        categoria: interpretacao.categoria,
        nivelAlerta: interpretacao.nivelAlerta,
        descricao: interpretacao.descricao,
      };
    }
    
    // GAD-7
    const respostasGAD7 = sessoes.flatMap((s) =>
      s.respostas.filter((r) => r.perguntaBanco?.escalaNome === 'GAD-7')
    );
    if (respostasGAD7.length >= 7) {
      const scoreGAD7 = respostasGAD7.slice(-7).reduce((sum, r) => sum + (typeof r.valor === 'number' ? r.valor : r.valorNumerico || 0), 0);
      const interpretacao = interpretarGAD7(scoreGAD7);
      interpretacoes.gad7 = {
        score: scoreGAD7,
        categoria: interpretacao.categoria,
        nivelAlerta: interpretacao.nivelAlerta,
        descricao: interpretacao.descricao,
      };
    }
    
    // WHO-5
    const respostasWHO5 = sessoes.flatMap((s) =>
      s.respostas.filter((r) => r.perguntaBanco?.escalaNome === 'WHO-5')
    );
    if (respostasWHO5.length >= 5) {
      const scoreWHO5 = respostasWHO5.slice(-5).reduce((sum, r) => sum + (typeof r.valor === 'number' ? r.valor : r.valorNumerico || 0), 0);
      const interpretacao = interpretarWHO5(scoreWHO5);
      interpretacoes.who5 = {
        score: scoreWHO5,
        categoria: interpretacao.categoria,
        nivelAlerta: interpretacao.nivelAlerta,
        descricao: interpretacao.descricao,
      };
    }
    
    // Preparar dados para exportação
    const dadosExport = {
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
      },
      periodo: { inicio, fim },
      scoresPorCategoria: scoresCalculados,
      thetaEvolucao,
      respostas,
      alertas: alertas.map((a) => ({
        data: a.criadoEm,
        tipo: a.tipo,
        severidade: a.nivel,
        descricao: a.descricao,
        status: a.status,
      })),
      interpretacoes: Object.keys(interpretacoes).length > 0 ? interpretacoes : undefined,
    };
    
    // Gerar arquivo conforme formato
    if (formato === 'pdf') {
      const dadosPDF = {
        ...dadosExport,
        alertas: {
          total: alertas.length,
          porNivel: alertas.reduce((acc, a) => {
            acc[a.nivel] = (acc[a.nivel] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          criticos: alertas
            .filter((a) => a.nivel === 'VERMELHO' || a.nivel === 'LARANJA')
            .slice(0, 5)
            .map((a) => ({
              tipo: a.tipo,
              data: a.criadoEm,
              descricao: a.descricao,
            })),
        },
      };
      
      const blob = await gerarRelatorioPDF(dadosPDF);
      const buffer = Buffer.from(await blob.arrayBuffer());
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="relatorio_${usuario.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`,
        },
      });
    } else if (formato === 'excel') {
      const buffer = Buffer.from(await gerarRelatorioExcel(dadosExport));
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="relatorio_${usuario.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    } else {
      // CSV
      const csv = gerarRelatorioCSV(dadosExport);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="relatorio_${usuario.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }
  } catch (erro) {
    console.error('Erro ao gerar relatório:', erro);
    return NextResponse.json(
      { erro: 'Erro ao gerar relatório', detalhes: erro instanceof Error ? erro.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
