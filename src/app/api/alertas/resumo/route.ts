import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/alertas/resumo
 * 
 * Retorna resumo agregado de alertas
 * 
 * Query Params:
 * - usuarioId: ID do usuário (opcional)
 * 
 * @example
 * GET /api/alertas/resumo
 * GET /api/alertas/resumo?usuarioId=1
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const usuarioId = searchParams.get('usuarioId');

    // Construir filtros
    const where: any = {};

    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId);
    }

    // Buscar todos os alertas que atendem aos filtros
    const alertas = await prisma.alertaSocioemocional.findMany({
      where,
      select: {
        id: true,
        nivel: true,
        status: true,
      },
    });

    // Calcular estatísticas
    const total = alertas.length;
    const ativos = alertas.filter((a) => 
      a.status === 'PENDENTE' || 
      a.status === 'EM_ANALISE' || 
      a.status === 'NOTIFICADO'
    ).length;
    const resolvidos = alertas.filter((a) => a.status === 'RESOLVIDO').length;
    const emAcompanhamento = alertas.filter((a) => a.status === 'EM_ACOMPANHAMENTO').length;

    // Contar por nível
    const porNivel = {
      VERMELHO: alertas.filter((a) => a.nivel === 'VERMELHO').length,
      LARANJA: alertas.filter((a) => a.nivel === 'LARANJA').length,
      AMARELO: alertas.filter((a) => a.nivel === 'AMARELO').length,
      VERDE: alertas.filter((a) => a.nivel === 'VERDE').length,
    };

    return NextResponse.json({
      total,
      ativos,
      resolvidos,
      emAcompanhamento,
      porNivel,
    });

  } catch (error) {
    console.error('[API] Erro ao buscar resumo de alertas:', error);
    
    return NextResponse.json(
      { 
        erro: 'Erro ao buscar resumo de alertas',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
