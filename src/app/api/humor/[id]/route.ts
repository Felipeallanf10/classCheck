import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const TipoHumor = z.enum(['MUITO_TRISTE', 'TRISTE', 'NEUTRO', 'FELIZ', 'MUITO_FELIZ'])

const updateHumorSchema = z.object({
  humor: TipoHumor.optional(),
  observacao: z.string().max(500, 'Observação deve ter no máximo 500 caracteres').optional().nullable()
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

    const registro = await prisma.humorRegistro.findUnique({
      where: { id },
      select: {
        id: true,
        humor: true,
        data: true,
        observacao: true,
        createdAt: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true,
            role: true
          }
        }
      }
    })

    if (!registro) {
      return NextResponse.json(
        { error: 'Registro de humor não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(registro)
  } catch (error) {
    console.error('Erro ao buscar registro de humor:', error)
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
    const data = updateHumorSchema.parse(body)

    // Verificar se registro existe
    const existingRegistro = await prisma.humorRegistro.findUnique({
      where: { id }
    })

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro de humor não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar registro
    const registro = await prisma.humorRegistro.update({
      where: { id },
      data,
      select: {
        id: true,
        humor: true,
        data: true,
        observacao: true,
        createdAt: true,
        usuario: {
          select: {
            id: true,
            nome: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(registro)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar registro de humor:', error)
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

    // Verificar se registro existe
    const existingRegistro = await prisma.humorRegistro.findUnique({
      where: { id }
    })

    if (!existingRegistro) {
      return NextResponse.json(
        { error: 'Registro de humor não encontrado' },
        { status: 404 }
      )
    }

    // Deletar registro
    await prisma.humorRegistro.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Registro de humor deletado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar registro de humor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
