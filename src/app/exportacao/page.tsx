'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';

const ExportacaoRedirectPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar após 2 segundos para dar feedback visual ao usuário
    const timer = setTimeout(() => {
      router.replace('/relatorios');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          
          <h2 className="text-xl font-semibold mb-3">
            Redirecionando...
          </h2>
          
          <p className="text-gray-600 mb-4">
            A funcionalidade de exportação foi integrada à página de relatórios para uma melhor experiência.
          </p>
          
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>/exportacao</span>
            <ArrowRight className="h-4 w-4 mx-2" />
            <span>/relatorios</span>
          </div>
          
          <p className="text-xs text-gray-400 mt-4">
            Você será redirecionado automaticamente em 2 segundos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportacaoRedirectPage;
