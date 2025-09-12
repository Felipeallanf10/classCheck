import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface AvaliacaoSocioemocional {
  id: string
  usuarioId: number
  estadoEmocional: string
  valencia: number
  ativacao: number
  confianca: number
  observacoes: string | null
  respostas: string | null
  dataAvaliacao: Date
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuarioId')
    const periodo = searchParams.get('periodo') || '30' // dias

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() - parseInt(periodo))

    // TODO: Buscar avaliações no banco quando Prisma estiver configurado
    // const avaliacoes = await prisma.avaliacaoSocioemocional.findMany({...})

    // Por enquanto, usar dados simulados para análise
    const avaliacoesSimuladas: AvaliacaoSocioemocional[] = [
      {
        id: '1',
        usuarioId: parseInt(usuarioId),
        estadoEmocional: 'Focado',
        valencia: 0.3,
        ativacao: 0.6,
        confianca: 0.85,
        observacoes: 'Concentração durante aula',
        respostas: '{}',
        dataAvaliacao: new Date()
      },
      {
        id: '2',
        usuarioId: parseInt(usuarioId),
        estadoEmocional: 'Feliz',
        valencia: 0.8,
        ativacao: 0.4,
        confianca: 0.92,
        observacoes: 'Atividade em grupo bem-sucedida',
        respostas: '{}',
        dataAvaliacao: new Date(Date.now() - 86400000)
      },
      {
        id: '3',
        usuarioId: parseInt(usuarioId),
        estadoEmocional: 'Ansioso',
        valencia: -0.4,
        ativacao: 0.7,
        confianca: 0.78,
        observacoes: 'Apresentação oral',
        respostas: '{}',
        dataAvaliacao: new Date(Date.now() - 172800000)
      }
    ]

    const avaliacoes = avaliacoesSimuladas

    if (avaliacoes.length === 0) {
      return NextResponse.json({
        estadoDominante: null,
        tendencia: 'Insuficiente',
        pontuacaoGeral: 0,
        distribuicaoEstados: {},
        evolucaoTemporal: [],
        recomendacoes: ['Realize mais avaliações para obter insights personalizados']
      })
    }

    // Calcular estado emocional dominante
    const estadosContagem = avaliacoes.reduce((acc: Record<string, number>, avaliacao: AvaliacaoSocioemocional) => {
      acc[avaliacao.estadoEmocional] = (acc[avaliacao.estadoEmocional] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const estadoDominante = Object.entries(estadosContagem)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0][0]

    // Calcular tendência (últimas 5 vs primeiras 5 avaliações)
    const metadeIndex = Math.floor(avaliacoes.length / 2)
    const primeiraMetade = avaliacoes.slice(0, metadeIndex)
    const segundaMetade = avaliacoes.slice(metadeIndex)

    const mediaValenciaPrimeira = primeiraMetade.reduce((sum: number, a: AvaliacaoSocioemocional) => sum + a.valencia, 0) / primeiraMetade.length
    const mediaValenciaSegunda = segundaMetade.reduce((sum: number, a: AvaliacaoSocioemocional) => sum + a.valencia, 0) / segundaMetade.length

    let tendencia = 'Estável'
    if (mediaValenciaSegunda > mediaValenciaPrimeira + 0.2) {
      tendencia = 'Melhorando'
    } else if (mediaValenciaSegunda < mediaValenciaPrimeira - 0.2) {
      tendencia = 'Declinando'
    }

    // Calcular pontuação geral (média ponderada de valência, ativação e confiança)
    const pontuacaoGeral = avaliacoes.reduce((sum: number, a: AvaliacaoSocioemocional) => {
      const pontuacao = ((a.valencia + 2) / 4) * 0.4 + 
                       ((a.ativacao + 2) / 4) * 0.3 + 
                       a.confianca * 0.3
      return sum + pontuacao
    }, 0) / avaliacoes.length

    // Preparar evolução temporal
    const evolucaoTemporal = avaliacoes.map((a: AvaliacaoSocioemocional) => ({
      data: a.dataAvaliacao.toISOString().split('T')[0],
      estado: a.estadoEmocional,
      valencia: a.valencia,
      ativacao: a.ativacao,
      confianca: a.confianca
    }))

    // Gerar recomendações baseadas nos padrões
    const recomendacoes = []
    
    if (estadosContagem['Ansioso'] && estadosContagem['Ansioso'] > avaliacoes.length * 0.3) {
      recomendacoes.push('Pratique técnicas de respiração para reduzir ansiedade')
    }
    
    if (estadosContagem['Cansado'] && estadosContagem['Cansado'] > avaliacoes.length * 0.3) {
      recomendacoes.push('Priorize o descanso e estabeleça uma rotina de sono regular')
    }
    
    if (pontuacaoGeral > 0.7) {
      recomendacoes.push('Continue mantendo as práticas que têm promovido seu bem-estar')
    }
    
    if (recomendacoes.length === 0) {
      recomendacoes.push('Mantenha o automonitoramento regular para identificar padrões')
    }

    return NextResponse.json({
      estadoDominante,
      tendencia,
      pontuacaoGeral: Math.round(pontuacaoGeral * 10 * 100) / 100,
      distribuicaoEstados: estadosContagem,
      evolucaoTemporal,
      recomendacoes,
      totalAvaliacoes: avaliacoes.length
    })

  } catch (error) {
    console.error('Erro ao gerar análise:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
