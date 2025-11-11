'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, ArrowRight } from 'lucide-react';

export default function QuestionarioRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar após 2 segundos
    const timer = setTimeout(() => {
      router.replace('/avaliacao-socioemocional');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <CardTitle>Redirecionando...</CardTitle>
          </div>
          <CardDescription>
            Esta página foi movida para uma nova localização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Nova Localização
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                /avaliacao-socioemocional
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>

          <p className="text-sm text-muted-foreground">
            O questionário agora está integrado na página de <strong>Avaliação Socioemocional</strong>, 
            com novas funcionalidades incluindo histórico e análise de resultados.
          </p>

          <div className="pt-2">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Você será redirecionado automaticamente...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
