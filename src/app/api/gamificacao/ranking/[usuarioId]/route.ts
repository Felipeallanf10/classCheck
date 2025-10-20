/**
 * API Route: GET /api/gamificacao/ranking/[usuarioId]
 * Busca a posição de um usuário no ranking
 */

import { NextRequest, NextResponse } from 'next/server'
import { buscarPosicaoUsuario } from '@/lib/gamificacao/ranking-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const usuarioId = parseInt(params.usuarioId)
    const { searchParams } = new URL(request.url)
    const configuracaoId = parseInt(searchParams.get('configuracaoId') || '1')

    if (isNaN(usuarioId) || isNaN(configuracaoId)) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      )
    }

    const posicao = await buscarPosicaoUsuario(usuarioId, configuracaoId)

    return NextResponse.json(posicao, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar posição:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar posição no ranking' },
      { status: 500 }
    )
  }
}
