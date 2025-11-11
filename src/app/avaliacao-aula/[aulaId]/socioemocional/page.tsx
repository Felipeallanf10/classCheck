'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2 } from 'lucide-react'
import QuestionarioSocioemocional from '@/components/questionario/QuestionarioSocioemocional'

interface Aula {
  id: string
  titulo: string
  materia: string
  professor: string
  dataHora: string
}

export default function AvaliacaoSocioemocionaalPage() {
  const params = useParams()
  const router = useRouter()
  const aulaId = params.aulaId as string
  
  const [aula, setAula] = useState<Aula | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAula() {
      try {
        const response = await fetch(`/api/aulas/${aulaId}`)
        if (!response.ok) throw new Error('Aula não encontrada')
        const data = await response.json()
        
        // DEBUG: Verificar o tipo de professor recebido
        console.log('🔍 DEBUG - Dados recebidos da API:', data)
        console.log('🔍 DEBUG - Tipo de professor:', typeof data.professor)
        console.log('🔍 DEBUG - Valor de professor:', data.professor)
        
        setAula(data)
      } catch (err) {
        setError('Não foi possível carregar os dados da aula')
      } finally {
        setLoading(false)
      }
    }

    if (aulaId) {
      fetchAula()
    }
  }, [aulaId])

  const handleComplete = async (resultado: any) => {
    try {
      // Salvar avaliação socioemocional no banco
      const response = await fetch('/api/avaliacoes/socioemocional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aulaId,
          valencia: resultado.finalPosition?.x || 0,
          ativacao: resultado.finalPosition?.y || 0,
          estadoPrimario: resultado.primaryState || 'Neutro',
          confianca: resultado.confidence || 0,
          totalPerguntas: resultado.totalQuestions || 0,
          tempoResposta: 180, // calcular tempo real depois
          respostas: JSON.stringify(resultado.responses || []),
        }),
      })

      if (response.ok) {
        // Redirecionar para página de avaliação didática (opcional)
        router.push(`/avaliacao-aula/${aulaId}/didatica?socioemocional=concluida`)
      }
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !aula) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error || 'Aula não encontrada'}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/aulas')} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Aulas
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header com informações da aula */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/aulas')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">{aula.titulo}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>📚 {aula.materia}</span>
              <span>👤 {aula.professor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questionário Socioemocional */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Avaliação Socioemocional</CardTitle>
            <p className="text-center text-muted-foreground">
              Como você se sentiu durante esta aula?
            </p>
          </CardHeader>
        </Card>

        <QuestionarioSocioemocional
          onComplete={handleComplete}
          contexto="aula"
        />
      </div>
    </div>
  )
}
