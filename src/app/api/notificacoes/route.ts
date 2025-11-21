import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-helpers'

// GET - Buscar notificações do usuário
export async function GET(request: Request) {
  // Verificar autenticação
  const { authenticated, userId, error } = await requireAuth()
  if (!authenticated) return error!

  try {
    const { searchParams } = new URL(request.url)
    const lida = searchParams.get('lida')

    const where: any = {
      usuarioId: userId,
    }

    if (lida === 'true') {
      where.lida = true
    } else if (lida === 'false') {
      where.lida = false
    }

    const notificacoes = await prisma.notificacao.findMany({
      where,
      orderBy: {
        criadoEm: 'desc',
      },
      take: 50,
    })

    const naoLidas = await prisma.notificacao.count({
      where: {
        usuarioId: userId,
        lida: false,
      },
    })

    return NextResponse.json({
      notificacoes,
      naoLidas,
    })
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json(
      { erro: 'Erro ao buscar notificações' },
      { status: 500 }
    )
  }
}

// PATCH - Marcar notificação como lida
export async function PATCH(request: Request) {
  // Verificar autenticação
  const { authenticated, userId, error } = await requireAuth()
  if (!authenticated) return error!

  try {
    const body = await request.json()
    const { notificacaoId, marcarTodasComoLidas } = body

    if (marcarTodasComoLidas) {
      // Marcar todas como lidas
      await prisma.notificacao.updateMany({
        where: {
          usuarioId: userId,
          lida: false,
        },
        data: {
          lida: true,
          lidaEm: new Date(),
        },
      })

      return NextResponse.json({ mensagem: 'Todas as notificações foram marcadas como lidas' })
    }

    if (!notificacaoId) {
      return NextResponse.json(
        { erro: 'ID da notificação é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a notificação pertence ao usuário
    const notificacao = await prisma.notificacao.findFirst({
      where: {
        id: notificacaoId,
        usuarioId: userId,
      },
    })

    if (!notificacao) {
      return NextResponse.json(
        { erro: 'Notificação não encontrada' },
        { status: 404 }
      )
    }

    // Marcar como lida
    const notificacaoAtualizada = await prisma.notificacao.update({
      where: { id: notificacaoId },
      data: { 
        lida: true,
        lidaEm: new Date(),
      },
    })

    return NextResponse.json(notificacaoAtualizada)
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error)
    return NextResponse.json(
      { erro: 'Erro ao atualizar notificação' },
      { status: 500 }
    )
  }
}
