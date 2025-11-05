'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para monitoramento
    console.error('Error:', error)
  }, [error])

  // Verificar se é erro de conexão com banco
  const isDatabaseError = error.message.includes("Can't reach database server")

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-600 dark:text-red-400">
            {isDatabaseError ? 'Erro de Conexão' : 'Algo deu errado'}
          </CardTitle>
          <CardDescription>
            {isDatabaseError 
              ? 'Não foi possível conectar ao banco de dados'
              : 'Ocorreu um erro inesperado'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDatabaseError && (
            <div className="space-y-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <p className="font-medium text-blue-900 dark:text-blue-100">💡 Possíveis causas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>O banco de dados Neon está em suspensão (plano gratuito)</li>
                <li>Problemas temporários de conexão</li>
                <li>O banco pode estar sobrecarregado</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={() => reset()} className="w-full">
              Tentar Novamente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Voltar para o Início
            </Button>
          </div>

          {!isDatabaseError && (
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
