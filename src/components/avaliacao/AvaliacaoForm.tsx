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
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Como foi sua experiência em {aulaTitle}?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Seletor de Humor */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Como você se sentiu durante a aula? *
            </Label>
            <HumorSelector
              value={watchedValues.humor}
              onChange={(humor) => setValue("humor", humor)}
              readonly={isSubmitting || isLoading}
            />
            {errors.humor && (
              <p className="text-sm text-red-500 mt-1">{errors.humor.message}</p>
            )}
          </div>

          {/* Rating de Estrelas */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Qual nota você daria para esta aula? *
            </Label>
            <div className="flex justify-center">
              <RatingStars
                value={watchedValues.nota}
                onChange={(nota) => setValue("nota", nota)}
                readonly={isSubmitting || isLoading}
                size="lg"
              />
            </div>
            {errors.nota && (
              <p className="text-sm text-red-500 mt-1">{errors.nota.message}</p>
            )}
          </div>

          {/* Feedback Textual */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="feedback" className="text-base font-medium">
                Feedback adicional (opcional)
              </Label>
              <span className={cn(
                "text-sm",
                feedbackLength > 450 ? "text-red-500" : "text-muted-foreground"
              )}>
                {feedbackLength}/500
              </span>
            </div>
            <Textarea
              id="feedback"
              placeholder="Compartilhe mais detalhes sobre sua experiência..."
              {...register("feedback")}
              disabled={isSubmitting || isLoading}
              className="min-h-[120px] resize-none"
            />
            {errors.feedback && (
              <p className="text-sm text-red-500 mt-1">{errors.feedback.message}</p>
            )}
          </div>

          {/* Botão de Envio */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || isLoading}
            size="lg"
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
