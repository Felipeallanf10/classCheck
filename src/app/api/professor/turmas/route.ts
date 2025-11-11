import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRole } from '@/lib/auth-helpers';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/professor/turmas
 * 
 * Retorna todas as turmas que o professor leciona
 * Inclui estatísticas básicas de cada turma
 */
export async function GET(request: NextRequest) {
  // Verificar permissão (PROFESSOR ou ADMIN)
  const { authorized, userId, error } = await checkRole(['PROFESSOR', 'ADMIN']);
  if (!authorized) return error!;

  try {

    // Buscar turmas do professor com estatísticas
    const turmasProfessor = await prisma.turmaProfessor.findMany({
      where: {
        professorId: userId,
      },
      include: {
        turma: {
          include: {
            _count: {
              select: {
                alunos: true,
                aulas: true,
              },
            },
            alunos: {
              select: {
                aluno: {
                  select: {
                    id: true,
                    nome: true,
                    avatar: true,
                  },
                },
              },
            },
            aulas: {
              select: {
                id: true,
                titulo: true,
                dataHora: true,
                status: true,
              },
              orderBy: {
                dataHora: 'desc',
              },
              take: 3, // Últimas 3 aulas
            },
          },
        },
      },
      orderBy: {
        turma: {
          nome: 'asc',
        },
      },
    });

    // Formatar resposta
    const turmas = await Promise.all(
      turmasProfessor.map(async (tp) => {
        const turma = tp.turma;

        // Calcular estatísticas adicionais
        const totalAvaliacoes = await prisma.avaliacaoSocioemocional.count({
          where: {
            aula: {
              turmaId: turma.id,
            },
          },
        });

        const aulasRecentes = await prisma.aula.count({
          where: {
            turmaId: turma.id,
            dataHora: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
            },
          },
        });

        return {
          id: turma.id,
          nome: turma.nome,
          codigo: turma.codigo,
          ano: turma.ano,
          periodo: turma.periodo,
          ativa: turma.ativa,
          materia: tp.materia, // Matéria que o professor leciona nessa turma
          estatisticas: {
            totalAlunos: turma._count.alunos,
            totalAulas: turma._count.aulas,
            totalAvaliacoes,
            aulasRecentes,
          },
          alunos: turma.alunos.map((a) => ({
            id: a.aluno.id,
            nome: a.aluno.nome,
            avatar: a.aluno.avatar,
          })),
          aulasRecentes: turma.aulas.map((aula) => ({
            id: aula.id,
            titulo: aula.titulo,
            dataHora: aula.dataHora,
            status: aula.status,
          })),
        };
      })
    );

    return NextResponse.json({
      turmas,
      total: turmas.length,
    });

  } catch (error) {
    console.error('[API] Erro ao buscar turmas do professor:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao buscar turmas',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
