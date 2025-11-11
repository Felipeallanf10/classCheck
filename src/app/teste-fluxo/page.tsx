"use client";

import { useEffect, useState, useRef } from 'react';
import { PerguntaRenderer } from '@/components/avaliacoes/PerguntaRenderer';
import perguntasMock from '@/data/test-perguntas.json';
import type { PerguntaSocioemocional } from '@/types/pergunta';
import { responderAleatorio } from '@/lib/test-harness/simularResposta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TesteFluxoPage() {
  const perguntas = perguntasMock as PerguntaSocioemocional[];
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [autoMode, setAutoMode] = useState(false);
  const [speedMs, setSpeedMs] = useState(800);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoMode) return;
    timerRef.current = window.setTimeout(() => {
      handleAutoStep();
    }, speedMs);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoMode, index, currentValue, speedMs]);

  const handleAutoStep = () => {
    const p = perguntas[index];
    const r = responderAleatorio(p);
    submitResponse(r);
  };

  const submitResponse = (val: any) => {
    const p = perguntas[index];
    const now = Date.now();
    setResponses((s) => [...s, { perguntaId: p.id, valor: val, tempoResposta: 1, timestamp: new Date().toISOString() }]);
    setCurrentValue(null);
    if (index < perguntas.length - 1) setIndex(index + 1);
    else setAutoMode(false);
  };

  const handleComplete = () => {
    submitResponse(currentValue);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Teste de Fluxo - Simulação</h1>
        <p className="text-muted-foreground">Use o modo automático para simular sessões completas.</p>
      </div>

      <div className="flex gap-3 mb-4">
        <Button onClick={() => setAutoMode(!autoMode)}>{autoMode ? 'Parar Automático' : 'Iniciar Automático'}</Button>
        <Button onClick={() => { setIndex(0); setResponses([]); setCurrentValue(null); }}>Reiniciar</Button>
        <Button onClick={() => {
          const blob = new Blob([JSON.stringify(responses, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `respostas_simulacao_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}>Exportar JSON</Button>
        <div className="flex items-center gap-2">
          <label className="text-sm">Velocidade (ms)</label>
          <input type="number" value={speedMs} onChange={(e) => setSpeedMs(Number(e.target.value))} className="input input-sm" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle>Pergunta {index + 1} / {perguntas.length}</CardTitle>
              <CardDescription>{perguntas[index].texto}</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">Tipo: {perguntas[index].tipoPergunta}</div>
          </div>
        </CardHeader>
        <CardContent>
          <PerguntaRenderer
            pergunta={perguntas[index]}
            value={currentValue}
            onChange={setCurrentValue}
            onComplete={handleComplete}
            showMetadata={true}
          />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Relatório (respostas até agora)</h2>
        <pre className="bg-muted p-4 rounded h-48 overflow-auto">{JSON.stringify(responses, null, 2)}</pre>
      </div>
    </div>
  );
}
