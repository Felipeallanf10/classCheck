'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {  ArrowLeft, Star, Shield, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Professor {
  id: number
  nome: string
  disciplina: string
  avatar?: string
}

const criterios = [
  {
    id: 'dominioConteudo',
    nome: 'Domínio do Conteúdo',
    descricao: 'Conhecimento profundo da matéria ensinada',
    icon: '📚'
  },
  {
    id: 'clarezaExplicacao',
    nome: 'Clareza nas Explicações',
    descricao: 'Capacidade de explicar conceitos de forma compreensível',
    icon: '💡'
  },
  {
    id: 'pontualidade',
    nome: 'Pontualidade e Organização',
    descricao: 'Respeito aos horários e planejamento das aulas',
    icon: '⏰'
  },
  {
    id: 'organizacao',
    nome: 'Organização do Conteúdo',
    descricao: 'Estruturação lógica e sequencial da matéria',
    icon: '📋'
  },
  {
    id: 'acessibilidade',
    nome: 'Acessibilidade',
    descricao: 'Disponibilidade para tirar dúvidas fora da aula',
    icon: '🤝'
  },
  {
    id: 'empatia',
    nome: 'Empatia e Respeito',
    descricao: 'Tratamento respeitoso e compreensivo com os alunos',
    icon: '❤️'
  }
]

export default function AvaliarProfessorPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const professorId = params.id as string

  const [professor, setProfessor] = useState<Professor | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [jaAvaliou, setJaAvaliou] = useState(false)
  
  // Estado das notas (1-5)
  const [notas, setNotas] = useState<Record<string, number>>({
    dominioConteudo: 0,
    clarezaExplicacao: 0,
    pontualidade: 0,
    organizacao: 0,
    acessibilidade: 0,
    empatia: 0
  })
  
  const [comentario, setComentario] = useState('')

  // Verificar se já avaliou neste período
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setProfessor({
          id: Number(professorId),
          nome: 'Prof. Ana Costa',
          disciplina: 'Geografia',
          avatar: undefined
        })
        
        // Verificar se já avaliou (mock - seria API)
        const hoje = new Date()
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
        const jaAvaliouKey = `avaliacao-professor-${professorId}-${mesAtual}`
        const jaAvaliouStorage = localStorage.getItem(jaAvaliouKey)
        
        setJaAvaliou(!!jaAvaliouStorage)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [professorId])

  const handleNotaChange = (criterioId: string, nota: number) => {
    setNotas(prev => ({ ...prev, [criterioId]: nota }))
  }

  const notasPreenchidas = Object.values(notas).every(nota => nota > 0)
  const progressoPreenchimento = (Object.values(notas).filter(n => n > 0).length / criterios.length) * 100
  const mediaNotas = Object.values(notas).reduce((acc, n) => acc + n, 0) / criterios.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!notasPreenchidas) {
      toast.error({
        title: "Avaliação incompleta",
        description: "Por favor, avalie todos os critérios antes de enviar."
      })
      return
    }

    setSubmitting(true)

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Salvar no localStorage (simulação)
      const hoje = new Date()
      const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
      const jaAvaliouKey = `avaliacao-professor-${professorId}-${mesAtual}`
      localStorage.setItem(jaAvaliouKey, JSON.stringify({ notas, comentario, data: hoje.toISOString() }))
      
      toast.success("✅ Avaliação enviada com sucesso! Obrigado por contribuir para a melhoria do ensino.")
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      toast.error("Erro ao enviar avaliação. Tente novamente mais tarde.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (jaAvaliou) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-12 pb-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Você já avaliou este professor este mês</h2>
                <p className="text-muted-foreground">
                  Para manter a qualidade das avaliações, só permitimos uma avaliação por mês por professor.
                </p>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Você poderá avaliar {professor?.nome} novamente no próximo mês.
                </AlertDescription>
              </Alert>

              <Button onClick={() => router.push('/dashboard')} className="mt-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
                {professor?.nome.charAt(5).toUpperCase()}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-1">Avaliar Professor</CardTitle>
                <CardDescription className="text-base">
                  {professor?.nome} • {professor?.disciplina}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Alerta de Anonimato */}
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 dark:text-blue-300">
            <strong>Sua avaliação é anônima.</strong> O professor não saberá quem avaliou. 
            Seja honesto e construtivo para ajudar na melhoria do ensino.
          </AlertDescription>
        </Alert>

        {/* Progresso */}
        {progressoPreenchimento > 0 && progressoPreenchimento < 100 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{progressoPreenchimento.toFixed(0)}%</span>
                </div>
                <Progress value={progressoPreenchimento} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Critérios de Avaliação */}
          <div className="space-y-4">
            {criterios.map((criterio) => (
              <Card key={criterio.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <span className="text-2xl">{criterio.icon}</span>
                        {criterio.nome}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {criterio.descricao}
                      </p>
                    </div>

                    {/* Estrelas de avaliação */}
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((estrela) => (
                        <button
                          key={estrela}
                          type="button"
                          onClick={() => handleNotaChange(criterio.id, estrela)}
                          className="group transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 transition-colors ${
                              estrela <= notas[criterio.id]
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 group-hover:text-yellow-200'
                            }`}
                          />
                        </button>
                      ))}
                      {notas[criterio.id] > 0 && (
                        <span className="ml-2 text-sm font-medium text-primary">
                          {notas[criterio.id]}/5
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comentário Opcional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comentário (Opcional)</CardTitle>
              <CardDescription>
                Compartilhe suas observações, sugestões ou elogios de forma construtiva.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ex: As aulas são muito dinâmicas e os exemplos práticos ajudam bastante na compreensão..."
                rows={4}
                maxLength={500}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {comentario.length}/500 caracteres
              </p>
            </CardContent>
          </Card>

          {/* Preview da Média */}
          {notasPreenchidas && (
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Sua avaliação geral</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {mediaNotas.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(mediaNotas)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mediaNotas >= 4.5 ? '🌟 Excelente avaliação!' : 
                     mediaNotas >= 4.0 ? '👍 Muito bom!' :
                     mediaNotas >= 3.0 ? '👌 Bom' :
                     '⚠️ Pode melhorar'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botão de Envio */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!notasPreenchidas || submitting}
              className="flex-1 gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar Avaliação Anônima
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Rodapé informativo */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-center text-muted-foreground">
            💡 <strong>Lembre-se:</strong> As avaliações são uma ferramenta de melhoria contínua. 
            Suas opiniões honestas ajudam os professores a aprimorarem suas metodologias e contribuem 
            para um ambiente de aprendizado cada vez melhor.
          </p>
        </div>
      </div>
    </div>
  )
}
