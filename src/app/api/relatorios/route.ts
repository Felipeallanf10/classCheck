import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/cache/redis-cache'

// Forçar dinâmico
export const dynamic = 'force-dynamic';

// Mapeamento de humor para valores numéricos
const humorParaNumero: Record<string, number> = {
  PESSIMO: 1,
  RUIM: 2,
  NEUTRO: 3,
  BOM: 4,
  OTIMO: 5
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filtros disponíveis
    const tipo = searchParams.get('tipo') // 'geral' | 'professor' | 'turma' | 'aluno'
    const professorId = searchParams.get('professorId')
    const usuarioId = searchParams.get('usuarioId')
    const materia = searchParams.get('materia')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    
    // Período padrão: últimos 30 dias
    const hoje = new Date()
    const trintaDiasAtras = new Date()
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)
    
    const periodoInicio = dataInicio ? new Date(dataInicio) : trintaDiasAtras
    const periodoFim = dataFim ? new Date(dataFim) : hoje

    // ========================================
    // RELATÓRIO GERAL (Dashboard Diretoria)
    // ========================================
    if (!tipo || tipo === 'geral') {
      // Chave do cache incluindo o período
      const cacheKey = `relatorios:geral:${periodoInicio.toISOString()}:${periodoFim.toISOString()}`;
      
      const dados = await getCached(
        cacheKey,
        async () => {
          // Total de usuários
          const totalUsuarios = await prisma.usuario.count({
            where: { ativo: true }
          })

      const totalUsuariosPorRole = await prisma.usuario.groupBy({
        by: ['role'],
        where: { ativo: true },
        _count: true
      })

      // Total de professores
      const totalProfessores = await prisma.usuario.count({
        where: { role: 'PROFESSOR', ativo: true }
      })

      // Total de aulas
      const totalAulas = await prisma.aula.count()
      const totalAulasPorStatus = await prisma.aula.groupBy({
        by: ['status'],
        _count: true
      })

      // Total de avaliações
      const totalAvaliacoes = await prisma.avaliacao.count({
        where: {
          createdAt: {
            gte: periodoInicio,
            lte: periodoFim
          }
        }
      })

      // Média geral de notas
      const avaliacoes = await prisma.avaliacao.findMany({
        where: {
          createdAt: {
            gte: periodoInicio,
            lte: periodoFim
          },
          nota: {
            not: null
          }
        },
        select: {
          nota: true,
          humor: true
        }
      })

      const mediaNotasGeral = avaliacoes.length > 0
        ? avaliacoes.reduce((sum, a) => sum + (a.nota || 0), 0) / avaliacoes.length
        : 0

      // Distribuição de humor geral
      const humorParaNumero: Record<string, number> = {
        MUITO_TRISTE: 1,
        TRISTE: 2,
        NEUTRO: 3,
        FELIZ: 4,
        MUITO_FELIZ: 5
      }

      const mediaHumorGeral = avaliacoes.length > 0
        ? avaliacoes.reduce((sum, a) => sum + humorParaNumero[a.humor], 0) / avaliacoes.length
        : 0

      // Top 5 professores (por média de notas)
      const avaliacoesPorProfessor = await prisma.avaliacao.findMany({
        where: {
          createdAt: {
            gte: periodoInicio,
            lte: periodoFim
          },
          nota: {
            not: null
          }
        },
        select: {
          nota: true,
          aula: {
            select: {
              professorId: true,
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
        }
      })

      const professoresMap: Record<number, any> = {}
      avaliacoesPorProfessor.forEach(av => {
        const profId = av.aula.professorId
        if (!professoresMap[profId]) {
          professoresMap[profId] = {
            professor: av.aula.professor,
            notas: [],
            totalAvaliacoes: 0
          }
        }
        professoresMap[profId].notas.push(av.nota || 0)
        professoresMap[profId].totalAvaliacoes++
      })

      const topProfessores = Object.values(professoresMap)
        .map((p: any) => ({
          professor: p.professor,
          mediaNotas: p.notas.reduce((sum: number, n: number) => sum + n, 0) / p.notas.length,
          totalAvaliacoes: p.totalAvaliacoes
        }))
        .sort((a, b) => b.mediaNotas - a.mediaNotas)
        .slice(0, 5)

      // Estatísticas por matéria
      const avaliacoesPorMateria = await prisma.avaliacao.findMany({
        where: {
          createdAt: {
            gte: periodoInicio,
            lte: periodoFim
          }
        },
        select: {
          nota: true,
          humor: true,
          aula: {
            select: {
              materia: true
            }
          }
        }
      })

      const materiasMap: Record<string, any> = {}
      avaliacoesPorMateria.forEach(av => {
        const mat = av.aula.materia
        if (!materiasMap[mat]) {
          materiasMap[mat] = {
            materia: mat,
            avaliacoes: 0,
            notas: [],
            humores: []
          }
        }
        materiasMap[mat].avaliacoes++
        if (av.nota) materiasMap[mat].notas.push(av.nota)
        materiasMap[mat].humores.push(humorParaNumero[av.humor])
      })

      const estatisticasPorMateria = Object.values(materiasMap).map((m: any) => ({
        materia: m.materia,
        totalAvaliacoes: m.avaliacoes,
        mediaNotas: m.notas.length > 0
          ? m.notas.reduce((sum: number, n: number) => sum + n, 0) / m.notas.length
          : 0,
        mediaHumor: m.humores.length > 0
          ? m.humores.reduce((sum: number, h: number) => sum + h, 0) / m.humores.length
          : 0
      }))

      // Registros de humor no período
      const totalHumorRegistros = await prisma.humorRegistro.count({
        where: {
          data: {
            gte: periodoInicio,
            lte: periodoFim
          }
        }
      })

          return {
            tipo: 'geral',
            periodo: {
              inicio: periodoInicio,
              fim: periodoFim
            },
            resumo: {
              totalUsuarios,
              usuariosPorRole: totalUsuariosPorRole,
              totalProfessores,
              totalAulas,
              aulasPorStatus: totalAulasPorStatus,
              totalAvaliacoes,
              totalHumorRegistros,
              mediaNotasGeral: Math.round(mediaNotasGeral * 100) / 100,
              mediaHumorGeral: Math.round(mediaHumorGeral * 100) / 100
            },
            topProfessores,
            estatisticasPorMateria
          };
        },
        600 // 10 minutos de cache para relatório geral
      );

      return NextResponse.json(dados);
    }

    // ========================================
    // RELATÓRIO POR PROFESSOR
    // ========================================
    if (tipo === 'professor' && professorId) {
      const profId = parseInt(professorId)

      // Verificar se professor existe
      const professor = await prisma.usuario.findUnique({
        where: { id: profId, role: 'PROFESSOR' }
      })

      if (!professor) {
        return NextResponse.json(
          { error: 'Professor não encontrado' },
          { status: 404 }
        )
      }

      // Chave do cache
      const cacheKey = `relatorios:professor:${profId}:${periodoInicio.toISOString()}:${periodoFim.toISOString()}`;
      
      const dados = await getCached(
        cacheKey,
        async () => {

      // Buscar todas as aulas do professor
      const aulas = await prisma.aula.findMany({
        where: {
          professorId: profId,
          dataHora: {
            gte: periodoInicio,
            lte: periodoFim
          }
        },
        select: {
          id: true,
          titulo: true,
          materia: true,
          dataHora: true,
          status: true,
          _count: {
            select: {
              avaliacoes: true
            }
          }
        }
      })

      // Buscar avaliações das aulas do professor
      const avaliacoesProfessor = await prisma.avaliacao.findMany({
        where: {
          aula: {
            professorId: profId
          },
          createdAt: {
            gte: periodoInicio,
            lte: periodoFim
          }
        },
        select: {
          id: true,
          nota: true,
          humor: true,
          feedback: true,
          createdAt: true,
          aula: {
            select: {
              id: true,
              titulo: true,
              materia: true,
              dataHora: true
            }
          },
          usuario: {
            select: {
              id: true,
              nome: true,
              avatar: true
            }
          }
        }
      })

      const totalAvaliacoes = avaliacoesProfessor.length
      const avaliacoesComNota = avaliacoesProfessor.filter(a => a.nota !== null)
      
      const mediaNotas = avaliacoesComNota.length > 0
        ? avaliacoesComNota.reduce((sum, a) => sum + (a.nota || 0), 0) / avaliacoesComNota.length
        : 0

      const mediaHumor = totalAvaliacoes > 0
        ? avaliacoesProfessor.reduce((sum, a) => sum + humorParaNumero[a.humor], 0) / totalAvaliacoes
        : 0

          return {
            tipo: 'professor',
            professor,
            periodo: {
              inicio: periodoInicio,
              fim: periodoFim
            },
            resumo: {
              totalAulas: aulas.length,
              totalAvaliacoes,
              mediaNotas: Math.round(mediaNotas * 100) / 100,
              mediaHumor: Math.round(mediaHumor * 100) / 100
            },
            aulas,
            avaliacoes: avaliacoesProfessor
          };
        },
        300 // 5 minutos de cache para relatório de professor
      );

      return NextResponse.json(dados);
    }

    // ========================================
    // RELATÓRIO POR ALUNO
    // ========================================
    if (tipo === 'aluno' && usuarioId) {
      const userId = parseInt(usuarioId)

      // Verificar se usuário existe
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId }
      })

      if (!usuario) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        )
      }

      // Chave do cache
      const cacheKey = `relatorios:aluno:${userId}:${periodoInicio.toISOString()}:${periodoFim.toISOString()}`;
      
      const dados = await getCached(
        cacheKey,
        async () => {

      // Buscar avaliações do aluno
      const avaliacoesAluno = await prisma.avaliacao.findMany({
        where: {
          usuarioId: userId,
          createdAt: {
            gte: periodoInicio,
            lte: periodoFim
          }
        },
        select: {
          id: true,
          nota: true,
          humor: true,
          feedback: true,
          createdAt: true,
          aula: {
            select: {
              id: true,
              titulo: true,
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Buscar registros de humor do aluno
      const humorRegistros = await prisma.humorRegistro.findMany({
        where: {
          usuarioId: userId,
          data: {
            gte: periodoInicio,
            lte: periodoFim
          }
        },
        select: {
          id: true,
          humor: true,
          data: true,
          observacao: true
        },
        orderBy: {
          data: 'desc'
        }
      })

      const totalAvaliacoes = avaliacoesAluno.length
      const avaliacoesComNota = avaliacoesAluno.filter(a => a.nota !== null)
      
      const mediaNotas = avaliacoesComNota.length > 0
        ? avaliacoesComNota.reduce((sum, a) => sum + (a.nota || 0), 0) / avaliacoesComNota.length
        : 0

      const mediaHumorAvaliacoes = totalAvaliacoes > 0
        ? avaliacoesAluno.reduce((sum, a) => sum + humorParaNumero[a.humor], 0) / totalAvaliacoes
        : 0

      const mediaHumorRegistros = humorRegistros.length > 0
        ? humorRegistros.reduce((sum, h) => sum + humorParaNumero[h.humor], 0) / humorRegistros.length
        : 0

          return {
            tipo: 'aluno',
            usuario,
            periodo: {
              inicio: periodoInicio,
              fim: periodoFim
            },
            resumo: {
              totalAvaliacoes,
              totalHumorRegistros: humorRegistros.length,
              mediaNotas: Math.round(mediaNotas * 100) / 100,
              mediaHumorAvaliacoes: Math.round(mediaHumorAvaliacoes * 100) / 100,
              mediaHumorRegistros: Math.round(mediaHumorRegistros * 100) / 100
            },
            avaliacoes: avaliacoesAluno,
            humorRegistros
          };
        },
        300 // 5 minutos de cache para relatório de aluno
      );

      return NextResponse.json(dados);
    }

    return NextResponse.json(
      { error: 'Tipo de relatório inválido ou parâmetros faltando' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
