'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionarioSocioemocional from '@/components/questionario/QuestionarioSocioemocional';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';

export default function AvaliacaoSocioemocionaalPage() {
  const router = useRouter();
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
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Avaliação Socioemocional</h1>
                <p className="text-sm text-gray-600">Sistema de questionário adaptativo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Baseado no Modelo Circumplex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="py-8">
        <QuestionarioSocioemocional
          onComplete={handleResultadoCompleto}
          contexto="geral"
        />
      </div>

      {/* Footer informativo */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Este questionário utiliza métodos científicos validados para avaliação emocional.
              Baseado em Russell (1980), Watson & Clark (1988), e teoria da resposta ao item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
