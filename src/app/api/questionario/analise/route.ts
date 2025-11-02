import { NextRequest, NextResponse } from 'next/server'

import {
  buscarHistoricoTheta,
  calcularEstatisticasUsuario,
  type PeriodoAnalise,
  type ScoresPorCategoria,
  type Tendencia,
} from '@/lib/analytics/queries'
import { interpretarCategoria, type InterpretacaoClinica } from '@/lib/analytics/interpretacao-clinica'
import { CategoriaPergunta } from '@prisma/client'

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

function calcularPeriodo(searchParams: URLSearchParams): PeriodoAnalise {
  const fimParam = searchParams.get('fim')
  const inicioParam = searchParams.get('inicio')

  const fim = fimParam ? new Date(fimParam) : new Date()
  const inicio = inicioParam
    ? new Date(inicioParam)
    : new Date(fim.getTime() - 30 * 24 * 60 * 60 * 1000)

  return { inicio, fim }
}

function selecionarEstadoDominante(scores: ScoresPorCategoria[]) {
  if (!scores.length) return 'INDISPONIVEL'

  const maior = [...scores].sort((a, b) => b.media - a.media)[0]
  return maior?.categoria ?? 'INDISPONIVEL'
}

function sintetizarTendencia(tendencias: Tendencia[]) {
  if (!tendencias.length) return 'estavel'

  const ordenadas = [...tendencias].sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao))
  const principal = ordenadas[0]
  return `${principal.direcao}:${principal.categoria}`
}

function calcularPontuacaoGeral(scores: ScoresPorCategoria[]) {
  if (!scores.length) return 0
  const acumulado = scores.reduce((acc, item) => acc + item.media, 0)
  return Math.round((acumulado / scores.length) * 100)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioIdParam = searchParams.get('usuarioId')

    if (!usuarioIdParam) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const usuarioId = Number(usuarioIdParam)

    if (Number.isNaN(usuarioId)) {
      return NextResponse.json(
        { error: 'ID do usuário inválido' },
        { status: 400 }
      )
    }

    const periodo = calcularPeriodo(searchParams)

    const estatisticas = await calcularEstatisticasUsuario(usuarioId, periodo)

    if (!estatisticas.totalSessoes) {
      return NextResponse.json({
        resumo: {
          totalAvaliacoes: 0,
          estadoDominante: 'INDISPONIVEL',
          tendencia: 'estavel',
          pontuacaoGeral: 0,
          recomendacoes: ['Nenhum dado disponível para o período informado.']
        },
        detalhes: {
          periodo,
          scoresPorCategoria: [],
          tendencias: [],
          historicoTheta: [],
          thetaMedio: 0
        }
      })
    }

    const historicoTheta = await buscarHistoricoTheta(usuarioId, 30)

    const estadoDominante = selecionarEstadoDominante(estatisticas.scoresPorCategoria)
    const tendenciaSintetizada = sintetizarTendencia(estatisticas.tendencias)
    const pontuacaoGeral = calcularPontuacaoGeral(estatisticas.scoresPorCategoria)

    const interpretacoes: Array<{ categoria: CategoriaPergunta; interpretacao: InterpretacaoClinica }> = estatisticas.scoresPorCategoria.map((score) => ({
      categoria: score.categoria,
      interpretacao: interpretarCategoria(score.categoria, score.media)
    }))

    const recomendacoes = interpretacoes
      .filter((item) => item.interpretacao.necessitaAlerta)
      .flatMap((item) => item.interpretacao.recomendacoes)

    return NextResponse.json({
      resumo: {
        totalAvaliacoes: estatisticas.totalSessoes,
        estadoDominante,
        tendencia: tendenciaSintetizada,
        pontuacaoGeral,
        recomendacoes: recomendacoes.length
          ? Array.from(new Set(recomendacoes))
          : ['Monitorar progresso e registrar novas sessões socioemocionais.']
      },
      detalhes: {
        periodo,
        thetaMedio: estatisticas.thetaMedio,
        ultimaSessao: estatisticas.ultimaSessao,
        scoresPorCategoria: estatisticas.scoresPorCategoria,
        tendencias: estatisticas.tendencias,
        historicoTheta,
        interpretacoes,
      }
    })

  } catch (error) {
    console.error('Erro ao analisar dados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
