import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/relatorio-longitudinal
 * 
 * Retorna evolução temporal das avaliações do usuário
 * Agrupa por dia e calcula médias
 * 
 * Query params:
 * - usuarioId: number (obrigatório)
 * - periodoInicio: string (ISO date, obrigatório)
 * - periodoFim: string (ISO date, obrigatório)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const usuarioId = searchParams.get('usuarioId');
    const periodoInicio = searchParams.get('periodoInicio');
    const periodoFim = searchParams.get('periodoFim');

    if (!usuarioId || !periodoInicio || !periodoFim) {
      return NextResponse.json(
        { erro: 'usuarioId, periodoInicio e periodoFim são obrigatórios' },
        { status: 400 }
      );
    }

    const dataInicio = parseISO(periodoInicio);
    const dataFim = parseISO(periodoFim);

    // Buscar avaliações socioemocionais no período
    // Filtra pela data da AULA, não pela data de criação da avaliação
    const avaliacoes = await prisma.avaliacaoSocioemocional.findMany({
      where: {
        usuarioId: parseInt(usuarioId),
        aula: {
          dataHora: {
            gte: dataInicio,
            lte: dataFim,
          },
        },
      },
      include: {
        aula: true,
      },
      orderBy: {
        aula: {
          dataHora: 'asc',
        },
      },
    });

    if (avaliacoes.length === 0) {
      return NextResponse.json({
        dadosTemporais: [],
        estatisticas: {
          valenciaMedia: 0,
          ativacaoMedia: 0,
          confiancaMedia: 0,
          tendencia: 'estavel' as const,
          variacaoPercentual: 0,
        },
        periodo: {
          inicio: dataInicio,
          fim: dataFim,
        },
      });
    }

    // Agrupar avaliações por dia (usando data da AULA)
    const avaliacoesPorDia = new Map<string, typeof avaliacoes>();

    avaliacoes.forEach((av) => {
      const dia = format(av.aula.dataHora, 'yyyy-MM-dd');
      if (!avaliacoesPorDia.has(dia)) {
        avaliacoesPorDia.set(dia, []);
      }
      avaliacoesPorDia.get(dia)!.push(av);
    });

    // Criar array de todos os dias do período
    const todosDias = eachDayOfInterval({ start: dataInicio, end: dataFim });

    // Calcular médias por dia
    const dadosTemporais = todosDias.map((dia) => {
      const diaStr = format(dia, 'yyyy-MM-dd');
      const avaliacoesDia = avaliacoesPorDia.get(diaStr) || [];

      if (avaliacoesDia.length === 0) {
        // Dia sem avaliações - usar null ou valores anteriores
        return null;
      }

      const valenciaMedia = avaliacoesDia.reduce((sum, av) => sum + av.valencia, 0) / avaliacoesDia.length;
      const ativacaoMedia = avaliacoesDia.reduce((sum, av) => sum + av.ativacao, 0) / avaliacoesDia.length;
      const confiancaMedia = avaliacoesDia.reduce((sum, av) => sum + av.confianca, 0) / avaliacoesDia.length;

      // Estado predominante do dia
      const estados = avaliacoesDia.map((av) => av.estadoPrimario);
      const estadosPredominantes = estados.reduce((acc, estado) => {
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const estadoPrimario = Object.entries(estadosPredominantes)
        .sort(([, a], [, b]) => b - a)[0][0];

      return {
        data: format(dia, 'dd/MM'),
        valencia: Number(valenciaMedia.toFixed(2)),
        ativacao: Number(ativacaoMedia.toFixed(2)),
        confianca: Number(confiancaMedia.toFixed(2)),
        estadoPrimario,
        totalAvaliacoes: avaliacoesDia.length,
      };
    }).filter(Boolean); // Remover dias null

    // Calcular estatísticas gerais
    const valencias = avaliacoes.map((av) => av.valencia);
    const ativacoes = avaliacoes.map((av) => av.ativacao);
    const confiancas = avaliacoes.map((av) => av.confianca);

    const valenciaMedia = valencias.reduce((a, b) => a + b, 0) / valencias.length;
    const ativacaoMedia = ativacoes.reduce((a, b) => a + b, 0) / ativacoes.length;
    const confiancaMedia = confiancas.reduce((a, b) => a + b, 0) / confiancas.length;

    // Calcular tendência (comparar primeira metade vs segunda metade)
    const metade = Math.floor(valencias.length / 2);
    const primeiraMetade = valencias.slice(0, metade);
    const segundaMetade = valencias.slice(metade);

    const mediaPrimeira = primeiraMetade.reduce((a, b) => a + b, 0) / primeiraMetade.length;
    const mediaSegunda = segundaMetade.reduce((a, b) => a + b, 0) / segundaMetade.length;

    const variacao = mediaSegunda - mediaPrimeira;
    const variacaoPercentual = (variacao / Math.abs(mediaPrimeira)) * 100;

    let tendencia: 'crescente' | 'estavel' | 'decrescente';
    if (Math.abs(variacaoPercentual) < 5) {
      tendencia = 'estavel';
    } else if (variacaoPercentual > 0) {
      tendencia = 'crescente';
    } else {
      tendencia = 'decrescente';
    }

    return NextResponse.json({
      dadosTemporais,
      estatisticas: {
        valenciaMedia: Number(valenciaMedia.toFixed(2)),
        ativacaoMedia: Number(ativacaoMedia.toFixed(2)),
        confiancaMedia: Number(confiancaMedia.toFixed(2)),
        tendencia,
        variacaoPercentual: Number(variacaoPercentual.toFixed(1)),
      },
      periodo: {
        inicio: dataInicio,
        fim: dataFim,
      },
    });
  } catch (error) {
    console.error('[GET /api/analytics/relatorio-longitudinal] Erro:', error);
    return NextResponse.json(
      {
        erro: 'Erro ao gerar relatório longitudinal',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
