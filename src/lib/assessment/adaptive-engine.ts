/**
 * Sistema de Avaliação Adaptativa para ClassCheck
 * Implementa algoritmos de seleção de questões baseados na Teoria de Resposta ao Item (TRI)
 * Conforme especificações do Sprint 4 - Validação Científica
 */

import { calculateConfidenceInterval, StatisticalTest } from '../scientific-validation/confidence-calculation';

export interface QuestionItem {
  id: string;
  content: string;
  category: 'valencia' | 'ativacao' | 'concentracao' | 'motivacao';
  difficulty: number; // Parâmetro 'b' da TRI (dificuldade)
  discrimination: number; // Parâmetro 'a' da TRI (discriminação)
  guessing: number; // Parâmetro 'c' da TRI (acerto ao acaso)
  scale: [number, number]; // Escala de resposta [min, max]
  keywords: string[];
}

export interface StudentAbility {
  id: string;
  theta: number; // Habilidade estimada (θ)
  standardError: number; // Erro padrão da estimativa
  confidenceInterval: [number, number];
  responseHistory: ResponseRecord[];
  lastUpdated: Date;
}

export interface ResponseRecord {
  questionId: string;
  response: number;
  timestamp: Date;
  timeSpent: number; // em segundos
  difficulty: number;
  correct: boolean;
}

export interface AdaptiveSession {
  sessionId: string;
  studentId: string;
  startTime: Date;
  currentTheta: number;
  targetPrecision: number; // Erro padrão alvo (default: 0.3)
  maxQuestions: number; // Máximo de questões (default: 15)
  questionsAnswered: ResponseRecord[];
  isComplete: boolean;
  finalAbility: StudentAbility;
}

/**
 * Engine de Avaliação Adaptativa principal
 * Implementa CAT (Computer Adaptive Testing) baseado na TRI
 */
export class AdaptiveAssessmentEngine {
  private questionBank: QuestionItem[];
  private studentAbilities: Map<string, StudentAbility>;
  private activeSessions: Map<string, AdaptiveSession>;
  
  constructor(questionBank: QuestionItem[] = []) {
    this.questionBank = questionBank;
    this.studentAbilities = new Map();
    this.activeSessions = new Map();
  }

  /**
   * Inicia uma nova sessão de avaliação adaptativa
   * @param studentId ID do estudante
   * @param options Configurações da sessão
   * @returns Sessão iniciada
   */
  startSession(
    studentId: string, 
    options: {
      targetPrecision?: number;
      maxQuestions?: number;
      initialTheta?: number;
    } = {}
  ): AdaptiveSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Obter habilidade prévia do estudante ou usar valor inicial
    const previousAbility = this.studentAbilities.get(studentId);
    const initialTheta = options.initialTheta ?? previousAbility?.theta ?? 0;
    
    const session: AdaptiveSession = {
      sessionId,
      studentId,
      startTime: new Date(),
      currentTheta: initialTheta,
      targetPrecision: options.targetPrecision ?? 0.3,
      maxQuestions: options.maxQuestions ?? 15,
      questionsAnswered: [],
      isComplete: false,
      finalAbility: {
        id: studentId,
        theta: initialTheta,
        standardError: 1.0, // Incerteza inicial alta
        confidenceInterval: [initialTheta - 1.96, initialTheta + 1.96],
        responseHistory: previousAbility?.responseHistory ?? [],
        lastUpdated: new Date()
      }
    };
    
    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Seleciona a próxima questão mais informativa
   * @param sessionId ID da sessão
   * @returns Próxima questão ou null se a sessão estiver completa
   */
  selectNextQuestion(sessionId: string): QuestionItem | null {
    const session = this.activeSessions.get(sessionId);
    if (!session || session.isComplete) {
      return null;
    }

    // Verificar critérios de parada
    if (this.shouldStopSession(session)) {
      this.completeSession(sessionId);
      return null;
    }

    // Filtrar questões já respondidas
    const answeredQuestionIds = new Set(session.questionsAnswered.map(r => r.questionId));
    const availableQuestions = this.questionBank.filter(q => !answeredQuestionIds.has(q.id));
    
    if (availableQuestions.length === 0) {
      this.completeSession(sessionId);
      return null;
    }

    // Selecionar questão com máxima informação de Fisher
    let bestQuestion = availableQuestions[0];
    let maxInformation = this.calculateFisherInformation(bestQuestion, session.currentTheta);
    
    for (const question of availableQuestions) {
      const information = this.calculateFisherInformation(question, session.currentTheta);
      if (information > maxInformation) {
        maxInformation = information;
        bestQuestion = question;
      }
    }

    return bestQuestion;
  }

  /**
   * Processa a resposta do estudante e atualiza a estimativa de habilidade
   * @param sessionId ID da sessão
   * @param questionId ID da questão respondida
   * @param response Resposta do estudante
   * @param timeSpent Tempo gasto na questão (segundos)
   * @returns Habilidade atualizada
   */
  processResponse(
    sessionId: string, 
    questionId: string, 
    response: number, 
    timeSpent: number
  ): StudentAbility | null {
    const session = this.activeSessions.get(sessionId);
    if (!session || session.isComplete) {
      return null;
    }

    const question = this.questionBank.find(q => q.id === questionId);
    if (!question) {
      throw new Error(`Questão ${questionId} não encontrada no banco de questões`);
    }

    // Calcular se a resposta está "correta" (acima do ponto médio da escala)
    const midpoint = (question.scale[0] + question.scale[1]) / 2;
    const correct = response > midpoint;

    // Criar registro da resposta
    const responseRecord: ResponseRecord = {
      questionId,
      response,
      timestamp: new Date(),
      timeSpent,
      difficulty: question.difficulty,
      correct
    };

    session.questionsAnswered.push(responseRecord);

    // Atualizar estimativa de habilidade usando MLE (Maximum Likelihood Estimation)
    const newTheta = this.estimateAbilityMLE(session.questionsAnswered);
    const standardError = this.calculateStandardError(session.questionsAnswered, newTheta);
    
    session.currentTheta = newTheta;
    session.finalAbility = {
      id: session.studentId,
      theta: newTheta,
      standardError,
      confidenceInterval: [newTheta - 1.96 * standardError, newTheta + 1.96 * standardError],
      responseHistory: [...session.finalAbility.responseHistory, responseRecord],
      lastUpdated: new Date()
    };

    return session.finalAbility;
  }

  /**
   * Verifica se a sessão deve ser finalizada
   * @param session Sessão atual
   * @returns true se deve parar, false caso contrário
   */
  private shouldStopSession(session: AdaptiveSession): boolean {
    // Critério 1: Máximo de questões atingido
    if (session.questionsAnswered.length >= session.maxQuestions) {
      return true;
    }

    // Critério 2: Precisão alvo atingida
    if (session.finalAbility.standardError <= session.targetPrecision) {
      return true;
    }

    // Critério 3: Mínimo de questões para estimativa confiável
    if (session.questionsAnswered.length < 5) {
      return false;
    }

    // Critério 4: Convergência da estimativa (mudança < 0.1 nas últimas 3 questões)
    if (session.questionsAnswered.length >= 8) {
      const recentChanges = this.getRecentThetaChanges(session, 3);
      const avgChange = recentChanges.reduce((sum, change) => sum + Math.abs(change), 0) / recentChanges.length;
      if (avgChange < 0.1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calcula a informação de Fisher para uma questão em um nível de habilidade
   * @param question Questão
   * @param theta Nível de habilidade
   * @returns Valor da informação de Fisher
   */
  private calculateFisherInformation(question: QuestionItem, theta: number): number {
    const { discrimination: a, difficulty: b, guessing: c } = question;
    
    // Probabilidade de resposta correta (modelo 3PL da TRI)
    const probability = c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
    
    // Derivada da probabilidade
    const derivative = a * (1 - c) * Math.exp(-a * (theta - b)) / Math.pow(1 + Math.exp(-a * (theta - b)), 2);
    
    // Informação de Fisher
    const information = Math.pow(derivative, 2) / (probability * (1 - probability));
    
    return isNaN(information) || !isFinite(information) ? 0 : information;
  }

  /**
   * Estima a habilidade usando Maximum Likelihood Estimation
   * @param responses Histórico de respostas
   * @returns Estimativa de theta
   */
  private estimateAbilityMLE(responses: ResponseRecord[]): number {
    if (responses.length === 0) return 0;

    let theta = 0; // Estimativa inicial
    const maxIterations = 50;
    const tolerance = 0.001;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let likelihood = 0;
      let derivative = 0;
      let secondDerivative = 0;

      for (const response of responses) {
        const question = this.questionBank.find(q => q.id === response.questionId);
        if (!question) continue;

        const { discrimination: a, difficulty: b, guessing: c } = question;
        const probability = c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
        
        const correct = response.correct ? 1 : 0;
        
        // Log-likelihood
        likelihood += correct * Math.log(probability) + (1 - correct) * Math.log(1 - probability);
        
        // Primeira derivada
        const probDerivative = a * (1 - c) * Math.exp(-a * (theta - b)) / Math.pow(1 + Math.exp(-a * (theta - b)), 2);
        derivative += correct * (probDerivative / probability) - (1 - correct) * (probDerivative / (1 - probability));
        
        // Segunda derivada (para Newton-Raphson)
        const probSecondDerivative = -Math.pow(a, 2) * (1 - c) * Math.exp(-a * (theta - b)) * 
          (Math.exp(-a * (theta - b)) - 1) / Math.pow(1 + Math.exp(-a * (theta - b)), 3);
        
        secondDerivative += correct * (probSecondDerivative / probability - Math.pow(probDerivative / probability, 2)) -
          (1 - correct) * (probSecondDerivative / (1 - probability) - Math.pow(probDerivative / (1 - probability), 2));
      }

      // Newton-Raphson update
      if (Math.abs(secondDerivative) < 0.0001) break;
      
      const newTheta = theta - derivative / secondDerivative;
      
      if (Math.abs(newTheta - theta) < tolerance) {
        theta = newTheta;
        break;
      }
      
      theta = newTheta;
      
      // Limitar theta a um intervalo razoável [-4, 4]
      theta = Math.max(-4, Math.min(4, theta));
    }

    return theta;
  }

  /**
   * Calcula o erro padrão da estimativa de habilidade
   * @param responses Histórico de respostas
   * @param theta Estimativa atual de theta
   * @returns Erro padrão
   */
  private calculateStandardError(responses: ResponseRecord[], theta: number): number {
    let totalInformation = 0;

    for (const response of responses) {
      const question = this.questionBank.find(q => q.id === response.questionId);
      if (question) {
        totalInformation += this.calculateFisherInformation(question, theta);
      }
    }

    return totalInformation > 0 ? 1 / Math.sqrt(totalInformation) : 1.0;
  }

  /**
   * Obtém as mudanças recentes na estimativa de theta
   * @param session Sessão atual
   * @param numQuestions Número de questões recentes a considerar
   * @returns Array com mudanças na estimativa
   */
  private getRecentThetaChanges(session: AdaptiveSession, numQuestions: number): number[] {
    const responses = session.questionsAnswered.slice(-numQuestions);
    const changes: number[] = [];
    
    let currentTheta = session.currentTheta;
    for (let i = responses.length - 1; i > 0; i--) {
      const previousResponses = responses.slice(0, i);
      const previousTheta = this.estimateAbilityMLE(previousResponses);
      changes.push(currentTheta - previousTheta);
      currentTheta = previousTheta;
    }
    
    return changes;
  }

  /**
   * Finaliza uma sessão de avaliação
   * @param sessionId ID da sessão
   * @returns Resultado final da avaliação
   */
  completeSession(sessionId: string): StudentAbility | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    session.isComplete = true;
    
    // Atualizar registro permanente da habilidade do estudante
    this.studentAbilities.set(session.studentId, session.finalAbility);
    
    // Limpar sessão ativa
    this.activeSessions.delete(sessionId);
    
    return session.finalAbility;
  }

  /**
   * Obtém estatísticas da sessão para análise
   * @param sessionId ID da sessão
   * @returns Estatísticas detalhadas
   */
  getSessionStatistics(sessionId: string): {
    questionsAnswered: number;
    averageTimePerQuestion: number;
    difficultyProgression: number[];
    abilityProgression: number[];
    finalPrecision: number;
    isComplete: boolean;
  } | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    const responses = session.questionsAnswered;
    const averageTime = responses.length > 0 ? 
      responses.reduce((sum, r) => sum + r.timeSpent, 0) / responses.length : 0;
    
    const difficultyProgression = responses.map(r => r.difficulty);
    
    // Simular progressão da habilidade recalculando a cada resposta
    const abilityProgression: number[] = [];
    for (let i = 1; i <= responses.length; i++) {
      const partialResponses = responses.slice(0, i);
      abilityProgression.push(this.estimateAbilityMLE(partialResponses));
    }

    return {
      questionsAnswered: responses.length,
      averageTimePerQuestion: averageTime,
      difficultyProgression,
      abilityProgression,
      finalPrecision: session.finalAbility.standardError,
      isComplete: session.isComplete
    };
  }

  /**
   * Adiciona questões ao banco de questões
   * @param questions Array de questões a adicionar
   */
  addQuestions(questions: QuestionItem[]): void {
    this.questionBank.push(...questions);
  }

  /**
   * Obtém a habilidade atual de um estudante
   * @param studentId ID do estudante
   * @returns Habilidade do estudante ou null se não encontrado
   */
  getStudentAbility(studentId: string): StudentAbility | null {
    return this.studentAbilities.get(studentId) ?? null;
  }

  /**
   * Valida a qualidade do banco de questões
   * @returns Relatório de validação
   */
  validateQuestionBank(): {
    totalQuestions: number;
    difficultyRange: [number, number];
    discriminationRange: [number, number];
    categoryCoverage: Record<string, number>;
    qualityIssues: string[];
  } {
    const issues: string[] = [];
    const difficulties = this.questionBank.map(q => q.difficulty);
    const discriminations = this.questionBank.map(q => q.discrimination);
    
    const categoryCounts = this.questionBank.reduce((counts, q) => {
      counts[q.category] = (counts[q.category] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    // Verificar qualidade
    if (this.questionBank.length < 50) {
      issues.push('Banco de questões muito pequeno (< 50 questões)');
    }
    
    if (Math.max(...difficulties) - Math.min(...difficulties) < 3) {
      issues.push('Faixa de dificuldade muito restrita');
    }
    
    if (discriminations.some(d => d < 0.5)) {
      issues.push('Questões com discriminação muito baixa (< 0.5)');
    }

    return {
      totalQuestions: this.questionBank.length,
      difficultyRange: [Math.min(...difficulties), Math.max(...difficulties)],
      discriminationRange: [Math.min(...discriminations), Math.max(...discriminations)],
      categoryCoverage: categoryCounts,
      qualityIssues: issues
    };
  }
}

/**
 * Factory para criar questões do banco com parâmetros TRI estimados
 */
export class QuestionFactory {
  /**
   * Cria questões de avaliação emocional baseadas no modelo Circumplex
   * @returns Array de questões com parâmetros TRI
   */
  static createEmotionalAssessmentQuestions(): QuestionItem[] {
    return [
      // Questões de Valencia (Positiva/Negativa)
      {
        id: 'val_01',
        content: 'Como você se sente em relação ao conteúdo desta aula?',
        category: 'valencia',
        difficulty: -0.5, // Fácil de responder positivamente
        discrimination: 1.2,
        guessing: 0.1,
        scale: [1, 7],
        keywords: ['conteúdo', 'aula', 'sentimento']
      },
      {
        id: 'val_02',
        content: 'O quanto você gostou das atividades realizadas?',
        category: 'valencia',
        difficulty: 0.0,
        discrimination: 1.5,
        guessing: 0.15,
        scale: [1, 5],
        keywords: ['atividades', 'gostar', 'realização']
      },
      {
        id: 'val_03',
        content: 'Você considera esta aula interessante?',
        category: 'valencia',
        difficulty: 0.3,
        discrimination: 1.8,
        guessing: 0.1,
        scale: [1, 10],
        keywords: ['interessante', 'aula', 'consideração']
      },
      
      // Questões de Ativação (Alta/Baixa)
      {
        id: 'ativ_01',
        content: 'Quão energizado você se sente durante a aula?',
        category: 'ativacao',
        difficulty: 0.2,
        discrimination: 1.4,
        guessing: 0.12,
        scale: [1, 7],
        keywords: ['energia', 'energizado', 'aula']
      },
      {
        id: 'ativ_02',
        content: 'Você se sente alerta e focado nas atividades?',
        category: 'ativacao',
        difficulty: -0.2,
        discrimination: 1.6,
        guessing: 0.08,
        scale: [1, 5],
        keywords: ['alerta', 'focado', 'atividades']
      },
      {
        id: 'ativ_03',
        content: 'O ritmo da aula te mantém engajado?',
        category: 'ativacao',
        difficulty: 0.5,
        discrimination: 1.3,
        guessing: 0.15,
        scale: [1, 10],
        keywords: ['ritmo', 'engajado', 'aula']
      },
      
      // Questões de Concentração
      {
        id: 'conc_01',
        content: 'Você consegue manter a atenção durante toda a aula?',
        category: 'concentracao',
        difficulty: 0.8,
        discrimination: 2.0,
        guessing: 0.05,
        scale: [1, 7],
        keywords: ['atenção', 'manter', 'aula']
      },
      {
        id: 'conc_02',
        content: 'Quantas vezes sua mente "viajou" durante a explicação?',
        category: 'concentracao',
        difficulty: -0.3,
        discrimination: 1.1,
        guessing: 0.2,
        scale: [0, 10],
        keywords: ['mente', 'viajou', 'explicação']
      },
      
      // Questões de Motivação
      {
        id: 'motiv_01',
        content: 'Você se sente motivado a participar das atividades?',
        category: 'motivacao',
        difficulty: 0.1,
        discrimination: 1.7,
        guessing: 0.1,
        scale: [1, 5],
        keywords: ['motivado', 'participar', 'atividades']
      },
      {
        id: 'motiv_02',
        content: 'Quão importante você considera o tema da aula?',
        category: 'motivacao',
        difficulty: -0.4,
        discrimination: 1.3,
        guessing: 0.12,
        scale: [1, 10],
        keywords: ['importante', 'tema', 'aula']
      }
    ];
  }
}

// Exportar instância padrão do engine
export const defaultAdaptiveEngine = new AdaptiveAssessmentEngine(
  QuestionFactory.createEmotionalAssessmentQuestions()
);
