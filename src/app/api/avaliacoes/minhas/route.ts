import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/avaliacoes/minhas
 * 
 * Retorna todas as avaliações do usuário logado:
 * - Avaliações de aulas (socioemocional + didática)
 * - Avaliações de professores
 * - Check-ins diários
 * - Estatísticas gerais
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // TODO: Pegar usuário da sessão autenticada
    // Por enquanto, usar ID fixo do usuário de teste
    const usuarioId = parseInt(searchParams.get('usuarioId') || '52');
    
    if (!usuarioId) {
      return NextResponse.json(
        { erro: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar avaliações socioemocionais de aulas
    const avaliacoesSocioemocionais = await prisma.avaliacaoSocioemocional.findMany({
      where: { usuarioId },
      include: {
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
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Buscar avaliações didáticas de aulas
    const avaliacoesDidaticas = await prisma.avaliacaoDidatica.findMany({
      where: { usuarioId },
      include: {
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
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Combinar avaliações por aula (socioemocional + didática)
    const avaliacoesAulasMap = new Map();

    avaliacoesSocioemocionais.forEach((avSocio) => {
      const aulaId = avSocio.aulaId;
      if (!avaliacoesAulasMap.has(aulaId)) {
        avaliacoesAulasMap.set(aulaId, {
          id: avSocio.id,
          aulaId: avSocio.aulaId,
          aulaTitulo: avSocio.aula.titulo,
          aulaMateria: avSocio.aula.materia,
          aulaData: avSocio.aula.dataHora,
          professor: avSocio.aula.professor.nome,
          professorId: avSocio.aula.professor.id,
          data: avSocio.createdAt,
          socioemocional: {
            valencia: avSocio.valencia,
            ativacao: avSocio.ativacao,
            estadoPrimario: avSocio.estadoPrimario,
            confianca: avSocio.confianca,
            totalPerguntas: avSocio.totalPerguntas,
          },
          didatica: null,
        });
      }
    });

    avaliacoesDidaticas.forEach((avDid) => {
      const aulaId = avDid.aulaId;
      if (avaliacoesAulasMap.has(aulaId)) {
        const avaliacao = avaliacoesAulasMap.get(aulaId);
        avaliacao.didatica = {
          compreensaoConteudo: avDid.compreensaoConteudo,
          ritmoAula: avDid.ritmoAula,
          recursosDidaticos: avDid.recursosDidaticos,
          engajamento: avDid.engajamento,
          pontoPositivo: avDid.pontoPositivo,
          sugestao: avDid.sugestao,
        };
      } else {
        // Caso tenha didática mas não socioemocional (edge case)
        avaliacoesAulasMap.set(aulaId, {
          id: avDid.id,
          aulaId: avDid.aulaId,
          aulaTitulo: avDid.aula.titulo,
          aulaMateria: avDid.aula.materia,
          aulaData: avDid.aula.dataHora,
          professor: avDid.aula.professor.nome,
          professorId: avDid.aula.professor.id,
          data: avDid.createdAt,
          socioemocional: null,
          didatica: {
            compreensaoConteudo: avDid.compreensaoConteudo,
            ritmoAula: avDid.ritmoAula,
            recursosDidaticos: avDid.recursosDidaticos,
            engajamento: avDid.engajamento,
            pontoPositivo: avDid.pontoPositivo,
            sugestao: avDid.sugestao,
          },
        });
      }
    });

    const avaliacoesAulas = Array.from(avaliacoesAulasMap.values());

    // Buscar avaliações de professores
    const avaliacoesProfessores = await prisma.avaliacaoProfessor.findMany({
      where: { usuarioId },
      include: {
        professor: {
          select: {
            id: true,
            nome: true,
            materia: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Buscar sessões de check-in
    const sessoesCheckIn = await prisma.sessaoAdaptativa.findMany({
      where: {
        usuarioId,
        questionarioId: 'questionario-checkin-diario',
        status: 'FINALIZADA',
      },
      select: {
        id: true,
        iniciadoEm: true,
        finalizadoEm: true,
        scoresPorCategoria: true,
        respostas: {
          select: {
            categoria: true,
            valorNormalizado: true,
          },
        },
      },
      orderBy: { iniciadoEm: 'desc' },
      take: 30,
    });

    // Calcular estatísticas
    const totalAvaliacoesAulas = avaliacoesAulas.length;
    const totalCheckIns = sessoesCheckIn.length;
    const totalAvaliacoesProfessores = avaliacoesProfessores.length;

    // Sequência atual de check-ins (dias consecutivos)
    let sequenciaAtual = 0;
    if (sessoesCheckIn.length > 0) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < sessoesCheckIn.length; i++) {
        const dataCheckIn = new Date(sessoesCheckIn[i].iniciadoEm);
        dataCheckIn.setHours(0, 0, 0, 0);
        
        const diffDias = Math.floor((hoje.getTime() - dataCheckIn.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDias === i) {
          sequenciaAtual++;
        } else {
          break;
        }
      }
    }

    // Média de humor (baseado em valência das avaliações socioemocionais)
    let mediaHumor = 5; // Padrão neutro
    if (avaliacoesSocioemocionais.length > 0) {
      const somaValencia = avaliacoesSocioemocionais.reduce(
        (sum, av) => sum + av.valencia,
        0
      );
      const valenciaMedia = somaValencia / avaliacoesSocioemocionais.length;
      // Converter valência (-1 a 1) para escala de humor (1 a 10)
      mediaHumor = ((valenciaMedia + 1) / 2) * 9 + 1; // Mapeia para 1-10
    }

    // Disciplina favorita (mais avaliações)
    const disciplinasCount = new Map<string, number>();
    avaliacoesAulas.forEach((av) => {
      const materia = av.aulaMateria;
      disciplinasCount.set(materia, (disciplinasCount.get(materia) || 0) + 1);
    });
    
    let disciplinaFavorita = 'Nenhuma';
    let maxCount = 0;
    disciplinasCount.forEach((count, materia) => {
      if (count > maxCount) {
        maxCount = count;
        disciplinaFavorita = materia;
      }
    });

    return NextResponse.json({
      avaliacoesAulas,
      avaliacoesProfessores: avaliacoesProfessores.map((av) => ({
        id: av.id,
        professor: av.professor.nome,
        professorId: av.professor.id,
        materia: av.professor.materia,
        periodo: av.periodo,
        data: av.createdAt,
        dominioConteudo: av.dominioConteudo,
        clarezaExplicacao: av.clarezaExplicacao,
        pontualidade: av.pontualidade,
        organizacao: av.organizacao,
        acessibilidade: av.acessibilidade,
        empatia: av.empatia,
        comentario: av.comentario,
      })),
      checkIns: sessoesCheckIn.map((sessao) => ({
        id: sessao.id,
        data: sessao.iniciadoEm,
        scores: sessao.scoresPorCategoria as Record<string, number>,
      })),
      estatisticas: {
        totalAvaliacoesAulas,
        totalCheckIns,
        totalAvaliacoesProfessores,
        sequenciaAtual,
        mediaHumor: Math.round(mediaHumor * 10) / 10, // Arredondar para 1 casa decimal
        disciplinaFavorita,
      },
    });
  } catch (error) {
    console.error('[API] Erro ao buscar avaliações:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao buscar avaliações',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
