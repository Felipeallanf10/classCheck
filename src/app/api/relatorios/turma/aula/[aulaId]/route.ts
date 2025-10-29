import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient()

interface RouteParams {
  params: Promise<{ aulaId: string }>
}

export async function GET(request: NextRequest, context: RouteParams) {
  const params = await context.params
  try {
    const aulaId = parseInt(params.aulaId)
    
    if (isNaN(aulaId)) {
      return NextResponse.json(
        { error: 'ID de aula inválido' },
        { status: 400 }
      )
    }

    // Buscar informações da aula
    const aula = await prisma.aula.findUnique({
      where: { id: aulaId },
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

    // Buscar todas as avaliações socioemocionais desta aula
    const avaliacoes = await prisma.avaliacaoSocioemocional.findMany({
      where: {
        aulaId
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calcular estatísticas agregadas
    const totalAvaliacoes = avaliacoes.length
    
    if (totalAvaliacoes === 0) {
      return NextResponse.json({
        aula: {
          id: aula.id,
          titulo: aula.titulo,
          materia: aula.materia,
          dataHora: aula.dataHora.toISOString(),
          professor: aula.professor.nome
        },
        totalAvaliacoes: 0,
        avaliacoes: [],
        estatisticas: null
      })
    }

    const valenciaMedia = avaliacoes.reduce((sum, av) => sum + av.valencia, 0) / totalAvaliacoes
    const ativacaoMedia = avaliacoes.reduce((sum, av) => sum + av.ativacao, 0) / totalAvaliacoes
    const confiancaMedia = avaliacoes.reduce((sum, av) => sum + av.confianca, 0) / totalAvaliacoes

    // Contar por quadrante do circumplex
    const quadrantes = {
      altoPositivo: 0,    // Valencia > 0, Ativacao > 0
      baixoPositivo: 0,   // Valencia > 0, Ativacao < 0
      altoNegativo: 0,    // Valencia < 0, Ativacao > 0
      baixoNegativo: 0,   // Valencia < 0, Ativacao < 0
    }

    avaliacoes.forEach(av => {
      if (av.valencia > 0 && av.ativacao > 0) quadrantes.altoPositivo++
      else if (av.valencia > 0 && av.ativacao <= 0) quadrantes.baixoPositivo++
      else if (av.valencia <= 0 && av.ativacao > 0) quadrantes.altoNegativo++
      else quadrantes.baixoNegativo++
    })

    // Contar estados primários
    const estadosCount = avaliacoes.reduce((acc, av) => {
      acc[av.estadoPrimario] = (acc[av.estadoPrimario] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const estadoMaisFrequente = Object.entries(estadosCount)
      .sort(([,a], [,b]) => b - a)[0]

    // Identificar alunos que precisam de atenção
    // Critérios: valencia < -0.3 OU (valencia < 0 E ativacao < -0.3)
    const alunosAtencao = avaliacoes
      .filter(av => av.valencia < -0.3 || (av.valencia < 0 && av.ativacao < -0.3))
      .map(av => ({
        usuarioId: av.usuario.id,
        nome: av.usuario.nome,
        valencia: av.valencia,
        ativacao: av.ativacao,
        estadoPrimario: av.estadoPrimario,
        motivo: av.valencia < -0.3 
          ? 'Valência muito negativa' 
          : 'Baixa energia e valência negativa'
      }))

    // Formatar resposta
    const resposta = {
      aula: {
        id: aula.id,
        titulo: aula.titulo,
        materia: aula.materia,
        dataHora: aula.dataHora.toISOString(),
        duracao: aula.duracao,
        sala: aula.sala,
        status: aula.status,
        professor: aula.professor.nome
      },
      totalAvaliacoes,
      estatisticas: {
        valenciaMedia: Number(valenciaMedia.toFixed(2)),
        ativacaoMedia: Number(ativacaoMedia.toFixed(2)),
        confiancaMedia: Number(confiancaMedia.toFixed(2)),
        estadoMaisFrequente: estadoMaisFrequente ? {
          estado: estadoMaisFrequente[0],
          quantidade: estadoMaisFrequente[1],
          percentual: Math.round((estadoMaisFrequente[1] / totalAvaliacoes) * 100)
        } : null,
        distribuicaoQuadrantes: {
          altoPositivo: {
            count: quadrantes.altoPositivo,
            percentual: Math.round((quadrantes.altoPositivo / totalAvaliacoes) * 100)
          },
          baixoPositivo: {
            count: quadrantes.baixoPositivo,
            percentual: Math.round((quadrantes.baixoPositivo / totalAvaliacoes) * 100)
          },
          altoNegativo: {
            count: quadrantes.altoNegativo,
            percentual: Math.round((quadrantes.altoNegativo / totalAvaliacoes) * 100)
          },
          baixoNegativo: {
            count: quadrantes.baixoNegativo,
            percentual: Math.round((quadrantes.baixoNegativo / totalAvaliacoes) * 100)
          }
        },
        estadosCount
      },
      alunosAtencao,
      avaliacoes: avaliacoes.map(av => ({
        usuarioId: av.usuario.id,
        usuarioNome: av.usuario.nome,
        usuarioAvatar: av.usuario.avatar,
        valencia: av.valencia,
        ativacao: av.ativacao,
        estadoPrimario: av.estadoPrimario,
        confianca: av.confianca,
        createdAt: av.createdAt.toISOString()
      }))
    }

    return NextResponse.json(resposta)
  } catch (error) {
    console.error('Erro ao buscar relatório da turma:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
