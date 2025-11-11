import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const TipoHumor = z.enum(['MUITO_TRISTE', 'TRISTE', 'NEUTRO', 'FELIZ', 'MUITO_FELIZ'])

const createAvaliacaoSchema = z.object({
  usuarioId: z.number().int().positive('ID do usuário é obrigatório'),
  aulaId: z.number().int().positive('ID da aula é obrigatório'),
  humor: TipoHumor,
  nota: z.number().int().min(1, 'Nota mínima é 1').max(5, 'Nota máxima é 5').optional().nullable(),
  feedback: z.string().min(10, 'Feedback deve ter no mínimo 10 caracteres').max(1000, 'Feedback deve ter no máximo 1000 caracteres').optional().nullable()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros disponíveis
    const usuarioId = searchParams.get('usuarioId')
    const aulaId = searchParams.get('aulaId')
    const professorId = searchParams.get('professorId')
    const materia = searchParams.get('materia')
    const humor = searchParams.get('humor')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Construir filtro dinâmico
    const where: any = {}
    
    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId)
    }
    
    if (aulaId) {
      where.aulaId = parseInt(aulaId)
    }
    
    if (humor && TipoHumor.safeParse(humor).success) {
      where.humor = humor
    }
    
    // Filtros por aula relacionada
    if (professorId || materia || dataInicio || dataFim) {
      where.aula = {}
      
      if (professorId) {
        where.aula.professorId = parseInt(professorId)
      }
      
      if (materia) {
        where.aula.materia = materia
      }
      
      if (dataInicio || dataFim) {
        where.aula.dataHora = {}
        
        if (dataInicio) {
          where.aula.dataHora.gte = new Date(dataInicio)
        }
        
        if (dataFim) {
          where.aula.dataHora.lte = new Date(dataFim)
        }
      }
    }

    // Buscar total de registros para paginação
    const total = await prisma.avaliacao.count({ where })

    // Buscar avaliações com paginação
    const avaliacoes = await prisma.avaliacao.findMany({
      where,
      select: {
        id: true,
        humor: true,
        nota: true,
        feedback: true,
        createdAt: true,
        updatedAt: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true,
            role: true
          }
        },
        aula: {
          select: {
            id: true,
            titulo: true,
            materia: true,
            dataHora: true,
            duracao: true,
            sala: true,
            status: true,
            professor: {
              select: {
                id: true,
                nome: true,
                materia: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      data: avaliacoes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createAvaliacaoSchema.parse(body)

    // Verificar se usuário existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { id: data.usuarioId }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!usuario.ativo) {
      return NextResponse.json(
        { error: 'Usuário não está ativo' },
        { status: 400 }
      )
    }

    // Verificar se aula existe
    const aula = await prisma.aula.findUnique({
      where: { id: data.aulaId }
    })

    if (!aula) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se aula já foi concluída ou está cancelada
    if (aula.status === 'CANCELADA') {
      return NextResponse.json(
        { error: 'Não é possível avaliar uma aula cancelada' },
        { status: 400 }
      )
    }

    // Verificar se aula ainda não aconteceu
    const agora = new Date()
    if (aula.dataHora > agora) {
      return NextResponse.json(
        { error: 'Não é possível avaliar uma aula que ainda não aconteceu' },
        { status: 400 }
      )
    }

    // Verificar se usuário já avaliou esta aula (constraint unique)
    const avaliacaoExistente = await prisma.avaliacao.findUnique({
      where: {
        usuarioId_aulaId: {
          usuarioId: data.usuarioId,
          aulaId: data.aulaId
        }
      }
    })

    if (avaliacaoExistente) {
      return NextResponse.json(
        { error: 'Você já avaliou esta aula. Use PUT para editar sua avaliação.' },
        { status: 409 }
      )
    }

    // Criar avaliação
    const avaliacao = await prisma.avaliacao.create({
      data,
      select: {
        id: true,
        humor: true,
        nota: true,
        feedback: true,
        createdAt: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true
          }
        },
        aula: {
          select: {
            id: true,
            titulo: true,
            materia: true,
            dataHora: true,
            professor: {
              select: {
                id: true,
                nome: true,
                materia: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(avaliacao, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    // Erro de constraint unique do Prisma
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Você já avaliou esta aula' },
        { status: 409 }
      )
    }

    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
