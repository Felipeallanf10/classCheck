'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Home, ArrowLeft, Mail, HelpCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PageContainer } from '@/components/shared/PageContainer'

// Sugestões de páginas populares
const suggestedPages = [
  { name: 'Dashboard', path: '/dashboard', description: 'Visão geral das suas atividades' },
  { name: 'Avaliações', path: '/avaliacoes', description: 'Avalie suas aulas e professores' },
  { name: 'Relatórios', path: '/relatorios', description: 'Consulte relatórios e estatísticas' },
  { name: 'Aulas', path: '/aulas', description: 'Gerencie suas aulas e horários' },
  { name: 'Central de Ajuda', path: '/ajuda', description: 'Encontre respostas para suas dúvidas' },
  { name: 'Contato', path: '/contato', description: 'Entre em contato conosco' }
]

// Links úteis
const helpfulLinks = [
  { name: 'Sobre o ClassCheck', path: '/sobre' },
  { name: 'Política de Privacidade', path: '/politica-de-privacidade' },
  { name: 'Termos de Uso', path: '/termos-de-uso' },
  { name: 'Central de Ajuda', path: '/ajuda' }
]

export default function NotFoundPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [countdown, setCountdown] = useState(10)
  const [autoRedirect, setAutoRedirect] = useState(true)

  // Countdown para redirecionamento automático
  useEffect(() => {
    if (!autoRedirect) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, autoRedirect])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirecionar para busca ou página relevante
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const cancelAutoRedirect = () => {
    setAutoRedirect(false)
  }

  return (
    <PageContainer maxWidth="3xl">
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8">
        
        {/* Ilustração e erro principal */}
        <div className="space-y-6">
          <div className="text-8xl md:text-9xl font-bold text-primary/20 select-none">
            404
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Página não encontrada
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Ops! A página que você está procurando não existe ou foi movida para outro local.
            </p>
          </div>
        </div>

        {/* Busca rápida */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-lg">🔍 Buscar na plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Digite o que você procura..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Ações principais */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            size="lg"
            className="min-w-[140px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <Button 
            onClick={() => router.push('/dashboard')} 
            size="lg"
            className="min-w-[140px]"
          >
            <Home className="mr-2 h-4 w-4" />
            Ir para Home
          </Button>

          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="lg"
            className="min-w-[140px]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Recarregar
          </Button>
        </div>

        {/* Contador de redirecionamento */}
        {autoRedirect && countdown > 0 && (
          <Card className="w-full max-w-md border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Redirecionando para o Dashboard em <strong>{countdown}</strong> segundos
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={cancelAutoRedirect}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-900"
                >
                  Cancelar redirecionamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="w-full max-w-md" />

        {/* Páginas sugeridas */}
        <div className="w-full max-w-4xl space-y-6">
          <h2 className="text-xl font-semibold text-center">
            Talvez você esteja procurando por:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedPages.map((page) => (
              <Card 
                key={page.path} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                onClick={() => router.push(page.path)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{page.name}</h3>
                  <p className="text-xs text-muted-foreground">{page.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Links úteis */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-lg">Links Úteis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {helpfulLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => router.push(link.path)}
                >
                  {link.name === 'Central de Ajuda' && <HelpCircle className="mr-2 h-4 w-4" />}
                  {link.name === 'Contato' && <Mail className="mr-2 h-4 w-4" />}
                  {!['Central de Ajuda', 'Contato'].includes(link.name) && <div className="mr-2 h-4 w-4" />}
                  {link.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações de ajuda */}
        <div className="text-center space-y-2 text-sm text-muted-foreground max-w-lg">
          <p>
            Se você acredita que isso é um erro ou precisa de ajuda, 
            <Button variant="link" className="p-0 h-auto text-sm ml-1" onClick={() => router.push('/contato')}>
              entre em contato conosco
            </Button>
            .
          </p>
          <p>
            Código do erro: <code className="bg-muted px-1 py-0.5 rounded text-xs">404_PAGE_NOT_FOUND</code>
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
