/**
 * Página de Listagem de Questionários - /avaliacoes/questionarios
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionarioSelector } from '@/components/avaliacoes/QuestionarioSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Brain, 
  Zap, 
  Shield, 
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';

// TODO: Substituir por autenticação real
const CURRENT_USER_ID = 52;
import { useResumoAlertas } from '@/hooks/useAlertas';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function QuestionariosPage() {
  const { data: resumo, isLoading } = useResumoAlertas();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-7xl py-8 space-y-8">
        {/* Header Hero */}
        <div className="text-center space-y-4 pt-8 pb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Avaliações Socioemocionais
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Avaliações adaptativas baseadas em IA que se ajustam ao seu perfil,
            oferecendo insights personalizados sobre seu bem-estar emocional.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Sistema Adaptativo</CardTitle>
              <CardDescription>
                Perguntas selecionadas dinamicamente usando Teoria de Resposta ao Item (IRT)
                para máxima precisão com menos questões.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Alertas Inteligentes</CardTitle>
              <CardDescription>
                Detecção automática de padrões de risco como ansiedade avaliativa,
                fadiga cognitiva e dificuldades de aprendizagem.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">100% Confidencial</CardTitle>
              <CardDescription>
                Suas respostas são privadas e utilizadas apenas para
                acompanhamento pedagógico personalizado.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Estatísticas de Alertas */}
        {!isLoading && resumo && resumo.ativos > 0 && (
          <Alert className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <Info className="h-4 w-4 text-orange-600" />
            <AlertDescription className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium text-orange-900 dark:text-orange-100">
                  Você possui {resumo.ativos} alerta{resumo.ativos > 1 ? 's' : ''} ativo{resumo.ativos > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  {resumo.porNivel.VERMELHO > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {resumo.porNivel.VERMELHO} crítico{resumo.porNivel.VERMELHO > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {resumo.porNivel.LARANJA > 0 && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">
                      {resumo.porNivel.LARANJA} moderado{resumo.porNivel.LARANJA > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {resumo.porNivel.AMARELO > 0 && (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs">
                      {resumo.porNivel.AMARELO} leve{resumo.porNivel.AMARELO > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                Ver Alertas
                <ChevronRight className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Seletor de Questionários */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-2xl font-bold">Questionários Disponíveis</h2>
              <p className="text-sm text-muted-foreground">
                Selecione um questionário para iniciar ou continuar uma avaliação
              </p>
            </div>
          </div>
          
          <QuestionarioSelector usuarioId={CURRENT_USER_ID} />
        </div>

        {/* Como Funciona */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Como Funcionam as Avaliações?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Seleção de Questionário</h4>
                  <p className="text-sm text-muted-foreground">
                    Escolha um questionário adaptado ao seu perfil e objetivos.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Respostas Adaptativas</h4>
                  <p className="text-sm text-muted-foreground">
                    O sistema seleciona perguntas baseadas nas suas respostas anteriores.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Análise em Tempo Real</h4>
                  <p className="text-sm text-muted-foreground">
                    Algoritmos de IA detectam padrões e geram alertas quando necessário.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Resultados Personalizados</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba insights detalhados e recomendações específicas para você.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ ou Dicas */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 Dicas para Melhores Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Responda com sinceridade, não há respostas certas ou erradas</p>
              <p>• Escolha um momento tranquilo sem interrupções</p>
              <p>• Leia cada questão com atenção antes de responder</p>
              <p>• Você pode pausar e continuar depois a qualquer momento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">🔒 Sua Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Todas as respostas são criptografadas e confidenciais</p>
              <p>• Apenas profissionais autorizados têm acesso aos dados</p>
              <p>• Você pode solicitar exclusão dos seus dados a qualquer momento</p>
              <p>• Nenhuma informação é compartilhada sem seu consentimento</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
