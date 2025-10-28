/**
 * Utilitários para Progresso e IRT
 */

import type { NivelAlerta } from '@/types/sessao';

/**
 * Retorna cor do nível de alerta
 */
export function getAlertaColor(nivel: NivelAlerta): {
  bg: string;
  text: string;
  border: string;
  ring: string;
} {
  const colors = {
    VERDE: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      ring: 'ring-green-500',
    },
    AMARELO: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      ring: 'ring-yellow-500',
    },
    LARANJA: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
      ring: 'ring-orange-500',
    },
    VERMELHO: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      ring: 'ring-red-500',
    },
  };

  return colors[nivel];
}

/**
 * Retorna label amigável para nível de alerta
 */
export function getAlertaLabel(nivel: NivelAlerta): string {
  const labels = {
    VERDE: 'Tudo bem',
    AMARELO: 'Atenção',
    LARANJA: 'Alerta',
    VERMELHO: 'Crítico',
  };

  return labels[nivel];
}

/**
 * Interpreta valor theta do IRT
 */
export function interpretarTheta(theta: number): string {
  if (theta < -2) return 'Muito baixo';
  if (theta < -1) return 'Baixo';
  if (theta < 1) return 'Médio';
  if (theta < 2) return 'Alto';
  return 'Muito alto';
}

/**
 * Retorna cor da barra de progresso baseada no nível de alerta
 */
export function getProgressColor(nivel: NivelAlerta): string {
  const colors = {
    VERDE: 'bg-green-500',
    AMARELO: 'bg-yellow-500',
    LARANJA: 'bg-orange-500',
    VERMELHO: 'bg-red-500',
  };

  return colors[nivel];
}

/**
 * Formata tempo em segundos para formato legível
 */
export function formatarTempo(segundos: number): string {
  if (segundos < 60) {
    return `${segundos}s`;
  }

  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;

  if (minutos < 60) {
    return segs > 0 ? `${minutos}m ${segs}s` : `${minutos}m`;
  }

  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  return mins > 0 ? `${horas}h ${mins}m` : `${horas}h`;
}

/**
 * Calcula tempo estimado restante
 */
export function calcularTempoRestante(
  tempoDecorrido: number,
  progresso: number
): number {
  if (progresso === 0) return 0;
  
  const tempoMedioPorPergunta = tempoDecorrido / progresso;
  const perguntasRestantes = 100 - progresso;
  
  return Math.ceil((perguntasRestantes / 100) * tempoMedioPorPergunta * progresso);
}

/**
 * Converte confiança (0-1) para porcentagem formatada
 */
export function formatarConfianca(confianca: number): string {
  return `${Math.round(confianca * 100)}%`;
}
