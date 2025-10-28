/**
 * Página de Sessão Ativa - /avaliacoes/sessao/[id]
 * Integra: ProgressBar + PerguntaRenderer + AlertaPanel
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressBarAdaptativo } from '@/components/avaliacoes/ProgressBarAdaptativo';
import { PerguntaRenderer } from '@/components/avaliacoes/PerguntaRenderer';
import { AlertaPanel } from '@/components/avaliacoes/AlertaPanel';
import { SessaoControles } from '@/components/avaliacoes/SessaoControles';
import { useSessao, useSubmeterResposta, useTempoDecorrido } from '@/hooks/useSessao';
import { Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SessaoPage() {
  const params = useParams();
  const router = useRouter();
  const sessaoId = params.id as string;

  const [tempoInicioPergunta, setTempoInicioPergunta] = useState(Date.now());
  const [respostaAtual, setRespostaAtual] = useState<any>(null);

  const { data: sessao, isLoading, error } = useSessao(sessaoId);
  const submeter = useSubmeterResposta();
  const tempoDecorrido = useTempoDecorrido(sessao?.iniciadoEm, sessao?.pausadoEm);

  // Reset tempo ao trocar de pergunta
  useEffect(() => {
    if (sessao?.perguntaAtual) {
      setTempoInicioPergunta(Date.now());
      setRespostaAtual(null);
    }
  }, [sessao?.perguntaAtual?.id]);

  // Redireciona se sessão finalizada
  useEffect(() => {
    if (sessao?.status === 'FINALIZADA') {
      router.push(`/avaliacoes/resultado/${sessaoId}`);
    }
  }, [sessao?.status, sessaoId, router]);

  useEffect(() => {
    console.log('[SessaoPage] Dados da sessão:', {
      sessaoId,
      status: sessao?.status,
      temPerguntaAtual: !!sessao?.perguntaAtual,
      perguntaAtualId: sessao?.perguntaAtual?.id,
      questionarioId: sessao?.questionario?.id,
      questionarioTitulo: sessao?.questionario?.titulo,
      totalPerguntasEstimado: sessao?.totalPerguntasEstimado,
      perguntasRespondidas: sessao?.respostas?.length,
    });
  }, [sessao, sessaoId]);

  const handleSubmeterResposta = (resposta: any) => {
    console.log('[handleSubmeterResposta] Chamado com:', {
      resposta,
      perguntaAtualId: sessao?.perguntaAtual?.id,
      temSessao: !!sessao,
      temPerguntaAtual: !!sessao?.perguntaAtual,
    });

    if (!sessao?.perguntaAtual) {
      console.error('[handleSubmeterResposta] Sem sessão ou pergunta atual');
      return;
    }

    const tempoResposta = Math.floor((Date.now() - tempoInicioPergunta) / 1000);

    console.log('[handleSubmeterResposta] Submetendo:', {
      sessaoId,
      perguntaId: sessao.perguntaAtual.id,
      resposta,
      tempoResposta,
    });

    submeter.mutate(
      {
        sessaoId,
        perguntaId: sessao.perguntaAtual.id,
        resposta,
        tempoResposta,
      },
      {
        onSuccess: (data) => {
          console.log('[handleSubmeterResposta] Sucesso:', data);
          toast.success('Resposta registrada!');
          
          // Se foi a última pergunta
          if (data.finalizada) {
            toast.success('Avaliação concluída!', {
              description: 'Redirecionando para os resultados...',
            });
            setTimeout(() => {
              router.push(`/avaliacoes/resultado/${sessaoId}`);
            }, 1500);
          }
        },
        onError: (error) => {
          console.error('[handleSubmeterResposta] Erro:', error);
          toast.error(`Erro ao enviar resposta: ${error.message}`);
        },
      }
    );
  };

  // Loading
  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-40 w-full" />
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
                <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Sessão</h2>
                <p className="text-muted-foreground">
                  {error?.message || 'Não foi possível carregar os dados da avaliação.'}
                </p>
              </div>
              <Button onClick={() => router.push('/avaliacoes/questionarios')}>
                Voltar para Questionários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validação adicional de dados essenciais
  if (!sessao.questionario) {
    return (
      <div className="container max-w-4xl py-16">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Dados Incompletos</h2>
                <p className="text-muted-foreground">
                  Os dados do questionário não foram carregados corretamente.
                </p>
              </div>
              <Button onClick={() => router.push('/avaliacoes/questionarios')}>
                Voltar para Questionários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sessão pausada
  if (sessao.status === 'PAUSADA') {
    return (
      <div className="container max-w-4xl py-16">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Clock className="h-12 w-12 text-yellow-600" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Avaliação Pausada</h2>
                <p className="text-muted-foreground mb-4">
                  Esta avaliação foi pausada. Clique em "Retomar" para continuar de onde parou.
                </p>
                
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                  <p><strong>Questionário:</strong> {sessao.questionario.titulo}</p>
                  <p>
                    <strong>Progresso:</strong> {sessao.progresso.perguntasRespondidas} de{' '}
                    {sessao.progresso.totalEstimado} perguntas respondidas
                  </p>
                </div>
              </div>
              
              <SessaoControles sessaoId={sessaoId} status={sessao.status} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sessão em andamento mas sem pergunta atual (carregando primeira pergunta)
  if (sessao.status === 'EM_ANDAMENTO' && !sessao.perguntaAtual && (sessao.respostas?.length || 0) === 0) {
    return (
      <div className="container max-w-4xl py-16">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Preparando Avaliação</h2>
                <p className="text-muted-foreground">
                  Aguarde enquanto carregamos a primeira pergunta...
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Questionário: {sessao.questionario.titulo}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcula progresso
  const progresso = {
    perguntasRespondidas: sessao.respostas?.length || 0,
    totalEstimado: sessao.totalPerguntasEstimado || 20,
    porcentagem: sessao.respostas?.length
      ? (sessao.respostas.length / (sessao.totalPerguntasEstimado || 20)) * 100
      : 0,
  };

  return (
    <div className="container max-w-7xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{sessao.questionario.titulo}</h1>
            {sessao.questionario.adaptativo && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Adaptativo
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {sessao.questionario.descricao || 'Responda com atenção às perguntas'}
          </p>
        </div>

        <SessaoControles
          sessaoId={sessaoId}
          status={sessao.status}
          disabled={submeter.isPending}
        />
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Perguntas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar */}
          <ProgressBarAdaptativo
            variant="detailed"
            progresso={progresso}
            irt={sessao.irt}
            nivelAlerta={sessao.nivelAlerta}
            tempoDecorrido={tempoDecorrido}
            adaptativo={sessao.questionario.adaptativo}
          />

          {/* Pergunta Atual */}
          {sessao.perguntaAtual ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Pergunta {progresso.perguntasRespondidas + 1} de{' '}
                      {progresso.totalEstimado}
                    </CardTitle>
                    <CardDescription>
                      {sessao.perguntaAtual.dimensao && (
                        <span className="inline-flex items-center gap-1">
                          Dimensão: <strong>{sessao.perguntaAtual.dimensao}</strong>
                        </span>
                      )}
                    </CardDescription>
                  </div>

                  {sessao.perguntaAtual.obrigatoria && (
                    <Badge variant="destructive">Obrigatória</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <PerguntaRenderer
                  pergunta={sessao.perguntaAtual as any}
                  value={respostaAtual}
                  onChange={setRespostaAtual}
                  onComplete={() => {
                    if (respostaAtual !== null && respostaAtual !== undefined) {
                      handleSubmeterResposta(respostaAtual);
                    }
                  }}
                  disabled={submeter.isPending}
                />

                {submeter.isPending && (
                  <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processando resposta...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold mb-2">
                  Todas as perguntas respondidas!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Finalize a avaliação para ver seus resultados.
                </p>
                <Button onClick={() => router.push(`/avaliacoes/resultado/${sessaoId}`)}>
                  Ver Resultados
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Alertas */}
        <div className="lg:col-span-1">
          <AlertaPanel
            compact
            sessaoId={sessaoId}
            maxAlertas={10}
            autoRefresh={true}
          />
        </div>
      </div>

      {/* Informações Adicionais (opcional) */}
      {sessao.questionario.adaptativo && sessao.irt && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Informações Técnicas (IRT)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Theta:</span>
                <p className="font-semibold">{sessao.irt.theta.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Erro:</span>
                <p className="font-semibold">{sessao.irt.erro.toFixed(3)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Confiança:</span>
                <p className="font-semibold">
                  {(sessao.irt.confianca * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
