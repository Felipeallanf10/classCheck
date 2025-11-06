'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { contatoSchema, type ContatoData } from '@/lib/validations/contato'
import { useToast } from '@/hooks/use-toast'

const assuntos = [
  'Dúvida sobre funcionalidades',
  'Problema técnico',
  'Sugestão de melhoria',
  'Relatório de bug',
  'Solicitação de suporte',
  'Feedback geral',
  'Outro'
]

export function ContatoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ContatoData>({
    resolver: zodResolver(contatoSchema)
  })

  const assuntoValue = watch('assunto')

  const onSubmit = async (data: ContatoData) => {
    setIsSubmitting(true)
    
    try {
      // Simulação de envio (mock)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Dados do contato:', data)
      
      setIsSuccess(true)
      toast.success({
        title: "Mensagem enviada com sucesso! ✅",
        description: "Entraremos em contato em breve. Obrigado!",
      })
      
      reset()
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
      
    } catch (error) {
      toast.error({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns instantes.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-foreground">
              Mensagem Enviada!
            </h3>
            <p className="text-muted-foreground">
              Obrigado por entrar em contato. Responderemos em breve!
            </p>
            <Button 
              onClick={() => setIsSuccess(false)}
              variant="outline"
            >
              Enviar Nova Mensagem
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Entre em Contato</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo e responderemos o mais breve possível.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                {...register('nome')}
                disabled={isSubmitting}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assunto">Assunto *</Label>
            <Select
              value={assuntoValue}
              onValueChange={(value) => setValue('assunto', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o assunto" />
              </SelectTrigger>
              <SelectContent>
                {assuntos.map((assunto) => (
                  <SelectItem key={assunto} value={assunto}>
                    {assunto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assunto && (
              <p className="text-sm text-destructive">{errors.assunto.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem *</Label>
            <Textarea
              id="mensagem"
              placeholder="Digite sua mensagem aqui..."
              rows={6}
              {...register('mensagem')}
              disabled={isSubmitting}
            />
            {errors.mensagem && (
              <p className="text-sm text-destructive">{errors.mensagem.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
