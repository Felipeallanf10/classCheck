import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros disponíveis
    const usuarioId = searchParams.get('usuarioId')
    const professorId = searchParams.get('professorId')
    const materia = searchParams.get('materia')
    const aulaId = searchParams.get('aulaId')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    
    // Construir filtro dinâmico
    const where: any = {}
    
    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId)
    }
    
    if (aulaId) {
      where.aulaId = parseInt(aulaId)
    }
    
    // Filtros por aula relacionada
    if (professorId || materia || dataInicio || dataFim) {
      where.aula = {}
      
      if (professorId) {
        where.aula.professorId = parseInt(professorId)
      }
      
      if (materia) {
        where.aula.materia = materia
      }
      
      if (dataInicio || dataFim) {
        where.aula.dataHora = {}
        
        if (dataInicio) {
          where.aula.dataHora.gte = new Date(dataInicio)
        }
        
        if (dataFim) {
          where.aula.dataHora.lte = new Date(dataFim)
        }
      }
    }

    // Buscar todas as avaliações com filtro
    const avaliacoes = await prisma.avaliacao.findMany({
      where,
      select: {
        id: true,
        humor: true,
        nota: true,
        createdAt: true,
        aula: {
          select: {
            id: true,
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

    // Total de avaliações
    const totalAvaliacoes = avaliacoes.length

    // Média de notas (somente avaliações com nota)
    const avaliacoesComNota = avaliacoes.filter(a => a.nota !== null)
    const mediaNotas = avaliacoesComNota.length > 0
      ? avaliacoesComNota.reduce((sum, a) => sum + (a.nota || 0), 0) / avaliacoesComNota.length
      : 0

    // Distribuição de humor
    const distribuicaoHumor = {
      MUITO_TRISTE: avaliacoes.filter(a => a.humor === 'MUITO_TRISTE').length,
      TRISTE: avaliacoes.filter(a => a.humor === 'TRISTE').length,
      NEUTRO: avaliacoes.filter(a => a.humor === 'NEUTRO').length,
      FELIZ: avaliacoes.filter(a => a.humor === 'FELIZ').length,
      MUITO_FELIZ: avaliacoes.filter(a => a.humor === 'MUITO_FELIZ').length
    }

    // Percentual de humor
    const percentualHumor = {
      MUITO_TRISTE: totalAvaliacoes > 0 ? (distribuicaoHumor.MUITO_TRISTE / totalAvaliacoes) * 100 : 0,
      TRISTE: totalAvaliacoes > 0 ? (distribuicaoHumor.TRISTE / totalAvaliacoes) * 100 : 0,
      NEUTRO: totalAvaliacoes > 0 ? (distribuicaoHumor.NEUTRO / totalAvaliacoes) * 100 : 0,
      FELIZ: totalAvaliacoes > 0 ? (distribuicaoHumor.FELIZ / totalAvaliacoes) * 100 : 0,
      MUITO_FELIZ: totalAvaliacoes > 0 ? (distribuicaoHumor.MUITO_FELIZ / totalAvaliacoes) * 100 : 0
    }

    // Humor médio (conversão para escala numérica)
    const humorParaNumero: Record<string, number> = {
      MUITO_TRISTE: 1,
      TRISTE: 2,
      NEUTRO: 3,
      FELIZ: 4,
      MUITO_FELIZ: 5
    }

    const mediaHumor = totalAvaliacoes > 0
      ? avaliacoes.reduce((sum, a) => sum + humorParaNumero[a.humor], 0) / totalAvaliacoes
      : 0

    // Distribuição de notas
    const distribuicaoNotas = {
      nota1: avaliacoesComNota.filter(a => a.nota === 1).length,
      nota2: avaliacoesComNota.filter(a => a.nota === 2).length,
      nota3: avaliacoesComNota.filter(a => a.nota === 3).length,
      nota4: avaliacoesComNota.filter(a => a.nota === 4).length,
      nota5: avaliacoesComNota.filter(a => a.nota === 5).length
    }

    // Estatísticas por matéria
    const materias = [...new Set(avaliacoes.map(a => a.aula.materia))]
    const estatisticasPorMateria = materias.map(materia => {
      const avaliacoesMateria = avaliacoes.filter(a => a.aula.materia === materia)
      const avaliacoesComNotaMateria = avaliacoesMateria.filter(a => a.nota !== null)
      
      return {
        materia,
        total: avaliacoesMateria.length,
        mediaNotas: avaliacoesComNotaMateria.length > 0
          ? avaliacoesComNotaMateria.reduce((sum, a) => sum + (a.nota || 0), 0) / avaliacoesComNotaMateria.length
          : 0,
        mediaHumor: avaliacoesMateria.length > 0
          ? avaliacoesMateria.reduce((sum, a) => sum + humorParaNumero[a.humor], 0) / avaliacoesMateria.length
          : 0
      }
    })

    // Estatísticas por professor (se não filtrado por professor específico)
    let estatisticasPorProfessor: any[] = []
    
    if (!professorId) {
      const professores = [...new Set(avaliacoes.map(a => a.aula.professor.id))]
      estatisticasPorProfessor = professores.map(profId => {
        const avaliacoesProfessor = avaliacoes.filter(a => a.aula.professor.id === profId)
        const avaliacoesComNotaProfessor = avaliacoesProfessor.filter(a => a.nota !== null)
        const professor = avaliacoes.find(a => a.aula.professor.id === profId)?.aula.professor
        
        return {
          professor: {
            id: profId,
            nome: professor?.nome,
            materia: professor?.materia
          },
          total: avaliacoesProfessor.length,
          mediaNotas: avaliacoesComNotaProfessor.length > 0
            ? avaliacoesComNotaProfessor.reduce((sum, a) => sum + (a.nota || 0), 0) / avaliacoesComNotaProfessor.length
            : 0,
          mediaHumor: avaliacoesProfessor.length > 0
            ? avaliacoesProfessor.reduce((sum, a) => sum + humorParaNumero[a.humor], 0) / avaliacoesProfessor.length
            : 0
        }
      }).sort((a, b) => b.mediaNotas - a.mediaNotas)
    }

    // Tendência temporal (últimos 30 dias)
    const hoje = new Date()
    const trintaDiasAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const tendenciaTemporal = []
    for (let i = 0; i < 30; i++) {
      const data = new Date(trintaDiasAtras.getTime() + i * 24 * 60 * 60 * 1000)
      const dataInicioDia = new Date(data.setHours(0, 0, 0, 0))
      const dataFimDia = new Date(data.setHours(23, 59, 59, 999))
      
      const avaliacoesDia = avaliacoes.filter(a => {
        const createdAt = new Date(a.createdAt)
        return createdAt >= dataInicioDia && createdAt <= dataFimDia
      })
      
      const avaliacoesComNotaDia = avaliacoesDia.filter(a => a.nota !== null)
      
      tendenciaTemporal.push({
        data: dataInicioDia.toISOString().split('T')[0],
        total: avaliacoesDia.length,
        mediaNotas: avaliacoesComNotaDia.length > 0
          ? avaliacoesComNotaDia.reduce((sum, a) => sum + (a.nota || 0), 0) / avaliacoesComNotaDia.length
          : 0,
        mediaHumor: avaliacoesDia.length > 0
          ? avaliacoesDia.reduce((sum, a) => sum + humorParaNumero[a.humor], 0) / avaliacoesDia.length
          : 0
      })
    }

    return NextResponse.json({
      resumo: {
        totalAvaliacoes,
        totalAvaliacoesComNota: avaliacoesComNota.length,
        mediaNotas: Math.round(mediaNotas * 100) / 100,
        mediaHumor: Math.round(mediaHumor * 100) / 100
      },
      distribuicaoHumor,
      percentualHumor: {
        MUITO_TRISTE: Math.round(percentualHumor.MUITO_TRISTE * 100) / 100,
        TRISTE: Math.round(percentualHumor.TRISTE * 100) / 100,
        NEUTRO: Math.round(percentualHumor.NEUTRO * 100) / 100,
        FELIZ: Math.round(percentualHumor.FELIZ * 100) / 100,
        MUITO_FELIZ: Math.round(percentualHumor.MUITO_FELIZ * 100) / 100
      },
      distribuicaoNotas,
      estatisticasPorMateria,
      estatisticasPorProfessor,
      tendenciaTemporal
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
