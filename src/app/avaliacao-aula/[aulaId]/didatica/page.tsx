'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle, Loader2, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Aula {
  id: string
  titulo: string
  materia: string
  professor: string
}

export default function AvaliacaoDidaticaPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const aulaId = params.aulaId as string
  
  const [aula, setAula] = useState<Aula | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Formulário
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
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (aulaId) {
      fetchAula()
    }
  }, [aulaId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Converter ritmo para número (1=muito lento, 3=adequado, 5=muito rápido)
      const ritmoNumero = ritmoAula === 'muito-lento' ? 1 : ritmoAula === 'adequado' ? 3 : 5

      const response = await fetch('/api/avaliacoes/didatica', {
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

      if (response.ok) {
        toast.success("Avaliação enviada! Obrigado pelo seu feedback.")
        router.push(`/avaliacao-aula/${aulaId}/concluida`)
      } else {
        throw new Error('Erro ao enviar avaliação')
      }
    } catch (error) {
      toast.error("Não foi possível enviar a avaliação.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = () => {
    router.push(`/avaliacao-aula/${aulaId}/concluida?didatica=pulada`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const socioemocionalConcluida = searchParams.get('socioemocional') === 'concluida'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/aulas')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          {socioemocionalConcluida && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Avaliação socioemocional concluída! Agora avalie o conteúdo da aula (opcional).
              </AlertDescription>
            </Alert>
          )}

          <div>
            <h1 className="text-2xl font-bold mb-2">Avaliação Didática</h1>
            <p className="text-muted-foreground">{aula?.titulo}</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Compreensão do Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle>Compreensão do Conteúdo</CardTitle>
              <CardDescription>O quanto você entendeu o conteúdo apresentado?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((nivel) => (
                  <button
                    key={nivel}
                    type="button"
                    onClick={() => setCompreensaoConteudo(nivel)}
                    className={`p-2 ${compreensaoConteudo >= nivel ? 'text-yellow-500' : 'text-gray-300'}`}
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
              <CardTitle>Ritmo da Aula</CardTitle>
              <CardDescription>A velocidade da aula estava adequada?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { value: 'muito-lento', label: 'Muito lento' },
                  { value: 'adequado', label: 'Adequado' },
                  { value: 'muito-rapido', label: 'Muito rápido' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRitmoAula(option.value)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                      ritmoAula === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recursos Didáticos */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos Didáticos</CardTitle>
              <CardDescription>Slides, exemplos, materiais foram úteis?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((nivel) => (
                  <button
                    key={nivel}
                    type="button"
                    onClick={() => setRecursosDidaticos(nivel)}
                    className={`p-2 ${recursosDidaticos >= nivel ? 'text-yellow-500' : 'text-gray-300'}`}
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
              <CardTitle>Seu Engajamento</CardTitle>
              <CardDescription>O quanto você se envolveu com a aula?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((nivel) => (
                  <button
                    key={nivel}
                    type="button"
                    onClick={() => setEngajamento(nivel)}
                    className={`p-2 ${engajamento >= nivel ? 'text-yellow-500' : 'text-gray-300'}`}
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
              <CardTitle>Feedback (Opcional)</CardTitle>
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
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
            >
              Pular Esta Etapa
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Avaliação'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
