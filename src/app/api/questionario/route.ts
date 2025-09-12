import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface AvaliacaoData {
  usuarioId: number
  respostas: Record<string, unknown>
  estadoEmocional: string
  valencia?: number
  ativacao?: number
  confianca?: number
  observacoes?: string
}

interface AvaliacaoResult {
  id: string
  estadoEmocional: string
  valencia: number
  ativacao: number
  confianca: number
  observacoes: string | null
  dataAvaliacao: Date
  respostas: string | null
}

export async function POST(request: NextRequest) {
  try {
    const data: AvaliacaoData = await request.json()
    const { 
      usuarioId, 
      respostas, 
      estadoEmocional, 
      valencia, 
      ativacao, 
      confianca,
      observacoes 
    } = data

    // Validação básica
    if (!usuarioId || !respostas || !estadoEmocional) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Salvar avaliação no banco de dados (usando mock)
    const avaliacao = await prisma.avaliacaoSocioemocional.create({
      data: {
        usuarioId,
        estadoEmocional,
        valencia: valencia || 0,
        ativacao: ativacao || 0,
        confianca: confianca || 0,
        observacoes,
        respostas: JSON.stringify(respostas),
        dataAvaliacao: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      avaliacaoId: avaliacao.id,
      message: 'Avaliação salva com sucesso'
    })

  } catch (error) {
    console.error('Erro ao salvar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const limite = parseInt(searchParams.get('limite') || '10')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // TODO: Buscar avaliações no banco quando Prisma estiver configurado
    // const avaliacoes = await prisma.avaliacaoSocioemocional.findMany({...})

    // Por enquanto, retornar dados simulados
    const avaliacoesSimuladas = [
      {
        id: '1',
        estadoEmocional: 'Focado',
        valencia: 0.3,
        ativacao: 0.6,
        confianca: 0.85,
        observacoes: 'Concentração durante aula de matemática',
        dataAvaliacao: new Date(),
        respostas: { pergunta1: 'resposta1' }
      },
      {
        id: '2',
        estadoEmocional: 'Ansioso',
        valencia: -0.4,
        ativacao: 0.7,
        confianca: 0.78,
        observacoes: 'Nervosismo antes da apresentação',
        dataAvaliacao: new Date(Date.now() - 86400000), // 1 dia atrás
        respostas: { pergunta1: 'resposta2' }
      }
    ]

    return NextResponse.json({
      avaliacoes: avaliacoesSimuladas.slice(0, limite),
      total: avaliacoesSimuladas.length
    })

  } catch (error) {
    console.error('Erro ao buscar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
