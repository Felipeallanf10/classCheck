import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createFavoritoSchema = z.object({
  usuarioId: z.number().int().positive('ID do usuário é obrigatório'),
  aulaId: z.number().int().positive('ID da aula é obrigatório')
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros disponíveis
    const usuarioId = searchParams.get('usuarioId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Construir filtro dinâmico
    const where: any = {}
    
    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId)
    }

    // Buscar total de registros para paginação
    const total = await prisma.aulaFavorita.count({ where })

    // Buscar favoritos com paginação
    const favoritos = await prisma.aulaFavorita.findMany({
      where,
      select: {
        id: true,
        createdAt: true,
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
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return NextResponse.json({
      data: favoritos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createFavoritoSchema.parse(body)

    // Verificar se usuário existe e está ativo
    const usuario = await prisma.usuario.findUnique({
      where: { id: data.usuarioId }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!usuario.ativo) {
      return NextResponse.json(
        { error: 'Usuário não está ativo' },
        { status: 400 }
      )
    }

    // Verificar se aula existe
    const aula = await prisma.aula.findUnique({
      where: { id: data.aulaId },
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            materia: true
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

    // Verificar se aula foi cancelada
    if (aula.status === 'CANCELADA') {
      return NextResponse.json(
        { error: 'Não é possível favoritar uma aula cancelada' },
        { status: 400 }
      )
    }

    // Verificar se já está favoritado (constraint unique)
    const favoritoExistente = await prisma.aulaFavorita.findUnique({
      where: {
        usuarioId_aulaId: {
          usuarioId: data.usuarioId,
          aulaId: data.aulaId
        }
      }
    })

    if (favoritoExistente) {
      return NextResponse.json(
        { error: 'Você já favoritou esta aula' },
        { status: 409 }
      )
    }

    // Criar favorito
    const favorito = await prisma.aulaFavorita.create({
      data,
      select: {
        id: true,
        createdAt: true,
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

    return NextResponse.json(favorito, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    // Erro de constraint unique do Prisma
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Você já favoritou esta aula' },
        { status: 409 }
      )
    }

    console.error('Erro ao criar favorito:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
