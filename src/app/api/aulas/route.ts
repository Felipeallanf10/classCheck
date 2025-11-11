import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, checkRole } from '@/lib/auth-helpers'
import { z } from 'zod'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const createAulaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  materia: z.string().min(1, 'Matéria é obrigatória'),
  dataHora: z.string().datetime('Data e hora inválidas'),
  duracao: z.number().min(15, 'Duração mínima de 15 minutos').max(480, 'Duração máxima de 8 horas'),
  professorId: z.number().int().positive('Professor é obrigatório'),
  turmaId: z.number().int().positive('Turma é obrigatória'),
  sala: z.string().optional()
})

export async function GET(request: NextRequest) {
  // Verificar autenticação
  const { authenticated, userId, userRole, error } = await requireAuth()
  if (!authenticated) return error!

  try {
    const { searchParams } = new URL(request.url)
    
    // Parse manual dos parâmetros
    const date = searchParams.get('date') || undefined
    const page = parseInt(searchParams.get('page') || '1') || 1
    const limit = parseInt(searchParams.get('limit') || '10') || 10
    const search = searchParams.get('search') || undefined
    const materia = searchParams.get('materia') || undefined
    const professorId = searchParams.get('professorId') ? parseInt(searchParams.get('professorId')!) : undefined
    const status = searchParams.get('status') || undefined
    const dataInicio = searchParams.get('dataInicio') || undefined
    const dataFim = searchParams.get('dataFim') || undefined

    const skip = (page - 1) * limit

    // Construir filtros dinâmicos
    const where: any = {}
    
    // FILTRO POR USUÁRIO BASEADO NO ROLE
    if (userRole === 'ALUNO') {
      // Aluno vê apenas aulas das suas turmas
      const turmasDoAluno = await prisma.turmaAluno.findMany({
        where: { alunoId: userId! },
        select: { turmaId: true }
      })
      
      where.turmaId = {
        in: turmasDoAluno.map(t => t.turmaId)
      }
    } else if (userRole === 'PROFESSOR') {
      // Professor vê apenas suas próprias aulas
      where.professorId = userId
    }
    // ADMIN vê todas as aulas (sem filtro adicional)
    
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

    // Filtro por data específica (formato YYYY-MM-DD)
    if (date) {
      const targetDate = new Date(date)
      const nextDate = new Date(targetDate)
      nextDate.setDate(nextDate.getDate() + 1)
      
      where.dataHora = {
        gte: targetDate,
        lt: nextDate
      }
    } else if (dataInicio || dataFim) {
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
              avaliacoesSocioemocionais: true,
              avaliacoesDidaticas: true,
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
  // Apenas professores e admins podem criar aulas
  const { authorized, userRole, error } = await checkRole(['PROFESSOR', 'ADMIN'])
  if (!authorized) return error!

  try {
    const body = await request.json()
    const data = createAulaSchema.parse(body)
    
    // Verificar se professor existe e tem role PROFESSOR
    const professor = await prisma.usuario.findUnique({
      where: { id: data.professorId }
    })
    
    if (!professor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 400 }
      )
    }

    if (professor.role !== 'PROFESSOR') {
      return NextResponse.json(
        { error: 'Usuário não é um professor' },
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
    
    // Verificar se turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: data.turmaId }
    })
    
    if (!turma) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 400 }
      )
    }
    
    if (!turma.ativa) {
      return NextResponse.json(
        { error: 'Turma não está ativa' },
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
