import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parâmetros obrigatórios: ano e mês
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear().toString())
    const mes = parseInt(searchParams.get('mes') || (new Date().getMonth() + 1).toString())
    
    if (isNaN(ano) || isNaN(mes) || mes < 1 || mes > 12) {
      return NextResponse.json(
        { error: 'Ano e mês inválidos. Use ano (YYYY) e mes (1-12)' },
        { status: 400 }
      )
    }

    // Calcular primeiro e último dia do mês
    const primeiroDia = new Date(ano, mes - 1, 1)
    const ultimoDia = new Date(ano, mes, 0, 23, 59, 59)

    // Buscar todos os eventos do mês
    const eventos = await prisma.evento.findMany({
      where: {
        dataInicio: {
          gte: primeiroDia,
          lte: ultimoDia
        }
      },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        dataInicio: true,
        dataFim: true,
        cor: true,
        tipo: true,
        aula: {
          select: {
            id: true,
            titulo: true,
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
            }
          }
        }
      },
      orderBy: { dataInicio: 'asc' }
    })

    // Buscar aulas do mês que ainda não têm evento vinculado
    const aulas = await prisma.aula.findMany({
      where: {
        dataHora: {
          gte: primeiroDia,
          lte: ultimoDia
        },
        status: {
          not: 'CANCELADA'
        }
      },
      select: {
        id: true,
        titulo: true,
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
        eventos: {
          select: {
            id: true
          }
        }
      }
    })

    // Criar eventos automáticos para aulas sem evento
    const eventosAulas = aulas
      .filter(aula => aula.eventos.length === 0) // Apenas aulas sem evento
      .map(aula => ({
        id: `aula-${aula.id}`, // ID temporário
        titulo: aula.titulo,
        descricao: `Aula de ${aula.materia} - ${aula.professor.nome}`,
        dataInicio: aula.dataHora,
        dataFim: new Date(aula.dataHora.getTime() + aula.duracao * 60000),
        cor: '#3B82F6', // Azul para aulas
        tipo: 'AULA' as const,
        aula: {
          id: aula.id,
          titulo: aula.titulo,
          materia: aula.materia,
          dataHora: aula.dataHora,
          duracao: aula.duracao,
          sala: aula.sala,
          status: aula.status,
          professor: aula.professor
        }
      }))

    // Combinar eventos reais com eventos de aulas
    const todosEventos = [
      ...eventos,
      ...eventosAulas
    ].sort((a, b) => a.dataInicio.getTime() - b.dataInicio.getTime())

    // Agrupar eventos por dia
    const eventosPorDia: Record<string, any[]> = {}
    
    todosEventos.forEach(evento => {
      const dia = evento.dataInicio.getDate()
      const chave = dia.toString().padStart(2, '0')
      
      if (!eventosPorDia[chave]) {
        eventosPorDia[chave] = []
      }
      
      eventosPorDia[chave].push(evento)
    })

    // Estatísticas do mês
    const estatisticas = {
      totalEventos: todosEventos.length,
      porTipo: {
        AULA: todosEventos.filter(e => e.tipo === 'AULA').length,
        PROVA: todosEventos.filter(e => e.tipo === 'PROVA').length,
        EVENTO: todosEventos.filter(e => e.tipo === 'EVENTO').length,
        FERIADO: todosEventos.filter(e => e.tipo === 'FERIADO').length,
        REUNIAO: todosEventos.filter(e => e.tipo === 'REUNIAO').length
      },
      diasComEventos: Object.keys(eventosPorDia).length
    }

    // Informações do mês
    const diasNoMes = ultimoDia.getDate()
    const primeiroDiaSemana = primeiroDia.getDay() // 0 = Domingo, 6 = Sábado
    const ultimoDiaSemana = ultimoDia.getDay()

    return NextResponse.json({
      periodo: {
        ano,
        mes,
        mesNome: primeiroDia.toLocaleDateString('pt-BR', { month: 'long' }),
        diasNoMes,
        primeiroDiaSemana,
        ultimoDiaSemana
      },
      eventos: todosEventos,
      eventosPorDia,
      estatisticas
    })
  } catch (error) {
    console.error('Erro ao buscar calendário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
