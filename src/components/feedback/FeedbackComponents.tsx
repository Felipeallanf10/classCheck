/**
 * Componentes de Feedback Visual - Sistema Adaptativo
 * 
 * Componentes React para melhorar UX:
 * - Loading states
 * - Progresso visual
 * - Feedback de confiança
 * - Mensagens de erro amigáveis
 */

import React from 'react';
import { AlertCircle, CheckCircle, Info, Loader2, TrendingUp } from 'lucide-react';

// ==========================================
// Loading States
// ==========================================

export function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function SkeletonPergunta() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      
      <div className="space-y-2 mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Indicador de Progresso Inteligente
// ==========================================

interface ProgressoAdaptativoProps {
  numeroResposta: number;
  minimoEstimado: number;
  maximoEstimado: number;
  sem: number;
  confianca: number;
}

export function ProgressoAdaptativo({
  numeroResposta,
  minimoEstimado,
  maximoEstimado,
  sem,
  confianca
}: ProgressoAdaptativoProps) {
  // Calcular progresso baseado em confiança (não em número de perguntas)
  const progressoPorConfianca = Math.min(100, confianca * 100);
  const progressoPorNumero = Math.min(
    100,
    (numeroResposta / minimoEstimado) * 100
  );

  // Usar o maior dos dois
  const progresso = Math.max(progressoPorConfianca, progressoPorNumero);

  // Determinar cor baseada em qualidade
  const corProgresso =
    confianca >= 0.8
      ? 'bg-green-500'
      : confianca >= 0.6
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Progresso da Avaliação</span>
        <span className="text-muted-foreground">
          {numeroResposta} pergunta{numeroResposta !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${corProgresso}`}
          style={{ width: `${progresso}%` }}
        />
      </div>

      {/* Indicadores de qualidade */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>Confiança: {(confianca * 100).toFixed(0)}%</span>
        </div>
        <div className="text-muted-foreground">
          {numeroResposta < minimoEstimado
            ? `Pelo menos ${minimoEstimado - numeroResposta} mais`
            : 'Finalizando em breve'}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Feedback de Theta e Métricas IRT
// ==========================================

interface MetricasIRTProps {
  theta: number;
  sem: number;
  confianca: number;
  mostrarDetalhes?: boolean;
}

export function MetricasIRT({
  theta,
  sem,
  confianca,
  mostrarDetalhes = false
}: MetricasIRTProps) {
  // Normalizar theta para escala visual (-4 a +4 → 0% a 100%)
  const thetaNormalizado = ((theta + 4) / 8) * 100;

  // Determinar nível
  const nivel =
    theta > 1 ? 'Alto' : theta > -1 ? 'Moderado' : 'Baixo';

  const corNivel =
    theta > 1
      ? 'text-green-600'
      : theta > -1
      ? 'text-yellow-600'
      : 'text-red-600';

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Estimativa Atual</h4>
        <span className={`text-sm font-medium ${corNivel}`}>{nivel}</span>
      </div>

      {/* Visualização de theta */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Baixo</span>
          <span>Moderado</span>
          <span>Alto</span>
        </div>
        <div className="relative w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full">
          <div
            className="absolute top-0 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-md transform -translate-y-0.5 transition-all duration-500"
            style={{ left: `calc(${thetaNormalizado}% - 6px)` }}
          />
        </div>
      </div>

      {mostrarDetalhes && (
        <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
          <div className="text-center">
            <div className="text-muted-foreground">θ (Theta)</div>
            <div className="font-semibold">{theta.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Erro (SEM)</div>
            <div className="font-semibold">{sem.toFixed(3)}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Confiança</div>
            <div className="font-semibold">{(confianca * 100).toFixed(0)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Mensagens de Erro Amigáveis
// ==========================================

interface ErroAmigavelProps {
  tipo: 'validacao' | 'rede' | 'servidor' | 'timeout' | 'generico';
  mensagem?: string;
  onTentarNovamente?: () => void;
}

export function ErroAmigavel({
  tipo,
  mensagem,
  onTentarNovamente
}: ErroAmigavelProps) {
  const configs = {
    validacao: {
      icone: AlertCircle,
      titulo: 'Ops! Algo não está certo',
      mensagemPadrao: 'Por favor, verifique os dados e tente novamente.',
      cor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      acao: 'Corrija e tente novamente'
    },
    rede: {
      icone: AlertCircle,
      titulo: 'Problema de conexão',
      mensagemPadrao: 'Não foi possível conectar ao servidor. Verifique sua internet.',
      cor: 'text-orange-600 bg-orange-50 border-orange-200',
      acao: 'Tentar novamente'
    },
    servidor: {
      icone: AlertCircle,
      titulo: 'Erro no servidor',
      mensagemPadrao: 'Ocorreu um erro em nossos servidores. Tente novamente em instantes.',
      cor: 'text-red-600 bg-red-50 border-red-200',
      acao: 'Tentar novamente'
    },
    timeout: {
      icone: AlertCircle,
      titulo: 'Tempo esgotado',
      mensagemPadrao: 'A operação demorou muito. Tente novamente.',
      cor: 'text-orange-600 bg-orange-50 border-orange-200',
      acao: 'Tentar novamente'
    },
    generico: {
      icone: AlertCircle,
      titulo: 'Algo deu errado',
      mensagemPadrao: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      cor: 'text-red-600 bg-red-50 border-red-200',
      acao: 'Tentar novamente'
    }
  };

  const config = configs[tipo];
  const Icone = config.icone;

  return (
    <div
      className={`rounded-lg border p-4 ${config.cor}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <Icone className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold">{config.titulo}</h4>
          <p className="text-sm">
            {mensagem || config.mensagemPadrao || config.acao}
          </p>
          {onTentarNovamente && (
            <button
              onClick={onTentarNovamente}
              className="text-sm font-medium underline hover:no-underline"
            >
              {config.acao}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Feedback de Sucesso
// ==========================================

interface FeedbackSucessoProps {
  titulo: string;
  mensagem?: string;
  onContinuar?: () => void;
}

export function FeedbackSucesso({
  titulo,
  mensagem,
  onContinuar
}: FeedbackSucessoProps) {
  return (
    <div
      className="rounded-lg border border-green-200 bg-green-50 text-green-800 p-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold">{titulo}</h4>
          {mensagem && <p className="text-sm">{mensagem}</p>}
          {onContinuar && (
            <button
              onClick={onContinuar}
              className="text-sm font-medium underline hover:no-underline"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Info Box
// ==========================================

interface InfoBoxProps {
  titulo: string;
  mensagem: string;
}

export function InfoBox({ titulo, mensagem }: InfoBoxProps) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 text-blue-800 p-4">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-sm">{titulo}</h4>
          <p className="text-sm">{mensagem}</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Transições Suaves
// ==========================================

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {children}
    </div>
  );
}
