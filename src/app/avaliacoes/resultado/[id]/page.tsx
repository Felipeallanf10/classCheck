/**
 * Página de Resultados da Avaliação - /avaliacoes/resultado/[id]
 * 
 * Exibe resultados completos da sessão finalizada:
 * - Gráfico Circumplex (Russell's Model - Valência x Ativação)
 * - Resumo IRT (theta, erro, confiança)
 * - Scores por categoria
 * - Recomendações baseadas em alertas
 * - Histórico de respostas
 * - Ações: PDF, Nova Avaliação, Ver Jornada
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessao } from '@/hooks/useSessao';
import {
  ArrowLeft,
  Download,
  Plus,
  TrendingUp,
  Brain,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Award,
  Lightbulb,
  Heart,
  Smile,
  Frown,
  Meh,
  Zap,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mapeamento de categorias para ícones e cores
const categoriaConfig = {
  BEM_ESTAR: { icon: Heart, label: 'Bem-Estar', color: 'text-pink-500' },
  HUMOR: { icon: Smile, label: 'Humor', color: 'text-yellow-500' },
  ANSIEDADE: { icon: Zap, label: 'Ansiedade', color: 'text-orange-500' },
  DEPRESSAO: { icon: Frown, label: 'Depressão', color: 'text-blue-500' },
  ESTRESSE: { icon: AlertCircle, label: 'Estresse', color: 'text-red-500' },
  SONO: { icon: Meh, label: 'Sono', color: 'text-indigo-500' },
  CONCENTRACAO: { icon: Brain, label: 'Concentração', color: 'text-purple-500' },
  MOTIVACAO: { icon: TrendingUp, label: 'Motivação', color: 'text-green-500' },
  RELACIONAMENTOS: { icon: Heart, label: 'Relacionamentos', color: 'text-pink-500' },
  AUTOESTIMA: { icon: Award, label: 'Autoestima', color: 'text-amber-500' },
  ENERGIA: { icon: Zap, label: 'Energia', color: 'text-yellow-500' },
};

// Função para determinar nível de alerta baseado no score
function getNivelAlerta(score: number): 'VERDE' | 'AMARELO' | 'LARANJA' | 'VERMELHO' {
  if (score >= 8) return 'VERDE';
  if (score >= 6) return 'AMARELO';
  if (score >= 4) return 'LARANJA';
  return 'VERMELHO';
}

// Componente de Score por Categoria
function ScoreCard({ categoria, score }: { categoria: string; score: number }) {
  const config = categoriaConfig[categoria as keyof typeof categoriaConfig] || {
    icon: BarChart3,
    label: categoria,
    color: 'text-gray-500',
  };
  const Icon = config.icon;
  const nivel = getNivelAlerta(score);
  const porcentagem = (score / 10) * 100;

  const nivelConfig = {
    VERDE: { bg: 'bg-green-500', text: 'text-green-700', label: 'Ótimo' },
    AMARELO: { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Bom' },
    LARANJA: { bg: 'bg-orange-500', text: 'text-orange-700', label: 'Atenção' },
    VERMELHO: { bg: 'bg-red-500', text: 'text-red-700', label: 'Alerta' },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-5 w-5', config.color)} />
            <CardTitle className="text-base">{config.label}</CardTitle>
          </div>
          <Badge variant="outline" className={nivelConfig[nivel].text}>
            {nivelConfig[nivel].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">{score.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">/10</span>
          </div>
          <Progress value={porcentagem} className={nivelConfig[nivel].bg} />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de Resumo IRT
function IRTSummary({ theta, erro, confianca }: { theta: number; erro: number; confianca: number }) {
  const confiancaPorcentagem = (confianca * 100).toFixed(1);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <CardTitle>Análise IRT (Teoria de Resposta ao Item)</CardTitle>
        </div>
        <CardDescription>
          Medição psicométrica baseada nas suas respostas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Theta (θ)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{theta.toFixed(2)}</span>
              <Badge variant="outline">Traço Latente</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Nível estimado do constructo medido
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Erro Padrão</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{erro.toFixed(2)}</span>
              <Badge variant="outline">Precisão</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Quanto menor, mais precisa a medição
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Confiança</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{confiancaPorcentagem}%</span>
              <Badge variant="outline">Confiabilidade</Badge>
            </div>
            <Progress value={confianca * 100} className="bg-purple-500" />
          </div>
        </div>

        <Separator />

        <div className="rounded-lg bg-muted p-4">
          <div className="flex gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">O que significa?</p>
              <p className="text-xs text-muted-foreground">
                O sistema adaptativo selecionou perguntas específicas para você,
                aumentando a precisão da avaliação. Uma confiança acima de 80% indica
                resultados altamente confiáveis.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente de Recomendações
function Recomendacoes({ scores, nivelAlerta }: { scores: Record<string, number>; nivelAlerta: string }) {
  const recomendacoes: string[] = [];

  // Análise por categoria
  Object.entries(scores).forEach(([categoria, score]) => {
    if (score < 4) {
      const config = categoriaConfig[categoria as keyof typeof categoriaConfig];
      recomendacoes.push(
        `⚠️ ${config?.label || categoria}: Score baixo detectado. Considere buscar apoio profissional.`
      );
    } else if (score < 6) {
      const config = categoriaConfig[categoria as keyof typeof categoriaConfig];
      recomendacoes.push(
        `💡 ${config?.label || categoria}: Pratique atividades que melhorem este aspecto.`
      );
    }
  });

  // Recomendações gerais
  if (nivelAlerta === 'VERMELHO') {
    recomendacoes.unshift('🚨 Nível de alerta vermelho detectado. Recomendamos conversar com um profissional de saúde mental.');
  } else if (nivelAlerta === 'LARANJA') {
    recomendacoes.unshift('⚠️ Alguns aspectos requerem atenção. Considere práticas de autocuidado.');
  } else if (nivelAlerta === 'VERDE') {
    recomendacoes.unshift('✅ Resultados positivos! Continue mantendo seus hábitos saudáveis.');
  }

  if (recomendacoes.length === 0) {
    recomendacoes.push('✅ Seus resultados estão dentro da faixa esperada. Continue assim!');
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          <CardTitle>Recomendações</CardTitle>
        </div>
        <CardDescription>
          Sugestões baseadas nos seus resultados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {recomendacoes.map((rec, idx) => (
            <li key={idx} className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{rec}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function ResultadoPage() {
  const params = useParams();
  const router = useRouter();
  const sessaoId = params.id as string;

  const { data: sessao, isLoading, error } = useSessao(sessaoId);

  useEffect(() => {
    // Redireciona se sessão ainda não finalizada
    if (sessao && sessao.status !== 'FINALIZADA') {
      toast.error('Esta sessão ainda não foi finalizada');
      router.push(`/avaliacoes/sessao/${sessaoId}`);
    }
  }, [sessao, sessaoId, router]);

  const handleNovaAvaliacao = () => {
    router.push('/avaliacoes/questionarios');
  };

  const handleVerJornada = () => {
    router.push('/jornada-emocional');
  };

  const handleBaixarPDF = () => {
    toast.info('Funcionalidade de PDF em desenvolvimento');
  };

  // Loading
  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Erro
  if (error || !sessao) {
    return (
      <div className="container max-w-4xl py-16">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Resultados</h2>
                <p className="text-muted-foreground">
                  {error?.message || 'Não foi possível carregar os resultados da avaliação.'}
                </p>
              </div>
              <Button onClick={() => router.push('/avaliacoes/questionarios')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Avaliações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scores = sessao.scoresPorCategoria || {};
  const tempoMinutos = Math.floor((sessao.tempoTotal || 0) / 60);
  const tempoSegundos = (sessao.tempoTotal || 0) % 60;

  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/avaliacoes/questionarios')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Avaliações
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resultados da Avaliação</h1>
            <p className="text-muted-foreground">
              {sessao.questionario?.titulo || 'Avaliação Socioemocional'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleBaixarPDF}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline" onClick={handleVerJornada}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Jornada
            </Button>
            <Button onClick={handleNovaAvaliacao}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Avaliação
            </Button>
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">Concluída</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Total</p>
                  <p className="text-lg font-semibold">
                    {tempoMinutos}:{tempoSegundos.toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Perguntas</p>
                  <p className="text-lg font-semibold">{sessao.respostas?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle
                  className={cn(
                    'h-8 w-8',
                    sessao.nivelAlerta === 'VERDE' && 'text-green-500',
                    sessao.nivelAlerta === 'AMARELO' && 'text-yellow-500',
                    sessao.nivelAlerta === 'LARANJA' && 'text-orange-500',
                    sessao.nivelAlerta === 'VERMELHO' && 'text-red-500'
                  )}
                />
                <div>
                  <p className="text-sm text-muted-foreground">Nível</p>
                  <p className="text-lg font-semibold">{sessao.nivelAlerta || 'VERDE'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scores">Scores por Categoria</TabsTrigger>
          <TabsTrigger value="irt">Análise IRT</TabsTrigger>
          <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
        </TabsList>

        {/* Scores */}
        <TabsContent value="scores" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(scores).map(([categoria, score]) => (
              <ScoreCard key={categoria} categoria={categoria} score={score as number} />
            ))}
          </div>

          {Object.keys(scores).length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <BarChart3 className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nenhum Score Disponível</h3>
                    <p className="text-muted-foreground">
                      Os scores serão calculados após finalizar a avaliação.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* IRT */}
        <TabsContent value="irt" className="space-y-6">
          <IRTSummary
            theta={sessao.irt?.theta || 0}
            erro={sessao.irt?.erro || 1}
            confianca={sessao.irt?.confianca || 0.5}
          />
        </TabsContent>

        {/* Recomendações */}
        <TabsContent value="recomendacoes" className="space-y-6">
          <Recomendacoes scores={scores} nivelAlerta={sessao.nivelAlerta || 'VERDE'} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
