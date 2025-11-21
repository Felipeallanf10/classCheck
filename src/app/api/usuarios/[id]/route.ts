import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic'

const updateUserSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  email: z.string().email('Email inválido').optional(),
  avatar: z.string().url('URL do avatar inválida').nullable().optional(),
  role: z.enum(['ALUNO', 'PROFESSOR', 'ADMIN']).optional(),
  ativo: z.boolean().optional()
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        avatar: true,
        role: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
        avaliacoes: {
          select: {
            id: true,
            humor: true,
            nota: true,
            feedback: true,
            createdAt: true,
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
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Últimas 10 avaliações
        },
        humorRegistros: {
          select: {
            id: true,
            humor: true,
            data: true,
            observacao: true,
            createdAt: true
          },
          orderBy: { data: 'desc' },
          take: 30 // Últimos 30 dias
        },
        aulasFavoritas: {
          select: {
            id: true,
            createdAt: true,
            aula: {
              select: {
                id: true,
                titulo: true,
                materia: true,
                dataHora: true,
                professor: {
                  select: {
                    id: true,
                    nome: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            avaliacoes: true,
            humorRegistros: true,
            aulasFavoritas: true
          }
        }
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = updateUserSchema.parse(body)

    // Verificar se usuário existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Se está alterando email, verificar se já existe outro usuário com esse email
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.usuario.findUnique({
        where: { email: data.email }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email já está em uso por outro usuário' },
          { status: 409 }
        )
      }
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        avatar: true,
        role: true,
        ativo: true,
        updatedAt: true
      }
    })

    return NextResponse.json(usuario)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Verificar se usuário existe
    const existingUser = await prisma.usuario.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            avaliacoes: true,
            humorRegistros: true,
            aulasFavoritas: true
          }
        }
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Soft delete: apenas desativa o usuário ao invés de deletar
    // Isso mantém a integridade dos dados históricos
    if (existingUser._count.avaliacoes > 0 || existingUser._count.humorRegistros > 0) {
      const usuario = await prisma.usuario.update({
        where: { id },
        data: { ativo: false },
        select: {
          id: true,
          nome: true,
          email: true,
          ativo: true
        }
      })

      return NextResponse.json({
        message: 'Usuário desativado com sucesso (soft delete)',
        usuario
      })
    }

    // Se não tem dados históricos, pode deletar permanentemente
    await prisma.usuario.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Usuário deletado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
