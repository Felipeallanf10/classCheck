import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const TipoHumor = z.enum(['MUITO_TRISTE', 'TRISTE', 'NEUTRO', 'FELIZ', 'MUITO_FELIZ'])

const updateAvaliacaoSchema = z.object({
  humor: TipoHumor.optional(),
  nota: z.number().int().min(1, 'Nota mínima é 1').max(5, 'Nota máxima é 5').optional().nullable(),
  feedback: z.string().min(10, 'Feedback deve ter no mínimo 10 caracteres').max(1000, 'Feedback deve ter no máximo 1000 caracteres').optional().nullable()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id },
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
            descricao: true,
            materia: true,
            dataHora: true,
            duracao: true,
            sala: true,
            status: true,
            professor: {
              select: {
                id: true,
                nome: true,
                email: true,
                materia: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!avaliacao) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(avaliacao)
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const data = updateAvaliacaoSchema.parse(body)

    // Verificar se avaliação existe
    const existingAvaliacao = await prisma.avaliacao.findUnique({
      where: { id },
      include: {
        aula: true
      }
    })

    if (!existingAvaliacao) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se a aula não foi cancelada
    if (existingAvaliacao.aula.status === 'CANCELADA') {
      return NextResponse.json(
        { error: 'Não é possível editar avaliação de aula cancelada' },
        { status: 400 }
      )
    }

    // Atualizar avaliação
    const avaliacao = await prisma.avaliacao.update({
      where: { id },
      data,
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

    return NextResponse.json(avaliacao)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Verificar se avaliação existe
    const existingAvaliacao = await prisma.avaliacao.findUnique({
      where: { id }
    })

    if (!existingAvaliacao) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Deletar avaliação
    await prisma.avaliacao.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Avaliação deletada com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
