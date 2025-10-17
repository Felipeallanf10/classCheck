/**
 * API Route: GET /api/gamificacao/perfil/[usuarioId]
 * Busca o perfil de gamificação de um usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { buscarPerfilGamificacao } from '@/lib/gamificacao/xp-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const usuarioId = parseInt(params.usuarioId)

    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'usuarioId inválido' },
        { status: 400 }
      )
    }

    const perfil = await buscarPerfilGamificacao(usuarioId)

    if (!perfil) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(perfil, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}
