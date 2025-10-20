/**
 * API Route: GET /api/gamificacao/conquistas/[usuarioId]
 * Busca conquistas de um usuário específico
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  buscarConquistasUsuario,
  buscarProgressoConquistas,
} from '@/lib/gamificacao/conquistas-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const usuarioId = parseInt(params.usuarioId)
    const { searchParams } = new URL(request.url)
    const incluirProgresso = searchParams.get('progresso') === 'true'

    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'ID de usuário inválido' },
        { status: 400 }
      )
    }

    let resultado

    if (incluirProgresso) {
      // Retorna todas as conquistas com progresso
      resultado = await buscarProgressoConquistas(usuarioId)
    } else {
      // Retorna apenas conquistas desbloqueadas
      resultado = await buscarConquistasUsuario(usuarioId)
    }

    return NextResponse.json(resultado, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar conquistas do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar conquistas do usuário' },
      { status: 500 }
    )
  }
}
