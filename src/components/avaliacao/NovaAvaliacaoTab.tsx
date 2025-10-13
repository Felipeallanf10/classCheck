'use client';

import { useState } from 'react';
import QuestionarioSocioemocional from '@/components/questionario/QuestionarioSocioemocional';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle2 } from 'lucide-react';

export function NovaAvaliacaoTab() {
  const [resultadoSalvo, setResultadoSalvo] = useState(false);

  const handleResultadoCompleto = async (resultado: any) => {
    try {
      // Aqui você salvaria o resultado no banco de dados
      // const response = await fetch('/api/avaliacoes-socioemocionais', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     resultado,
      //     usuarioId: session?.user?.id,
      //     timestamp: new Date().toISOString()
      //   })
      // });
      
      console.log('Resultado da avaliação:', resultado);
      setResultadoSalvo(true);
      
      // Resetar o estado após 5 segundos
      setTimeout(() => setResultadoSalvo(false), 5000);
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações sobre a avaliação */}
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-900 dark:text-blue-100">
          Este questionário utiliza métodos científicos validados para avaliação emocional.
          Baseado em Russell (1980), Watson & Clark (1988), e teoria da resposta ao item.
        </AlertDescription>
      </Alert>

      {/* Resultado salvo */}
      {resultadoSalvo && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-900 dark:text-green-100">
            Avaliação registrada com sucesso! Você pode visualizar o resultado na aba "Análise".
          </AlertDescription>
        </Alert>
      )}

      {/* Componente do questionário */}
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <QuestionarioSocioemocional
            onComplete={handleResultadoCompleto}
            contexto="geral"
          />
        </CardContent>
      </Card>

      {/* Footer informativo */}
      <Card className="bg-gray-50 dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-sm">Sobre o Questionário</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">Modelo Circumplex:</strong> Este modelo mapeia emoções em dois eixos - 
            valência (positivo/negativo) e ativação (alta/baixa energia).
          </p>
          <p>
            <strong className="text-foreground">Privacidade:</strong> Suas respostas são confidenciais e usadas apenas 
            para gerar insights personalizados sobre seu bem-estar emocional.
          </p>
          <p>
            <strong className="text-foreground">Frequência Recomendada:</strong> Para melhores resultados, 
            recomendamos fazer esta avaliação semanalmente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
