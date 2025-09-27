// Dashboard Components - ClassCheck
// Seção 2.6: Dashboard & Relatórios Completo
// Sistema enterprise com 8 componentes integrados

// Componentes Originais (Professor)
export { default as DashboardProfessor } from './DashboardProfessor';
export { default as MetricasTurma } from './MetricasTurma';
export { default as TabelaAlunos } from './TabelaAlunos';
export { default as AlertasUrgentes } from './AlertasUrgentes';

// Componente Principal Unificado
export { DashboardUnificado } from './DashboardUnificado'

// Componentes de Dados e Estatísticas
export { CardsEstatisticas } from './CardsEstatisticas'
export { FiltrosAvancados } from './FiltrosAvancados'

// Componentes de Calendário e Eventos
export { CalendarioEventos } from './CalendarioEventos'

// Componentes de Exportação e Relatórios
export { GeradorPDF } from './GeradorPDF'
export { SistemaExportacao } from './SistemaExportacao'

// Componentes de Personalização
export { WidgetManager } from './WidgetManager'

// Componentes de Estado e Loading
export { 
  DashboardSkeleton, 
  WidgetSkeleton, 
  ListaSkeleton, 
  FormSkeleton 
} from './DashboardSkeleton'
