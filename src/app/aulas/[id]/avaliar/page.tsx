'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Loader2, Star, CheckCircle, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import QuestionarioSocioemocional from '@/components/questionario/QuestionarioSocioemocional'

interface Aula {
  id: string
  titulo: string
  materia: string
  professor: string
  dataHora: string
}

type Step = 'socioemocional' | 'didatica' | 'resumo'

export default function AvaliarAulaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const aulaId = params.id as string
  
  const [aula, setAula] = useState<Aula | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('socioemocional')
  
  // Dados da avaliação socioemocional
  const [socioemocionaData, setSocioemocionaData] = useState<any>(null)
  
  // Dados da avaliação didática
  const [compreensaoConteudo, setCompreensaoConteudo] = useState(3)
  const [ritmoAula, setRitmoAula] = useState('adequado')
  const [recursosDidaticos, setRecursosDidaticos] = useState(3)
  const [engajamento, setEngajamento] = useState(3)
  const [pontoPositivo, setPontoPositivo] = useState('')
  const [pontoMelhoria, setPontoMelhoria] = useState('')
  const [sugestao, setSugestao] = useState('')

  useEffect(() => {
    async function fetchAula() {
      try {
        const response = await fetch(`/api/aulas/${aulaId}`)
        if (!response.ok) throw new Error('Aula não encontrada')
        const data = await response.json()
        setAula(data)
      } catch (err) {
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

  const handleSocioemocionaComplete = async (resultado: any) => {
    setSocioemocionaData(resultado)
    setCurrentStep('didatica')
  }

  const handleSkipDidatica = () => {
    setCurrentStep('resumo')
  }

  const handleSubmitFinal = async () => {
    setSubmitting(true)

    try {
      // 1. Salvar avaliação socioemocional
      const socioResponse = await fetch('/api/avaliacoes/socioemocional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aulaId,
          valencia: socioemocionaData?.finalPosition?.x || 0,
          ativacao: socioemocionaData?.finalPosition?.y || 0,
          estadoPrimario: socioemocionaData?.primaryState || 'Neutro',
          confianca: socioemocionaData?.confidence || 0,
          totalPerguntas: socioemocionaData?.totalQuestions || 0,
          tempoResposta: 180,
          respostas: JSON.stringify(socioemocionaData?.responses || []),
        }),
      })

      if (!socioResponse.ok) throw new Error('Erro ao salvar avaliação socioemocional')

      // 2. Salvar avaliação didática (se preenchida)
      if (currentStep === 'resumo') {
        const ritmoNumero = ritmoAula === 'muito-lento' ? 1 : ritmoAula === 'adequado' ? 3 : 5

        const didaticaResponse = await fetch('/api/avaliacoes/didatica', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            aulaId,
            compreensaoConteudo,
            ritmoAula: ritmoNumero,
            recursosDidaticos,
            engajamento,
            pontoPositivo: pontoPositivo || null,
            pontoMelhoria: pontoMelhoria || null,
            sugestao: sugestao || null,
          }),
        })

        if (!didaticaResponse.ok) throw new Error('Erro ao salvar avaliação didática')
      }

      // 3. Redirecionar para página de sucesso
      router.push(`/aulas/${aulaId}/avaliar/sucesso`)
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error)
      toast.error({
        title: "Erro",
        description: "Não foi possível enviar a avaliação. Tente novamente."
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getProgress = () => {
    switch (currentStep) {
      case 'socioemocional': return 33
      case 'didatica': return 66
      case 'resumo': return 100
      default: return 0
    }
  }

  const getStepLabel = () => {
    switch (currentStep) {
      case 'socioemocional': return 'Etapa 1 de 2'
      case 'didatica': return 'Etapa 2 de 2'
      case 'resumo': return 'Revisão Final'
      default: return ''
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header com informações da aula */}
      <div className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
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
          
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Avaliando:</p>
            <h1 className="text-xl font-bold">{aula.titulo}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
              <span>📚 {aula.materia}</span>
              <span>👤 {aula.professor}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{getStepLabel()}</span>
              <span className="text-muted-foreground">{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </div>
      </div>

      {/* Conteúdo das Etapas */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep === 'socioemocional' && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-center">😊 Como você se sentiu nesta aula?</CardTitle>
                <CardDescription className="text-center">
                  Responda às perguntas para mapear suas emoções durante a aula
                </CardDescription>
              </CardHeader>
            </Card>

            <QuestionarioSocioemocional
              onComplete={handleSocioemocionaComplete}
              contexto="aula"
            />
          </div>
        )}

        {currentStep === 'didatica' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📖 Avalie os aspectos da aula</CardTitle>
                <CardDescription>
                  Esta etapa é opcional, mas seu feedback ajuda a melhorar as próximas aulas
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Compreensão do Conteúdo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compreensão do Conteúdo</CardTitle>
                <CardDescription>O quanto você entendeu o conteúdo apresentado?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((nivel) => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setCompreensaoConteudo(nivel)}
                      className={`p-2 transition-colors ${compreensaoConteudo >= nivel ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                    >
                      <Star className="h-8 w-8" fill={compreensaoConteudo >= nivel ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-center text-muted-foreground mt-2">
                  {compreensaoConteudo === 1 && 'Não entendi quase nada'}
                  {compreensaoConteudo === 2 && 'Entendi pouco'}
                  {compreensaoConteudo === 3 && 'Entendi razoavelmente'}
                  {compreensaoConteudo === 4 && 'Entendi bem'}
                  {compreensaoConteudo === 5 && 'Entendi perfeitamente'}
                </p>
              </CardContent>
            </Card>

            {/* Ritmo da Aula */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ritmo da Aula</CardTitle>
                <CardDescription>A velocidade da aula estava adequada?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { value: 'muito-lento', label: 'Muito lento', emoji: '🐌' },
                    { value: 'adequado', label: 'Adequado', emoji: '✅' },
                    { value: 'muito-rapido', label: 'Muito rápido', emoji: '⚡' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRitmoAula(option.value)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                        ritmoAula === option.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="mr-2">{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recursos Didáticos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recursos Didáticos</CardTitle>
                <CardDescription>Slides, exemplos, materiais foram úteis?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((nivel) => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setRecursosDidaticos(nivel)}
                      className={`p-2 transition-colors ${recursosDidaticos >= nivel ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                    >
                      <Star className="h-8 w-8" fill={recursosDidaticos >= nivel ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engajamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seu Engajamento</CardTitle>
                <CardDescription>O quanto você se envolveu com a aula?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((nivel) => (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setEngajamento(nivel)}
                      className={`p-2 transition-colors ${engajamento >= nivel ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                    >
                      <Star className="h-8 w-8" fill={engajamento >= nivel ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Texto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feedback Adicional (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="positivo">O que funcionou bem?</Label>
                  <Textarea
                    id="positivo"
                    value={pontoPositivo}
                    onChange={(e) => setPontoPositivo(e.target.value)}
                    placeholder="Ex: Os exemplos práticos ajudaram muito"
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="melhoria">O que pode melhorar?</Label>
                  <Textarea
                    id="melhoria"
                    value={pontoMelhoria}
                    onChange={(e) => setPontoMelhoria(e.target.value)}
                    placeholder="Ex: Poderia ter mais exercícios"
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="sugestao">Sugestões</Label>
                  <Textarea
                    id="sugestao"
                    value={sugestao}
                    onChange={(e) => setSugestao(e.target.value)}
                    placeholder="Suas sugestões para as próximas aulas"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkipDidatica}
                className="flex-1"
              >
                Pular Esta Etapa
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep('resumo')}
                className="flex-1"
              >
                Continuar
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'resumo' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resumo da Avaliação
                </CardTitle>
                <CardDescription>
                  Revise suas respostas antes de enviar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resumo Socioemocional */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    😊 Avaliação Socioemocional
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Estado emocional: <strong>{socioemocionaData?.primaryState || 'Registrado'}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valência: {(socioemocionaData?.finalPosition?.x || 0).toFixed(2)} • 
                    Ativação: {(socioemocionaData?.finalPosition?.y || 0).toFixed(2)}
                  </p>
                </div>

                {/* Resumo Didático */}
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    📖 Avaliação Didática
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Compreensão:</p>
                      <div className="flex gap-1">
                        {[...Array(compreensaoConteudo)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recursos:</p>
                      <div className="flex gap-1">
                        {[...Array(recursosDidaticos)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Engajamento:</p>
                      <div className="flex gap-1">
                        {[...Array(engajamento)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ritmo:</p>
                      <p className="font-medium">
                        {ritmoAula === 'muito-lento' && '🐌 Lento'}
                        {ritmoAula === 'adequado' && '✅ Adequado'}
                        {ritmoAula === 'muito-rapido' && '⚡ Rápido'}
                      </p>
                    </div>
                  </div>
                  
                  {(pontoPositivo || pontoMelhoria || sugestao) && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        + Feedback adicional incluído
                      </p>
                    </div>
                  )}
                </div>

                <Alert>
                  <AlertDescription>
                    Ao enviar, sua avaliação será registrada e não poderá ser alterada posteriormente.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep('didatica')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleSubmitFinal}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Enviar Avaliação
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
