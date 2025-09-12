'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import VisualizacaoCircumplex from '@/components/questionario/VisualizacaoCircumplex'
import GraficoEvolucionEmocional from '@/components/questionario/GraficoEvolucionEmocional'
import { TrendingUp, Brain, Target, AlertCircle } from 'lucide-react'

export default function AnaliseQuestionarioPage() {
  const [dadosAnalise, setDadosAnalise] = useState({
    estadoDominante: 'Focado',
    tendencia: 'Estável',
    pontuacaoGeral: 7.8,
    recomendacoes: [
      'Manter rotina de exercícios para regulação emocional',
      'Praticar técnicas de respiração antes de apresentações',
      'Estabelecer pausas regulares durante estudos intensos'
    ]
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Análise Psicométrica</h1>
          <p className="text-muted-foreground">
            Insights científicos sobre seu perfil socioemocional
          </p>
        </div>
        <Button>
          <Brain className="mr-2 h-4 w-4" />
          Relatório Completo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Dominante</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosAnalise.estadoDominante}</div>
            <p className="text-xs text-muted-foreground">
              Baseado em 15 avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosAnalise.tendencia}</div>
            <p className="text-xs text-muted-foreground">
              Últimas 4 semanas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação Geral</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dadosAnalise.pontuacaoGeral}/10</div>
            <p className="text-xs text-muted-foreground">
              Bem-estar socioemocional
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="circumplex" className="space-y-4">
        <TabsList>
          <TabsTrigger value="circumplex">Modelo Circumplex</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução Temporal</TabsTrigger>
          <TabsTrigger value="padroes">Padrões</TabsTrigger>
          <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="circumplex" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posicionamento no Modelo Circumplex</CardTitle>
              <CardDescription>
                Visualização científica baseada no modelo de Russell (1980)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VisualizacaoCircumplex 
                posicaoAtual={{ valence: 0.3, arousal: 0.6, confidence: 0.85 }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolucao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Emocional</CardTitle>
              <CardDescription>
                Acompanhamento longitudinal dos estados emocionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoEvolucionEmocional 
                responses={[
                  { questionId: 'humor_1', answer: 4, timestamp: Date.now() - 432000000 },
                  { questionId: 'humor_2', answer: 5, timestamp: Date.now() - 345600000 },
                  { questionId: 'humor_3', answer: 2, timestamp: Date.now() - 259200000 },
                  { questionId: 'humor_4', answer: 4, timestamp: Date.now() - 172800000 },
                  { questionId: 'humor_5', answer: 5, timestamp: Date.now() - 86400000 }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="padroes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Padrões Semanais</CardTitle>
                <CardDescription>Variações ao longo da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Segunda-feira</span>
                    <span className="text-sm font-medium">Ansioso (65%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Terça-feira</span>
                    <span className="text-sm font-medium">Focado (80%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quarta-feira</span>
                    <span className="text-sm font-medium">Feliz (75%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quinta-feira</span>
                    <span className="text-sm font-medium">Cansado (60%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sexta-feira</span>
                    <span className="text-sm font-medium">Relaxado (85%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gatilhos Identificados</CardTitle>
                <CardDescription>Situações que influenciam o estado emocional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Apresentações orais → Ansiedade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Atividades em grupo → Felicidade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Estudos matinais → Foco</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Exercícios → Motivação</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recomendacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Personalizadas</CardTitle>
              <CardDescription>
                Baseadas em evidências científicas e seu perfil psicométrico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dadosAnalise.recomendacoes.map((recomendacao, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm flex-1">{recomendacao}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
