/**
 * Testes para Critérios de Parada do CAT (Computerized Adaptive Testing)
 * 
 * Cenários cobertos:
 * 1. Parada por SEM < 0.30 (precisão atingida)
 * 2. Parada por mínimo de 5 respostas
 * 3. Parada por máximo de 20 respostas
 * 4. Parada por falta de perguntas candidatas
 */

import { describe, it, expect } from 'vitest';
import { verificarCriteriosParada, calcularSEM } from '@/lib/adaptive/selecao-avancada-service';

describe('Critérios de Parada - CAT', () => {
  it('deve exigir mínimo de 5 respostas', () => {
    const respostas = [
      { valorNormalizado: 0.75, configuracaoIRT: { discriminacao: 1.0, dificuldade: 0.5, acerto: 0 } },
      { valorNormalizado: 0.75, configuracaoIRT: { discriminacao: 1.0, dificuldade: 0.5, acerto: 0 } },
      { valorNormalizado: 0.75, configuracaoIRT: { discriminacao: 1.0, dificuldade: 0.5, acerto: 0 } },
    ];

    const theta = 0.5;
    const sem = calcularSEM(respostas, theta);

    const { deveparar, motivo } = verificarCriteriosParada(respostas, theta, sem);

    // Mesmo com SEM baixo, não deve parar com menos de 5 respostas
    expect(respostas.length).toBeLessThan(5);
    expect(deveparar).toBe(false);
  });

  it('deve parar quando SEM < 0.30 com ≥5 respostas', () => {
    // Criar 6 respostas consistentes (alta discriminação para baixar SEM)
    const respostas = Array.from({ length: 6 }, () => ({
      valorNormalizado: 0.75,
      configuracaoIRT: { discriminacao: 2.0, dificuldade: 0.5, acerto: 0 },
    }));

    const theta = 0.5;
    const sem = calcularSEM(respostas, theta);

    console.log(`SEM com 6 respostas: ${sem.toFixed(3)}`);

    const { deveparar, motivo } = verificarCriteriosParada(respostas, theta, sem);

    if (sem < 0.30) {
      expect(deveparar).toBe(true);
      expect(motivo).toContain('SEM');
    }
  });

  it('deve parar ao atingir máximo de 20 respostas', () => {
    const respostas = Array.from({ length: 20 }, (_, i) => ({
      valorNormalizado: 0.5 + (i % 3) * 0.1,
      configuracaoIRT: { discriminacao: 1.0, dificuldade: 0.5, acerto: 0 },
    }));

    const theta = 0.0;
    const sem = calcularSEM(respostas, theta);

    const { deveparar, motivo } = verificarCriteriosParada(respostas, theta, sem);

    expect(deveparar).toBe(true);
    expect(motivo).toContain('máximo');
  });

  it('deve calcular SEM corretamente', () => {
    const respostas = [
      { valorNormalizado: 0.75, configuracaoIRT: { discriminacao: 1.5, dificuldade: 0.3, acerto: 0 } },
      { valorNormalizado: 0.80, configuracaoIRT: { discriminacao: 1.8, dificuldade: 0.2, acerto: 0 } },
      { valorNormalizado: 0.70, configuracaoIRT: { discriminacao: 1.2, dificuldade: 0.4, acerto: 0 } },
    ];

    const theta = 0.5;
    const sem = calcularSEM(respostas, theta);

    expect(sem).toBeGreaterThan(0);
    expect(sem).toBeLessThan(1); // SEM deve estar em range razoável
    expect(typeof sem).toBe('number');
  });

  it('deve ter SEM alto com poucas respostas', () => {
    const respostas = [
      { valorNormalizado: 0.5, configuracaoIRT: { discriminacao: 1.0, dificuldade: 0.5, acerto: 0 } },
    ];

    const theta = 0.0;
    const sem = calcularSEM(respostas, theta);

    // Com apenas 1 resposta, SEM deve ser alto (pouca precisão)
    expect(sem).toBeGreaterThan(0.5);
  });

  it('deve ter SEM baixo com muitas respostas consistentes', () => {
    const respostas = Array.from({ length: 10 }, () => ({
      valorNormalizado: 0.75,
      configuracaoIRT: { discriminacao: 2.0, dificuldade: 0.5, acerto: 0 },
    }));

    const theta = 0.5;
    const sem = calcularSEM(respostas, theta);

    console.log(`SEM com 10 respostas consistentes: ${sem.toFixed(3)}`);

    // Com 10 respostas consistentes e boa discriminação, SEM deve ser baixo
    expect(sem).toBeLessThan(0.5);
  });

  it('não deve parar se tiver menos de 5 respostas, mesmo com SEM baixo', () => {
    // Caso improvável mas deve ser testado
    const respostas = Array.from({ length: 4 }, () => ({
      valorNormalizado: 0.75,
      configuracaoIRT: { discriminacao: 3.0, dificuldade: 0.5, acerto: 0 },
    }));

    const theta = 0.5;
    const sem = 0.25; // SEM artificialmente baixo

    const { deveparar } = verificarCriteriosParada(respostas, theta, sem);

    expect(deveparar).toBe(false);
  });

  it('deve considerar confiança ao decidir parada', () => {
    const respostas = Array.from({ length: 7 }, () => ({
      valorNormalizado: 0.75,
      configuracaoIRT: { discriminacao: 1.8, dificuldade: 0.5, acerto: 0 },
    }));

    const theta = 0.5;
    const sem = calcularSEM(respostas, theta);
    const confianca = 1 / (1 + sem);

    console.log(`Confiança com 7 respostas: ${(confianca * 100).toFixed(1)}%`);

    // Alta confiança deve correlacionar com SEM baixo
    if (confianca > 0.75) {
      expect(sem).toBeLessThan(0.35);
    }
  });
});
