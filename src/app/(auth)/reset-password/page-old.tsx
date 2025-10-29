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
import { Loader2 } from 'lucide-react'

// Schema de validação com Zod
const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    console.log('Dados do reset de senha:', data)
    
    // Simula chamada de API
    setTimeout(() => {
      setIsLoading(false)
      // Poderia redirecionar para login com mensagem de sucesso
      alert('Link de recuperação enviado para seu email!')
    }, 2000)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Recuperar senha</CardTitle>
        <CardDescription>
          Digite seu email para receber as instruções de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            <div className="grid gap-6">
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
              
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                Você receberá um email com instruções para redefinir sua senha.
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </Button>
            </div>
            <div className="text-center text-sm">
              <Link 
                href="/login" 
                className="underline underline-offset-4"
              >
                ← Voltar para o login
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
