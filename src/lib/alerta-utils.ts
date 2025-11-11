/**
 * Funções utilitárias para Alertas
 */

import type { TipoAlerta } from '@/types/alerta';
import type { NivelAlerta } from '@/types/sessao';
import {
  AlertTriangle,
  BookOpen,
  Battery,
  Brain,
  Clock,
  Eye,
  Shuffle,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';

/**
 * Retorna o ícone apropriado para cada tipo de alerta
 */
export function getAlertaIcon(tipo: TipoAlerta): LucideIcon {
  const iconMap: Record<TipoAlerta, LucideIcon> = {
    RISCO_EVASAO: TrendingDown,
    DIFICULDADE_APRENDIZAGEM: BookOpen,
    BAIXO_ENGAJAMENTO: Battery,
    ANSIEDADE_AVALIATIVA: AlertTriangle,
    FADIGA_COGNITIVA: Brain,
    INCONSISTENCIA_RESPOSTAS: Eye,
    TEMPO_EXCESSIVO: Clock,
    PADRAO_ALEATORIO: Shuffle,
  };

  return iconMap[tipo] || AlertTriangle;
}

/**
 * Retorna título amigável para o tipo de alerta
 */
export function getAlertaTitulo(tipo: TipoAlerta): string {
  const tituloMap: Record<TipoAlerta, string> = {
    RISCO_EVASAO: 'Risco de Evasão',
    DIFICULDADE_APRENDIZAGEM: 'Dificuldade de Aprendizagem',
    BAIXO_ENGAJAMENTO: 'Baixo Engajamento',
    ANSIEDADE_AVALIATIVA: 'Ansiedade Avaliativa',
    FADIGA_COGNITIVA: 'Fadiga Cognitiva',
    INCONSISTENCIA_RESPOSTAS: 'Inconsistência nas Respostas',
    TEMPO_EXCESSIVO: 'Tempo Excessivo',
    PADRAO_ALEATORIO: 'Padrão Aleatório Detectado',
  };

  return tituloMap[tipo] || 'Alerta';
}

/**
 * Retorna descrição curta do tipo de alerta
 */
export function getAlertaDescricaoCurta(tipo: TipoAlerta): string {
  const descricaoMap: Record<TipoAlerta, string> = {
    RISCO_EVASAO: 'Padrões indicam possível abandono',
    DIFICULDADE_APRENDIZAGEM: 'Respostas sugerem dificuldades',
    BAIXO_ENGAJAMENTO: 'Participação abaixo do esperado',
    ANSIEDADE_AVALIATIVA: 'Sinais de estresse durante avaliação',
    FADIGA_COGNITIVA: 'Cansaço mental detectado',
    INCONSISTENCIA_RESPOSTAS: 'Respostas contraditórias',
    TEMPO_EXCESSIVO: 'Tempo de resposta muito alto',
    PADRAO_ALEATORIO: 'Respostas sem padrão coerente',
  };

  return descricaoMap[tipo] || '';
}

/**
 * Retorna prioridade numérica do nível (maior = mais urgente)
 */
export function getAlertaPrioridade(nivel: NivelAlerta): number {
  const prioridadeMap: Record<NivelAlerta, number> = {
    VERMELHO: 4,
    LARANJA: 3,
    AMARELO: 2,
    VERDE: 1,
  };

  return prioridadeMap[nivel] || 0;
}

/**
 * Retorna recomendações padrão baseadas no tipo de alerta
 */
export function getRecomendacoesPadrao(tipo: TipoAlerta): string[] {
  const recomendacoesMap: Record<TipoAlerta, string[]> = {
    RISCO_EVASAO: [
      'Agendar conversa individual com o aluno',
      'Verificar frequência e participação nas atividades',
      'Oferecer suporte adicional ou tutoria',
      'Avaliar possíveis dificuldades pessoais ou acadêmicas',
    ],
    DIFICULDADE_APRENDIZAGEM: [
      'Revisar conteúdo com abordagem diferenciada',
      'Disponibilizar material de apoio adicional',
      'Considerar atividades de reforço',
      'Avaliar necessidade de acompanhamento especializado',
    ],
    BAIXO_ENGAJAMENTO: [
      'Variar metodologias de ensino',
      'Propor atividades mais interativas',
      'Verificar interesse e motivação do aluno',
      'Estabelecer metas pequenas e alcançáveis',
    ],
    ANSIEDADE_AVALIATIVA: [
      'Oferecer ambiente mais acolhedor para avaliações',
      'Considerar formatos alternativos de avaliação',
      'Fornecer feedback construtivo e encorajador',
      'Sugerir técnicas de relaxamento e respiração',
    ],
    FADIGA_COGNITIVA: [
      'Recomendar pausas mais frequentes',
      'Dividir atividades em blocos menores',
      'Avaliar carga de trabalho do aluno',
      'Sugerir descanso adequado e sono regular',
    ],
    INCONSISTENCIA_RESPOSTAS: [
      'Revisar compreensão das perguntas',
      'Verificar se o aluno está lendo as questões adequadamente',
      'Avaliar se há distrações no ambiente',
      'Considerar reaplicação da avaliação',
    ],
    TEMPO_EXCESSIVO: [
      'Investigar dificuldades específicas',
      'Verificar se há problemas de leitura ou interpretação',
      'Considerar mais tempo ou adaptações',
      'Avaliar ansiedade ou perfeccionismo',
    ],
    PADRAO_ALEATORIO: [
      'Verificar se o aluno compreendeu as instruções',
      'Avaliar nível de atenção durante a atividade',
      'Considerar invalidar respostas e reaplicar',
      'Conversar sobre a importância da avaliação',
    ],
  };

  return recomendacoesMap[tipo] || ['Entre em contato com o responsável pedagógico'];
}

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export function formatarDataRelativa(data: Date | string): string {
  const agora = new Date();
  const dataAlerta = typeof data === 'string' ? new Date(data) : data;
  const diffMs = agora.getTime() - dataAlerta.getTime();
  const diffSegundos = Math.floor(diffMs / 1000);
  const diffMinutos = Math.floor(diffSegundos / 60);
  const diffHoras = Math.floor(diffMinutos / 60);
  const diffDias = Math.floor(diffHoras / 24);

  if (diffDias > 0) {
    return diffDias === 1 ? 'há 1 dia' : `há ${diffDias} dias`;
  }
  if (diffHoras > 0) {
    return diffHoras === 1 ? 'há 1 hora' : `há ${diffHoras} horas`;
  }
  if (diffMinutos > 0) {
    return diffMinutos === 1 ? 'há 1 minuto' : `há ${diffMinutos} minutos`;
  }
  return 'agora mesmo';
}

/**
 * Retorna texto do badge de status
 */
export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    ATIVO: 'Ativo',
    VISUALIZADO: 'Visualizado',
    EM_ACOMPANHAMENTO: 'Em Acompanhamento',
    RESOLVIDO: 'Resolvido',
  };

  return statusMap[status] || status;
}

/**
 * Retorna cores do badge de status
 */
export function getStatusColors(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  const colorMap: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    ATIVO: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
    },
    VISUALIZADO: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
    },
    EM_ACOMPANHAMENTO: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
    },
    RESOLVIDO: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
    },
  };

  return (
    colorMap[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
    }
  );
}
