import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const favorito = await prisma.aulaFavorita.findUnique({
      where: { id },
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
                email: true,
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
      }
    })

    if (!favorito) {
      return NextResponse.json(
        { error: 'Favorito não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(favorito)
  } catch (error) {
    console.error('Erro ao buscar favorito:', error)
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

    // Verificar se favorito existe
    const existingFavorito = await prisma.aulaFavorita.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true
          }
        },
        aula: {
          select: {
            id: true,
            titulo: true
          }
        }
      }
    })

    if (!existingFavorito) {
      return NextResponse.json(
        { error: 'Favorito não encontrado' },
        { status: 404 }
      )
    }

    // TODO: Verificar se o usuário logado é o dono do favorito
    // Isso será implementado após criar o middleware de autenticação
    // if (session.user.id !== existingFavorito.usuarioId) {
    //   return NextResponse.json(
    //     { error: 'Você não tem permissão para remover este favorito' },
    //     { status: 403 }
    //   )
    // }

    // Deletar favorito
    await prisma.aulaFavorita.delete({
      where: { id }
    })

    return NextResponse.json(
      { 
        message: 'Favorito removido com sucesso',
        favorito: {
          id: existingFavorito.id,
          usuario: existingFavorito.usuario,
          aula: existingFavorito.aula
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar favorito:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
