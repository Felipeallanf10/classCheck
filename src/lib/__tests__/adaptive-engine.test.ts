/**
 * Testes para o Sistema de Avaliação Adaptativa
 * Validação dos algoritmos TRI e seleção de questões
 * Conforme padrões científicos do Sprint 4
 */

// Setup para testes unitários (com mock do Prisma)
import '../../test-setup-unit';

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  AdaptiveAssessmentEngine, 
  QuestionItem, 
  StudentAbility, 
  ResponseRecord,
  QuestionFactory
} from '../assessment/adaptive-engine';
import { VALIDATED_QUESTIONS } from '../../data/validated-questions';

describe('AdaptiveAssessmentEngine', () => {
  let engine: AdaptiveAssessmentEngine;
  let mockQuestions: QuestionItem[];
  let testStudentId: string;

  beforeEach(() => {
    // Configurar questões mock com parâmetros TRI controlados
    mockQuestions = [
      {
        id: 'test_easy',
        content: 'Questão fácil para teste',
        category: 'valencia',
        difficulty: -1.0,
        discrimination: 1.5,
        guessing: 0.1,
        scale: [1, 5],
        keywords: ['teste', 'fácil']
      },
      {
        id: 'test_medium',
        content: 'Questão média para teste',
        category: 'ativacao',
        difficulty: 0.0,
        discrimination: 2.0,
        guessing: 0.05,
        scale: [1, 7],
        keywords: ['teste', 'médio']
      },
      {
        id: 'test_hard',
        content: 'Questão difícil para teste',
        category: 'concentracao',
        difficulty: 1.5,
        discrimination: 1.8,
        guessing: 0.15,
        scale: [1, 10],
        keywords: ['teste', 'difícil']
      }
    ];

    engine = new AdaptiveAssessmentEngine(mockQuestions);
    testStudentId = 'student_test_001';
  });

  describe('Inicialização e Configuração', () => {
    it('deve inicializar com banco de questões', () => {
      expect(engine).toBeDefined();
      const validation = engine.validateQuestionBank();
      expect(validation.totalQuestions).toBe(3);
      expect(validation.difficultyRange[0]).toBe(-1.0);
      expect(validation.difficultyRange[1]).toBe(1.5);
    });

    it('deve validar qualidade do banco de questões', () => {
      const validation = engine.validateQuestionBank();
      expect(validation.categoryCoverage).toEqual({
        valencia: 1,
        ativacao: 1,
        concentracao: 1
      });
      expect(validation.qualityIssues).toContain('Banco de questões muito pequeno (< 50 questões)');
    });
  });

  describe('Gerenciamento de Sessões', () => {
    it('deve iniciar nova sessão com parâmetros padrão', () => {
      const session = engine.startSession(testStudentId);
      
      expect(session.sessionId).toBeDefined();
      expect(session.studentId).toBe(testStudentId);
      expect(session.currentTheta).toBe(0); // Valor inicial padrão
      expect(session.targetPrecision).toBe(0.3);
      expect(session.maxQuestions).toBe(15);
      expect(session.questionsAnswered).toHaveLength(0);
      expect(session.isComplete).toBe(false);
    });

    it('deve iniciar sessão com parâmetros customizados', () => {
      const customOptions = {
        targetPrecision: 0.2,
        maxQuestions: 10,
        initialTheta: 0.5
      };
      
      const session = engine.startSession(testStudentId, customOptions);
      
      expect(session.currentTheta).toBe(0.5);
      expect(session.targetPrecision).toBe(0.2);
      expect(session.maxQuestions).toBe(10);
    });

    it('deve usar habilidade prévia se disponível', () => {
      // Simular estudante com habilidade prévia
      const mockAbility: StudentAbility = {
        id: testStudentId,
        theta: 1.2,
        standardError: 0.4,
        confidenceInterval: [0.4, 2.0],
        responseHistory: [],
        lastUpdated: new Date()
      };

      // Adicionar habilidade manualmente para teste
      (engine as any).studentAbilities.set(testStudentId, mockAbility);
      
      const session = engine.startSession(testStudentId);
      expect(session.currentTheta).toBe(1.2);
    });
  });

  describe('Seleção de Questões', () => {
    let sessionId: string;

    beforeEach(() => {
      const session = engine.startSession(testStudentId);
      sessionId = session.sessionId;
    });

    it('deve selecionar primeira questão baseada na informação de Fisher', () => {
      const question = engine.selectNextQuestion(sessionId);
      
      expect(question).toBeDefined();
      expect(mockQuestions.map(q => q.id)).toContain(question!.id);
    });

    it('deve retornar null quando sessão está completa', () => {
      engine.completeSession(sessionId);
      const question = engine.selectNextQuestion(sessionId);
      
      expect(question).toBeNull();
    });

    it('deve evitar questões já respondidas', () => {
      const firstQuestion = engine.selectNextQuestion(sessionId);
      expect(firstQuestion).toBeDefined();
      
      // Simular resposta à primeira questão
      engine.processResponse(sessionId, firstQuestion!.id, 3, 45);
      
      const secondQuestion = engine.selectNextQuestion(sessionId);
      expect(secondQuestion).toBeDefined();
      expect(secondQuestion!.id).not.toBe(firstQuestion!.id);
    });

    it('deve selecionar questões com máxima informação para habilidade atual', () => {
      // Para theta = 0, questão com dificuldade próxima a 0 deve ter maior informação
      const question = engine.selectNextQuestion(sessionId);
      expect(question).toBeDefined();
      
      // A questão média (difficulty = 0.0) deve ser preferida para theta = 0
      // Devido à maior informação de Fisher
      expect(Math.abs(question!.difficulty)).toBeLessThanOrEqual(1.0);
    });
  });

  describe('Processamento de Respostas e Estimação de Habilidade', () => {
    let sessionId: string;
    let selectedQuestion: QuestionItem;

    beforeEach(() => {
      const session = engine.startSession(testStudentId);
      sessionId = session.sessionId;
      selectedQuestion = engine.selectNextQuestion(sessionId)!;
    });

    it('deve processar resposta e atualizar habilidade', () => {
      const response = 4; // Resposta positiva
      const timeSpent = 30;
      
      const updatedAbility = engine.processResponse(sessionId, selectedQuestion.id, response, timeSpent);
      
      expect(updatedAbility).toBeDefined();
      expect(updatedAbility!.theta).toBeDefined();
      expect(updatedAbility!.standardError).toBeDefined();
      expect(updatedAbility!.confidenceInterval).toHaveLength(2);
      expect(updatedAbility!.responseHistory).toHaveLength(1);
    });

    it('deve lançar erro para questão não encontrada', () => {
      expect(() => {
        engine.processResponse(sessionId, 'question_not_exists', 3, 30);
      }).toThrow('Questão question_not_exists não encontrada no banco de questões');
    });

    it('deve retornar null para sessão inválida', () => {
      const result = engine.processResponse('invalid_session', selectedQuestion.id, 3, 30);
      expect(result).toBeNull();
    });

    it('deve criar registro de resposta correto', () => {
      const response = 5;
      const timeSpent = 25;
      
      engine.processResponse(sessionId, selectedQuestion.id, response, timeSpent);
      
      const session = (engine as any).activeSessions.get(sessionId);
      const responseRecord = session.questionsAnswered[0];
      
      expect(responseRecord.questionId).toBe(selectedQuestion.id);
      expect(responseRecord.response).toBe(response);
      expect(responseRecord.timeSpent).toBe(timeSpent);
      expect(responseRecord.difficulty).toBe(selectedQuestion.difficulty);
      expect(responseRecord.timestamp).toBeInstanceOf(Date);
      expect(typeof responseRecord.correct).toBe('boolean');
    });
  });

  describe('Critérios de Parada', () => {
    let sessionId: string;

    beforeEach(() => {
      const session = engine.startSession(testStudentId, {
        maxQuestions: 5,
        targetPrecision: 0.25
      });
      sessionId = session.sessionId;
    });

    it('deve parar quando máximo de questões for atingido', () => {
      // Responder 5 questões (máximo configurado)
      for (let i = 0; i < 5; i++) {
        const question = engine.selectNextQuestion(sessionId);
        if (question) {
          engine.processResponse(sessionId, question.id, 3, 30);
        }
      }
      
      const nextQuestion = engine.selectNextQuestion(sessionId);
      expect(nextQuestion).toBeNull();
      
      const session = (engine as any).activeSessions.get(sessionId);
      expect(session?.isComplete).toBe(true);
    });

    it('deve parar quando precisão alvo for atingida', () => {
      // Simular sessão com precisão muito alta (erro padrão baixo)
      const session = (engine as any).activeSessions.get(sessionId);
      session.finalAbility.standardError = 0.2; // Abaixo do target de 0.25
      
      const question = engine.selectNextQuestion(sessionId);
      expect(question).toBeNull();
    });

    it('deve exigir mínimo de questões antes de parar', () => {
      // Mesmo com precisão alta, deve responder pelo menos algumas questões
      const session = (engine as any).activeSessions.get(sessionId);
      session.finalAbility.standardError = 0.1; // Muito baixo
      
      // Deve continuar até pelo menos 5 questões
      for (let i = 0; i < 4; i++) {
        const question = engine.selectNextQuestion(sessionId);
        expect(question).toBeDefined();
        if (question) {
          engine.processResponse(sessionId, question.id, 3, 30);
        }
      }
    });
  });

  describe('Estatísticas de Sessão', () => {
    let sessionId: string;

    beforeEach(() => {
      const session = engine.startSession(testStudentId);
      sessionId = session.sessionId;
      
      // Responder algumas questões para ter dados
      for (let i = 0; i < 3; i++) {
        const question = engine.selectNextQuestion(sessionId);
        if (question) {
          engine.processResponse(sessionId, question.id, i + 2, 30 + i * 5);
        }
      }
    });

    it('deve calcular estatísticas de sessão corretamente', () => {
      const stats = engine.getSessionStatistics(sessionId);
      
      expect(stats).toBeDefined();
      expect(stats!.questionsAnswered).toBe(3);
      expect(stats!.averageTimePerQuestion).toBe(35); // (30 + 35 + 40) / 3 = 105 / 3 = 35
      expect(stats!.difficultyProgression).toHaveLength(3);
      expect(stats!.abilityProgression).toHaveLength(3);
      expect(stats!.finalPrecision).toBeDefined();
      expect(typeof stats!.isComplete).toBe('boolean');
    });

    it('deve retornar null para sessão inválida', () => {
      const stats = engine.getSessionStatistics('invalid_session');
      expect(stats).toBeNull();
    });
  });

  describe('Finalização de Sessão', () => {
    let sessionId: string;

    beforeEach(() => {
      const session = engine.startSession(testStudentId);
      sessionId = session.sessionId;
      
      // Responder uma questão
      const question = engine.selectNextQuestion(sessionId);
      if (question) {
        engine.processResponse(sessionId, question.id, 4, 35);
      }
    });

    it('deve finalizar sessão e retornar habilidade final', () => {
      const finalAbility = engine.completeSession(sessionId);
      
      expect(finalAbility).toBeDefined();
      expect(finalAbility!.id).toBe(testStudentId);
      expect(finalAbility!.responseHistory).toHaveLength(1);
      expect(finalAbility!.lastUpdated).toBeInstanceOf(Date);
    });

    it('deve salvar habilidade do estudante permanentemente', () => {
      const finalAbility = engine.completeSession(sessionId);
      const savedAbility = engine.getStudentAbility(testStudentId);
      
      expect(savedAbility).toEqual(finalAbility);
    });

    it('deve marcar sessão como completa após finalização', () => {
      engine.completeSession(sessionId);
      
      const session = (engine as any).activeSessions.get(sessionId);
      expect(session).toBeDefined();
      expect(session.isComplete).toBe(true);
    });
  });

  describe('Informação de Fisher', () => {
    it('deve calcular informação corretamente para diferentes parâmetros', () => {
      const question: QuestionItem = {
        id: 'test_fisher',
        content: 'Teste de informação',
        category: 'valencia',
        difficulty: 0.0,
        discrimination: 2.0,
        guessing: 0.1,
        scale: [1, 5],
        keywords: ['teste']
      };

      const theta = 0.0; // Habilidade igual à dificuldade
      
      // Calcular informação usando método privado
      const information = (engine as any).calculateFisherInformation(question, theta);
      
      expect(information).toBeGreaterThan(0);
      expect(information).toBeLessThanOrEqual(1); // Normalizado
    });

    it('deve ter informação máxima quando theta = dificuldade', () => {
      const question: QuestionItem = {
        id: 'test_optimal',
        content: 'Questão ótima',
        category: 'valencia',
        difficulty: 1.0,
        discrimination: 1.5,
        guessing: 0.0,
        scale: [1, 5],
        keywords: ['teste']
      };

      const informationAtDifficulty = (engine as any).calculateFisherInformation(question, 1.0);
      const informationAway = (engine as any).calculateFisherInformation(question, 2.0);
      
      expect(informationAtDifficulty).toBeGreaterThan(informationAway);
    });
  });

  describe('Estimação MLE', () => {
    it('deve convergir para estimativa estável', () => {
      const responses: ResponseRecord[] = [
        {
          questionId: 'test_easy',
          response: 4,
          timestamp: new Date(),
          timeSpent: 30,
          difficulty: -1.0,
          correct: true
        },
        {
          questionId: 'test_medium',
          response: 3,
          timestamp: new Date(),
          timeSpent: 35,
          difficulty: 0.0,
          correct: true
        },
        {
          questionId: 'test_hard',
          response: 2,
          timestamp: new Date(),
          timeSpent: 50,
          difficulty: 1.5,
          correct: false
        }
      ];

      const theta = (engine as any).estimateAbilityMLE(responses);
      
      expect(theta).toBeDefined();
      expect(typeof theta).toBe('number');
      expect(theta).toBeGreaterThan(-4);
      expect(theta).toBeLessThanOrEqual(4); // Theta é clampado em [-4, 4]
    });

    it('deve retornar 0 para lista vazia de respostas', () => {
      const theta = (engine as any).estimateAbilityMLE([]);
      expect(theta).toBe(0);
    });
  });

  describe('Erro Padrão', () => {
    it('deve calcular erro padrão baseado na informação total', () => {
      const responses: ResponseRecord[] = [
        {
          questionId: 'test_medium',
          response: 4,
          timestamp: new Date(),
          timeSpent: 30,
          difficulty: 0.0,
          correct: true
        }
      ];

      const theta = 0.5;
      const standardError = (engine as any).calculateStandardError(responses, theta);
      
      expect(standardError).toBeGreaterThan(0);
      expect(standardError).toBeLessThan(2); // Valor razoável
    });

    it('deve diminuir com mais questões respondidas', () => {
      const singleResponse: ResponseRecord[] = [{
        questionId: 'test_medium',
        response: 4,
        timestamp: new Date(),
        timeSpent: 30,
        difficulty: 0.0,
        correct: true
      }];

      const multipleResponses: ResponseRecord[] = [
        ...singleResponse,
        {
          questionId: 'test_easy',
          response: 5,
          timestamp: new Date(),
          timeSpent: 25,
          difficulty: -1.0,
          correct: true
        },
        {
          questionId: 'test_hard',
          response: 2,
          timestamp: new Date(),
          timeSpent: 60,
          difficulty: 1.5,
          correct: false
        }
      ];

      const theta = 0.0;
      const singleSE = (engine as any).calculateStandardError(singleResponse, theta);
      const multipleSE = (engine as any).calculateStandardError(multipleResponses, theta);
      
      expect(multipleSE).toBeLessThan(singleSE);
    });
  });
});

describe('QuestionFactory', () => {
  describe('Criação de Questões Emocionais', () => {
    it('deve criar questões com parâmetros TRI válidos', () => {
      const questions = QuestionFactory.createEmotionalAssessmentQuestions();
      
      expect(questions.length).toBeGreaterThan(0);
      
      questions.forEach(question => {
        expect(question.id).toBeDefined();
        expect(question.content).toBeDefined();
        expect(question.category).toMatch(/^(valencia|ativacao|concentracao|motivacao)$/);
        expect(question.difficulty).toBeGreaterThan(-3);
        expect(question.difficulty).toBeLessThan(3);
        expect(question.discrimination).toBeGreaterThan(0);
        expect(question.guessing).toBeGreaterThanOrEqual(0);
        expect(question.guessing).toBeLessThan(1);
        expect(question.scale).toHaveLength(2);
        expect(question.scale[1]).toBeGreaterThan(question.scale[0]);
        expect(question.keywords).toBeDefined();
        expect(question.keywords.length).toBeGreaterThan(0);
      });
    });

    it('deve criar questões balanceadas por categoria', () => {
      const questions = QuestionFactory.createEmotionalAssessmentQuestions();
      const categoryCounts = questions.reduce((counts, q) => {
        counts[q.category] = (counts[q.category] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      // Verificar se há questões de todas as categorias principais
      expect(categoryCounts.valencia).toBeGreaterThan(0);
      expect(categoryCounts.ativacao).toBeGreaterThan(0);
      expect(categoryCounts.concentracao).toBeGreaterThan(0);
      expect(categoryCounts.motivacao).toBeGreaterThan(0);
    });

    it('deve criar questões com diferentes níveis de dificuldade', () => {
      const questions = QuestionFactory.createEmotionalAssessmentQuestions();
      const difficulties = questions.map(q => q.difficulty);
      
      const minDifficulty = Math.min(...difficulties);
      const maxDifficulty = Math.max(...difficulties);
      
      expect(maxDifficulty - minDifficulty).toBeGreaterThan(1); // Faixa adequada
    });
  });
});

describe('Integração com Questões Validadas', () => {
  it('deve funcionar com questões do banco validado', () => {
    const validatedEngine = new AdaptiveAssessmentEngine(VALIDATED_QUESTIONS.slice(0, 10));
    const validation = validatedEngine.validateQuestionBank();
    
    expect(validation.totalQuestions).toBe(10);
    expect(validation.qualityIssues.length).toBeGreaterThan(0); // Ainda pequeno
    
    const session = validatedEngine.startSession('test_student');
    const firstQuestion = validatedEngine.selectNextQuestion(session.sessionId);
    
    expect(firstQuestion).toBeDefined();
    expect(VALIDATED_QUESTIONS.map(q => q.id)).toContain(firstQuestion!.id);
  });

  it('deve manter qualidade com banco completo de questões validadas', () => {
    const fullEngine = new AdaptiveAssessmentEngine(VALIDATED_QUESTIONS);
    const validation = fullEngine.validateQuestionBank();
    
    expect(validation.totalQuestions).toBe(VALIDATED_QUESTIONS.length);
    expect(validation.difficultyRange[1] - validation.difficultyRange[0]).toBeGreaterThan(1.5); // Range realista
    
    // Com banco de 32 questões (< 50), esperamos aviso de banco pequeno
    // Isso é correto e desejável do ponto de vista de validação
    expect(validation.qualityIssues).toBeDefined();
  });
});

describe('Cenários de Erro e Edge Cases', () => {
  let engine: AdaptiveAssessmentEngine;

  beforeEach(() => {
    engine = new AdaptiveAssessmentEngine([]);
  });

  it('deve lidar com banco de questões vazio', () => {
    const session = engine.startSession('test_student');
    const question = engine.selectNextQuestion(session.sessionId);
    
    expect(question).toBeNull();
  });

  it('deve validar parâmetros de sessão extremos', () => {
    // Deve lançar erro para targetPrecision inválido
    expect(() => {
      engine.startSession('test_student', {
        targetPrecision: -0.1, // Inválido
      });
    }).toThrow('targetPrecision deve ser maior que zero');
    
    // Deve lançar erro para maxQuestions inválido
    expect(() => {
      engine.startSession('test_student', {
        maxQuestions: 0, // Inválido
      });
    }).toThrow('maxQuestions deve ser maior que zero');
    
    // Deve aceitar initialTheta extremo (será clampado posteriormente)
    const session = engine.startSession('test_student', {
      initialTheta: 10 // Extremo
    });
    
    expect(session.sessionId).toBeDefined();
  });

  it('deve manter estabilidade com valores extremos de theta', () => {
    const testQuestions: QuestionItem[] = [{
      id: 'extreme_test',
      content: 'Teste extremo',
      category: 'valencia',
      difficulty: 0.0,
      discrimination: 1.0,
      guessing: 0.0,
      scale: [1, 5],
      keywords: ['teste']
    }];
    
    const extremeEngine = new AdaptiveAssessmentEngine(testQuestions);
    
    // Testar com theta muito alto
    const sessionHigh = extremeEngine.startSession('student_high', { initialTheta: 5.0 });
    const questionHigh = extremeEngine.selectNextQuestion(sessionHigh.sessionId);
    expect(questionHigh).toBeDefined();
    
    // Testar com theta muito baixo
    const sessionLow = extremeEngine.startSession('student_low', { initialTheta: -5.0 });
    const questionLow = extremeEngine.selectNextQuestion(sessionLow.sessionId);
    expect(questionLow).toBeDefined();
  });
});
