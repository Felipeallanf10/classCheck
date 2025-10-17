/**
 * API Route: GET/POST /api/gamificacao/ranking
 * Gerencia o ranking de XP
 */

import { NextRequest, NextResponse } from 'next/server'
import { buscarTop3, calcularRanking } from '@/lib/gamificacao/ranking-service'
import { PeriodoRanking } from '@prisma/client'

// GET: Busca o Top 3 do ranking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const configuracaoId = parseInt(searchParams.get('configuracaoId') || '1')
    const periodo = searchParams.get('periodo') as PeriodoRanking | null

    if (isNaN(configuracaoId)) {
      return NextResponse.json(
        { error: 'configuracaoId inválido' },
        { status: 400 }
      )
    }

    const top3 = await buscarTop3(configuracaoId, periodo || undefined)

    return NextResponse.json({ top3 }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar ranking:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ranking' },
      { status: 500 }
    )
  }
}

// POST: Calcula o ranking do período
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { configuracaoId } = body

    if (!configuracaoId) {
      return NextResponse.json(
        { error: 'configuracaoId é obrigatório' },
        { status: 400 }
      )
    }

    const resultado = await calcularRanking(parseInt(configuracaoId))

    return NextResponse.json(resultado, { status: 200 })
  } catch (error) {
    console.error('Erro ao calcular ranking:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular ranking' },
      { status: 500 }
    )
  }
}
