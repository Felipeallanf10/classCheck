import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface RouteParams {
  params: Promise<{ usuarioId: string }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  const params = await context.params
  try {
    const usuarioId = parseInt(params.usuarioId)
    
    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'ID de usuário inválido' },
        { status: 400 }
      )
    }

    // Buscar todas as avaliações socioemocionais do usuário
    const avaliacoes = await prisma.avaliacaoSocioemocional.findMany({
      where: {
        usuarioId
      },
      include: {
        aula: {
          select: {
            id: true,
            titulo: true,
            materia: true,
            dataHora: true,
            professor: {
              select: {
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formatar resposta para evitar problemas com objetos complexos
    const avaliacoesFormatadas = avaliacoes.map(av => ({
      id: av.id,
      valencia: av.valencia,
      ativacao: av.ativacao,
      estadoPrimario: av.estadoPrimario,
      confianca: av.confianca,
      totalPerguntas: av.totalPerguntas,
      tempoResposta: av.tempoResposta,
      createdAt: av.createdAt.toISOString(),
      aula: {
        id: av.aula.id,
        titulo: av.aula.titulo,
        materia: av.aula.materia,
        dataHora: av.aula.dataHora.toISOString(),
        professor: av.aula.professor.nome
      }
    }))

    return NextResponse.json(avaliacoesFormatadas)
  } catch (error) {
    console.error('Erro ao buscar avaliações socioemocionais:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
