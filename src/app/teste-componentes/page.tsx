/**
 * TesteComponentes - Página para testar todos os componentes de tipos de perguntas
 * Acesse: /teste-componentes
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Likert5 } from '@/components/avaliacoes/tipos/Likert5';
import { Likert7 } from '@/components/avaliacoes/tipos/Likert7';
import { SimNao } from '@/components/avaliacoes/tipos/SimNao';
import { EscalaFrequencia } from '@/components/avaliacoes/tipos/EscalaFrequencia';
import { EscalaIntensidade } from '@/components/avaliacoes/tipos/EscalaIntensidade';
import { EscalaVisual } from '@/components/avaliacoes/tipos/EscalaVisual';
import { MultiplaEscolha } from '@/components/avaliacoes/tipos/MultiplaEscolha';
import { SelecaoMultipla } from '@/components/avaliacoes/tipos/SelecaoMultipla';
import { EmojiRating } from '@/components/avaliacoes/tipos/EmojiRating';
import { Slider } from '@/components/avaliacoes/tipos/Slider';

export default function TesteComponentesPage() {
  const [likert5Value, setLikert5Value] = useState<number>();
  const [likert7Value, setLikert7Value] = useState<number>();
  const [simNaoValue, setSimNaoValue] = useState<boolean>();
  const [frequenciaValue, setFrequenciaValue] = useState<number>();
  const [intensidadeValue, setIntensidadeValue] = useState<number>();
  const [visualValue, setVisualValue] = useState<{ x: number; y: number }>();
  const [multiplaEscolhaValue, setMultiplaEscolhaValue] = useState<string | number>();
  const [selecaoMultiplaValue, setSelecaoMultiplaValue] = useState<(string | number)[]>([]);
  const [emojiValue, setEmojiValue] = useState<number>();
  const [sliderValue, setSliderValue] = useState<number>();

  const opcoesMultiplaEscolha = [
    { id: '1', texto: 'Muito ruim', valor: 1, label: 'Muito ruim' },
    { id: '2', texto: 'Ruim', valor: 2, label: 'Ruim' },
    { id: '3', texto: 'Regular', valor: 3, label: 'Regular' },
    { id: '4', texto: 'Bom', valor: 4, label: 'Bom' },
    { id: '5', texto: 'Muito bom', valor: 5, label: 'Muito bom' },
  ];

  const opcoesSelecaoMultipla = [
    { id: 'ansiedade', texto: 'Ansiedade', valor: 1, label: 'Ansiedade' },
    { id: 'tristeza', texto: 'Tristeza', valor: 2, label: 'Tristeza' },
    { id: 'estresse', texto: 'Estresse', valor: 3, label: 'Estresse' },
    { id: 'insonia', texto: 'Insônia', valor: 4, label: 'Insônia' },
    { id: 'fadiga', texto: 'Fadiga', valor: 5, label: 'Fadiga' },
  ];

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Teste de Componentes</h1>
        <p className="text-muted-foreground">
          Visualize e teste todos os tipos de perguntas disponíveis no sistema
        </p>
      </div>

      <Tabs defaultValue="likert5" className="space-y-6">
        <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-2">
          <TabsTrigger value="likert5">Likert 5</TabsTrigger>
          <TabsTrigger value="likert7">Likert 7</TabsTrigger>
          <TabsTrigger value="frequencia">Frequência</TabsTrigger>
          <TabsTrigger value="intensidade">Intensidade</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="simnao">Sim/Não</TabsTrigger>
          <TabsTrigger value="multipla">Múltipla Escolha</TabsTrigger>
          <TabsTrigger value="selecao">Seleção Múltipla</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
          <TabsTrigger value="slider">Slider</TabsTrigger>
        </TabsList>

        {/* Likert 5 */}
        <TabsContent value="likert5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Escala Likert 5 Pontos</CardTitle>
                  <CardDescription>Usado em PSS-10 e perguntas gerais</CardDescription>
                </div>
                <Badge>LIKERT_5</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Com que frequência você se sentiu nervoso ou estressado?
              </p>
              
              <Likert5 value={likert5Value} onChange={setLikert5Value} />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {likert5Value !== undefined ? likert5Value : 'Nenhum'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Likert 7 */}
        <TabsContent value="likert7">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Escala Likert 7 Pontos</CardTitle>
                  <CardDescription>Usado em SWLS (Satisfaction With Life Scale)</CardDescription>
                </div>
                <Badge>LIKERT_7</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Na maioria das vezes, minha vida está perto do meu ideal
              </p>
              
              <Likert7 value={likert7Value} onChange={setLikert7Value} />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {likert7Value !== undefined ? likert7Value : 'Nenhum'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escala Frequência */}
        <TabsContent value="frequencia">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Escala de Frequência</CardTitle>
                  <CardDescription>Usado em PHQ-9 e GAD-7</CardDescription>
                </div>
                <Badge>ESCALA_FREQUENCIA</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Com que frequência você teve pouco interesse ou prazer em fazer as coisas?
              </p>
              
              <EscalaFrequencia value={frequenciaValue} onChange={setFrequenciaValue} />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {frequenciaValue !== undefined ? frequenciaValue : 'Nenhum'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Escala: 0 (Nenhuma vez) a 3 (Quase todos os dias)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escala Intensidade */}
        <TabsContent value="intensidade">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Escala de Intensidade</CardTitle>
                  <CardDescription>Usado em PANAS e ISI</CardDescription>
                </div>
                <Badge>ESCALA_INTENSIDADE</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Indique em que medida você se sentiu INTERESSADO durante as últimas semanas
              </p>
              
              <EscalaIntensidade value={intensidadeValue} onChange={setIntensidadeValue} />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {intensidadeValue !== undefined ? intensidadeValue : 'Nenhum'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Escala: 1 (Nada) a 5 (Extremamente)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escala Visual */}
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Escala Visual Bidimensional</CardTitle>
                  <CardDescription>Circumplex Model (Russell) - Valência x Ativação</CardDescription>
                </div>
                <Badge>ESCALA_VISUAL</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Como você se sente agora? Clique no grid ou escolha uma emoção
              </p>
              
              <EscalaVisual value={visualValue} onChange={setVisualValue} />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valores selecionados:</p>
                {visualValue ? (
                  <div className="space-y-1">
                    <p className="text-lg">
                      <span className="font-medium">Valência:</span> {visualValue.x.toFixed(2)} 
                      <span className="text-muted-foreground ml-2">
                        ({visualValue.x > 0 ? 'Positiva' : 'Negativa'})
                      </span>
                    </p>
                    <p className="text-lg">
                      <span className="font-medium">Ativação:</span> {visualValue.y.toFixed(2)}
                      <span className="text-muted-foreground ml-2">
                        ({visualValue.y > 0 ? 'Alta' : 'Baixa'})
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-primary">Nenhum</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sim/Não */}
        <TabsContent value="simnao">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pergunta Sim/Não</CardTitle>
                  <CardDescription>Perguntas binárias simples</CardDescription>
                </div>
                <Badge>SIM_NAO</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Você teve dificuldade para dormir nas últimas 2 semanas?
              </p>
              
              <SimNao value={simNaoValue} onChange={setSimNaoValue} />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {simNaoValue !== undefined ? (simNaoValue ? 'Sim' : 'Não') : 'Nenhum'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Múltipla Escolha */}
        <TabsContent value="multipla">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Múltipla Escolha</CardTitle>
                  <CardDescription>Selecione uma opção</CardDescription>
                </div>
                <Badge>MULTIPLA_ESCOLHA</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Como você avalia sua qualidade de vida?
              </p>
              
              <MultiplaEscolha 
                opcoes={opcoesMultiplaEscolha}
                value={multiplaEscolhaValue}
                onChange={setMultiplaEscolhaValue}
              />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {multiplaEscolhaValue || 'Nenhum'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seleção Múltipla */}
        <TabsContent value="selecao">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Seleção Múltipla</CardTitle>
                  <CardDescription>Selecione uma ou mais opções</CardDescription>
                </div>
                <Badge>MULTIPLA_SELECAO</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Quais sintomas você experimentou nas últimas semanas?
              </p>
              
              <SelecaoMultipla
                opcoes={opcoesSelecaoMultipla}
                value={selecaoMultiplaValue}
                onChange={setSelecaoMultiplaValue}
              />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valores selecionados:</p>
                <p className="text-lg font-bold text-primary">
                  {selecaoMultiplaValue.length > 0 
                    ? selecaoMultiplaValue.join(', ')
                    : 'Nenhum'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total: {selecaoMultiplaValue.length} opções
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emoji */}
        <TabsContent value="emoji">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Seleção por Emoji</CardTitle>
                  <CardDescription>Avaliação visual com emojis</CardDescription>
                </div>
                <Badge>EMOJI_PICKER</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Como você está se sentindo hoje?
              </p>
              
              <EmojiRating value={emojiValue} onChange={setEmojiValue} />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {emojiValue !== undefined ? emojiValue : 'Nenhum'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slider */}
        <TabsContent value="slider">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Slider Numérico</CardTitle>
                  <CardDescription>Seleção em escala contínua</CardDescription>
                </div>
                <Badge>SLIDER_NUMERICO</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">
                Em uma escala de 0 a 100, qual seu nível de estresse?
              </p>
              
              <Slider 
                value={sliderValue}
                onChange={setSliderValue}
                min={0}
                max={100}
              />
              
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Valor selecionado:</p>
                <p className="text-2xl font-bold text-primary">
                  {sliderValue !== undefined ? sliderValue : 'Nenhum'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
