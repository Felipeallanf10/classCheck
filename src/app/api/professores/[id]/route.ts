import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const updateProfessorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  email: z.string().email('Email inválido').optional(),
  materia: z.string().min(1, 'Matéria é obrigatória').optional(),
  avatar: z.string().url().nullable().optional(),
  ativo: z.boolean().optional()
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  const params = await context.params
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const professor = await prisma.usuario.findUnique({
      where: { 
        id,
        role: 'PROFESSOR'
      },
      select: {
        id: true,
        nome: true,
        email: true,
        materia: true,
        avatar: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
        aulasMinistradas: {
          select: {
            id: true,
            titulo: true,
            materia: true,
            dataHora: true,
            status: true
          },
          orderBy: { dataHora: 'desc' },
          take: 10
        },
        _count: {
          select: {
            aulasMinistradas: true
          }
        }
      }
    })

    if (!professor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(professor)
  } catch (error) {
    console.error('Erro ao buscar professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
  const params = await context.params
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = updateProfessorSchema.parse(body)

    // Verificar se professor existe
    const existingProfessor = await prisma.usuario.findUnique({
      where: { 
        id,
        role: 'PROFESSOR'
      }
    })

    if (!existingProfessor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se email já está em uso por outro usuário
    if (data.email && data.email !== existingProfessor.email) {
      const emailInUse = await prisma.usuario.findUnique({
        where: { email: data.email }
      })

      if (emailInUse) {
        return NextResponse.json(
          { error: 'Email já está em uso' },
          { status: 400 }
        )
      }
    }

    const professor = await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        materia: true,
        avatar: true,
        ativo: true,
        updatedAt: true
      }
    })

    return NextResponse.json(professor)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  const params = await context.params
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Verificar se professor existe
    const existingProfessor = await prisma.usuario.findUnique({
      where: { 
        id,
        role: 'PROFESSOR'
      },
      include: {
        _count: {
          select: { aulasMinistradas: true }
        }
      }
    })

    if (!existingProfessor) {
      return NextResponse.json(
        { error: 'Professor não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se professor tem aulas associadas
    if (existingProfessor._count.aulasMinistradas > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar professor com aulas associadas. Desative o professor ao invés de deletar.' },
        { status: 400 }
      )
    }

    await prisma.usuario.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Professor deletado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar professor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
