'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmailInput, PasswordInput, LoadingButton } from '@/components/ui'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { toast: toastHelpers } = useToast()
  const searchParams = useSearchParams()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  // Verificar se há erro de autenticação na URL
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'CredentialsSignin') {
      toastHelpers.error('Email ou senha inválidos')
    } else if (error) {
      toastHelpers.error('Erro ao fazer login. Tente novamente.')
    }
  }, [searchParams, toastHelpers])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // Usar redirect: true e deixar NextAuth gerenciar o redirect completo
      // Isso garante que a sessão seja estabelecida antes do redirect
      const result = await signIn('credentials', {
        email: data.email,
        senha: data.password,
        callbackUrl: '/dashboard',
        redirect: true, // TRUE para NextAuth gerenciar tudo
      })

      // Este código só será executado se redirect: false
      // Com redirect: true, o NextAuth faz o redirect antes de retornar
      if (result?.error) {
        console.error('Erro no login:', result.error)
        toastHelpers.error("Email ou senha inválidos")
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toastHelpers.error("Erro ao fazer login. Tente novamente.")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Erro no login com Google:', error)
      toastHelpers.error('Erro ao fazer login com Google')
      setIsGoogleLoading(false)
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
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Conectando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </>
          )}
        </Button>
        
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
