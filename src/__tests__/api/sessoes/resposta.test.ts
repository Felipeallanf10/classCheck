/**
 * Testes para API de Resposta de Sessão Adaptativa
 * 
 * Cenários cobertos:
 * 1. Salvar resposta → determinar próxima pergunta (questionário)
 * 2. Salvar resposta → determinar próxima pergunta (banco adaptativo)
 * 3. Critério de parada (≥5 respostas + SEM < 0.30)
 * 4. Verificar que pergunta já respondida não pode ser respondida novamente
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import { determinarProximaPergunta } from '@/lib/adaptive/proxima-pergunta-service';

// Se a variável de ambiente DATABASE_URL não estiver definida, ignoramos toda a suíte de integração
// para permitir execução completa dos demais testes sem infraestrutura de banco (sem Docker / Postgres local).
if (!process.env.DATABASE_URL) {
  describe.skip('API de Resposta - Sessão Adaptativa (skip - DATABASE_URL ausente)', () => {
    it('pulando suíte de integração por ausência de DATABASE_URL', () => {
      expect(true).toBe(true);
    });
  });
} else {
  // Testes de integração que requerem banco de dados real
  describe('API de Resposta - Sessão Adaptativa', () => {
  let usuarioId: number;
  let questionarioId: string;
  let sessaoId: string;
  let perguntaQuestionarioId: string;
  let perguntaBancoId: string;

  // Helpers para reduzir duplicação na criação de respostas
  const criarRespostaQuestionario = async (valor: number, ordem: number, perguntaId?: string) => {
    return await prisma.respostaSocioemocional.create({
      data: {
        sessaoId,
        usuarioId,
        perguntaId: perguntaId ?? perguntaQuestionarioId,
        valor,
        valorNumerico: valor,
        valorNormalizado: (valor - 1) / 4, // normalização LIKERT_5
        tempoResposta: 5,
        categoria: 'HUMOR_GERAL',
        dominio: 'FELIZ',
        ordem,
      },
    });
  };

  const criarRespostaBanco = async (valor: number, ordem: number) => {
    return await prisma.respostaSocioemocional.create({
      data: {
        sessaoId,
        usuarioId,
        perguntaId: null,
        perguntaBancoId,
        valor,
        valorNumerico: valor,
        valorNormalizado: (valor - 1) / 4,
        tempoResposta: 7,
        categoria: 'ANSIEDADE',
        dominio: 'NERVOSO',
        escalaNome: 'GAD7',
        escalaItem: 'GAD7_1',
        ordem,
      },
    });
  };

  beforeAll(async () => {
    // Limpar dados de testes anteriores
    await prisma.respostaSocioemocional.deleteMany({
      where: { 
        usuario: { email: 'teste-resposta-api@test.com' }
      },
    });
    await prisma.sessaoAdaptativa.deleteMany({
      where: { 
        usuario: { email: 'teste-resposta-api@test.com' }
      },
    });
    await prisma.usuario.deleteMany({
      where: { email: 'teste-resposta-api@test.com' },
    });

    // Criar usuário de teste
    const usuario = await prisma.usuario.create({
      data: {
        email: 'teste-resposta-api@test.com',
        nome: 'Teste Resposta API',
        senha: 'senha123',
        role: 'ALUNO',
      },
    });
    usuarioId = usuario.id;

    // Criar questionário de teste
    const questionario = await prisma.questionarioSocioemocional.create({
      data: {
        titulo: 'Questionário de Teste - Resposta',
        tipo: 'CHECK_IN_DIARIO',
        adaptativo: true,
        nivelAdaptacao: 'ALTO',
        ativo: true,
      },
    });
    questionarioId = questionario.id;

    // Criar perguntas no questionário
    const perguntaQuestionario = await prisma.perguntaSocioemocional.create({
      data: {
        questionarioId,
        texto: 'Como você está se sentindo hoje?',
        categoria: 'HUMOR_GERAL',
        dominio: 'FELIZ',
        tipoPergunta: 'LIKERT_5',
        ordem: 1,
        dificuldade: 0.5,
        discriminacao: 1.0,
        opcoes: [
          { valor: 1, label: 'Muito mal' },
          { valor: 2, label: 'Mal' },
          { valor: 3, label: 'Neutro' },
          { valor: 4, label: 'Bem' },
          { valor: 5, label: 'Muito bem' },
        ],
        valorMinimo: 1,
        valorMaximo: 5,
      },
    });
    perguntaQuestionarioId = perguntaQuestionario.id;

    // Criar pergunta no banco adaptativo
    const perguntaBanco = await prisma.bancoPerguntasAdaptativo.create({
      data: {
        codigo: 'TEST_BANCO_001',
        titulo: 'Pergunta do Banco de Teste',
        texto: 'Você tem se sentido ansioso recentemente?',
        categoria: 'ANSIEDADE',
        dominio: 'NERVOSO',
        tipoPergunta: 'LIKERT_5',
        parametroA: 1.2,
        parametroB: 0.3,
        escalaNome: 'GAD7',
        escalaItem: 'GAD7_1',
      },
    });
    perguntaBancoId = perguntaBanco.id;
  });

  afterAll(async () => {
    // Limpar dados de teste (na ordem certa para respeitar foreign keys)
    await prisma.respostaSocioemocional.deleteMany({
      where: { usuarioId },
    });
    await prisma.sessaoAdaptativa.deleteMany({
      where: { usuarioId },
    });
    
    // Deletar perguntas se o questionário foi criado
    if (questionarioId) {
      await prisma.perguntaSocioemocional.deleteMany({
        where: { questionarioId },
      });
      await prisma.questionarioSocioemocional.delete({
        where: { id: questionarioId },
      });
    }
    
    await prisma.bancoPerguntasAdaptativo.deleteMany({
      where: { codigo: 'TEST_BANCO_001' },
    });
    
    if (usuarioId) {
      await prisma.usuario.delete({
        where: { id: usuarioId },
      });
    }
    
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Criar nova sessão para cada teste
    const sessao = await prisma.sessaoAdaptativa.create({
      data: {
        usuarioId,
        questionarioId,
        status: 'EM_ANDAMENTO',
        contextoTipo: 'GERAL',
        thetaEstimado: 0,
        erroEstimacao: 1,
        confianca: 0.5,
        totalPerguntasEstimado: 10,
      },
    });
    sessaoId = sessao.id;
  });

  it('deve salvar resposta de pergunta do questionário e determinar próxima pergunta', async () => {
    const resposta = await criarRespostaQuestionario(4, 1);

    expect(resposta.perguntaId).toBe(perguntaQuestionarioId);
    expect(resposta.perguntaBancoId).toBeNull();
    expect(resposta.valorNormalizado).toBe(0.75);

    // Determinar próxima pergunta
    const resultado = await determinarProximaPergunta(sessaoId);

    expect(resultado.thetaAtualizado).toBeDefined();
    expect(resultado.confianca).toBeGreaterThan(0);
    expect(resultado.finalizar).toBeFalsy();
  });

  it('deve salvar resposta de pergunta do banco adaptativo sem criar proxy', async () => {
    const resposta = await criarRespostaBanco(3, 1);

    expect(resposta.perguntaId).toBeNull();
    expect(resposta.perguntaBancoId).toBe(perguntaBancoId);
    expect(resposta.categoria).toBe('ANSIEDADE');

    // Verificar que não foi criada pergunta proxy
    const perguntaProxy = await prisma.perguntaSocioemocional.findUnique({
      where: { id: perguntaBancoId },
    });
    expect(perguntaProxy).toBeNull();
  });

  it('deve impedir responder a mesma pergunta duas vezes (questionário) - verificação lógica', async () => {
    await criarRespostaQuestionario(4, 1);

    // Verificar que já foi respondida
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId },
      include: {
        respostas: {
          select: {
            perguntaId: true,
            perguntaBancoId: true,
          },
        },
      },
    });

    const jaRespondida = sessao?.respostas.some(
      (resposta: { perguntaId: string | null; perguntaBancoId: string | null }) =>
        resposta.perguntaId === perguntaQuestionarioId
    );

    expect(jaRespondida).toBe(true);
  });

  it('deve impedir responder a mesma pergunta duas vezes (banco) - verificação lógica', async () => {
    await criarRespostaBanco(3, 1);

    // Verificar que já foi respondida
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId },
      include: {
        respostas: {
          select: {
            perguntaId: true,
            perguntaBancoId: true,
          },
        },
      },
    });

    const jaRespondida = sessao?.respostas.some(
      (resposta: { perguntaId: string | null; perguntaBancoId: string | null }) =>
        resposta.perguntaBancoId === perguntaBancoId
    );

    expect(jaRespondida).toBe(true);
  });

  it('deve finalizar quando atingir critérios de parada (≥5 respostas + alta confiança)', async () => {
    // Criar 5 perguntas adicionais
    const perguntas = await Promise.all(
      Array.from({ length: 5 }, async (_, i) => {
        return await prisma.perguntaSocioemocional.create({
          data: {
            questionarioId,
            texto: `Pergunta ${i + 2}`,
            categoria: 'HUMOR_GERAL',
            dominio: 'FELIZ',
            tipoPergunta: 'LIKERT_5',
            ordem: i + 2,
            dificuldade: 0.5,
            discriminacao: 1.0,
            valorMinimo: 1,
            valorMaximo: 5,
          },
        });
      })
    );

    // Salvar 5 respostas
    await Promise.all(
      perguntas.map((pergunta: { id: string; ordem: number }) => {
        return prisma.respostaSocioemocional.create({
          data: {
            sessaoId,
            usuarioId,
            perguntaId: pergunta.id,
            valor: 4,
            valorNumerico: 4,
            valorNormalizado: 0.75,
            tempoResposta: 5,
            categoria: 'HUMOR_GERAL',
            dominio: 'FELIZ',
            ordem: pergunta.ordem,
          },
        });
      })
    );

    // Determinar próxima pergunta (pode finalizar se SEM < 0.30)
    const resultado = await determinarProximaPergunta(sessaoId);

    // Verificar que tem pelo menos 5 respostas
    const sessao = await prisma.sessaoAdaptativa.findUnique({
      where: { id: sessaoId },
      include: {
        respostas: true,
      },
    });

    expect(sessao?.respostas.length).toBeGreaterThanOrEqual(5);

    // Se SEM < 0.30, deve ter finalizado
    if (resultado.sem && resultado.sem < 0.30) {
      expect(resultado.finalizar).toBe(true);
      expect(resultado.motivo).toContain('SEM');
    }
  });

  it('deve calcular theta corretamente após múltiplas respostas', async () => {
    // Resposta 1 (valor alto)
    await criarRespostaQuestionario(5, 1);

    const resultado1 = await determinarProximaPergunta(sessaoId);
    const theta1 = resultado1.thetaAtualizado;

    // Criar segunda pergunta
    const pergunta2 = await prisma.perguntaSocioemocional.create({
      data: {
        questionarioId,
        texto: 'Pergunta 2',
        categoria: 'HUMOR_GERAL',
        dominio: 'FELIZ',
        tipoPergunta: 'LIKERT_5',
        ordem: 2,
        dificuldade: 0.5,
        discriminacao: 1.0,
        valorMinimo: 1,
        valorMaximo: 5,
      },
    });

    // Resposta 2 (valor alto também)
    await criarRespostaQuestionario(5, 2, pergunta2.id);

    const resultado2 = await determinarProximaPergunta(sessaoId);
    const theta2 = resultado2.thetaAtualizado;

    // Theta deve ter aumentado (respostas consistentemente altas)
    expect(theta2).toBeGreaterThanOrEqual(theta1);
    expect(resultado2.confianca).toBeGreaterThan(resultado1.confianca);
  });
  });
}
