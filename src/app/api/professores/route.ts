import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const createProfessorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  materia: z.string().min(1, 'Matéria é obrigatória'),
  avatar: z.string().url().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse manual dos parâmetros
    const page = parseInt(searchParams.get('page') || '1') || 1
    const limit = parseInt(searchParams.get('limit') || '10') || 10
    const search = searchParams.get('search') || undefined
    const materia = searchParams.get('materia') || undefined
    const ativoParam = searchParams.get('ativo')
    const ativo = ativoParam === 'true' ? true : ativoParam === 'false' ? false : undefined

    const skip = (page - 1) * limit

    // Construir filtros dinâmicos
    const where: any = {}
    
    if (ativo !== undefined) {
      where.ativo = ativo
    }
    
    if (materia) {
      where.materia = {
        contains: materia,
        mode: 'insensitive'
      }
    }
    
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { materia: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [professores, total] = await Promise.all([
      prisma.professor.findMany({
        where,
        select: {
          id: true,
          nome: true,
          email: true,
          materia: true,
          avatar: true,
          ativo: true,
          createdAt: true,
          _count: {
            select: { aulas: true }
          }
        },
        orderBy: { nome: 'asc' },
        skip,
        take: limit
      }),
      prisma.professor.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      professores,
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
    console.error('Erro ao buscar professores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createProfessorSchema.parse(body)
    
    // Verificar se email já existe
    const existingProfessor = await prisma.professor.findUnique({
      where: { email: data.email }
    })
    
    if (existingProfessor) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }
    
    const professor = await prisma.professor.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        materia: true,
        avatar: true,
        ativo: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(professor, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
