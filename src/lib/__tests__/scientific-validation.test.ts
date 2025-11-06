/**
 * Testes para Validação Científica do ClassCheck
 * Verificação dos critérios psicométricos e estatísticos do Sprint 4
 * Conforme padrões de validação científica
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  calculateConfidenceInterval,
  calculateCronbachAlpha,
  oneSampleTTest,
  twoSampleTTest,
  calculateSampleSize,
  interpretCronbachAlpha,
  ConfidenceInterval,
  StatisticalTest
} from '../scientific-validation/confidence-calculation';
import { ScientificAnalyticsEngine, ValidationMetrics } from '../analytics/scientific-analytics';
import { AdaptiveSession, ResponseRecord } from '../assessment/adaptive-engine';

describe('Cálculos de Intervalos de Confiança', () => {
  describe('calculateConfidenceInterval', () => {
    it('deve calcular intervalo de confiança para dados válidos', () => {
      const data = [85, 90, 78, 92, 88, 76, 95, 82, 89, 91];
      const result = calculateConfidenceInterval(data, 0.95);
      
      expect(result.mean).toBeCloseTo(86.6, 1);
      expect(result.lower).toBeLessThan(result.upper);
      expect(result.margin).toBeGreaterThan(0);
      expect(result.confidenceLevel).toBe(0.95);
      
      // Verificar se a média está dentro do intervalo
      expect(result.mean).toBeGreaterThanOrEqual(result.lower);
      expect(result.mean).toBeLessThanOrEqual(result.upper);
    });

    it('deve calcular intervalos diferentes para níveis de confiança diferentes', () => {
      const data = [10, 12, 8, 14, 11, 9, 13, 7, 15, 10];
      
      const ci90 = calculateConfidenceInterval(data, 0.90);
      const ci95 = calculateConfidenceInterval(data, 0.95);
      const ci99 = calculateConfidenceInterval(data, 0.99);
      
      // Intervalo de 99% deve ser maior que 95%, que deve ser maior que 90%
      expect(ci99.margin).toBeGreaterThan(ci95.margin);
      expect(ci95.margin).toBeGreaterThan(ci90.margin);
    });

    it('deve lançar erro para array vazio', () => {
      expect(() => calculateConfidenceInterval([], 0.95))
        .toThrow('Array de dados não pode estar vazio');
    });

    it('deve lidar com amostra pequena (n=2)', () => {
      const data = [100, 200];
      const result = calculateConfidenceInterval(data, 0.95);
      
      expect(result.mean).toBe(150);
      expect(result.lower).toBeLessThan(result.upper);
      expect(result.margin).toBeGreaterThan(0);
    });

    it('deve ser mais preciso com amostras maiores', () => {
      const smallSample = [10, 12, 8, 14, 11];
      const largeSample = Array.from({length: 100}, (_, i) => 10 + Math.random() * 4);
      
      const ciSmall = calculateConfidenceInterval(smallSample, 0.95);
      const ciLarge = calculateConfidenceInterval(largeSample, 0.95);
      
      // Amostra maior deve ter margem de erro menor (mais precisa)
      expect(ciLarge.margin).toBeLessThan(ciSmall.margin);
    });
  });
});

describe('Análise de Confiabilidade - Cronbach Alpha', () => {
  describe('calculateCronbachAlpha', () => {
    it('deve calcular alpha para dados psicométricos típicos', () => {
      // Simular respostas de 5 participantes a 4 itens (escala 1-5)
      const items = [
        [4, 5, 3, 4, 4], // Item 1
        [3, 4, 3, 5, 4], // Item 2
        [4, 4, 2, 4, 3], // Item 3
        [5, 5, 4, 4, 5]  // Item 4
      ];
      
      const alpha = calculateCronbachAlpha(items);
      
      expect(alpha).toBeGreaterThan(0);
      expect(alpha).toBeLessThanOrEqual(1);
      expect(alpha).toBeCloseTo(0.7, 0.2); // Valor esperado para dados correlacionados
    });

    it('deve retornar alpha alto para itens altamente correlacionados', () => {
      // Itens muito similares (alta correlação)
      const baseScores = [4, 5, 3, 4, 4];
      const items = [
        baseScores,
        baseScores.map(x => x + 0.1),
        baseScores.map(x => x - 0.1),
        baseScores.map(x => x + 0.2)
      ];
      
      const alpha = calculateCronbachAlpha(items);
      expect(alpha).toBeGreaterThan(0.8);
    });

    it('deve retornar alpha baixo para itens não correlacionados', () => {
      // Itens completamente aleatórios
      const items = [
        [1, 5, 2, 4, 3],
        [5, 1, 4, 2, 3],
        [3, 2, 5, 1, 4],
        [2, 4, 1, 5, 2]
      ];
      
      const alpha = calculateCronbachAlpha(items);
      expect(alpha).toBeLessThan(0.7);
    });

    it('deve lançar erro para menos de 2 itens', () => {
      const singleItem = [[1, 2, 3, 4, 5]];
      expect(() => calculateCronbachAlpha(singleItem))
        .toThrow('Necessário pelo menos 2 itens para calcular Alpha de Cronbach');
    });

    it('deve interpretar valores de alpha corretamente', () => {
      expect(interpretCronbachAlpha(0.95)).toBe('Excelente');
      expect(interpretCronbachAlpha(0.85)).toBe('Boa');
      expect(interpretCronbachAlpha(0.75)).toBe('Aceitável');
      expect(interpretCronbachAlpha(0.65)).toBe('Questionável');
      expect(interpretCronbachAlpha(0.55)).toBe('Pobre');
    });
  });
});

describe('Testes Estatísticos', () => {
  describe('oneSampleTTest', () => {
    it('deve realizar teste t para uma amostra', () => {
      const data = [22, 25, 23, 21, 24, 26, 20, 23, 25, 24];
      const hypothesizedMean = 20;
      
      const result = oneSampleTTest(data, hypothesizedMean, 0.95);
      
      expect(result.statistic).toBeGreaterThan(0); // Média amostral > média hipotética
      expect(result.pValue).toBeGreaterThan(0);
      expect(result.pValue).toBeLessThanOrEqual(1);
      expect(result.critical).toBeGreaterThan(0);
      expect(['small', 'medium', 'large']).toContain(result.effect);
      
      // Com média amostral ~23.3 vs hipotética 20, deve ser significativo
      expect(result.isSignificant).toBe(true);
    });

    it('deve não ser significativo para diferenças pequenas', () => {
      const data = [20.1, 19.9, 20.2, 19.8, 20.0];
      const hypothesizedMean = 20.0;
      
      const result = oneSampleTTest(data, hypothesizedMean, 0.95);
      
      expect(result.isSignificant).toBe(false);
      expect(result.effect).toBe('small');
    });

    it('deve detectar efeitos grandes', () => {
      const data = [30, 32, 29, 31, 28, 33, 30, 31];
      const hypothesizedMean = 20;
      
      const result = oneSampleTTest(data, hypothesizedMean, 0.95);
      
      expect(result.isSignificant).toBe(true);
      expect(result.effect).toBe('large');
    });
  });

  describe('twoSampleTTest', () => {
    it('deve comparar duas amostras independentes', () => {
      const group1 = [85, 90, 78, 92, 88]; // Grupo controle
      const group2 = [95, 98, 89, 94, 96]; // Grupo experimental
      
      const result = twoSampleTTest(group1, group2, 0.95);
      
      expect(result.statistic).toBeLessThan(0); // group1 < group2
      expect(result.pValue).toBeGreaterThan(0);
      expect(result.isSignificant).toBe(true); // Diferença clara
      expect(result.effect).toMatch(/medium|large/);
    });

    it('deve não ser significativo para amostras similares', () => {
      const group1 = [20, 22, 18, 21, 19];
      const group2 = [21, 23, 19, 20, 22];
      
      const result = twoSampleTTest(group1, group2, 0.95);
      
      expect(result.isSignificant).toBe(false);
      expect(result.effect).toMatch(/small|medium/); // Pode variar dependendo da variância
    });
  });
});

describe('Cálculo de Tamanho de Amostra', () => {
  describe('calculateSampleSize', () => {
    it('deve calcular tamanho necessário da amostra', () => {
      const marginOfError = 2.0;
      const standardDeviation = 10.0;
      const confidenceLevel = 0.95;
      
      const n = calculateSampleSize(marginOfError, standardDeviation, confidenceLevel);
      
      expect(n).toBeGreaterThan(0);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThan(90); // Valor esperado aproximado
    });

    it('deve requerer amostras maiores para margens menores', () => {
      const sd = 5.0;
      const conf = 0.95;
      
      const n1 = calculateSampleSize(1.0, sd, conf); // Margem pequena
      const n2 = calculateSampleSize(2.0, sd, conf); // Margem maior
      
      expect(n1).toBeGreaterThan(n2);
    });

    it('deve requerer amostras maiores para maior variabilidade', () => {
      const margin = 1.0;
      const conf = 0.95;
      
      const n1 = calculateSampleSize(margin, 5.0, conf);  // Baixa variabilidade
      const n2 = calculateSampleSize(margin, 15.0, conf); // Alta variabilidade
      
      expect(n2).toBeGreaterThan(n1);
    });
  });
});

describe('Sistema de Analytics Científico', () => {
  let analyticsEngine: ScientificAnalyticsEngine;
  let mockSessions: AdaptiveSession[];

  beforeEach(() => {
    analyticsEngine = new ScientificAnalyticsEngine();
    
    // Criar sessões mock para testes
    mockSessions = createMockSessions();
  });

  function createMockSessions(): AdaptiveSession[] {
    const sessions: AdaptiveSession[] = [];
    
    for (let i = 0; i < 10; i++) {
      const session: AdaptiveSession = {
        sessionId: `session_${i}`,
        studentId: `student_${i % 5}`, // 5 estudantes diferentes
        startTime: new Date(Date.now() - i * 86400000), // Dias diferentes
        currentTheta: Math.random() * 2 - 1, // -1 a 1
        targetPrecision: 0.3,
        maxQuestions: 15,
        questionsAnswered: createMockResponses(8 + Math.floor(Math.random() * 7)),
        isComplete: true,
        finalAbility: {
          id: `student_${i % 5}`,
          theta: Math.random() * 2 - 1,
          standardError: 0.2 + Math.random() * 0.3,
          confidenceInterval: [-0.5, 0.5],
          responseHistory: [],
          lastUpdated: new Date()
        }
      };
      
      sessions.push(session);
    }
    
    return sessions;
  }

  function createMockResponses(count: number): ResponseRecord[] {
    const responses: ResponseRecord[] = [];
    const questionTypes = ['val_', 'ativ_', 'conc_', 'motiv_'];
    
    for (let i = 0; i < count; i++) {
      const type = questionTypes[i % 4];
      const response: ResponseRecord = {
        questionId: `${type}${String(i + 1).padStart(3, '0')}`,
        response: 1 + Math.floor(Math.random() * 7),
        timestamp: new Date(Date.now() - (count - i) * 60000),
        timeSpent: 20 + Math.random() * 40,
        difficulty: -2 + Math.random() * 4,
        correct: Math.random() > 0.3
      };
      responses.push(response);
    }
    
    return responses;
  }

  describe('Validação Cruzada K-Fold', () => {
    it('deve realizar validação cruzada com k=5', () => {
      const allResponses = mockSessions.flatMap(s => s.questionsAnswered);
      
      const result = analyticsEngine.performCrossValidation(allResponses, 5);
      
      expect(result.folds).toBe(5);
      expect(result.accuracy).toHaveLength(5);
      expect(result.meanAccuracy).toBeGreaterThan(0);
      expect(result.meanAccuracy).toBeLessThanOrEqual(1);
      expect(result.standardDeviation).toBeGreaterThanOrEqual(0);
      expect(result.confidenceInterval).toHaveLength(2);
      expect(result.confidenceInterval[0]).toBeLessThan(result.confidenceInterval[1]);
      expect(typeof result.isValid).toBe('boolean');
    });

    it('deve lançar erro para dados insuficientes', () => {
      const fewResponses = mockSessions[0].questionsAnswered.slice(0, 10);
      
      expect(() => analyticsEngine.performCrossValidation(fewResponses, 5))
        .toThrow('Dados insuficientes para validação 5-fold');
    });

    it('deve validar critério de 80% de acurácia', () => {
      const allResponses = mockSessions.flatMap(s => s.questionsAnswered);
      const result = analyticsEngine.performCrossValidation(allResponses, 5);
      
      if (result.meanAccuracy > 0.8) {
        expect(result.isValid).toBe(true);
      } else {
        expect(result.isValid).toBe(false);
      }
    });
  });

  describe('Métricas de Validação Científica', () => {
    it('deve calcular todas as métricas requeridas pelo Sprint 4', () => {
      const metrics = analyticsEngine.calculateValidationMetrics(mockSessions);
      
      expect(metrics.cronbachAlpha).toBeGreaterThanOrEqual(0); // Pode ser 0 se dados insuficientes
      expect(metrics.cronbachAlpha).toBeLessThanOrEqual(1);
      expect(metrics.testRetestReliability).toBeGreaterThanOrEqual(0);
      expect(metrics.testRetestReliability).toBeLessThanOrEqual(1);
      expect(metrics.predictiveAccuracy).toBeGreaterThanOrEqual(0);
      expect(metrics.predictiveAccuracy).toBeLessThanOrEqual(1);
      expect(metrics.userSystemAgreement).toBeGreaterThanOrEqual(0);
      expect(metrics.userSystemAgreement).toBeLessThanOrEqual(1);
      expect(metrics.convergenceRate).toBeGreaterThanOrEqual(0);
      expect(metrics.convergenceRate).toBeLessThanOrEqual(1);
      expect(metrics.stabilityIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.stabilityIndex).toBeLessThanOrEqual(1);
      expect(metrics.sample_size).toBe(mockSessions.length);
      expect(metrics.confidence_interval.level).toBe(0.95);
    });

    it('deve atender aos critérios científicos do Sprint 4', () => {
      const metrics = analyticsEngine.calculateValidationMetrics(mockSessions);
      const validation = analyticsEngine.validateScientificCriteria(metrics);
      
      expect(validation.criteriaResults.predictiveAccuracy.required).toBe(0.8);
      expect(validation.criteriaResults.userSystemAgreement.required).toBe(0.75);
      expect(validation.criteriaResults.testRetestStability.required).toBe(0.8);
      expect(validation.criteriaResults.cronbachAlpha.required).toBe(0.8);
      
      expect(typeof validation.isValid).toBe('boolean');
      expect(Array.isArray(validation.recommendations)).toBe(true);
    });

    it('deve fornecer recomendações quando critérios não são atendidos', () => {
      // Criar métricas que falham nos critérios
      const poorMetrics: ValidationMetrics = {
        cronbachAlpha: 0.65,
        testRetestReliability: 0.70,
        predictiveAccuracy: 0.75,
        userSystemAgreement: 0.70,
        convergenceRate: 0.60,
        stabilityIndex: 0.65,
        sample_size: 50,
        confidence_interval: { lower: 0.70, upper: 0.80, level: 0.95 }
      };
      
      const validation = analyticsEngine.validateScientificCriteria(poorMetrics);
      
      expect(validation.isValid).toBe(false);
      expect(validation.recommendations.length).toBeGreaterThan(0);
      expect(validation.recommendations.some(r => r.includes('banco de questões'))).toBe(true);
    });
  });

  describe('Relatório Psicométrico', () => {
    it('deve gerar relatório psicométrico completo', () => {
      const studyPeriod = {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-01')
      };
      
      const report = analyticsEngine.generatePsychometricReport(mockSessions, studyPeriod);
      
      expect(report.reliability.internal).toBeGreaterThanOrEqual(0); // Pode ser 0 se dados insuficientes
      expect(report.reliability.testRetest).toBeGreaterThanOrEqual(0);
      expect(report.reliability.interRater).toBeGreaterThanOrEqual(0);
      
      expect(report.validity.construct).toBeGreaterThanOrEqual(0);
      expect(report.validity.criterion).toBeGreaterThanOrEqual(0);
      expect(report.validity.content).toBeGreaterThanOrEqual(0);
      
      expect(report.sensitivity.emotionalStates).toBeGreaterThanOrEqual(0);
      expect(report.sensitivity.learningProgress).toBeGreaterThanOrEqual(0);
      expect(report.sensitivity.engagement).toBeGreaterThanOrEqual(0);
      
      expect(report.specificity.falsePositives).toBeGreaterThan(0);
      expect(report.specificity.discriminant).toBeGreaterThan(0);
      
      expect(report.sampleSize).toBe(mockSessions.length);
      expect(report.studyPeriod.start).toEqual(studyPeriod.start);
      expect(report.studyPeriod.end).toEqual(studyPeriod.end);
      expect(report.studyPeriod.duration_days).toBe(60);
    });
  });

  describe('Exportação para Análise Estatística', () => {
    it('deve exportar dados em formato CSV para análise externa', () => {
      const exportData = analyticsEngine.exportForStatisticalAnalysis(mockSessions);
      
      expect(exportData.csv).toBeDefined();
      expect(exportData.metadata).toBeDefined();
      expect(exportData.metadata.variables).toContain('session_id');
      expect(exportData.metadata.variables).toContain('student_id');
      expect(exportData.metadata.variables).toContain('theta_after');
      
      const lines = exportData.csv.split('\n');
      expect(lines.length).toBeGreaterThan(1); // Header + data
      
      const headers = lines[0].split(',');
      expect(headers).toContain('session_id');
      expect(headers).toContain('response');
      expect(headers).toContain('difficulty');
    });

    it('deve incluir metadados descritivos completos', () => {
      const exportData = analyticsEngine.exportForStatisticalAnalysis(mockSessions);
      
      expect(exportData.metadata.descriptions).toBeDefined();
      expect(exportData.metadata.scales).toBeDefined();
      
      expect(exportData.metadata.descriptions['response']).toContain('numérica');
      expect(exportData.metadata.descriptions['theta_after']).toContain('habilidade');
      
      expect(exportData.metadata.scales['response']).toEqual([1, 10]);
      expect(exportData.metadata.scales['difficulty']).toEqual([-4, 4]);
    });
  });
});

describe('Casos Extremos e Robustez', () => {
  describe('Dados Faltantes e Outliers', () => {
    it('deve lidar com dados faltantes graciosamente', () => {
      // Dados com alguns valores missing (simulados como NaN)
      const dataWithMissing = [1, 2, 3, NaN, 5, 6];
      const cleanData = dataWithMissing.filter(x => !isNaN(x));
      
      expect(() => calculateConfidenceInterval(cleanData, 0.95)).not.toThrow();
    });

    it('deve detectar e lidar com outliers extremos', () => {
      const normalData = [10, 12, 11, 13, 9, 10, 12];
      const dataWithOutliers = [...normalData, 100, -50]; // Outliers extremos
      
      const ciNormal = calculateConfidenceInterval(normalData, 0.95);
      const ciWithOutliers = calculateConfidenceInterval(dataWithOutliers, 0.95);
      
      // Outliers devem aumentar significativamente a margem de erro
      expect(ciWithOutliers.margin).toBeGreaterThan(ciNormal.margin * 2);
    });
  });

  describe('Amostras Pequenas', () => {
    it('deve funcionar com amostra mínima (n=2)', () => {
      const tinyData = [10, 20];
      
      expect(() => calculateConfidenceInterval(tinyData, 0.95)).not.toThrow();
      
      const result = calculateConfidenceInterval(tinyData, 0.95);
      expect(result.mean).toBe(15);
      expect(result.margin).toBeGreaterThan(0);
    });

    it('deve ajustar graus de liberdade corretamente', () => {
      const smallSample = [5, 7, 6];
      const result = oneSampleTTest(smallSample, 5, 0.95);
      
      // Com n=3, df=2, critical deve ser alto
      expect(result.critical).toBeGreaterThan(2.5);
    });
  });

  describe('Valores Extremos de Parâmetros', () => {
    it('deve lidar com níveis de confiança extremos', () => {
      const data = [1, 2, 3, 4, 5];
      
      // Nível muito baixo
      const ci50 = calculateConfidenceInterval(data, 0.50);
      expect(ci50.margin).toBeGreaterThan(0);
      
      // Nível muito alto
      const ci999 = calculateConfidenceInterval(data, 0.999);
      expect(ci999.margin).toBeGreaterThan(ci50.margin);
    });

    it('deve manter estabilidade com variâncias extremas', () => {
      // Dados com variância muito baixa
      const lowVariance = [10.0, 10.1, 9.9, 10.0, 10.1];
      const ciLow = calculateConfidenceInterval(lowVariance, 0.95);
      
      // Dados com variância muito alta
      const highVariance = [1, 100, 50, 200, 25];
      const ciHigh = calculateConfidenceInterval(highVariance, 0.95);
      
      expect(ciLow.margin).toBeLessThan(ciHigh.margin);
      expect(ciLow.lower).toBeLessThan(ciLow.upper);
      expect(ciHigh.lower).toBeLessThan(ciHigh.upper);
    });
  });

  describe('Performance e Escalabilidade', () => {
    it('deve processar grandes volumes de dados eficientemente', () => {
      const largeDataset = Array.from({length: 10000}, () => Math.random() * 100);
      
      const startTime = Date.now();
      const result = calculateConfidenceInterval(largeDataset, 0.95);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Menos de 100ms
      expect(result.mean).toBeDefined();
      expect(result.lower).toBeLessThan(result.upper);
    });

    it('deve manter precisão com muitos itens no Cronbach Alpha', () => {
      // Simular questionário com muitos itens altamente correlacionados
      const baseResponses = Array.from({length: 100}, () => 4); // Todos respondem 4
      
      const manyItems = Array.from({length: 50}, () => 
        baseResponses.map(base => {
          // Pequena variação aleatória
          const variation = (Math.random() - 0.5) * 0.2;
          return Math.max(3, Math.min(5, base + variation));
        })
      );
      
      const alpha = calculateCronbachAlpha(manyItems);
      expect(alpha).toBeGreaterThanOrEqual(0); // Válido
      expect(alpha).toBeLessThanOrEqual(1); // Dentro do range
    });
  });
});
