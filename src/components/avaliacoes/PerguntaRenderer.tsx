/**
 * PerguntaRenderer - Componente principal que renderiza perguntas por tipo
 * Suporta: LIKERT_5, SLIDER_NUMERICO, EMOJI_PICKER, SIM_NAO, MULTIPLA_ESCOLHA, etc
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PerguntaSocioemocional } from '@/types/pergunta';
import { AlertCircle, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Importar componentes de tipos
import { Likert5 } from './tipos/Likert5';
import { Likert7 } from './tipos/Likert7';
import { SimNao } from './tipos/SimNao';
import { MultiplaEscolha } from './tipos/MultiplaEscolha';
import { EscalaNumerica } from './tipos/EscalaNumerica';
import { EmojiRating } from './tipos/EmojiRating';
import { TextoCurto } from './tipos/TextoCurto';
import { Slider } from './tipos/Slider';
import { SelecaoMultipla } from './tipos/SelecaoMultipla';
import { EscalaFrequencia } from './tipos/EscalaFrequencia';
import { EscalaIntensidade } from './tipos/EscalaIntensidade';
import { EscalaVisual } from './tipos/EscalaVisual';

interface PerguntaRendererProps {
  pergunta: PerguntaSocioemocional;
  value?: any;
  onChange: (value: any) => void;
  onComplete?: () => void;
  disabled?: boolean;
  showMetadata?: boolean;
}

export function PerguntaRenderer({
  pergunta,
  value,
  onChange,
  onComplete,
  disabled,
  showMetadata = false,
}: PerguntaRendererProps) {
  const [tempoInicio] = useState(Date.now());

  // Log tempo de resposta quando value mudar
  useEffect(() => {
    if (value !== undefined && value !== null) {
      const tempoResposta = Math.floor((Date.now() - tempoInicio) / 1000);
      console.log(`Tempo de resposta: ${tempoResposta}s`);
    }
  }, [value, tempoInicio]);

  const renderInput = () => {
    switch (pergunta.tipoPergunta) {
      case 'LIKERT_5':
        // Mapear opcoes para labels do componente
        const likert5Labels = pergunta.opcoes?.reduce((acc, opcao) => {
          if (typeof opcao.valor === 'number' && opcao.valor >= 1 && opcao.valor <= 5) {
            acc[opcao.valor as 1 | 2 | 3 | 4 | 5] = opcao.label || opcao.texto || `Opção ${opcao.valor}`;
          }
          return acc;
        }, {} as Record<1 | 2 | 3 | 4 | 5, string>);

        return (
          <Likert5
            value={value}
            onChange={onChange}
            disabled={disabled}
            labels={Object.keys(likert5Labels || {}).length === 5 ? likert5Labels : undefined}
          />
        );

      case 'LIKERT_7':
        // Escala Likert de 7 pontos (usado em SWLS)
        const likert7Labels = pergunta.opcoes?.reduce((acc, opcao) => {
          if (opcao.valor === 1) acc.inicio = opcao.label || opcao.texto || '';
          if (opcao.valor === 4) acc.meio = opcao.label || opcao.texto || '';
          if (opcao.valor === 7) acc.fim = opcao.label || opcao.texto || '';
          return acc;
        }, { inicio: '', meio: '', fim: '' });

        return (
          <Likert7
            value={value}
            onChange={onChange}
            disabled={disabled}
            labels={likert7Labels?.inicio ? likert7Labels : undefined}
          />
        );

      case 'ESCALA_FREQUENCIA':
        // Usado em PHQ-9, GAD-7
        const frequenciaLabels = pergunta.opcoes?.reduce((acc, opcao) => {
          if (typeof opcao.valor === 'number' && opcao.valor >= 0 && opcao.valor <= 3) {
            acc[opcao.valor as 0 | 1 | 2 | 3] = opcao.label || opcao.texto || '';
          }
          return acc;
        }, {} as Record<0 | 1 | 2 | 3, string>);

        return (
          <EscalaFrequencia
            value={value}
            onChange={onChange}
            disabled={disabled}
            labels={Object.keys(frequenciaLabels || {}).length === 4 ? frequenciaLabels : undefined}
          />
        );

      case 'ESCALA_INTENSIDADE':
        // Usado em PANAS, ISI
        const intensidadeLabels = pergunta.opcoes?.reduce((acc, opcao) => {
          if (typeof opcao.valor === 'number' && opcao.valor >= 1 && opcao.valor <= 5) {
            acc[opcao.valor as 1 | 2 | 3 | 4 | 5] = opcao.label || opcao.texto || '';
          }
          return acc;
        }, {} as Record<1 | 2 | 3 | 4 | 5, string>);

        return (
          <EscalaIntensidade
            value={value}
            onChange={onChange}
            disabled={disabled}
            labels={Object.keys(intensidadeLabels || {}).length === 5 ? intensidadeLabels : undefined}
          />
        );

      case 'ESCALA_VISUAL':
        // Usado em Circumplex Model (Russell) - Emoções bidimensionais
        return (
          <EscalaVisual
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'SIM_NAO':
        return (
          <SimNao
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'MULTIPLA_ESCOLHA':
        if (!pergunta.opcoes || pergunta.opcoes.length === 0) {
          return <Alert variant="destructive"><AlertDescription>Erro: Nenhuma opção disponível</AlertDescription></Alert>;
        }
        return (
          <MultiplaEscolha
            opcoes={pergunta.opcoes}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'MULTIPLA_ESCOLHA_MULTIPLA':
      case 'MULTIPLA_SELECAO': // Alias para múltipla seleção
        if (!pergunta.opcoes || pergunta.opcoes.length === 0) {
          return <Alert variant="destructive"><AlertDescription>Erro: Nenhuma opção disponível</AlertDescription></Alert>;
        }
        return (
          <SelecaoMultipla
            opcoes={pergunta.opcoes}
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'ESCALA_NUMERICA':
        return (
          <EscalaNumerica
            value={value}
            onChange={onChange}
            disabled={disabled}
            min={pergunta.valorMinimo ?? 0}
            max={pergunta.valorMaximo ?? 10}
          />
        );

      case 'EMOJI_RATING':
      case 'EMOJI_PICKER': // Alias para EMOJI_RATING
        return (
          <EmojiRating
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        );

      case 'SLIDER':
      case 'SLIDER_NUMERICO': // Alias para SLIDER
        return (
          <Slider
            value={value}
            onChange={onChange}
            disabled={disabled}
            min={pergunta.valorMinimo ?? 0}
            max={pergunta.valorMaximo ?? 100}
          />
        );

      case 'TEXTO_CURTO':
        return (
          <TextoCurto
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={pergunta.placeholder}
            maxLength={pergunta.valorMaximo ?? 200}
          />
        );

      case 'TEXTO_LONGO':
        // TODO: Criar componente TextoLongo (textarea)
        return (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Tipo TEXTO_LONGO em desenvolvimento
            </AlertDescription>
          </Alert>
        );


      case 'ESCALA_VISUAL_ANALOGICA':
        // Pode usar o Slider como base
        return (
          <Slider
            value={value}
            onChange={onChange}
            disabled={disabled}
            min={0}
            max={100}
            step={1}
            showValue={false}
          />
        );

      case 'CIRCUMPLEX_GRID':
      case 'DRAG_DROP':
      case 'IMAGEM_ESCOLHA':
      case 'AUDIO_RESPOSTA':
      case 'VIDEO_RESPOSTA':
        return (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Tipo {pergunta.tipoPergunta} será implementado em breve
            </AlertDescription>
          </Alert>
        );

      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tipo de pergunta não reconhecido: {pergunta.tipoPergunta}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-xl md:text-2xl leading-relaxed">
              {pergunta.texto}
            </CardTitle>
            
            {pergunta.textoAuxiliar && (
              <CardDescription className="text-base">
                {pergunta.textoAuxiliar}
              </CardDescription>
            )}
          </div>

          {pergunta.obrigatoria && (
            <Badge variant="secondary" className="shrink-0">
              Obrigatória
            </Badge>
          )}
        </div>

        {/* Instruções */}
        {pergunta.instrucoes && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>{pergunta.instrucoes}</AlertDescription>
          </Alert>
        )}

        {/* Metadata (debug) */}
        {showMetadata && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-xs space-y-1">
            <div><strong>Tipo:</strong> {pergunta.tipoPergunta}</div>
            <div><strong>Categoria:</strong> {pergunta.categoria}</div>
            {pergunta.escalaNome && (
              <div><strong>Escala:</strong> {pergunta.escalaNome} - {pergunta.escalaItem}</div>
            )}
            {pergunta.dificuldade !== undefined && (
              <div><strong>Dificuldade IRT:</strong> {pergunta.dificuldade.toFixed(2)}</div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {renderInput()}

        {/* Botão de Submissão */}
        {onComplete && (
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                console.log('[PerguntaRenderer] Botão clicado, valor:', value);
                // Permitir submissão se: valor existe OU pergunta é opcional
                const podeSubmeter = value !== null && value !== undefined;
                const perguntaOpcional = !pergunta.obrigatoria;
                
                if (podeSubmeter || perguntaOpcional) {
                  onComplete();
                } else {
                  console.warn('[PerguntaRenderer] Valor null/undefined em pergunta obrigatória, não submetendo');
                }
              }}
              disabled={disabled || (pergunta.obrigatoria && (value === null || value === undefined))}
              size="lg"
              className="gap-2"
            >
              {!pergunta.obrigatoria && (value === null || value === undefined || value === '')
                ? 'Pular Pergunta'
                : 'Próxima Pergunta'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
