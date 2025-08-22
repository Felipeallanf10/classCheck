'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RatingStars } from "./RatingStars"
import { HumorSelector } from "./HumorSelector"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { avaliacaoSchema, type AvaliacaoFormData } from "@/lib/validations/avaliacao"
import { cn } from "@/lib/utils"

interface AvaliacaoFormProps {
  aulaTitle?: string
  onSubmit?: (data: AvaliacaoFormData) => void
  isLoading?: boolean
  className?: string
}

export function AvaliacaoForm({ 
  aulaTitle = "Aula", 
  onSubmit,
  isLoading = false,
  className 
}: AvaliacaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      humor: 0,
      nota: 0,
      feedback: ""
    }
  })

  const watchedValues = watch()
  const feedbackLength = watchedValues.feedback?.length || 0

  const handleFormSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (onSubmit) {
        onSubmit(data)
      }
      
      toast.success({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada com sucesso."
      })
      
      reset()
    } catch (error) {
      toast.error({
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua avaliação. Tente novamente."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-4xl shadow-2xl border-0 overflow-hidden hover-lift", className)}>
      {/* Header do formulário com gradiente */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white gradient-animated">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm mb-3 animate-float">
            <span className="text-2xl">⭐</span>
          </div>
          <h2 className="text-2xl font-bold animate-slide-up">
            Como foi sua experiência?
          </h2>
          <p className="text-emerald-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Sua opinião é valiosa para {aulaTitle}
          </p>
        </div>
      </div>

      <CardContent className="p-8 space-y-8">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2 mb-8 animate-fade-in-scale">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-500",
              watchedValues.humor > 0 ? "bg-emerald-500 scale-110 animate-bounce-in" : "bg-gray-200"
            )}></div>
            <div className={cn(
              "w-8 h-1 rounded transition-all duration-500",
              watchedValues.humor > 0 ? "bg-emerald-500" : "bg-gray-200"
            )}></div>
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-500",
              watchedValues.nota > 0 ? "bg-emerald-500 scale-110 animate-bounce-in" : "bg-gray-200"
            )}></div>
            <div className={cn(
              "w-8 h-1 rounded transition-all duration-500",
              watchedValues.nota > 0 ? "bg-emerald-500" : "bg-gray-200"
            )}></div>
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-500",
              feedbackLength > 0 ? "bg-emerald-500 scale-110 animate-bounce-in" : "bg-gray-200"
            )}></div>
          </div>

          {/* Seção 1: Humor */}
          <div className="space-y-4 animate-slide-up">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Como você se sentiu durante a aula?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Selecione o emoji que melhor representa seu humor
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 hover-lift">
              <HumorSelector
                value={watchedValues.humor}
                onChange={(humor) => setValue("humor", humor)}
                readonly={isSubmitting || isLoading}
              />
              {errors.humor && (
                <p className="text-sm text-red-500 mt-3 text-center animate-bounce-in">{errors.humor.message}</p>
              )}
            </div>
          </div>

          {/* Divisor decorativo */}
          <div className="flex items-center justify-center py-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent animate-shimmer"></div>
          </div>

          {/* Seção 2: Avaliação */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Qual nota você daria para esta aula?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Clique nas estrelas para avaliar
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 hover-lift">
              <div className="flex flex-col items-center space-y-4">
                <RatingStars
                  value={watchedValues.nota}
                  onChange={(nota) => setValue("nota", nota)}
                  readonly={isSubmitting || isLoading}
                  size="lg"
                />
                {watchedValues.nota > 0 && (
                  <div className="text-center space-y-1 animate-bounce-in">
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                      {watchedValues.nota === 1 && "Precisa melhorar muito"}
                      {watchedValues.nota === 2 && "Pode melhorar"}
                      {watchedValues.nota === 3 && "Regular"}
                      {watchedValues.nota === 4 && "Boa aula!"}
                      {watchedValues.nota === 5 && "Excelente!"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Obrigado pela sua avaliação!
                    </p>
                  </div>
                )}
              </div>
              {errors.nota && (
                <p className="text-sm text-red-500 mt-3 text-center animate-bounce-in">{errors.nota.message}</p>
              )}
            </div>
          </div>

          {/* Divisor decorativo */}
          <div className="flex items-center justify-center py-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent animate-shimmer"></div>
          </div>

          {/* Seção 3: Feedback */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Quer compartilhar mais detalhes?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Seu feedback ajuda a melhorar a experiência para todos
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 hover-lift">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="feedback" className="text-base font-medium text-slate-700 dark:text-slate-300">
                    Feedback adicional (opcional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm transition-colors duration-300",
                      feedbackLength > 450 ? "text-red-500" : 
                      feedbackLength > 0 ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {feedbackLength}/500
                    </span>
                    {feedbackLength > 0 && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                <Textarea
                  id="feedback"
                  placeholder="O que você achou da aula? Como foi a explicação do professor? Algo que poderia ser melhorado?"
                  {...register("feedback")}
                  disabled={isSubmitting || isLoading}
                  className="min-h-[140px] resize-none border-0 bg-white/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-700 transition-all duration-300 focus-ring"
                />
                {errors.feedback && (
                  <p className="text-sm text-red-500 animate-bounce-in">{errors.feedback.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botão de envio melhorado */}
          <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus-ring gradient-animated"
              disabled={isSubmitting || isLoading || (watchedValues.humor === 0 && watchedValues.nota === 0)}
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando sua avaliação...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>✨</span>
                  Enviar Avaliação
                  <span>🚀</span>
                </div>
              )}
            </Button>
            
            {/* Informação adicional */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 animate-fade-in-scale" style={{ animationDelay: '0.8s' }}>
              Sua avaliação é anônima e ajuda a melhorar a qualidade do ensino
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
