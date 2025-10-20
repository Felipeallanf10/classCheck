/**
 * API Route: POST /api/gamificacao/conquistas/verificar
 * Verifica e desbloqueia conquistas para um usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { verificarConquistas } from '@/lib/gamificacao/conquistas-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, acao } = body

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'usuarioId é obrigatório' },
        { status: 400 }
      )
    }

    const conquistasDesbloqueadas = await verificarConquistas({
      usuarioId: parseInt(usuarioId),
      acao,
    })

    return NextResponse.json({
      novasConquistas: conquistasDesbloqueadas,
      quantidade: conquistasDesbloqueadas.length,
    }, { status: 200 })
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar conquistas' },
      { status: 500 }
    )
  }
}
