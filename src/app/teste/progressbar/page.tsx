/**
 * Página de Teste - ProgressBar Adaptativo
 * Visualiza todas as variantes e estados possíveis
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressBarAdaptativo } from '@/components/avaliacoes/ProgressBarAdaptativo';
import { CircularProgress } from '@/components/avaliacoes/CircularProgress';
import type { NivelAlerta } from '@/types/sessao';

export default function TesteProgressBarPage() {
  const [porcentagem, setPorcentagem] = useState(50);
  const [nivelAlerta, setNivelAlerta] = useState<NivelAlerta>('VERDE');
  const [tempo, setTempo] = useState(120);

  const progresso = {
    perguntasRespondidas: Math.floor((porcentagem / 100) * 20),
    totalEstimado: 20,
    porcentagem,
  };

  const irt = {
    theta: ((porcentagem - 50) / 50) * 2, // -2 a 2
    erro: 0.3,
    confianca: 0.85 + (porcentagem / 100) * 0.1, // 0.85 a 0.95
  };

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Teste: ProgressBar Adaptativo</h1>
        <p className="text-muted-foreground">
          Visualize todos os estados e variantes dos componentes de progresso
        </p>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Controles de Simulação</CardTitle>
          <CardDescription>Ajuste os valores para testar diferentes estados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Porcentagem */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Porcentagem: {porcentagem}%</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPorcentagem(0)}>
                  0%
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPorcentagem(25)}>
                  25%
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPorcentagem(50)}>
                  50%
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPorcentagem(75)}>
                  75%
                </Button>
                <Button size="sm" variant="outline" onClick={() => setPorcentagem(100)}>
                  100%
                </Button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={porcentagem}
              onChange={(e) => setPorcentagem(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Nível de Alerta */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nível de Alerta</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={nivelAlerta === 'VERDE' ? 'default' : 'outline'}
                onClick={() => setNivelAlerta('VERDE')}
                className={nivelAlerta === 'VERDE' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Verde
              </Button>
              <Button
                size="sm"
                variant={nivelAlerta === 'AMARELO' ? 'default' : 'outline'}
                onClick={() => setNivelAlerta('AMARELO')}
                className={nivelAlerta === 'AMARELO' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                Amarelo
              </Button>
              <Button
                size="sm"
                variant={nivelAlerta === 'LARANJA' ? 'default' : 'outline'}
                onClick={() => setNivelAlerta('LARANJA')}
                className={nivelAlerta === 'LARANJA' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                Laranja
              </Button>
              <Button
                size="sm"
                variant={nivelAlerta === 'VERMELHO' ? 'default' : 'outline'}
                onClick={() => setNivelAlerta('VERMELHO')}
                className={nivelAlerta === 'VERMELHO' ? 'bg-red-500 hover:bg-red-600' : ''}
              >
                Vermelho
              </Button>
            </div>
          </div>

          {/* Tempo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tempo Decorrido: {tempo}s</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setTempo(30)}>
                  30s
                </Button>
                <Button size="sm" variant="outline" onClick={() => setTempo(120)}>
                  2m
                </Button>
                <Button size="sm" variant="outline" onClick={() => setTempo(300)}>
                  5m
                </Button>
                <Button size="sm" variant="outline" onClick={() => setTempo(900)}>
                  15m
                </Button>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1800"
              step="30"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs com Variantes */}
      <Tabs defaultValue="compact" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compact">Compact</TabsTrigger>
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="circular">Circular</TabsTrigger>
        </TabsList>

        {/* Compact Variant */}
        <TabsContent value="compact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variant: Compact</CardTitle>
              <CardDescription>
                Barra minimalista para mobile, sidebar, espaços reduzidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBarAdaptativo
                variant="compact"
                progresso={progresso}
                nivelAlerta={nivelAlerta}
                tempoDecorrido={tempo}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compact sem Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBarAdaptativo
                variant="compact"
                progresso={progresso}
                nivelAlerta={nivelAlerta}
                showTempo={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Default Variant */}
        <TabsContent value="default" className="space-y-4">
          <ProgressBarAdaptativo
            variant="default"
            progresso={progresso}
            nivelAlerta={nivelAlerta}
            tempoDecorrido={tempo}
            adaptativo={true}
            irt={irt}
          />

          <Card>
            <CardHeader>
              <CardTitle>Default sem IRT</CardTitle>
              <CardDescription>Para questionários não-adaptativos</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBarAdaptativo
                variant="default"
                progresso={progresso}
                nivelAlerta={nivelAlerta}
                tempoDecorrido={tempo}
                adaptativo={false}
                showIRT={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Variant */}
        <TabsContent value="detailed" className="space-y-4">
          <ProgressBarAdaptativo
            variant="detailed"
            progresso={progresso}
            nivelAlerta={nivelAlerta}
            tempoDecorrido={tempo}
            adaptativo={true}
            irt={irt}
          />
        </TabsContent>

        {/* Circular Progress */}
        <TabsContent value="circular" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Small */}
            <Card>
              <CardHeader>
                <CardTitle>Small (60px)</CardTitle>
                <CardDescription>Para cards pequenos</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <CircularProgress
                  porcentagem={porcentagem}
                  nivelAlerta={nivelAlerta}
                  size="sm"
                />
              </CardContent>
            </Card>

            {/* Medium */}
            <Card>
              <CardHeader>
                <CardTitle>Medium (100px)</CardTitle>
                <CardDescription>Tamanho padrão</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <CircularProgress
                  porcentagem={porcentagem}
                  nivelAlerta={nivelAlerta}
                  size="md"
                />
              </CardContent>
            </Card>

            {/* Large */}
            <Card>
              <CardHeader>
                <CardTitle>Large (140px)</CardTitle>
                <CardDescription>Destaque, dashboards</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <CircularProgress
                  porcentagem={porcentagem}
                  nivelAlerta={nivelAlerta}
                  size="lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Variações de Badge */}
          <Card>
            <CardHeader>
              <CardTitle>Variações de Badge e Label</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Com Badge</p>
                  <div className="flex justify-center">
                    <CircularProgress
                      porcentagem={porcentagem}
                      nivelAlerta={nivelAlerta}
                      size="md"
                      showBadge={true}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-4">Sem Badge</p>
                  <div className="flex justify-center">
                    <CircularProgress
                      porcentagem={porcentagem}
                      nivelAlerta={nivelAlerta}
                      size="md"
                      showBadge={false}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-4">Com Label</p>
                  <div className="flex justify-center">
                    <CircularProgress
                      porcentagem={porcentagem}
                      nivelAlerta={nivelAlerta}
                      size="md"
                      showLabel={true}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comparação de Níveis de Alerta */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação: Todos os Níveis de Alerta</CardTitle>
          <CardDescription>
            Como o componente se comporta em cada nível (Detailed variant)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(['VERDE', 'AMARELO', 'LARANJA', 'VERMELHO'] as NivelAlerta[]).map((nivel) => (
            <div key={nivel}>
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                Nível: {nivel}
              </h4>
              <ProgressBarAdaptativo
                variant="detailed"
                progresso={progresso}
                nivelAlerta={nivel}
                tempoDecorrido={tempo}
                adaptativo={true}
                irt={irt}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Estados Extremos */}
      <Card>
        <CardHeader>
          <CardTitle>Estados Extremos</CardTitle>
          <CardDescription>Início, meio, quase fim, completo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 0% */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Início (0%)</h4>
            <ProgressBarAdaptativo
              variant="default"
              progresso={{ perguntasRespondidas: 0, totalEstimado: 20, porcentagem: 0 }}
              nivelAlerta="VERDE"
              tempoDecorrido={0}
              adaptativo={true}
              irt={{ theta: 0, erro: 0.5, confianca: 0.5 }}
            />
          </div>

          {/* 25% */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Iniciando (25%)</h4>
            <ProgressBarAdaptativo
              variant="default"
              progresso={{ perguntasRespondidas: 5, totalEstimado: 20, porcentagem: 25 }}
              nivelAlerta="VERDE"
              tempoDecorrido={90}
              adaptativo={true}
              irt={{ theta: -0.5, erro: 0.35, confianca: 0.75 }}
            />
          </div>

          {/* 90% */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              Quase Completo (90%)
            </h4>
            <ProgressBarAdaptativo
              variant="default"
              progresso={{ perguntasRespondidas: 18, totalEstimado: 20, porcentagem: 90 }}
              nivelAlerta="LARANJA"
              tempoDecorrido={540}
              adaptativo={true}
              irt={{ theta: 1.5, erro: 0.2, confianca: 0.95 }}
            />
          </div>

          {/* 100% */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Completo (100%)</h4>
            <ProgressBarAdaptativo
              variant="default"
              progresso={{ perguntasRespondidas: 20, totalEstimado: 20, porcentagem: 100 }}
              nivelAlerta="VERDE"
              tempoDecorrido={600}
              adaptativo={true}
              irt={{ theta: 0.8, erro: 0.15, confianca: 0.98 }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
