import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros disponíveis
    const usuarioId = searchParams.get('usuarioId')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const dias = parseInt(searchParams.get('dias') || '30') // Padrão 30 dias
    
    // Construir filtro dinâmico
    const where: any = {}
    
    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId)
    }
    
    // Definir período
    if (dataInicio || dataFim) {
      where.data = {}
      
      if (dataInicio) {
        where.data.gte = new Date(dataInicio)
      }
      
      if (dataFim) {
        where.data.lte = new Date(dataFim)
      }
    } else {
      // Se não fornecido, usar últimos N dias
      const hoje = new Date()
      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - dias)
      
      where.data = {
        gte: dataLimite,
        lte: hoje
      }
    }

    // Buscar todos os registros de humor com filtro
    const registros = await prisma.humorRegistro.findMany({
      where,
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
            role: true
          }
        }
      },
      orderBy: { data: 'desc' }
    })

    const totalRegistros = registros.length

    // Distribuição de humor
    const distribuicaoHumor = {
      MUITO_TRISTE: registros.filter(r => r.humor === 'MUITO_TRISTE').length,
      TRISTE: registros.filter(r => r.humor === 'TRISTE').length,
      NEUTRO: registros.filter(r => r.humor === 'NEUTRO').length,
      FELIZ: registros.filter(r => r.humor === 'FELIZ').length,
      MUITO_FELIZ: registros.filter(r => r.humor === 'MUITO_FELIZ').length
    }

    // Percentual de humor
    const percentualHumor = {
      MUITO_TRISTE: totalRegistros > 0 ? (distribuicaoHumor.MUITO_TRISTE / totalRegistros) * 100 : 0,
      TRISTE: totalRegistros > 0 ? (distribuicaoHumor.TRISTE / totalRegistros) * 100 : 0,
      NEUTRO: totalRegistros > 0 ? (distribuicaoHumor.NEUTRO / totalRegistros) * 100 : 0,
      FELIZ: totalRegistros > 0 ? (distribuicaoHumor.FELIZ / totalRegistros) * 100 : 0,
      MUITO_FELIZ: totalRegistros > 0 ? (distribuicaoHumor.MUITO_FELIZ / totalRegistros) * 100 : 0
    }

    // Humor médio (conversão para escala numérica)
    const humorParaNumero: Record<string, number> = {
      MUITO_TRISTE: 1,
      TRISTE: 2,
      NEUTRO: 3,
      FELIZ: 4,
      MUITO_FELIZ: 5
    }

    const mediaHumor = totalRegistros > 0
      ? registros.reduce((sum, r) => sum + humorParaNumero[r.humor], 0) / totalRegistros
      : 0

    // Tendência (comparar primeira metade com segunda metade do período)
    const metade = Math.floor(registros.length / 2)
    const primeiraMetade = registros.slice(metade)
    const segundaMetade = registros.slice(0, metade)

    const mediaPrimeiraMetade = primeiraMetade.length > 0
      ? primeiraMetade.reduce((sum, r) => sum + humorParaNumero[r.humor], 0) / primeiraMetade.length
      : 0

    const mediaSegundaMetade = segundaMetade.length > 0
      ? segundaMetade.reduce((sum, r) => sum + humorParaNumero[r.humor], 0) / segundaMetade.length
      : 0

    const tendencia = mediaSegundaMetade - mediaPrimeiraMetade
    const tendenciaTipo = tendencia > 0.3 ? 'MELHORANDO' : tendencia < -0.3 ? 'PIORANDO' : 'ESTAVEL'

    // Série temporal (dia a dia)
    const serieTemporal: any[] = []
    const registrosPorData: Record<string, any[]> = {}

    registros.forEach(r => {
      const dataStr = r.data.toISOString().split('T')[0]
      if (!registrosPorData[dataStr]) {
        registrosPorData[dataStr] = []
      }
      registrosPorData[dataStr].push(r)
    })

    Object.keys(registrosPorData).sort().forEach(data => {
      const regs = registrosPorData[data]
      const mediaHumorDia = regs.reduce((sum, r) => sum + humorParaNumero[r.humor], 0) / regs.length

      serieTemporal.push({
        data,
        totalRegistros: regs.length,
        mediaHumor: Math.round(mediaHumorDia * 100) / 100,
        distribuicao: {
          MUITO_TRISTE: regs.filter(r => r.humor === 'MUITO_TRISTE').length,
          TRISTE: regs.filter(r => r.humor === 'TRISTE').length,
          NEUTRO: regs.filter(r => r.humor === 'NEUTRO').length,
          FELIZ: regs.filter(r => r.humor === 'FELIZ').length,
          MUITO_FELIZ: regs.filter(r => r.humor === 'MUITO_FELIZ').length
        }
      })
    })

    // Detecção de alertas
    const alertas: any[] = []

    // Alerta: Humor muito baixo recente
    const ultimoRegistro = registros[0]
    if (ultimoRegistro && (ultimoRegistro.humor === 'MUITO_TRISTE' || ultimoRegistro.humor === 'TRISTE')) {
      // Contar dias consecutivos de humor baixo
      let diasConsecutivos = 0
      for (const reg of registros) {
        if (reg.humor === 'MUITO_TRISTE' || reg.humor === 'TRISTE') {
          diasConsecutivos++
        } else {
          break
        }
      }

      if (diasConsecutivos >= 3) {
        alertas.push({
          tipo: 'HUMOR_BAIXO_CONSECUTIVO',
          gravidade: diasConsecutivos >= 5 ? 'ALTA' : 'MEDIA',
          mensagem: `${diasConsecutivos} dias consecutivos de humor baixo detectados`,
          diasConsecutivos,
          ultimoRegistro: {
            data: ultimoRegistro.data,
            humor: ultimoRegistro.humor
          }
        })
      }
    }

    // Alerta: Tendência de piora
    if (tendenciaTipo === 'PIORANDO') {
      alertas.push({
        tipo: 'TENDENCIA_NEGATIVA',
        gravidade: 'MEDIA',
        mensagem: 'Tendência de piora no humor detectada no período',
        variacaoMedia: Math.round(tendencia * 100) / 100
      })
    }

    // Alerta: Baixa frequência de registros
    const diasNoPeriodo = dias
    const taxaRegistro = (totalRegistros / diasNoPeriodo) * 100
    if (taxaRegistro < 50 && totalRegistros > 0) {
      alertas.push({
        tipo: 'BAIXA_FREQUENCIA',
        gravidade: 'BAIXA',
        mensagem: 'Baixa frequência de registros de humor',
        taxaRegistro: Math.round(taxaRegistro * 100) / 100,
        diasComRegistro: totalRegistros,
        diasNoPeriodo
      })
    }

    // Estatísticas por dia da semana
    const estatisticasPorDiaSemana: Record<string, any> = {
      'Domingo': { total: 0, soma: 0 },
      'Segunda': { total: 0, soma: 0 },
      'Terça': { total: 0, soma: 0 },
      'Quarta': { total: 0, soma: 0 },
      'Quinta': { total: 0, soma: 0 },
      'Sexta': { total: 0, soma: 0 },
      'Sábado': { total: 0, soma: 0 }
    }

    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

    registros.forEach(r => {
      const diaSemana = diasSemana[r.data.getDay()]
      estatisticasPorDiaSemana[diaSemana].total++
      estatisticasPorDiaSemana[diaSemana].soma += humorParaNumero[r.humor]
    })

    const mediaPorDiaSemana = Object.keys(estatisticasPorDiaSemana).map(dia => ({
      dia,
      total: estatisticasPorDiaSemana[dia].total,
      mediaHumor: estatisticasPorDiaSemana[dia].total > 0
        ? Math.round((estatisticasPorDiaSemana[dia].soma / estatisticasPorDiaSemana[dia].total) * 100) / 100
        : 0
    }))

    return NextResponse.json({
      periodo: {
        dataInicio: where.data?.gte || null,
        dataFim: where.data?.lte || null,
        dias: diasNoPeriodo
      },
      resumo: {
        totalRegistros,
        mediaHumor: Math.round(mediaHumor * 100) / 100,
        tendencia: tendenciaTipo,
        variacaoTendencia: Math.round(tendencia * 100) / 100
      },
      distribuicaoHumor,
      percentualHumor: {
        MUITO_TRISTE: Math.round(percentualHumor.MUITO_TRISTE * 100) / 100,
        TRISTE: Math.round(percentualHumor.TRISTE * 100) / 100,
        NEUTRO: Math.round(percentualHumor.NEUTRO * 100) / 100,
        FELIZ: Math.round(percentualHumor.FELIZ * 100) / 100,
        MUITO_FELIZ: Math.round(percentualHumor.MUITO_FELIZ * 100) / 100
      },
      serieTemporal,
      mediaPorDiaSemana,
      alertas
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas de humor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
