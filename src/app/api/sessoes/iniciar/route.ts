import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getCurrentUserId } from '@/lib/auth-temp';

// Força a rota a ser dinâmica
export const dynamic = 'force-dynamic';

/**
 * Schema de validação para criação de sessão
 */
const IniciarSessaoSchema = z.object({
  questionarioId: z.string().min(1, 'ID do questionário é obrigatório'),
  usuarioId: z.number().int().positive('ID do usuário deve ser positivo').optional(), // Agora opcional
  
  // Novo formato: contexto estruturado (RECOMENDADO)
  contexto: z.object({
    tipo: z.enum(['GERAL', 'AULA', 'CHECK_IN', 'EVENTO']).optional(),
    aulaId: z.number().int().positive().optional(),
    eventoId: z.string().optional(),
    metadata: z.record(z.any()).optional(), // Dados extras JSON
  }).optional(),
  
  // Formato antigo (backward compatibility - deprecated)
  aulaId: z.number().int().positive().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * POST /api/sessoes/iniciar
 * 
 * Inicia nova sessão adaptativa de questionário
 * 
 * Body:
 * - questionarioId: string (obrigatório)
 * - usuarioId: number (opcional - se não fornecido, pega da sessão autenticada)
 * - contexto: object (opcional) - Contexto da sessão
 *   - tipo: 'GERAL' | 'AULA' | 'CHECK_IN' | 'EVENTO' (padrão: GERAL)
 *   - aulaId: number (se tipo AULA)
 *   - eventoId: string (se tipo EVENTO)
 *   - metadata: object (dados extras JSON)
 * 
 * Retorna:
 * - sessaoId: string
 * - questionario: { id, titulo, instrucoes, duracaoEstimada }
 * - primeiraPergunta: PerguntaSocioemocional
 * - progresso: { atual: 0, estimado: number }
 * 
 * @example Geral (WHO-5) - Usuário autenticado
 * POST /api/sessoes/iniciar
 * Body: { 
 *   "questionarioId": "who-5",
 *   "contexto": { "tipo": "GERAL", "metadata": { "origem": "dashboard" } }
 * }
 * 
 * @example Check-in Diário
 * POST /api/sessoes/iniciar
 * Body: { 
 *   "questionarioId": "questionario-checkin-diario",
 *   "contexto": { "tipo": "CHECK_IN" }
 * }
 * 
 * @example Avaliação de Aula
 * POST /api/sessoes/iniciar
 * Body: { 
 *   "questionarioId": "questionario-impacto-aula",
 *   "contexto": { "tipo": "AULA", "aulaId": 42, "metadata": { "professor": "João" } }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse e validação do body
    const body = await request.json();
    const validatedData = IniciarSessaoSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          erro: 'Dados inválidos',
          detalhes: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { questionarioId, usuarioId: usuarioIdBody, contexto, metadata, aulaId } = validatedData.data;

    // Pegar usuário da sessão ou do body (para compatibilidade)
    const usuarioId = usuarioIdBody || await getCurrentUserId();

    // Processar contexto (novo formato vs antigo)
    const contextoTipo = contexto?.tipo || 'GERAL';
    const contextoAulaId = contexto?.aulaId || aulaId;
    const contextoEventoId = contexto?.eventoId;
    const contextoMetadata = contexto?.metadata || metadata || {};

    // Verificar se questionário existe e está ativo
    const questionario = await prisma.questionarioSocioemocional.findUnique({
      where: { id: questionarioId },
      include: {
        perguntas: {
          where: { ativo: true },
          orderBy: { ordem: 'asc' },
          select: {
            id: true,
            texto: true,
            textoAuxiliar: true,
            categoria: true,
            dominio: true,
            tipoPergunta: true,
            obrigatoria: true,
            ordem: true,
            opcoes: true,
            valorMinimo: true,
            valorMaximo: true,
            padraoResposta: true,
            dificuldade: true,
            discriminacao: true,
            peso: true,
            escalaNome: true,
            escalaItem: true,
          },
        },
      },
    });

    if (!questionario) {
      return NextResponse.json(
        { erro: 'Questionário não encontrado' },
        { status: 404 }
      );
    }

    if (!questionario.ativo || !questionario.publicado) {
      return NextResponse.json(
        { erro: 'Questionário não está disponível' },
        { status: 400 }
      );
    }

    if (questionario.perguntas.length === 0) {
      return NextResponse.json(
        { erro: 'Questionário não possui perguntas ativas' },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nome: true, ativo: true },
    });

    if (!usuario) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    if (!usuario.ativo) {
      return NextResponse.json(
        { erro: 'Usuário não está ativo' },
        { status: 400 }
      );
    }

    // Criar sessão adaptativa
    const sessao = await prisma.sessaoAdaptativa.create({
      data: {
        questionarioId,
        usuarioId,
        
        // Novo formato de contexto
        contextoTipo,
        contextoMetadata: Object.keys(contextoMetadata).length > 0 ? contextoMetadata : undefined,
        aulaId: contextoAulaId,
        eventoId: contextoEventoId,
        
        // Campos legados (manter por compatibilidade)
        contexto: contextoMetadata,
        
        status: 'EM_ANDAMENTO',
        iniciadoEm: new Date(),
        thetaEstimado: 0, // Theta inicial (neutro)
        erroEstimacao: 1.0, // Erro inicial
        confianca: 0.0, // Confiança inicial
        totalPerguntasEstimado: questionario.adaptativo 
          ? Math.ceil(questionario.perguntas.length * 0.6) // 60% das perguntas para adaptativos
          : questionario.perguntas.length,
        nivelAlerta: 'VERDE',
      },
    });

    // Determinar primeira pergunta
    // Para questionários não-adaptativos: primeira na ordem
    // Para adaptativos: pergunta de dificuldade média (theta ≈ 0)
    let primeiraPergunta;

    if (questionario.adaptativo) {
      // Buscar pergunta com dificuldade próxima de 0 (neutro)
      primeiraPergunta = questionario.perguntas.reduce((melhor, atual) => {
        const distanciaAtual = Math.abs(atual.dificuldade - 0);
        const distanciaMelhor = Math.abs(melhor.dificuldade - 0);
        return distanciaAtual < distanciaMelhor ? atual : melhor;
      });
    } else {
      // Primeira pergunta na ordem
      primeiraPergunta = questionario.perguntas[0];
    }

    // Atualizar sessão com primeira pergunta
    await prisma.sessaoAdaptativa.update({
      where: { id: sessao.id },
      data: {
        perguntasApresentadas: [primeiraPergunta.id],
        proximaPergunta: primeiraPergunta.id, // Define a primeira pergunta como próxima
      },
    });

    // Retornar resposta
    return NextResponse.json(
      {
        success: true,
        sessao: {
          id: sessao.id,
          status: sessao.status,
          iniciadoEm: sessao.iniciadoEm,
          contexto: {
            tipo: sessao.contextoTipo,
            aulaId: sessao.aulaId,
            eventoId: sessao.eventoId,
            metadata: sessao.contextoMetadata,
          },
        },
        questionario: {
          id: questionario.id,
          titulo: questionario.titulo,
          descricao: questionario.descricao,
          tipo: questionario.tipo,
          adaptativo: questionario.adaptativo,
          duracaoEstimada: questionario.duracaoEstimada,
          instrucoes: questionario.instrucoes,
        },
        primeiraPergunta: {
          id: primeiraPergunta.id,
          texto: primeiraPergunta.texto,
          textoAuxiliar: primeiraPergunta.textoAuxiliar,
          categoria: primeiraPergunta.categoria,
          dominio: primeiraPergunta.dominio,
          tipoPergunta: primeiraPergunta.tipoPergunta,
          obrigatoria: primeiraPergunta.obrigatoria,
          ordem: primeiraPergunta.ordem,
          opcoes: primeiraPergunta.opcoes,
          valorMinimo: primeiraPergunta.valorMinimo,
          valorMaximo: primeiraPergunta.valorMaximo,
          padraoResposta: primeiraPergunta.padraoResposta,
          escalaNome: primeiraPergunta.escalaNome,
        },
        progresso: {
          perguntaAtual: 1,
          totalEstimado: sessao.totalPerguntasEstimado || questionario.perguntas.length,
          porcentagem: (1 / (sessao.totalPerguntasEstimado || questionario.perguntas.length)) * 100,
        },
        irt: {
          theta: sessao.thetaEstimado,
          erro: sessao.erroEstimacao,
          confianca: sessao.confianca,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[API] Erro ao iniciar sessão:', error);

    return NextResponse.json(
      {
        erro: 'Erro ao iniciar sessão',
        mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
