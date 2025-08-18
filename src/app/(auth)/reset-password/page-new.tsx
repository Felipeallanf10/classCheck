'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmailInput, LoadingButton } from '@/components/ui'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Mail } from 'lucide-react'

// Schema de validação com Zod
const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    console.log('Dados do reset de senha:', data)
    
    try {
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Link de recuperação enviado para seu email!")
      setEmailSent(true)
    } catch (error) {
      toast.error("Erro ao enviar email. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      // Simula reenvio
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.info("Email reenviado com sucesso!")
    } catch (error) {
      toast.error("Erro ao reenviar email.")
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-success-600 dark:text-success-400" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Email enviado!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Enviamos as instruções de recuperação para <strong>{getValues('email')}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="mb-2">📧 <strong>Verifique sua caixa de entrada</strong></p>
            <p className="text-xs">
              O email pode levar alguns minutos para chegar. Se não encontrar, 
              verifique sua pasta de spam ou lixo eletrônico.
            </p>
          </div>

          <div className="space-y-3">
            <LoadingButton 
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              loading={isLoading}
              loadingText="Reenviando..."
            >
              Reenviar email
            </LoadingButton>
            
            <Link href="/login" className="w-full">
              <LoadingButton 
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o login
              </LoadingButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
          Recuperar senha
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Digite seu email para receber as instruções de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <EmailInput
                label="Email"
                placeholder="seu@email.com"
                errorMessage={errors.email?.message}
                required
                {...register('email')}
                className="w-full"
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
              💡 Você receberá um email com um link seguro para redefinir sua senha.
            </div>

            <LoadingButton 
              type="submit" 
              className="w-full"
              disabled={!isValid}
              loading={isLoading}
              loadingText="Enviando..."
            >
              Enviar link de recuperação
            </LoadingButton>
          </div>
        </form>
        
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
