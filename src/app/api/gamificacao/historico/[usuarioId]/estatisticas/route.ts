/**
 * API Route: GET /api/gamificacao/historico/[usuarioId]/estatisticas
 * Busca estatísticas de XP do usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const usuarioId = parseInt(params.usuarioId)

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

    // Calcula datas
    const hoje = new Date()
    const inicioHoje = new Date(hoje)
    inicioHoje.setHours(0, 0, 0, 0)
    
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - hoje.getDay())
    inicioSemana.setHours(0, 0, 0, 0)
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

    // Busca estatísticas
    const [xpHoje, xpSemana, xpMes, porAcao, ultimasAtividades] = await Promise.all([
      // XP hoje
      prisma.historicoXP.aggregate({
        where: {
          perfilId: perfil.id,
          createdAt: { gte: inicioHoje },
        },
        _sum: { xpGanho: true },
        _count: true,
      }),
      // XP esta semana
      prisma.historicoXP.aggregate({
        where: {
          perfilId: perfil.id,
          createdAt: { gte: inicioSemana },
        },
        _sum: { xpGanho: true },
        _count: true,
      }),
      // XP este mês
      prisma.historicoXP.aggregate({
        where: {
          perfilId: perfil.id,
          createdAt: { gte: inicioMes },
        },
        _sum: { xpGanho: true },
        _count: true,
      }),
      // XP por tipo de ação
      prisma.historicoXP.groupBy({
        by: ['acao'],
        where: { perfilId: perfil.id },
        _sum: { xpGanho: true },
        _count: true,
        orderBy: { _sum: { xpGanho: 'desc' } },
      }),
      // Últimas 7 atividades
      prisma.historicoXP.findMany({
        where: { perfilId: perfil.id },
        select: {
          createdAt: true,
          xpGanho: true,
          acao: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 7,
      }),
    ])

    return NextResponse.json({
      hoje: {
        xpGanho: xpHoje._sum.xpGanho || 0,
        acoes: xpHoje._count,
      },
      semana: {
        xpGanho: xpSemana._sum.xpGanho || 0,
        acoes: xpSemana._count,
      },
      mes: {
        xpGanho: xpMes._sum.xpGanho || 0,
        acoes: xpMes._count,
      },
      porAcao: porAcao.map((item: any) => ({
        acao: item.acao,
        xpTotal: item._sum.xpGanho || 0,
        quantidade: item._count,
      })),
      ultimasAtividades,
    }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
