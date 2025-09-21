import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const StatusAula = z.enum(['AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'])

const updateAulaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').optional(),
  descricao: z.string().optional(),
  materia: z.string().min(1, 'Matéria é obrigatória').optional(),
  dataHora: z.string().datetime('Data e hora inválidas').optional(),
  duracao: z.number().min(15, 'Duração mínima de 15 minutos').max(480, 'Duração máxima de 8 horas').optional(),
  professorId: z.number().int().positive('Professor é obrigatório').optional(),
  sala: z.string().optional(),
  status: StatusAula.optional()
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

    const aula = await prisma.aula.findUnique({
      where: { id },
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
        updatedAt: true,
        professor: {
          select: {
            id: true,
            nome: true,
            email: true,
            materia: true,
            avatar: true
          }
        },
        avaliacoes: {
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
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        aulasFavoritas: {
          select: {
            usuario: {
              select: {
                id: true,
                nome: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            avaliacoes: true,
            aulasFavoritas: true
          }
        }
      }
    })

    if (!aula) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(aula)
  } catch (error) {
    console.error('Erro ao buscar aula:', error)
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
    const data = updateAulaSchema.parse(body)

    // Verificar se aula existe
    const existingAula = await prisma.aula.findUnique({
      where: { id }
    })

    if (!existingAula) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    // Se está alterando professor, verificar se existe e está ativo
    if (data.professorId && data.professorId !== existingAula.professorId) {
      const professor = await prisma.professor.findUnique({
        where: { id: data.professorId }
      })

      if (!professor) {
        return NextResponse.json(
          { error: 'Professor não encontrado' },
          { status: 400 }
        )
      }

      if (!professor.ativo) {
        return NextResponse.json(
          { error: 'Professor não está ativo' },
          { status: 400 }
        )
      }
    }

    // Se está alterando data/hora ou duração, verificar conflitos
    if (data.dataHora || data.duracao) {
      const professorId = data.professorId || existingAula.professorId
      const dataHora = data.dataHora ? new Date(data.dataHora) : existingAula.dataHora
      const duracao = data.duracao || existingAula.duracao
      const dataFim = new Date(dataHora.getTime() + duracao * 60000)

      const conflito = await prisma.aula.findFirst({
        where: {
          id: { not: id }, // Excluir a própria aula
          professorId,
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
    }

    const updateData: any = { ...data }
    if (data.dataHora) {
      updateData.dataHora = new Date(data.dataHora)
    }

    const aula = await prisma.aula.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        titulo: true,
        descricao: true,
        materia: true,
        dataHora: true,
        duracao: true,
        sala: true,
        status: true,
        updatedAt: true,
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

    return NextResponse.json(aula)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar aula:', error)
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

    // Verificar se aula existe
    const existingAula = await prisma.aula.findUnique({
      where: { id },
      include: {
        _count: {
          select: { 
            avaliacoes: true,
            aulasFavoritas: true 
          }
        }
      }
    })

    if (!existingAula) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se aula tem avaliações
    if (existingAula._count.avaliacoes > 0 || existingAula._count.aulasFavoritas > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar aula com avaliações ou favoritada por usuários. Cancele a aula ao invés de deletar.' },
        { status: 400 }
      )
    }

    await prisma.aula.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Aula deletada com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar aula:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
