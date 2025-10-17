/**
 * API Route: POST /api/gamificacao/xp
 * Adiciona XP para um usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { adicionarXP } from '@/lib/gamificacao/xp-service'
import { TABELA_XP } from '@/lib/gamificacao/xp-calculator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, acao, aulaId, descricao } = body

    // Validação
    if (!usuarioId || !acao) {
      return NextResponse.json(
        { error: 'usuarioId e acao são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se a ação é válida
    if (!(acao in TABELA_XP)) {
      return NextResponse.json(
        { error: 'Ação inválida' },
        { status: 400 }
      )
    }

    // Adiciona XP
    const resultado = await adicionarXP({
      usuarioId: parseInt(usuarioId),
      acao,
      aulaId: aulaId ? parseInt(aulaId) : undefined,
      descricao,
    })

    return NextResponse.json(resultado, { status: 200 })
  } catch (error) {
    console.error('Erro ao adicionar XP:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar XP' },
      { status: 500 }
    )
  }
}
