import { describe, it, expect } from 'vitest';
import {
  interpretarPHQ9,
  interpretarGAD7,
  interpretarWHO5,
  analisarAlertasCombinados,
  calcularScoreEscala,
  type NivelAlerta,
  type CategoriaClinica,
} from '@/lib/escalas/interpretacao-clinica';

describe('interpretacao-clinica', () => {
  describe('interpretarPHQ9', () => {
    it('deve classificar score 0-4 como MINIMA (VERDE)', () => {
      const resultado = interpretarPHQ9(3);
      
      expect(resultado.escala).toBe('PHQ-9');
      expect(resultado.score).toBe(3);
      expect(resultado.scoreMaximo).toBe(27);
      expect(resultado.categoria).toBe('MINIMA');
      expect(resultado.nivelAlerta).toBe('VERDE');
      expect(resultado.requerAcaoImediata).toBe(false);
    });

    it('deve classificar score 5-9 como LEVE (AMARELO)', () => {
      const resultado = interpretarPHQ9(7);
      
      expect(resultado.categoria).toBe('LEVE');
      expect(resultado.nivelAlerta).toBe('AMARELO');
      expect(resultado.requerAcaoImediata).toBe(false);
    });

    it('deve classificar score 10-14 como MODERADA (LARANJA)', () => {
      const resultado = interpretarPHQ9(12);
      
      expect(resultado.categoria).toBe('MODERADA');
      expect(resultado.nivelAlerta).toBe('LARANJA');
      expect(resultado.requerAcaoImediata).toBe(false);
    });

    it('deve classificar score 15-19 como MODERADAMENTE_GRAVE (VERMELHO)', () => {
      const resultado = interpretarPHQ9(17);
      
      expect(resultado.categoria).toBe('MODERADAMENTE_GRAVE');
      expect(resultado.nivelAlerta).toBe('VERMELHO');
      expect(resultado.requerAcaoImediata).toBe(true);
    });

    it('deve classificar score 20+ como GRAVE (VERMELHO)', () => {
      const resultado = interpretarPHQ9(25);
      
      expect(resultado.categoria).toBe('GRAVE');
      expect(resultado.nivelAlerta).toBe('VERMELHO');
      expect(resultado.requerAcaoImediata).toBe(true);
    });

    it('deve detectar risco suicida no item 9 e priorizar VERMELHO', () => {
      const resultado = interpretarPHQ9(5, 2); // Score leve mas item 9 = 2
      
      expect(resultado.nivelAlerta).toBe('VERMELHO');
      expect(resultado.requerAcaoImediata).toBe(true);
      expect(resultado.descricao).toContain('ALERTA CRÍTICO');
      expect(resultado.descricao).toContain('autodestrutivos');
    });

    it('deve calcular percentual corretamente', () => {
      const resultado = interpretarPHQ9(13);
      
      const percentualEsperado = Math.round((13 / 27) * 100);
      expect(resultado.percentual).toBe(percentualEsperado);
    });
  });

  describe('interpretarGAD7', () => {
    it('deve classificar score 0-4 como MINIMA (VERDE)', () => {
      const resultado = interpretarGAD7(2);
      
      expect(resultado.escala).toBe('GAD-7');
      expect(resultado.scoreMaximo).toBe(21);
      expect(resultado.categoria).toBe('MINIMA');
      expect(resultado.nivelAlerta).toBe('VERDE');
    });

    it('deve classificar score 5-9 como LEVE (AMARELO)', () => {
      const resultado = interpretarGAD7(8);
      
      expect(resultado.categoria).toBe('LEVE');
      expect(resultado.nivelAlerta).toBe('AMARELO');
    });

    it('deve classificar score 10-14 como MODERADA (LARANJA)', () => {
      const resultado = interpretarGAD7(13);
      
      expect(resultado.categoria).toBe('MODERADA');
      expect(resultado.nivelAlerta).toBe('LARANJA');
    });

    it('deve classificar score 15-21 como GRAVE (VERMELHO)', () => {
      const resultado = interpretarGAD7(18);
      
      expect(resultado.categoria).toBe('GRAVE');
      expect(resultado.nivelAlerta).toBe('VERMELHO');
      expect(resultado.requerAcaoImediata).toBe(true);
    });
  });

  describe('interpretarWHO5', () => {
    it('deve classificar percentual 0-28% como GRAVE (VERMELHO)', () => {
      const resultado = interpretarWHO5(5); // 5/25 = 20%
      
      expect(resultado.escala).toBe('WHO-5');
      expect(resultado.scoreMaximo).toBe(25);
      expect(resultado.categoria).toBe('GRAVE');
      expect(resultado.nivelAlerta).toBe('VERMELHO');
      expect(resultado.requerAcaoImediata).toBe(true);
    });

    it('deve classificar percentual 29-50% como MODERADA (LARANJA)', () => {
      const resultado = interpretarWHO5(10); // 10/25 = 40%
      
      expect(resultado.categoria).toBe('MODERADA');
      expect(resultado.nivelAlerta).toBe('LARANJA');
    });

    it('deve classificar percentual 51-75% como LEVE (AMARELO)', () => {
      const resultado = interpretarWHO5(15); // 15/25 = 60%
      
      expect(resultado.categoria).toBe('LEVE');
      expect(resultado.nivelAlerta).toBe('AMARELO');
    });

    it('deve classificar percentual 76-100% como MINIMA (VERDE)', () => {
      const resultado = interpretarWHO5(20); // 20/25 = 80%
      
      expect(resultado.categoria).toBe('MINIMA');
      expect(resultado.nivelAlerta).toBe('VERDE');
      expect(resultado.requerAcaoImediata).toBe(false);
    });
  });

  describe('analisarAlertasCombinados', () => {
    it('deve retornar nível máximo VERMELHO quando algum alerta é VERMELHO', () => {
      const phq9 = interpretarPHQ9(20); // VERMELHO
      const gad7 = interpretarGAD7(5);  // AMARELO
      const who5 = interpretarWHO5(15); // AMARELO
      
      const resultado = analisarAlertasCombinados(phq9, gad7, who5);
      
      expect(resultado.nivelMaximo).toBe('VERMELHO');
      expect(resultado.requerAcaoImediata).toBe(true);
    });

    it('deve retornar nível máximo LARANJA quando há LARANJA mas não VERMELHO', () => {
      const phq9 = interpretarPHQ9(7);  // AMARELO
      const gad7 = interpretarGAD7(12); // LARANJA
      const who5 = interpretarWHO5(18); // AMARELO
      
      const resultado = analisarAlertasCombinados(phq9, gad7, who5);
      
      expect(resultado.nivelMaximo).toBe('LARANJA');
      expect(resultado.requerAcaoImediata).toBe(false);
    });

    it('deve retornar VERDE quando todas escalas estão normais', () => {
      const phq9 = interpretarPHQ9(3);  // VERDE
      const gad7 = interpretarGAD7(2);  // VERDE
      const who5 = interpretarWHO5(20); // VERDE
      
      const resultado = analisarAlertasCombinados(phq9, gad7, who5);
      
      expect(resultado.nivelMaximo).toBe('VERDE');
      expect(resultado.requerAcaoImediata).toBe(false);
      expect(resultado.mensagemConsolidada).toContain('normalidade');
    });

    it('deve funcionar com apenas algumas escalas', () => {
      const phq9 = interpretarPHQ9(15); // VERMELHO
      
      const resultado = analisarAlertasCombinados(phq9);
      
      expect(resultado.nivelMaximo).toBe('VERMELHO');
      expect(resultado.requerAcaoImediata).toBe(true);
    });
  });

  describe('calcularScoreEscala', () => {
    it('deve somar todos os valores das respostas', () => {
      const respostas = [
        { valor: 1 },
        { valor: 2 },
        { valor: 3 },
        { valor: 0 },
        { valor: 2 },
      ];
      
      const score = calcularScoreEscala(respostas);
      
      expect(score).toBe(8);
    });

    it('deve retornar 0 para array vazio', () => {
      const score = calcularScoreEscala([]);
      
      expect(score).toBe(0);
    });

    it('deve funcionar com respostas PHQ-9 (9 perguntas)', () => {
      const respostas = Array(9).fill({ valor: 2 }); // Todas = 2
      
      const score = calcularScoreEscala(respostas);
      
      expect(score).toBe(18); // 9 × 2 = 18
    });
  });
});
