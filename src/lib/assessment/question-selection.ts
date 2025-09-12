/**
 * Sistema de Seleção Inteligente de Questões
 * Implementa algoritmos de otimização para seleção de questões adaptativas
 * Baseado em Information Theory e critérios psicométricos
 */

import { QuestionItem, StudentAbility, ResponseRecord } from './adaptive-engine';

export interface SelectionCriteria {
  informationWeight: number; // Peso da informação de Fisher (0-1)
  diversityWeight: number; // Peso da diversidade de categorias (0-1)
  difficultyWeight: number; // Peso da adequação de dificuldade (0-1)
  timeWeight: number; // Peso do tempo estimado (0-1)
  exposureWeight: number; // Peso do controle de exposição (0-1)
}

export interface QuestionExposure {
  questionId: string;
  timesSelected: number;
  averagePerformance: number;
  lastUsed: Date;
  studentIds: Set<string>;
}

export interface SelectionStrategy {
  name: string;
  description: string;
  criteria: SelectionCriteria;
  minQuestions: number;
  maxQuestions: number;
}

/**
 * Estratégias pré-definidas de seleção
 */
export const SELECTION_STRATEGIES: Record<string, SelectionStrategy> = {
  MAXIMUM_INFORMATION: {
    name: 'Máxima Informação',
    description: 'Prioriza questões com maior informação de Fisher',
    criteria: {
      informationWeight: 0.8,
      diversityWeight: 0.1,
      difficultyWeight: 0.05,
      timeWeight: 0.03,
      exposureWeight: 0.02
    },
    minQuestions: 5,
    maxQuestions: 15
  },
  
  BALANCED: {
    name: 'Balanceado',
    description: 'Equilibra informação, diversidade e tempo',
    criteria: {
      informationWeight: 0.4,
      diversityWeight: 0.3,
      difficultyWeight: 0.15,
      timeWeight: 0.1,
      exposureWeight: 0.05
    },
    minQuestions: 8,
    maxQuestions: 20
  },
  
  DIVERSITY_FOCUSED: {
    name: 'Foco em Diversidade',
    description: 'Maximiza cobertura de diferentes categorias',
    criteria: {
      informationWeight: 0.2,
      diversityWeight: 0.5,
      difficultyWeight: 0.15,
      timeWeight: 0.1,
      exposureWeight: 0.05
    },
    minQuestions: 10,
    maxQuestions: 25
  },
  
  QUICK_ASSESSMENT: {
    name: 'Avaliação Rápida',
    description: 'Minimiza tempo mantendo precisão',
    criteria: {
      informationWeight: 0.5,
      diversityWeight: 0.1,
      difficultyWeight: 0.1,
      timeWeight: 0.25,
      exposureWeight: 0.05
    },
    minQuestions: 3,
    maxQuestions: 8
  },
  
  COMPREHENSIVE: {
    name: 'Abrangente',
    description: 'Cobertura completa com alta precisão',
    criteria: {
      informationWeight: 0.35,
      diversityWeight: 0.25,
      difficultyWeight: 0.2,
      timeWeight: 0.05,
      exposureWeight: 0.15
    },
    minQuestions: 15,
    maxQuestions: 30
  }
};

/**
 * Sistema de Seleção Inteligente de Questões
 */
export class QuestionSelectionEngine {
  private exposureData: Map<string, QuestionExposure>;
  private categoryTargets: Map<string, number>;
  private timeEstimates: Map<string, number>;
  
  constructor() {
    this.exposureData = new Map();
    this.categoryTargets = new Map([
      ['valencia', 0.3],
      ['ativacao', 0.3],
      ['concentracao', 0.2],
      ['motivacao', 0.2]
    ]);
    this.timeEstimates = new Map();
  }

  /**
   * Seleciona a próxima questão baseada na estratégia escolhida
   * @param availableQuestions Questões disponíveis
   * @param currentAbility Habilidade atual do estudante
   * @param answeredQuestions Questões já respondidas
   * @param strategy Estratégia de seleção
   * @returns Questão selecionada e score de adequação
   */
  selectQuestion(
    availableQuestions: QuestionItem[],
    currentAbility: StudentAbility,
    answeredQuestions: ResponseRecord[],
    strategy: SelectionStrategy = SELECTION_STRATEGIES.BALANCED
  ): { question: QuestionItem; score: number; reasoning: string } | null {
    
    if (availableQuestions.length === 0) {
      return null;
    }

    // Calcular scores para cada questão
    const questionScores = availableQuestions.map(question => {
      const score = this.calculateQuestionScore(
        question,
        currentAbility,
        answeredQuestions,
        strategy.criteria
      );
      
      return {
        question,
        score: score.totalScore,
        components: score.components,
        reasoning: this.generateReasoning(question, score.components)
      };
    });

    // Ordenar por score decrescente
    questionScores.sort((a, b) => b.score - a.score);
    
    const selected = questionScores[0];
    
    // Atualizar dados de exposição
    this.updateExposureData(selected.question.id, currentAbility.id);
    
    return {
      question: selected.question,
      score: selected.score,
      reasoning: selected.reasoning
    };
  }

  /**
   * Calcula o score composto de uma questão
   * @param question Questão a avaliar
   * @param ability Habilidade atual
   * @param answered Questões respondidas
   * @param criteria Critérios de seleção
   * @returns Score detalhado
   */
  private calculateQuestionScore(
    question: QuestionItem,
    ability: StudentAbility,
    answered: ResponseRecord[],
    criteria: SelectionCriteria
  ): {
    totalScore: number;
    components: {
      information: number;
      diversity: number;
      difficulty: number;
      time: number;
      exposure: number;
    };
  } {
    const components = {
      information: this.calculateInformationScore(question, ability.theta),
      diversity: this.calculateDiversityScore(question, answered),
      difficulty: this.calculateDifficultyScore(question, ability.theta),
      time: this.calculateTimeScore(question),
      exposure: this.calculateExposureScore(question.id)
    };

    const totalScore = 
      components.information * criteria.informationWeight +
      components.diversity * criteria.diversityWeight +
      components.difficulty * criteria.difficultyWeight +
      components.time * criteria.timeWeight +
      components.exposure * criteria.exposureWeight;

    return { totalScore, components };
  }

  /**
   * Calcula score de informação baseado na informação de Fisher
   * @param question Questão
   * @param theta Habilidade estimada
   * @returns Score normalizado 0-1
   */
  private calculateInformationScore(question: QuestionItem, theta: number): number {
    const { discrimination: a, difficulty: b, guessing: c } = question;
    
    // Probabilidade de resposta correta (modelo 3PL)
    const probability = c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
    
    // Derivada da probabilidade
    const derivative = a * (1 - c) * Math.exp(-a * (theta - b)) / 
      Math.pow(1 + Math.exp(-a * (theta - b)), 2);
    
    // Informação de Fisher
    const information = Math.pow(derivative, 2) / (probability * (1 - probability));
    
    // Normalizar para 0-1 (informação máxima teórica ≈ a²/4)
    const maxInformation = Math.pow(a, 2) / 4;
    return Math.min(information / maxInformation, 1);
  }

  /**
   * Calcula score de diversidade baseado na cobertura de categorias
   * @param question Questão
   * @param answered Questões já respondidas
   * @returns Score normalizado 0-1
   */
  private calculateDiversityScore(question: QuestionItem, answered: ResponseRecord[]): number {
    const categoryCounts = answered.reduce((counts, response) => {
      // Assumir que temos acesso à categoria através do ID da questão
      const category = this.getCategoryFromQuestionId(response.questionId);
      if (category) {
        counts[category] = (counts[category] || 0) + 1;
      }
      return counts;
    }, {} as Record<string, number>);

    const totalAnswered = answered.length;
    const currentCategoryCount = categoryCounts[question.category] || 0;
    const currentProportion = totalAnswered > 0 ? currentCategoryCount / totalAnswered : 0;
    const targetProportion = this.categoryTargets.get(question.category) || 0.25;

    // Score maior se a categoria está sub-representada
    if (currentProportion < targetProportion) {
      return 1 - (currentProportion / targetProportion);
    } else {
      return Math.max(0, 1 - (currentProportion - targetProportion) / (1 - targetProportion));
    }
  }

  /**
   * Calcula score de adequação de dificuldade
   * @param question Questão
   * @param theta Habilidade estimada
   * @returns Score normalizado 0-1
   */
  private calculateDifficultyScore(question: QuestionItem, theta: number): number {
    // Diferença absoluta entre dificuldade da questão e habilidade do estudante
    const difference = Math.abs(question.difficulty - theta);
    
    // Score máximo quando a dificuldade é igual à habilidade
    // Score decresce conforme a diferença aumenta
    const maxDifference = 3; // Assumindo escala de -3 a +3 para theta
    return Math.max(0, 1 - (difference / maxDifference));
  }

  /**
   * Calcula score de tempo estimado
   * @param question Questão
   * @returns Score normalizado 0-1
   */
  private calculateTimeScore(question: QuestionItem): number {
    const estimatedTime = this.timeEstimates.get(question.id) || this.estimateQuestionTime(question);
    
    // Preferir questões com tempo médio (nem muito rápidas nem muito lentas)
    const optimalTime = 45; // segundos
    const maxTime = 120; // segundos
    
    if (estimatedTime <= optimalTime) {
      return estimatedTime / optimalTime;
    } else {
      return Math.max(0, 1 - (estimatedTime - optimalTime) / (maxTime - optimalTime));
    }
  }

  /**
   * Calcula score de controle de exposição
   * @param questionId ID da questão
   * @returns Score normalizado 0-1
   */
  private calculateExposureScore(questionId: string): number {
    const exposure = this.exposureData.get(questionId);
    if (!exposure) {
      return 1; // Nova questão, sem exposição
    }

    // Penalizar questões muito utilizadas
    const maxExposure = 50; // Máximo de usos esperado
    const exposureRatio = Math.min(exposure.timesSelected / maxExposure, 1);
    
    // Score decresce com o aumento da exposição
    return 1 - exposureRatio;
  }

  /**
   * Estima o tempo necessário para responder uma questão
   * @param question Questão
   * @returns Tempo estimado em segundos
   */
  private estimateQuestionTime(question: QuestionItem): number {
    // Fatores que influenciam o tempo:
    const baseTime = 30; // Tempo base em segundos
    const contentLength = question.content.length;
    const scaleRange = question.scale[1] - question.scale[0];
    const difficultyFactor = Math.abs(question.difficulty);
    
    // Tempo adicional baseado na complexidade
    const lengthTime = Math.floor(contentLength / 10) * 2; // 2s para cada 10 caracteres extras
    const scaleTime = scaleRange > 5 ? 5 : 0; // 5s extra para escalas grandes
    const difficultyTime = difficultyFactor * 3; // 3s por unidade de dificuldade
    
    const estimatedTime = baseTime + lengthTime + scaleTime + difficultyTime;
    
    // Armazenar estimativa
    this.timeEstimates.set(question.id, estimatedTime);
    
    return estimatedTime;
  }

  /**
   * Atualiza dados de exposição da questão
   * @param questionId ID da questão
   * @param studentId ID do estudante
   */
  private updateExposureData(questionId: string, studentId: string): void {
    const existing = this.exposureData.get(questionId);
    
    if (existing) {
      existing.timesSelected++;
      existing.lastUsed = new Date();
      existing.studentIds.add(studentId);
    } else {
      this.exposureData.set(questionId, {
        questionId,
        timesSelected: 1,
        averagePerformance: 0,
        lastUsed: new Date(),
        studentIds: new Set([studentId])
      });
    }
  }

  /**
   * Obtém categoria de uma questão pelo ID
   * @param questionId ID da questão
   * @returns Categoria da questão
   */
  private getCategoryFromQuestionId(questionId: string): string | null {
    // Extrair categoria do prefixo do ID
    if (questionId.startsWith('val_')) return 'valencia';
    if (questionId.startsWith('ativ_')) return 'ativacao';
    if (questionId.startsWith('conc_')) return 'concentracao';
    if (questionId.startsWith('motiv_')) return 'motivacao';
    return null;
  }

  /**
   * Gera explicação para a seleção da questão
   * @param question Questão selecionada
   * @param components Componentes do score
   * @returns Texto explicativo
   */
  private generateReasoning(
    question: QuestionItem, 
    components: { information: number; diversity: number; difficulty: number; time: number; exposure: number }
  ): string {
    const reasons: string[] = [];
    
    if (components.information > 0.7) {
      reasons.push('alta informatividade');
    }
    
    if (components.diversity > 0.6) {
      reasons.push('categoria sub-representada');
    }
    
    if (components.difficulty > 0.8) {
      reasons.push('dificuldade adequada ao nível do estudante');
    }
    
    if (components.time > 0.7) {
      reasons.push('tempo de resposta otimizado');
    }
    
    if (components.exposure > 0.8) {
      reasons.push('baixa exposição prévia');
    }

    const mainReason = reasons.length > 0 ? reasons[0] : 'balanceamento geral dos critérios';
    const additionalReasons = reasons.length > 1 ? ` (também: ${reasons.slice(1).join(', ')})` : '';
    
    return `Selecionada por ${mainReason}${additionalReasons}`;
  }

  /**
   * Seleciona múltiplas questões para uma sessão completa
   * @param availableQuestions Questões disponíveis
   * @param ability Habilidade inicial do estudante
   * @param strategy Estratégia de seleção
   * @param maxQuestions Máximo de questões
   * @returns Array de questões selecionadas com ordem otimizada
   */
  selectQuestionSequence(
    availableQuestions: QuestionItem[],
    ability: StudentAbility,
    strategy: SelectionStrategy = SELECTION_STRATEGIES.BALANCED,
    maxQuestions: number = strategy.maxQuestions
  ): QuestionItem[] {
    const selectedQuestions: QuestionItem[] = [];
    const remaining = [...availableQuestions];
    let currentAbility = { ...ability };
    let answered: ResponseRecord[] = [];

    for (let i = 0; i < maxQuestions && remaining.length > 0; i++) {
      const selection = this.selectQuestion(remaining, currentAbility, answered, strategy);
      
      if (!selection) break;
      
      selectedQuestions.push(selection.question);
      
      // Remover questão selecionada das disponíveis
      const index = remaining.findIndex(q => q.id === selection.question.id);
      if (index >= 0) {
        remaining.splice(index, 1);
      }
      
      // Simular resposta média para próxima seleção
      const simulatedResponse: ResponseRecord = {
        questionId: selection.question.id,
        response: (selection.question.scale[0] + selection.question.scale[1]) / 2,
        timestamp: new Date(),
        timeSpent: this.timeEstimates.get(selection.question.id) || 45,
        difficulty: selection.question.difficulty,
        correct: true
      };
      
      answered.push(simulatedResponse);
      
      // Simular atualização da habilidade (aproximação simples)
      currentAbility.theta = currentAbility.theta * 0.9 + selection.question.difficulty * 0.1;
    }

    return selectedQuestions;
  }

  /**
   * Analisa a qualidade de uma sequência de questões
   * @param questions Sequência de questões
   * @returns Métricas de qualidade
   */
  analyzeQuestionSequence(questions: QuestionItem[]): {
    categoryDistribution: Record<string, number>;
    difficultyProgression: number[];
    informationCoverage: number;
    estimatedTotalTime: number;
    qualityScore: number;
  } {
    const categoryDistribution = questions.reduce((dist, q) => {
      dist[q.category] = (dist[q.category] || 0) + 1;
      return dist;
    }, {} as Record<string, number>);

    const difficultyProgression = questions.map(q => q.difficulty);
    
    const totalInformation = questions.reduce((sum, q) => {
      // Aproximar informação usando parâmetros da questão
      return sum + (q.discrimination || 1);
    }, 0);

    const estimatedTotalTime = questions.reduce((sum, q) => {
      return sum + (this.timeEstimates.get(q.id) || this.estimateQuestionTime(q));
    }, 0);

    // Calcular score de qualidade baseado em vários fatores
    const categoryBalance = this.calculateCategoryBalance(categoryDistribution, questions.length);
    const difficultyRange = Math.max(...difficultyProgression) - Math.min(...difficultyProgression);
    const timeEfficiency = estimatedTotalTime < 900 ? 1 : Math.max(0, 1 - (estimatedTotalTime - 900) / 600);
    
    const qualityScore = (categoryBalance + Math.min(difficultyRange / 3, 1) + timeEfficiency) / 3;

    return {
      categoryDistribution,
      difficultyProgression,
      informationCoverage: totalInformation,
      estimatedTotalTime,
      qualityScore
    };
  }

  /**
   * Calcula o balanceamento de categorias
   * @param distribution Distribuição atual
   * @param total Total de questões
   * @returns Score de balanceamento 0-1
   */
  private calculateCategoryBalance(distribution: Record<string, number>, total: number): number {
    let balance = 0;
    
    for (const [category, target] of this.categoryTargets.entries()) {
      const actual = (distribution[category] || 0) / total;
      const difference = Math.abs(actual - target);
      balance += Math.max(0, 1 - (difference / target));
    }
    
    return balance / this.categoryTargets.size;
  }

  /**
   * Obtém estatísticas de exposição do banco de questões
   * @returns Relatório de exposição
   */
  getExposureStatistics(): {
    totalQuestions: number;
    exposedQuestions: number;
    averageExposure: number;
    maxExposure: number;
    underutilized: string[];
    overutilized: string[];
  } {
    const exposures = Array.from(this.exposureData.values());
    const totalQuestions = this.exposureData.size;
    const exposures_values = exposures.map(e => e.timesSelected);
    
    const averageExposure = exposures_values.length > 0 ? 
      exposures_values.reduce((sum, count) => sum + count, 0) / exposures_values.length : 0;
    
    const maxExposure = exposures_values.length > 0 ? Math.max(...exposures_values) : 0;
    
    const underutilized = exposures
      .filter(e => e.timesSelected < averageExposure * 0.5)
      .map(e => e.questionId);
    
    const overutilized = exposures
      .filter(e => e.timesSelected > averageExposure * 2)
      .map(e => e.questionId);

    return {
      totalQuestions,
      exposedQuestions: exposures.length,
      averageExposure,
      maxExposure,
      underutilized,
      overutilized
    };
  }

  /**
   * Reseta dados de exposição (útil para novos períodos/turmas)
   */
  resetExposureData(): void {
    this.exposureData.clear();
  }

  /**
   * Define novos targets de categoria
   * @param targets Novos targets por categoria
   */
  setCategoryTargets(targets: Map<string, number>): void {
    this.categoryTargets = new Map(targets);
  }
}

// Instância padrão do engine de seleção
export const defaultSelectionEngine = new QuestionSelectionEngine();
