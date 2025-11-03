'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Loader2, Brain, Sparkles, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Aula {
  id: string
  titulo: string
  materia: string
  professor: string
  dataHora: string
}

// TODO: Substituir por autenticação real
const CURRENT_USER_ID = 52

// ID do questionário adaptativo para avaliação de impacto de aula
// Referência: prisma/seed-questionario-aula.js
const QUESTIONARIO_TRIAGEM_ID = 'questionario-impacto-aula'

export default function AvaliarAulaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const aulaId = params.id as string
  
  const [aula, setAula] = useState<Aula | null>(null)
  const [loading, setLoading] = useState(true)
  const [iniciando, setIniciando] = useState(false)

  useEffect(() => {
    async function fetchAula() {
      try {
        const response = await fetch(`/api/aulas/${aulaId}`)
        if (!response.ok) throw new Error('Aula não encontrada')
        const data = await response.json()
        setAula(data)
      } catch {
        toast.error({
          title: "Erro",
          description: "Não foi possível carregar os dados da aula"
        })
        router.push('/aulas')
      } finally {
        setLoading(false)
      }
    }

    if (aulaId) {
      fetchAula()
    }
  }, [aulaId, router, toast])

  const handleIniciarAvaliacaoAdaptativa = async () => {
    setIniciando(true)

    try {
      // Iniciar sessão adaptativa vinculada à aula
      const response = await fetch('/api/sessoes/iniciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionarioId: QUESTIONARIO_TRIAGEM_ID,
          usuarioId: CURRENT_USER_ID,
          aulaId: parseInt(aulaId), // Vincular à aula
          contexto: {
            origem: 'avaliacao-aula',
            dispositivo: 'desktop',
            aulaId: parseInt(aulaId), // Convertido para número
            aulaTitulo: aula?.titulo,
            aulaMateria: aula?.materia,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.erro || 'Erro ao iniciar avaliação')
      }

      const data = await response.json()
      const sessaoId = data.sessao?.id || data.sessaoId
      
      if (!sessaoId) {
        throw new Error('Sessão criada mas ID não retornado')
      }

      toast.success({
        title: 'Avaliação iniciada!',
        description: 'Responda às perguntas sobre como se sentiu nesta aula.'
      })

      // Redirecionar para a sessão adaptativa
      router.push(`/avaliacoes/sessao/${sessaoId}`)
    } catch (error) {
      console.error('Erro ao iniciar avaliação:', error)
      toast.error({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível iniciar a avaliação'
      })
    } finally {
      setIniciando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!aula) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/aulas')}
            className="mb-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Card */}
        <Card className="border-2 mb-8">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mx-auto">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Você está avaliando:</p>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {aula.titulo}
              </CardTitle>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mt-3">
                <span className="flex items-center gap-2">
                  📚 {aula.materia}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span className="flex items-center gap-2">
                  👤 {aula.professor}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Informações sobre Avaliação Adaptativa */}
        <Alert className="mb-6 border-2 border-primary/20 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <strong className="font-semibold text-primary">Avaliação Adaptativa com IA</strong>
            <p className="mt-2 text-muted-foreground">
              Esta avaliação usa inteligência artificial para adaptar as perguntas ao seu perfil.
              O sistema seleciona as questões mais relevantes com base nas suas respostas,
              tornando o processo mais rápido e preciso.
            </p>
          </AlertDescription>
        </Alert>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Perguntas Inteligentes</h3>
              <p className="text-sm text-muted-foreground">
                O sistema adapta as questões em tempo real baseado nas suas respostas
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Análise Profunda</h3>
              <p className="text-sm text-muted-foreground">
                Avalia seu estado emocional usando escalas científicas validadas
              </p>
            </CardContent>
          </Card>

          <Card className="border hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Rápido e Eficiente</h3>
              <p className="text-sm text-muted-foreground">
                Menos perguntas, mais precisão. Economize tempo com avaliações inteligentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold">Pronto para começar?</h3>
              <p className="text-sm text-muted-foreground">
                A avaliação leva aproximadamente 2-5 minutos e suas respostas são totalmente confidenciais.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full h-12 text-base gap-2"
              onClick={handleIniciarAvaliacaoAdaptativa}
              disabled={iniciando}
            >
              {iniciando ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Iniciar Avaliação Adaptativa
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Você pode pausar e continuar depois a qualquer momento
            </p>
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="mt-6 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              💡 Dicas para uma avaliação eficaz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Escolha um momento tranquilo, sem interrupções</p>
            <p>• Seja honesto(a) - não há respostas certas ou erradas</p>
            <p>• Pense em como você se sentiu durante toda a aula</p>
            <p>• Leia cada pergunta com atenção antes de responder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
