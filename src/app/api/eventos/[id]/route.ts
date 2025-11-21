import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const TipoEvento = z.enum(['AULA', 'PROVA', 'EVENTO', 'FERIADO', 'REUNIAO'])

const updateEventoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').max(255, 'Título deve ter no máximo 255 caracteres').optional(),
  descricao: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional().nullable(),
  dataInicio: z.string().datetime('Data de início inválida').optional(),
  dataFim: z.string().datetime('Data de fim inválida').optional().nullable(),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hexadecimal (#RRGGBB)').optional().nullable(),
  tipo: TipoEvento.optional(),
  aulaId: z.number().int().positive().optional().nullable()
})

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const evento = await prisma.evento.findUnique({
      where: { id },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        dataInicio: true,
        dataFim: true,
        cor: true,
        tipo: true,
        createdAt: true,
        updatedAt: true,
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

    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(evento)
  } catch (error) {
    console.error('Erro ao buscar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = updateEventoSchema.parse(body)

    // Verificar se evento existe
    const existingEvento = await prisma.evento.findUnique({
      where: { id }
    })

    if (!existingEvento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    // Se está alterando para tipo AULA e forneceu aulaId, verificar se aula existe
    if (data.tipo === 'AULA' && data.aulaId) {
      const aula = await prisma.aula.findUnique({
        where: { id: data.aulaId }
      })

      if (!aula) {
        return NextResponse.json(
          { error: 'Aula não encontrada' },
          { status: 404 }
        )
      }

      if (aula.status === 'CANCELADA') {
        return NextResponse.json(
          { error: 'Não é possível vincular evento a aula cancelada' },
          { status: 400 }
        )
      }
    }

    // Validar datas se ambas foram fornecidas
    if (data.dataInicio && data.dataFim) {
      const inicio = new Date(data.dataInicio)
      const fim = new Date(data.dataFim)
      
      if (fim <= inicio) {
        return NextResponse.json(
          { error: 'Data de fim deve ser posterior à data de início' },
          { status: 400 }
        )
      }
    }

    const updateData: any = { ...data }
    if (data.dataInicio) {
      updateData.dataInicio = new Date(data.dataInicio)
    }
    if (data.dataFim) {
      updateData.dataFim = new Date(data.dataFim)
    }

    const evento = await prisma.evento.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        titulo: true,
        descricao: true,
        dataInicio: true,
        dataFim: true,
        cor: true,
        tipo: true,
        updatedAt: true,
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

    return NextResponse.json(evento)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Verificar se evento existe
    const existingEvento = await prisma.evento.findUnique({
      where: { id }
    })

    if (!existingEvento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    // Deletar evento
    await prisma.evento.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Evento deletado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar evento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
