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

    // Mapear estadoEmocional para TipoHumor enum
    const humorMap: Record<string, 'MUITO_TRISTE' | 'TRISTE' | 'NEUTRO' | 'FELIZ' | 'MUITO_FELIZ'> = {
      'Muito Triste': 'MUITO_TRISTE',
      'Triste': 'TRISTE', 
      'Neutro': 'NEUTRO',
      'Feliz': 'FELIZ',
      'Muito Feliz': 'MUITO_FELIZ',
      // Fallbacks para outros estados
      'Ansioso': 'TRISTE',
      'Focado': 'FELIZ',
      'Motivado': 'MUITO_FELIZ',
      'Entediado': 'NEUTRO'
    }

    const humor = humorMap[estadoEmocional] || 'NEUTRO'

    // Salvar avaliação no banco de dados usando HumorRegistro
    const avaliacao = await prisma.humorRegistro.create({
      data: {
        usuarioId,
        humor,
        observacao: observacoes || `${estadoEmocional} - ${JSON.stringify(respostas)}`,
        data: new Date()
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

    // Buscar registros de humor no banco
    const registrosHumor = await prisma.humorRegistro.findMany({
      where: {
        usuarioId: parseInt(usuarioId)
      },
      orderBy: {
        data: 'desc'
      },
      take: limite
    })

    // Mapear para o formato esperado pela API
    const avaliacoes = registrosHumor.map(registro => ({
      id: registro.id.toString(),
      estadoEmocional: registro.humor,
      valencia: 0,
      ativacao: 0,
      confianca: 0,
      observacoes: registro.observacao,
      dataAvaliacao: registro.data,
      respostas: null
    }))

    return NextResponse.json({
      avaliacoes,
      total: avaliacoes.length
    })

  } catch (error) {
    console.error('Erro ao buscar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
