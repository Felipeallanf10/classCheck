/**
 * API Route: GET /api/gamificacao/historico/[usuarioId]
 * Busca o histórico de XP de um usuário com paginação e filtros
 */

import { NextRequest, NextResponse } from 'next/server'
import { buscarHistoricoXP } from '@/lib/gamificacao/xp-service'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ usuarioId: string }> }
) {
  try {
    const { usuarioId: usuarioIdStr } = await params
    const usuarioId = parseInt(usuarioIdStr)
    const { searchParams } = new URL(request.url)
    
    const limite = parseInt(searchParams.get('limite') || '20')
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const acao = searchParams.get('acao')

    if (isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'usuarioId inválido' },
        { status: 400 }
      )
    }

    // Busca perfil
    const perfil = await prisma.perfilGamificacao.findUnique({
      where: { usuarioId },
      select: { id: true },
    })

    if (!perfil) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    // Busca histórico com filtros
    const skip = (pagina - 1) * limite
    const where: any = { perfilId: perfil.id }
    
    if (acao) {
      where.acao = acao
    }

    const [historico, total] = await Promise.all([
      prisma.historicoXP.findMany({
        where,
        include: {
          aula: {
            select: {
              titulo: true,
              materia: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limite,
        skip,
      }),
      prisma.historicoXP.count({ where }),
    ])

    return NextResponse.json({
      historico,
      paginacao: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}
