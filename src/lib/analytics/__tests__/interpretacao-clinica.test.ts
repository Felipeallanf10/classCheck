/**
 * Testes Unitários - Interpretação Clínica
 * 
 * Testes para funções de interpretação clínica (PHQ-9, GAD-7, WHO-5).
 */

import { describe, it, expect } from 'vitest';
import {
  interpretarPHQ9,
  interpretarGAD7,
  interpretarWHO5,
  NivelSeveridade
} from '../interpretacao-clinica';

// ==============================================
// TESTES - interpretarPHQ9 (Depressão)
// ==============================================

describe('interpretarPHQ9 - Patient Health Questionnaire', () => {
  describe('Classificação de níveis', () => {
    it('deve classificar score 0-4 como MINIMO', () => {
      const resultado = interpretarPHQ9(0);
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.MINIMO);
      expect(resultado.score).toBe(0);
      
      const resultado2 = interpretarPHQ9(4);
      expect(resultado2.nivelSeveridade).toBe(NivelSeveridade.MINIMO);
    });

    it('deve classificar score 5-9 como LEVE', () => {
      const resultado = interpretarPHQ9(5);
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.LEVE);
      
      const resultado2 = interpretarPHQ9(9);
      expect(resultado2.nivelSeveridade).toBe(NivelSeveridade.LEVE);
    });

    it('deve classificar score 10-14 como MODERADO', () => {
      const resultado = interpretarPHQ9(10);
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.MODERADO);
      
      const resultado2 = interpretarPHQ9(14);
      expect(resultado2.nivelSeveridade).toBe(NivelSeveridade.MODERADO);
    });

    it('deve classificar score 15-19 como MODERADAMENTE_GRAVE', () => {
      const resultado = interpretarPHQ9(15);
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.MODERADAMENTE_GRAVE);
      
      const resultado2 = interpretarPHQ9(19);
      expect(resultado2.nivelSeveridade).toBe(NivelSeveridade.MODERADAMENTE_GRAVE);
    });

    it('deve classificar score 20-27 como GRAVE', () => {
      const resultado = interpretarPHQ9(20);
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.GRAVE);
      
      const resultado2 = interpretarPHQ9(27);
      expect(resultado2.nivelSeveridade).toBe(NivelSeveridade.GRAVE);
    });
  });

  describe('Recomendações e alertas', () => {
    it('deve ter recomendacoes array para nivel MINIMO', () => {
      const resultado = interpretarPHQ9(2);
      expect(Array.isArray(resultado.recomendacoes)).toBe(true);
      expect(resultado.recomendacoes.length).toBeGreaterThan(0);
      expect(resultado.necessitaAlerta).toBe(false);
    });

    it('deve necessitar alerta para nivel MODERADO', () => {
      const resultado = interpretarPHQ9(12);
      expect(resultado.necessitaAlerta).toBe(true);
      expect(resultado.recomendacoes).toContain('Considerar avaliação com profissional de saúde mental');
    });

    it('deve necessitar alerta urgente para nivel GRAVE', () => {
      const resultado = interpretarPHQ9(25);
      expect(resultado.necessitaAlerta).toBe(true);
      expect(resultado.recomendacoes.some(r => r.includes('URGENTE'))).toBe(true);
    });
  });

  describe('Validação de estrutura', () => {
    it('deve retornar todos os campos obrigatórios', () => {
      const resultado = interpretarPHQ9(10);
      
      expect(resultado).toHaveProperty('escala');
      expect(resultado).toHaveProperty('score');
      expect(resultado).toHaveProperty('nivelSeveridade');
      expect(resultado).toHaveProperty('descricao');
      expect(resultado).toHaveProperty('recomendacoes');
      expect(resultado).toHaveProperty('necessitaAlerta');
      expect(resultado).toHaveProperty('cor');
      
      expect(resultado.escala).toBe('PHQ-9');
    });

    it('deve retornar cor apropriada para visualização', () => {
      const minimo = interpretarPHQ9(2);
      const grave = interpretarPHQ9(25);
      
      expect(minimo.cor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(grave.cor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(minimo.cor).not.toBe(grave.cor);
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com scores negativos como LEVE (fallback)', () => {
      const resultado = interpretarPHQ9(-5);
      // Implementação atual: scores negativos caem no else if <= 9
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.LEVE);
    });

    it('deve lidar com scores acima do máximo', () => {
      const resultado = interpretarPHQ9(100);
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.GRAVE);
    });

    it('deve lidar com valores decimais', () => {
      const resultado = interpretarPHQ9(12.7);
      expect(resultado.score).toBe(12.7);
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.MODERADO);
    });
  });
});

// ==============================================
// TESTES - interpretarGAD7 (Ansiedade)
// ==============================================

describe('interpretarGAD7 - Generalized Anxiety Disorder', () => {
  describe('Classificação de níveis', () => {
    it('deve classificar score 0-4 como MINIMO', () => {
      expect(interpretarGAD7(0).nivelSeveridade).toBe(NivelSeveridade.MINIMO);
      expect(interpretarGAD7(4).nivelSeveridade).toBe(NivelSeveridade.MINIMO);
    });

    it('deve classificar score 5-9 como LEVE', () => {
      expect(interpretarGAD7(5).nivelSeveridade).toBe(NivelSeveridade.LEVE);
      expect(interpretarGAD7(9).nivelSeveridade).toBe(NivelSeveridade.LEVE);
    });

    it('deve classificar score 10-14 como MODERADO', () => {
      expect(interpretarGAD7(10).nivelSeveridade).toBe(NivelSeveridade.MODERADO);
      expect(interpretarGAD7(14).nivelSeveridade).toBe(NivelSeveridade.MODERADO);
    });

    it('deve classificar score 15-21 como GRAVE', () => {
      expect(interpretarGAD7(15).nivelSeveridade).toBe(NivelSeveridade.GRAVE);
      expect(interpretarGAD7(21).nivelSeveridade).toBe(NivelSeveridade.GRAVE);
    });
  });

  describe('Recomendações específicas de ansiedade', () => {
    it('deve recomendar técnicas de relaxamento para LEVE', () => {
      const resultado = interpretarGAD7(7);
      expect(resultado.recomendacoes.some(r => 
        r.includes('relaxamento') || r.includes('respiração')
      )).toBe(true);
    });

    it('deve recomendar intervenção clínica para MODERADO', () => {
      const resultado = interpretarGAD7(12);
      expect(resultado.recomendacoes.some(r => 
        r.toLowerCase().includes('clínica') || r.toLowerCase().includes('profissional')
      )).toBe(true);
    });

    it('deve indicar urgência para GRAVE', () => {
      const resultado = interpretarGAD7(18);
      expect(resultado.recomendacoes.some(r => 
        r.toLowerCase().includes('urgente') || r.toLowerCase().includes('necessária')
      )).toBe(true);
    });
  });

  describe('Validação de estrutura', () => {
    it('deve retornar estrutura completa', () => {
      const resultado = interpretarGAD7(11);
      
      expect(resultado.escala).toBe('GAD-7');
      expect(resultado.score).toBe(11);
      expect(Array.isArray(resultado.recomendacoes)).toBe(true);
      expect(typeof resultado.descricao).toBe('string');
      expect(typeof resultado.necessitaAlerta).toBe('boolean');
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com valores extremos como LEVE (fallback)', () => {
      expect(interpretarGAD7(-10).nivelSeveridade).toBe(NivelSeveridade.LEVE);
      expect(interpretarGAD7(100).nivelSeveridade).toBe(NivelSeveridade.GRAVE);
    });
  });
});

// ==============================================
// TESTES - interpretarWHO5 (Bem-estar)
// ==============================================

describe('interpretarWHO5 - Índice de Bem-Estar', () => {
  describe('Classificação de níveis (escala 0-25 convertida para 0-100%)', () => {
    it('deve classificar score baixo (<7 = <28%) como bem-estar muito baixo', () => {
      // Score 0 = 0%
      const resultado = interpretarWHO5(0);
      expect(resultado.descricao.toLowerCase()).toContain('muito baixo');
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.GRAVE);
      
      // Score 6.75 = 27%
      const resultado2 = interpretarWHO5(6.75);
      expect(resultado2.descricao.toLowerCase()).toContain('muito baixo');
    });

    it('deve classificar score médio-baixo (7-12.5 = 28-50%) como bem-estar reduzido', () => {
      // Score 7 = 28% (limite inferior)
      const resultado = interpretarWHO5(7);
      expect(resultado.descricao.toLowerCase()).toContain('reduzido');
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.MODERADO);
      
      // Score 10 = 40% (meio da faixa)
      const resultado2 = interpretarWHO5(10);
      expect(resultado2.descricao.toLowerCase()).toContain('reduzido');
    });

    it('deve classificar score médio (12.5-18.75 = 50-75%) como bem-estar moderado', () => {
      // Score 12.5 = 50% (limite inferior)
      const resultado = interpretarWHO5(12.5);
      expect(resultado.descricao.toLowerCase()).toContain('moderado');
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.LEVE);
      
      // Score 15 = 60% (meio da faixa)
      const resultado2 = interpretarWHO5(15);
      expect(resultado2.descricao.toLowerCase()).toContain('moderado');
    });

    it('deve classificar score alto (>18.75 = >75%) como bem-estar elevado', () => {
      // Score 19 = 76%
      const resultado = interpretarWHO5(19);
      expect(resultado.descricao.toLowerCase()).toContain('elevado');
      expect(resultado.nivelSeveridade).toBe(NivelSeveridade.MINIMO);
      
      // Score 25 = 100%
      const resultado2 = interpretarWHO5(25);
      expect(resultado2.descricao.toLowerCase()).toContain('elevado');
    });
  });

  describe('Cutoff de 28% para rastreamento de depressão', () => {
    it('deve indicar rastreamento para depressão quando score < 7 (<28%)', () => {
      const resultado = interpretarWHO5(6); // 24%
      expect(resultado.recomendacoes.some(r => 
        r.toLowerCase().includes('screening') || r.toLowerCase().includes('depressão')
      )).toBe(true);
      expect(resultado.necessitaAlerta).toBe(true);
    });

    it('não deve indicar rastreamento quando score >= 7 (>=28%)', () => {
      const resultado = interpretarWHO5(8); // 32%
      expect(resultado.recomendacoes.some(r => 
        r.toLowerCase().includes('screening para depressão')
      )).toBe(false);
    });
  });

  describe('Interpretação inversa (maior score = melhor bem-estar)', () => {
    it('score baixo deve indicar necessidade de alerta', () => {
      const baixo = interpretarWHO5(5); // 20%
      const alto = interpretarWHO5(21); // 84%
      
      expect(baixo.necessitaAlerta).toBe(true);
      expect(alto.necessitaAlerta).toBe(false);
    });

    it('cor deve refletir bem-estar (verde = bom, vermelho = ruim)', () => {
      const baixo = interpretarWHO5(4); // 16%
      const alto = interpretarWHO5(22); // 88%
      
      // Vermelho para baixo
      expect(baixo.cor).toBe('#ef4444');
      // Verde para alto
      expect(alto.cor).toBe('#22c55e');
    });
  });

  describe('Validação de estrutura', () => {
    it('deve retornar estrutura completa com score convertido para percentual', () => {
      const resultado = interpretarWHO5(14); // 56%
      
      expect(resultado.escala).toBe('WHO-5');
      expect(resultado.score).toBeCloseTo(56, 0); // Aproximado 56%
      expect(Array.isArray(resultado.recomendacoes)).toBe(true);
      expect(typeof resultado.descricao).toBe('string');
      expect(typeof resultado.cor).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com valores extremos', () => {
      // Score negativo = 0%
      const negativo = interpretarWHO5(-5);
      expect(negativo.descricao.toLowerCase()).toContain('muito baixo');
      
      // Score muito alto = >100%
      const alto = interpretarWHO5(50);
      expect(alto.descricao.toLowerCase()).toContain('elevado');
    });
  });
});

// ==============================================
// TESTES DE INTEGRAÇÃO
// ==============================================

describe('Integração entre escalas', () => {
  it('PHQ-9 e GAD-7 devem ter limites similares mas interpretações distintas', () => {
    const phq9_15 = interpretarPHQ9(15);
    const gad7_15 = interpretarGAD7(15);
    
    // Ambos são graves
    expect(phq9_15.nivelSeveridade).toBe(NivelSeveridade.MODERADAMENTE_GRAVE);
    expect(gad7_15.nivelSeveridade).toBe(NivelSeveridade.GRAVE);
    
    // Mas descrições são diferentes
    expect(phq9_15.descricao).not.toBe(gad7_15.descricao);
  });

  it('WHO-5 tem interpretação inversa comparada a PHQ-9 e GAD-7', () => {
    const phq9_alto = interpretarPHQ9(20); // grave
    const who5_alto = interpretarWHO5(80); // bom
    
    // PHQ-9 alto = ruim, WHO-5 alto = bom
    expect(phq9_alto.necessitaAlerta).toBe(true);
    expect(who5_alto.necessitaAlerta).toBe(false);
  });

  it('todas as escalas devem retornar estrutura consistente', () => {
    const phq9 = interpretarPHQ9(10);
    const gad7 = interpretarGAD7(10);
    const who5 = interpretarWHO5(50);
    
    const campos = ['escala', 'score', 'nivelSeveridade', 'descricao', 'recomendacoes', 'necessitaAlerta', 'cor'];
    
    campos.forEach(campo => {
      expect(phq9).toHaveProperty(campo);
      expect(gad7).toHaveProperty(campo);
      expect(who5).toHaveProperty(campo);
    });
  });
});

// ==============================================
// TESTES DE BOUNDARY VALUES
// ==============================================

describe('Boundary Values - Limites exatos das faixas', () => {
  describe('PHQ-9 boundaries', () => {
    it('deve classificar corretamente nos limites das faixas', () => {
      expect(interpretarPHQ9(4).nivelSeveridade).toBe(NivelSeveridade.MINIMO);
      expect(interpretarPHQ9(5).nivelSeveridade).toBe(NivelSeveridade.LEVE);
      
      expect(interpretarPHQ9(9).nivelSeveridade).toBe(NivelSeveridade.LEVE);
      expect(interpretarPHQ9(10).nivelSeveridade).toBe(NivelSeveridade.MODERADO);
      
      expect(interpretarPHQ9(14).nivelSeveridade).toBe(NivelSeveridade.MODERADO);
      expect(interpretarPHQ9(15).nivelSeveridade).toBe(NivelSeveridade.MODERADAMENTE_GRAVE);
      
      expect(interpretarPHQ9(19).nivelSeveridade).toBe(NivelSeveridade.MODERADAMENTE_GRAVE);
      expect(interpretarPHQ9(20).nivelSeveridade).toBe(NivelSeveridade.GRAVE);
    });
  });

  describe('GAD-7 boundaries', () => {
    it('deve classificar corretamente nos limites das faixas', () => {
      expect(interpretarGAD7(4).nivelSeveridade).toBe(NivelSeveridade.MINIMO);
      expect(interpretarGAD7(5).nivelSeveridade).toBe(NivelSeveridade.LEVE);
      
      expect(interpretarGAD7(9).nivelSeveridade).toBe(NivelSeveridade.LEVE);
      expect(interpretarGAD7(10).nivelSeveridade).toBe(NivelSeveridade.MODERADO);
      
      expect(interpretarGAD7(14).nivelSeveridade).toBe(NivelSeveridade.MODERADO);
      expect(interpretarGAD7(15).nivelSeveridade).toBe(NivelSeveridade.GRAVE);
    });
  });

  describe('WHO-5 boundaries', () => {
    it('deve classificar corretamente nos limites das faixas (convertido para percentual)', () => {
      // Score 6.99 = 27.96% → muito baixo
      const r27 = interpretarWHO5(6.99);
      expect(r27.descricao.toLowerCase()).toContain('muito baixo');
      
      // Score 7 = 28% → reduzido
      const r28 = interpretarWHO5(7);
      expect(r28.descricao.toLowerCase()).toContain('reduzido');
      expect(r28.descricao.toLowerCase()).not.toContain('muito');
      
      // Score 12.5 = 50% → moderado
      expect(interpretarWHO5(12.5).descricao.toLowerCase()).toContain('moderado');
      
      // Score 18.75 = 75% → elevado
      expect(interpretarWHO5(18.75).descricao.toLowerCase()).toContain('elevado');
    });
  });
});
