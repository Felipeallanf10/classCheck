import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, subMonths } from 'date-fns';
import { getCached } from '@/lib/cache/redis-cache';

export const dynamic = 'force-dynamic';

/**
 * GET /api/professor/relatorios/turma
 * Retorna métricas agregadas da turma com análise de risco dos alunos
 */
export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth();
    
    if (usuario.role !== 'PROFESSOR' && usuario.role !== 'ADMIN') {
      return NextResponse.json(
        { erro: 'Acesso negado' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const turmaId = Number(searchParams.get('turmaId'));
    const periodo = searchParams.get('periodo') || 'mes'; // semana | mes | 3meses | semestre
    
    if (!turmaId || isNaN(turmaId)) {
      return NextResponse.json(
        { erro: 'ID da turma inválido' },
        { status: 400 }
      );
    }
    
    // Calcular data início baseada no período
    let dataInicio: Date;
    switch (periodo) {
      case 'semana':
        dataInicio = subDays(new Date(), 7);
        break;
      case '3meses':
        dataInicio = subMonths(new Date(), 3);
        break;
      case 'semestre':
        dataInicio = subMonths(new Date(), 6);
        break;
      default: // mes
        dataInicio = subMonths(new Date(), 1);
    }
    
    // Chave de cache
    const cacheKey = `dashboard:turma:${turmaId}:${periodo}`;
    
    const dados = await getCached(
      cacheKey,
      async () => {
        // Buscar alunos da turma
        const turmaAlunos = await prisma.turmaAluno.findMany({
      where: { turmaId },
      select: {
        alunoId: true,
      },
    });
    
    const alunoIds = turmaAlunos.map((ta) => ta.alunoId);
    
    // Buscar dados dos alunos com sessões e alertas
    const alunos = await prisma.usuario.findMany({
      where: {
        id: { in: alunoIds },
      },
      select: {
        id: true,
        nome: true,
        email: true,
        sessoesAdaptativas: {
          where: {
            status: 'FINALIZADA',
            iniciadoEm: { gte: dataInicio },
          },
          select: {
            id: true,
            thetaEstimado: true,
            confianca: true,
            iniciadoEm: true,
          },
          orderBy: {
            iniciadoEm: 'asc',
          },
        },
        alertasSocioemocionais: {
          where: {
            status: { in: ['PENDENTE', 'EM_ANALISE'] },
            nivel: { in: ['VERMELHO', 'LARANJA'] },
          },
          select: {
            id: true,
            nivel: true,
            tipo: true,
            descricao: true,
          },
        },
      },
    });
    
    // Calcular métricas por aluno
    const metricas = alunos.map((aluno) => {
      const sessoes = aluno.sessoesAdaptativas;
      const alertas = aluno.alertasSocioemocionais;
      
      // Theta médio
      const thetaMedio = sessoes.length > 0
        ? sessoes.reduce((sum: number, s: any) => sum + (s.thetaEstimado || 0), 0) / sessoes.length
        : 0;
      
      // Confiança média
      const confiancaMedia = sessoes.length > 0
        ? sessoes.reduce((sum: number, s: any) => sum + (s.confianca || 0), 0) / sessoes.length
        : 0;
      
      // Calcular tendência (comparar primeira e última sessão)
      let tendencia: 'CRESCENTE' | 'ESTAVEL' | 'DECRESCENTE' = 'ESTAVEL';
      if (sessoes.length >= 2) {
        const primeiroTheta = sessoes[0].thetaEstimado || 0;
        const ultimoTheta = sessoes[sessoes.length - 1].thetaEstimado || 0;
        const variacao = ultimoTheta - primeiroTheta;
        
        if (variacao > 0.3) tendencia = 'CRESCENTE';
        else if (variacao < -0.3) tendencia = 'DECRESCENTE';
      }
      
      // Calcular nível de risco baseado em theta e alertas
      let nivelRisco: 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO' = 'BAIXO';
      const alertasVermelhos = alertas.filter((a: any) => a.nivel === 'VERMELHO').length;
      const alertasLaranjas = alertas.filter((a: any) => a.nivel === 'LARANJA').length;
      
      if (alertasVermelhos > 0 || thetaMedio < -2) {
        nivelRisco = 'CRITICO';
      } else if (alertasLaranjas > 1 || thetaMedio < -1) {
        nivelRisco = 'ALTO';
      } else if (alertasLaranjas > 0 || thetaMedio < 0) {
        nivelRisco = 'MEDIO';
      }
      
      return {
        aluno: {
          id: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
        },
        thetaMedio: Number(thetaMedio.toFixed(3)),
        confiancaMedia: Number(confiancaMedia.toFixed(3)),
        tendencia,
        totalSessoes: sessoes.length,
        alertasAbertos: alertas.length,
        alertasVermelhos,
        alertasLaranjas,
        nivelRisco,
        ultimaSessao: sessoes.length > 0 ? sessoes[sessoes.length - 1].iniciadoEm : null,
      };
    });
    
    // Métricas gerais da turma
    const metricsGerais = {
      totalAlunos: alunos.length,
      alunosCriticos: metricas.filter((m) => m.nivelRisco === 'CRITICO').length,
      alunosAltoRisco: metricas.filter((m) => m.nivelRisco === 'ALTO').length,
      alunosMedioRisco: metricas.filter((m) => m.nivelRisco === 'MEDIO').length,
      alunosBaixoRisco: metricas.filter((m) => m.nivelRisco === 'BAIXO').length,
      thetaMedioTurma: metricas.length > 0
        ? Number((metricas.reduce((sum, m) => sum + m.thetaMedio, 0) / metricas.length).toFixed(3))
        : 0,
      totalAlertasAbertos: metricas.reduce((sum, m) => sum + m.alertasAbertos, 0),
      totalSessoesRealizadas: metricas.reduce((sum, m) => sum + m.totalSessoes, 0),
    };
    
    // Ordenar alunos por nível de risco (crítico primeiro)
    const metricasOrdenadas = metricas.sort((a, b) => {
      const ordem = { CRITICO: 0, ALTO: 1, MEDIO: 2, BAIXO: 3 };
      return ordem[a.nivelRisco] - ordem[b.nivelRisco];
    });
    
        return {
          metricsGerais,
          metricas: metricasOrdenadas,
        };
      },
      300 // 5 minutos de cache
    );
    
    return NextResponse.json({
      sucesso: true,
      dados,
    });
  } catch (erro) {
    console.error('[API Professor Relatórios Turma] Erro:', erro);
    return NextResponse.json(
      { erro: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
