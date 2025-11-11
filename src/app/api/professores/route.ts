import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, checkRole } from '@/lib/auth-helpers'
import { z } from 'zod'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const createProfessorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  materia: z.string().min(1, 'Matéria é obrigatória'),
  avatar: z.string().url().optional()
})

export async function GET(request: NextRequest) {
  // Verificar autenticação
  const { authenticated, userId, userRole, error } = await requireAuth()
  if (!authenticated) return error!

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
    const where: any = {
      role: 'PROFESSOR' // Filtrar apenas usuários com role PROFESSOR
    }
    
    // FILTRO POR USUÁRIO BASEADO NO ROLE
    if (userRole === 'ALUNO') {
      // Aluno vê apenas professores das suas turmas
      const turmasDoAluno = await prisma.turmaAluno.findMany({
        where: { alunoId: userId! },
        select: { turmaId: true }
      })
      
      const turmaIds = turmasDoAluno.map(t => t.turmaId)
      
      // Buscar professores que lecionam nessas turmas
      const professoresDasTurmas = await prisma.turmaProfessor.findMany({
        where: { turmaId: { in: turmaIds } },
        select: { professorId: true }
      })
      
      const professorIds = [...new Set(professoresDasTurmas.map(tp => tp.professorId))]
      
      where.id = {
        in: professorIds
      }
    }
    // PROFESSOR e ADMIN veem todos os professores (sem filtro adicional)
    
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
      prisma.usuario.findMany({
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
            select: { 
              aulasMinistradas: true // Relação correta para aulas ministradas pelo professor
            }
          }
        },
        orderBy: { nome: 'asc' },
        skip,
        take: limit
      }),
      prisma.usuario.count({ where })
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
  // Apenas admins podem criar professores
  const { authorized, error } = await checkRole(['ADMIN'])
  if (!authorized) return error!

  try {
    const body = await request.json()
    const data = createProfessorSchema.parse(body)
    
    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }
    
    // Hash da senha
    const bcrypt = require('bcryptjs')
    const senhaHash = await bcrypt.hash(data.senha, 10)
    
    const professor = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
        materia: data.materia,
        avatar: data.avatar,
        role: 'PROFESSOR'
      },
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
