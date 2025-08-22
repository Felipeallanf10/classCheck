'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

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
    
    // Simula chamada de API
    setTimeout(() => {
      setIsLoading(false)
      // Redirecionamento após sucesso
      router.push('/dashboard')
    }, 2000)
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    console.log("Login com Google")
    
    // Simula chamada de API do Google
    setTimeout(() => {
      setIsGoogleLoading(false)
      // Redirecionamento após sucesso
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Criar sua conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para acessar o ClassCheck
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  {...register('nome')}
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.nome.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.email.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.password.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.confirmPassword.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  'Criar conta'
                )}
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Entrar com Google
                </>
              )}
            </Button>
            
            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link 
                href="/login" 
                className="underline underline-offset-4"
              >
                Fazer login
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
