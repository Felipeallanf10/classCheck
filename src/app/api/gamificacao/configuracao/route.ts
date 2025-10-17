/**
 * API Route: GET/POST /api/gamificacao/configuracao
 * Gerencia configurações de ranking
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  buscarConfiguracoesAtivas,
  criarConfiguracaoRanking,
} from '@/lib/gamificacao/ranking-service'
import { PeriodoRanking, VisibilidadeRanking } from '@prisma/client'

// GET: Busca configurações ativas
export async function GET() {
  try {
    const configuracoes = await buscarConfiguracoesAtivas()
    return NextResponse.json(configuracoes, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

// POST: Cria nova configuração
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      periodoCalculo,
      bonusPrimeiroLugar,
      bonusSegundoLugar,
      bonusTerceiroLugar,
      minimoAvaliacoes,
      aplicarAutomaticamente,
      notificarAlunos,
      visibilidadeRanking,
      materiaId,
      criadoPorId,
    } = body

    // Validação
    if (!periodoCalculo || !criadoPorId) {
      return NextResponse.json(
        { error: 'periodoCalculo e criadoPorId são obrigatórios' },
        { status: 400 }
      )
    }

    const configuracao = await criarConfiguracaoRanking({
      periodoCalculo: periodoCalculo as PeriodoRanking,
      bonusPrimeiroLugar: bonusPrimeiroLugar || 0.3,
      bonusSegundoLugar: bonusSegundoLugar || 0.2,
      bonusTerceiroLugar: bonusTerceiroLugar || 0.1,
      minimoAvaliacoes: minimoAvaliacoes || 5,
      aplicarAutomaticamente: aplicarAutomaticamente !== false,
      notificarAlunos: notificarAlunos !== false,
      visibilidadeRanking: (visibilidadeRanking as VisibilidadeRanking) || 'PUBLICO',
      materiaId: materiaId || undefined,
      criadoPorId: parseInt(criadoPorId),
    })

    return NextResponse.json(configuracao, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar configuração:', error)
    return NextResponse.json(
      { error: 'Erro ao criar configuração' },
      { status: 500 }
    )
  }
}
