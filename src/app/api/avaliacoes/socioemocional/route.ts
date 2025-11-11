import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUserId } from '@/lib/auth-temp'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      aulaId,
      valencia,
      ativacao,
      estadoPrimario,
      confianca,
      totalPerguntas,
      tempoResposta,
      respostas,
    } = body

    // Pegar ID do usuário autenticado
    const usuarioId = await getCurrentUserId()

    // Criar avaliação socioemocional
    const avaliacao = await prisma.avaliacaoSocioemocional.create({
      data: {
        usuarioId,
        aulaId: parseInt(aulaId),
        valencia: parseFloat(valencia),
        ativacao: parseFloat(ativacao),
        estadoPrimario,
        confianca: parseFloat(confianca),
        totalPerguntas: parseInt(totalPerguntas),
        tempoResposta: parseInt(tempoResposta),
        respostas: typeof respostas === 'string' ? respostas : JSON.stringify(respostas),
      },
    })

    return NextResponse.json(avaliacao, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar avaliação socioemocional:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar avaliação' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const aulaId = searchParams.get('aulaId')

    if (!aulaId) {
      return NextResponse.json(
        { error: 'aulaId é obrigatório' },
        { status: 400 }
      )
    }

    // Pegar ID do usuário autenticado
    const usuarioId = await getCurrentUserId()

    const avaliacao = await prisma.avaliacaoSocioemocional.findUnique({
      where: {
        usuarioId_aulaId: {
          usuarioId,
          aulaId: parseInt(aulaId),
        },
      },
    })

    return NextResponse.json(avaliacao)
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar avaliação' },
      { status: 500 }
    )
  }
}
