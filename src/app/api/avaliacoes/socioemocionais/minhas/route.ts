import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUserId } from '@/lib/auth-temp'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Pegar ID do usuário autenticado
    const usuarioId = await getCurrentUserId()

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
