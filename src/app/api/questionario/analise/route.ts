import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    
    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Por enquanto retorna dados simulados
    return NextResponse.json({
      resumo: {
        totalAvaliacoes: 5,
        estadoDominante: 'FELIZ',
        tendencia: 'positiva',
        pontuacaoGeral: 75,
        recomendacoes: ['Continue mantendo hábitos positivos!']
      }
    })

  } catch (error) {
    console.error('Erro ao analisar dados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
