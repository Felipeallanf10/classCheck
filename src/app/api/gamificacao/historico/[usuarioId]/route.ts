/**
 * API Route: GET /api/gamificacao/historico/[usuarioId]
 * Busca o histórico de XP de um usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { buscarHistoricoXP } from '@/lib/gamificacao/xp-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const usuarioId = parseInt(params.usuarioId)
    const { searchParams } = new URL(request.url)
    const limite = parseInt(searchParams.get('limite') || '20')

    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'usuarioId inválido' },
        { status: 400 }
      )
    }

    const historico = await buscarHistoricoXP(usuarioId, limite)

    return NextResponse.json(historico, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}
