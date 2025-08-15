import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Enum para status da aula
const StatusAula = z.enum(['AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'])

const createAulaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  materia: z.string().min(1, 'Matéria é obrigatória'),
  dataHora: z.string().datetime('Data e hora inválidas'),
  duracao: z.number().min(15, 'Duração mínima de 15 minutos').max(480, 'Duração máxima de 8 horas'),
  professorId: z.number().int().positive('Professor é obrigatório'),
  sala: z.string().optional()
})

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().nullish(),
  materia: z.string().nullish(),
  professorId: z.coerce.number().nullish(),
  status: StatusAula.nullish(),
  dataInicio: z.string().datetime().nullish(),
  dataFim: z.string().datetime().nullish()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      materia: searchParams.get('materia'),
      professorId: searchParams.get('professorId'),
      status: searchParams.get('status'),
      dataInicio: searchParams.get('dataInicio'),
      dataFim: searchParams.get('dataFim')
    })

    const { page, limit, search, materia, professorId, status, dataInicio, dataFim } = query
    const skip = (page - 1) * limit

    // Construir filtros dinâmicos
    const where: any = {}
    
    if (professorId) {
      where.professorId = professorId
    }
    
    if (status) {
      where.status = status
    }
    
    if (materia) {
      where.materia = {
        contains: materia,
        mode: 'insensitive'
      }
    }

    if (dataInicio || dataFim) {
      where.dataHora = {} as any
      if (dataInicio) {
        where.dataHora.gte = new Date(dataInicio)
      }
      if (dataFim) {
        where.dataHora.lte = new Date(dataFim)
      }
    }
    
    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
        { materia: { contains: search, mode: 'insensitive' } },
        { professor: { nome: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [aulas, total] = await Promise.all([
      prisma.aula.findMany({
        where,
        select: {
          id: true,
          titulo: true,
          descricao: true,
          materia: true,
          dataHora: true,
          duracao: true,
          sala: true,
          status: true,
          createdAt: true,
          professor: {
            select: {
              id: true,
              nome: true,
              materia: true,
              avatar: true
            }
          },
          _count: {
            select: {
              avaliacoes: true,
              aulasFavoritas: true
            }
          }
        },
        orderBy: { dataHora: 'desc' },
        skip,
        take: limit
      }),
      prisma.aula.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      aulas,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao buscar aulas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createAulaSchema.parse(body)
    
    // Verificar se professor existe
    const professor = await prisma.professor.findUnique({
      where: { id: data.professorId }
    })
    
    if (!professor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 400 }
      )
    }

    // Verificar se professor está ativo
    if (!professor.ativo) {
      return NextResponse.json(
        { error: 'Professor não está ativo' },
        { status: 400 }
      )
    }

    // Verificar conflito de horário do professor
    const dataHora = new Date(data.dataHora)
    const dataFim = new Date(dataHora.getTime() + data.duracao * 60000)
    
    const conflito = await prisma.aula.findFirst({
      where: {
        professorId: data.professorId,
        status: { not: 'CANCELADA' },
        AND: [
          { dataHora: { lt: dataFim } },
          { 
            dataHora: { 
              gte: new Date(dataHora.getTime() - 60000) // 1 minuto de margem
            }
          }
        ]
      }
    })

    if (conflito) {
      return NextResponse.json(
        { error: 'Professor já possui aula agendada neste horário' },
        { status: 400 }
      )
    }
    
    const aula = await prisma.aula.create({
      data: {
        ...data,
        dataHora: new Date(data.dataHora)
      },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        materia: true,
        dataHora: true,
        duracao: true,
        sala: true,
        status: true,
        createdAt: true,
        professor: {
          select: {
            id: true,
            nome: true,
            materia: true,
            avatar: true
          }
        }
      }
    })
    
    return NextResponse.json(aula, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar aula:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
