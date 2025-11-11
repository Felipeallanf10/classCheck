/**
 * Utilitários para Questionários
 */

import type { TipoQuestionario, CategoriaPergunta } from '@/types/questionario';
import { 
  HeartPulse, 
  Brain, 
  SmilePlus, 
  Circle, 
  FileText,
  Sparkles,
  Battery,
  Moon,
  Focus,
  Award,
  Users,
  Zap,
  Target,
  Heart
} from 'lucide-react';

/**
 * Retorna o ícone apropriado para cada tipo de questionário
 */
export function getQuestionarioIcon(tipo: TipoQuestionario) {
  const icons: Record<string, any> = {
    // Tipos antigos (compatibilidade)
    WHO5: SmilePlus,
    PHQ9: Brain,
    GAD7: HeartPulse,
    CIRCUMPLEX: Circle,
    PERSONALIZADO: FileText,
    // Tipos novos do schema
    CHECK_IN_DIARIO: SmilePlus,
    AVALIACAO_SEMANAL: FileText,
    AVALIACAO_MENSAL: FileText,
    AVALIACAO_POS_AULA: SmilePlus,
    AVALIACAO_CRITICA: HeartPulse,
    QUESTIONARIO_INICIAL: Brain,
    QUESTIONARIO_FINAL: Brain,
    PESQUISA_SATISFACAO: SmilePlus,
    AUTOAVALIACAO: Brain,
    DIAGNOSTICO: HeartPulse,
    TRIAGEM: FileText,
    ACOMPANHAMENTO: Target,
    INTERVENCAO: Zap,
    PESQUISA: FileText,
    SCREENING: HeartPulse,
    LONGITUDINAL: FileText,
    TRANSVERSAL: FileText,
  };

  return icons[tipo] || FileText;
}

/**
 * Retorna cor do badge para cada tipo
 */
export function getQuestionarioColor(tipo: TipoQuestionario): string {
  const colors: Record<string, string> = {
    WHO5: 'bg-green-100 text-green-700 border-green-200',
    PHQ9: 'bg-blue-100 text-blue-700 border-blue-200',
    GAD7: 'bg-purple-100 text-purple-700 border-purple-200',
    CIRCUMPLEX: 'bg-pink-100 text-pink-700 border-pink-200',
    PERSONALIZADO: 'bg-gray-100 text-gray-700 border-gray-200',
    CHECK_IN_DIARIO: 'bg-green-100 text-green-700 border-green-200',
    AVALIACAO_SEMANAL: 'bg-blue-100 text-blue-700 border-blue-200',
    AVALIACAO_MENSAL: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    AVALIACAO_POS_AULA: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    AVALIACAO_CRITICA: 'bg-red-100 text-red-700 border-red-200',
    QUESTIONARIO_INICIAL: 'bg-purple-100 text-purple-700 border-purple-200',
    QUESTIONARIO_FINAL: 'bg-pink-100 text-pink-700 border-pink-200',
    PESQUISA_SATISFACAO: 'bg-amber-100 text-amber-700 border-amber-200',
    AUTOAVALIACAO: 'bg-blue-100 text-blue-700 border-blue-200',
    DIAGNOSTICO: 'bg-purple-100 text-purple-700 border-purple-200',
    TRIAGEM: 'bg-orange-100 text-orange-700 border-orange-200',
    ACOMPANHAMENTO: 'bg-teal-100 text-teal-700 border-teal-200',
    INTERVENCAO: 'bg-red-100 text-red-700 border-red-200',
    PESQUISA: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    SCREENING: 'bg-purple-100 text-purple-700 border-purple-200',
    LONGITUDINAL: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    TRANSVERSAL: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return colors[tipo] || colors.PERSONALIZADO || 'bg-gray-100 text-gray-700 border-gray-200';
}

/**
 * Retorna label amigável para o tipo
 */
export function getQuestionarioLabel(tipo: TipoQuestionario): string {
  const labels: Record<string, string> = {
    WHO5: 'WHO-5 (Bem-estar)',
    PHQ9: 'PHQ-9 (Depressão)',
    GAD7: 'GAD-7 (Ansiedade)',
    CIRCUMPLEX: 'Circumplex (Emoções)',
    PERSONALIZADO: 'Personalizado',
    CHECK_IN_DIARIO: 'Check-in Diário',
    AVALIACAO_SEMANAL: 'Avaliação Semanal',
    AVALIACAO_MENSAL: 'Avaliação Mensal',
    AVALIACAO_POS_AULA: 'Pós-Aula',
    AVALIACAO_CRITICA: 'Avaliação Crítica',
    QUESTIONARIO_INICIAL: 'Questionário Inicial',
    QUESTIONARIO_FINAL: 'Questionário Final',
    PESQUISA_SATISFACAO: 'Pesquisa de Satisfação',
    AUTOAVALIACAO: 'Autoavaliação',
    DIAGNOSTICO: 'Diagnóstico',
    TRIAGEM: 'Triagem',
    ACOMPANHAMENTO: 'Acompanhamento',
    INTERVENCAO: 'Intervenção',
    PESQUISA: 'Pesquisa',
    SCREENING: 'Screening',
    LONGITUDINAL: 'Estudo Longitudinal',
    TRANSVERSAL: 'Estudo Transversal',
  };

  return labels[tipo] || tipo.replace(/_/g, ' ');
}

/**
 * Retorna ícone para cada categoria
 */
export function getCategoriaIcon(categoria: CategoriaPergunta) {
  const icons = {
    BEM_ESTAR: SmilePlus,
    ANSIEDADE: HeartPulse,
    DEPRESSAO: Brain,
    HUMOR: Heart,
    ENERGIA: Sparkles,
    SONO: Moon,
    CONCENTRACAO: Focus,
    AUTOESTIMA: Award,
    RELACIONAMENTOS: Users,
    ESTRESSE: Zap,
    MOTIVACAO: Target,
    EMOCIONAL: Heart,
  };

  return icons[categoria] || FileText;
}

/**
 * Retorna cor para cada categoria
 */
export function getCategoriaColor(categoria: CategoriaPergunta): string {
  const colors = {
    BEM_ESTAR: 'text-green-600',
    ANSIEDADE: 'text-purple-600',
    DEPRESSAO: 'text-blue-600',
    HUMOR: 'text-pink-600',
    ENERGIA: 'text-yellow-600',
    SONO: 'text-indigo-600',
    CONCENTRACAO: 'text-cyan-600',
    AUTOESTIMA: 'text-amber-600',
    RELACIONAMENTOS: 'text-rose-600',
    ESTRESSE: 'text-red-600',
    MOTIVACAO: 'text-orange-600',
    EMOCIONAL: 'text-fuchsia-600',
  };

  return colors[categoria] || 'text-gray-600';
}

/**
 * Formata duração em minutos
 */
export function formatarDuracao(minutos: number): string {
  if (minutos < 1) return 'Menos de 1 min';
  if (minutos === 1) return '1 minuto';
  if (minutos < 60) return `${minutos} minutos`;
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (mins === 0) return `${horas}h`;
  return `${horas}h ${mins}min`;
}
