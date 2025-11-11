'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input, EmailInput, PasswordInput, LoadingButton } from '@/components/ui'
import { useToast } from '@/hooks/use-toast'

// Schema de validação com Zod
const cadastroSchema = z.object({
  nome: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .min(1, 'Nome é obrigatório'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type CadastroFormData = z.infer<typeof cadastroSchema>

// Componente do ícone do Google
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export default function CadastroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: CadastroFormData) => {
    setIsLoading(true)
    console.log('Dados do cadastro:', data)
    
    try {
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Conta criada com sucesso!")
      
      // Redirecionamento após sucesso
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch {
      toast.error("Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    console.log("Cadastro com Google")
    
    try {
      // Simula chamada de API do Google
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Cadastro com Google realizado!")
      
      // Redirecionamento após sucesso
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch {
      toast.error("Erro no cadastro com Google. Tente novamente.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
          Criar sua conta
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Preencha os dados abaixo para acessar o ClassCheck
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                label="Nome completo"
                placeholder="Seu nome completo"
                errorMessage={errors.nome?.message}
                required
                {...register('nome')}
                className="w-full"
              />
            </div>
            
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
            
            <div className="space-y-2">
              <PasswordInput
                label="Senha"
                placeholder="Crie uma senha"
                errorMessage={errors.password?.message}
                required
                {...register('password')}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <PasswordInput
                label="Confirmar senha"
                placeholder="Confirme sua senha"
                errorMessage={errors.confirmPassword?.message}
                required
                {...register('confirmPassword')}
                className="w-full"
              />
            </div>
            
            <LoadingButton 
              type="submit" 
              className="w-full"
              disabled={!isValid}
              loading={isLoading}
              loadingText="Criando conta..."
            >
              Criar conta
            </LoadingButton>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
              ou continue com
            </span>
          </div>
        </div>
        
        <LoadingButton 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleLogin}
          loading={isGoogleLoading}
          loadingText="Conectando..."
        >
          <GoogleIcon />
          <span className="ml-2">Cadastrar com Google</span>
        </LoadingButton>
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <Link 
            href="/login" 
            className="font-medium text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
          >
            Fazer login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
