/**
 * API para Recalcular Ranking
 * POST /api/gamificacao/ranking/recalcular
 */

import { NextRequest, NextResponse } from 'next/server';
import { calcularRanking, buscarConfiguracoesAtivas } from '@/lib/gamificacao/ranking-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { periodo } = body;

    if (!periodo) {
      return NextResponse.json(
        { erro: 'Período é obrigatório (DIARIO, SEMANAL, MENSAL, ANUAL)' },
        { status: 400 }
      );
    }

    // Busca configuração ativa para o período
    const configuracoes = await buscarConfiguracoesAtivas();
    const configuracao = configuracoes.find((c: any) => c.periodoCalculo === periodo);

    if (!configuracao) {
      return NextResponse.json(
        { erro: `Nenhuma configuração ativa encontrada para o período ${periodo}` },
        { status: 404 }
      );
    }

    // Recalcula o ranking
    const resultado = await calcularRanking(configuracao.id);

    return NextResponse.json({
      mensagem: 'Ranking recalculado com sucesso',
      periodo,
      totalUsuarios: resultado.ranking.length,
      ranking: resultado.ranking.slice(0, 10), // Retorna apenas top 10
    });
  } catch (error) {
    console.error('Erro ao recalcular ranking:', error);
    return NextResponse.json(
      { erro: 'Erro ao recalcular ranking' },
      { status: 500 }
    );
  }
}
