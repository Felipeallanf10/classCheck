import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calcularMetricasAgregadas, AvaliacaoAulaCompleta } from '@/lib/analytics/metricas-avaliacoes';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics/metricas-avaliacoes
 * 
 * Retorna métricas agregadas e análises avançadas das avaliações do usuário
 * 
 * Query params:
 * - usuarioId: number (obrigatório)
 * - periodoInicio: string (opcional, ISO date)
 * - periodoFim: string (opcional, ISO date)
 * - materia: string (opcional, filtrar por matéria)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const usuarioId = searchParams.get('usuarioId');
    const periodoInicio = searchParams.get('periodoInicio');
    const periodoFim = searchParams.get('periodoFim');
    const materia = searchParams.get('materia');

    if (!usuarioId) {
      return NextResponse.json(
        { erro: 'usuarioId é obrigatório' },
        { status: 400 }
      );
    }

    // Construir filtros
    const filtros: any = {
      usuarioId: parseInt(usuarioId),
    };

    if (periodoInicio || periodoFim) {
      filtros.createdAt = {};
      if (periodoInicio) {
        filtros.createdAt.gte = new Date(periodoInicio);
      }
      if (periodoFim) {
        filtros.createdAt.lte = new Date(periodoFim);
      }
    }

    if (materia) {
      filtros.aula = {
        materia: materia,
      };
    }

    // Buscar avaliações socioemocionais
    const avaliacoesSocio = await prisma.avaliacaoSocioemocional.findMany({
      where: filtros,
      include: {
        aula: {
          select: {
            id: true,
            titulo: true,
            materia: true,
            professor: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Buscar avaliações didáticas correspondentes
    const aulaIds = avaliacoesSocio.map(av => av.aulaId);
    const avaliacoesDidaticas = await prisma.avaliacaoDidatica.findMany({
      where: {
        usuarioId: parseInt(usuarioId),
        aulaId: { in: aulaIds },
      },
    });

    // Mapear para formato unificado
    const avaliacoesCompletas: AvaliacaoAulaCompleta[] = avaliacoesSocio.map(socio => {
      const didatica = avaliacoesDidaticas.find(d => d.aulaId === socio.aulaId);

      return {
        id: socio.id,
        data: socio.createdAt,
        aulaTitulo: socio.aula.titulo,
        aulaMateria: socio.aula.materia,
        professor: socio.aula.professor.nome,
        socioemocional: {
          valencia: socio.valencia,
          ativacao: socio.ativacao,
          estadoPrimario: socio.estadoPrimario,
          confianca: socio.confianca,
          thetaEstimado: socio.thetaEstimado,
          totalPerguntas: socio.totalPerguntas,
        },
        didatica: didatica ? {
          compreensaoConteudo: didatica.compreensaoConteudo,
          ritmoAula: didatica.ritmoAula,
          recursosDidaticos: didatica.recursosDidaticos,
          engajamento: didatica.engajamento,
          pontoPositivo: didatica.pontoPositivo || undefined,
          sugestao: didatica.sugestao || undefined,
        } : undefined,
      };
    });

    if (avaliacoesCompletas.length === 0) {
      return NextResponse.json({
        mensagem: 'Nenhuma avaliação encontrada para o período',
        metricas: null,
      });
    }

    // Calcular métricas agregadas
    const metricas = calcularMetricasAgregadas(avaliacoesCompletas);

    return NextResponse.json({
      metricas,
      totalRegistros: avaliacoesCompletas.length,
      periodo: {
        inicio: metricas.periodoInicio,
        fim: metricas.periodoFim,
      },
    });

  } catch (error) {
    console.error('[GET /api/analytics/metricas-avaliacoes] Erro:', error);
    return NextResponse.json(
      { 
        erro: 'Erro ao calcular métricas',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
