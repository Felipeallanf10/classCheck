'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmailInput, PasswordInput, LoadingButton } from '@/components/ui'
import { useToast } from '@/hooks/use-toast'

// Schema de validação com Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast: toastHelpers } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // Deixar NextAuth gerenciar o redirect automaticamente (melhor para produção)
      const result = await signIn('credentials', {
        email: data.email,
        senha: data.password,
        callbackUrl: '/dashboard',
        redirect: false, // Manter false apenas para mostrar mensagem de erro
      })

      if (result?.error) {
        console.error('Erro no login:', result.error)
        toastHelpers.error("Email ou senha inválidos")
        setIsLoading(false)
      } else if (result?.ok) {
        // Login bem-sucedido - usar router.push do Next.js ao invés de window.location
        toastHelpers.success("Login realizado com sucesso!")
        
        // Usar router.push para navegação client-side adequada
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toastHelpers.error("Erro ao fazer login. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader className="text-center space-y-3">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Entre com suas credenciais para acessar o ClassCheck
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
                {...register('email')}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </span>
                <Link
                  href="/reset-password"
                  className="text-xs text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
              <PasswordInput
                placeholder="Sua senha"
                errorMessage={errors.password?.message}
                {...register('password')}
                className="w-full"
              />
            </div>
            
            <LoadingButton 
              type="submit" 
              className="w-full"
              disabled={!isValid}
              loading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
            </LoadingButton>
          </div>
        </form>
        
        {/* Google OAuth desabilitado temporariamente - não configurado */}
        {/* TODO: Configurar Google Provider no NextAuth se necessário */}
        {/* <div className="relative">
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
          <span className="ml-2">Entrar com Google</span>
        </LoadingButton> */}
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link 
            href="/cadastro" 
            className="font-medium text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
          >
            Criar conta
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
