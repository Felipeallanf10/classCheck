'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Mail, Twitter, Github, RefreshCw, Bell, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { PageContainer } from '@/components/shared/PageContainer'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { useToast } from '@/hooks/use-toast'

// Status da manutenção (isso viria de uma API em produção)
const maintenanceInfo = {
  title: 'Manutenção Programada',
  description: 'Estamos atualizando nossos servidores para melhorar sua experiência',
  startTime: '2025-09-12T02:00:00Z',
  estimatedEndTime: '2025-09-12T06:00:00Z',
  actualEndTime: null, // null = ainda em manutenção
  progress: 75, // porcentagem de progresso
  status: 'in-progress', // 'scheduled', 'in-progress', 'completed', 'delayed'
  components: [
    { name: 'Autenticação', status: 'completed' },
    { name: 'Dashboard', status: 'completed' },
    { name: 'Avaliações', status: 'in-progress' },
    { name: 'Relatórios', status: 'pending' },
    { name: 'Notificações', status: 'pending' }
  ],
  updates: [
    {
      time: '04:30',
      message: 'Migração do banco de dados concluída com sucesso',
      type: 'success'
    },
    {
      time: '04:15',
      message: 'Iniciando atualização dos módulos de relatórios',
      type: 'info'
    },
    {
      time: '04:00',
      message: 'Backup dos dados finalizado',
      type: 'success'
    },
    {
      time: '03:45',
      message: 'Servidores temporariamente indisponíveis',
      type: 'warning'
    }
  ]
}

export default function MaintenancePage() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { toast } = useToast()

  // Atualizar horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Calcular tempo estimado restante
  const getTimeRemaining = () => {
    const endTime = new Date(maintenanceInfo.estimatedEndTime)
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()

    if (diff <= 0) return 'Finalizando...'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}min restantes`
    }
    return `${minutes}min restantes`
  }

  const handleEmailSubscription = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    // Simulação de inscrição
    setIsSubscribed(true)
    toast.success('Inscrição realizada com sucesso! Você será notificado quando a manutenção terminar.')
    setEmail('')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  return (
    <PageContainer maxWidth="3xl">
      <Breadcrumb items={[{ label: 'Manutenção' }]} className="mb-6" />
      
      <div className="min-h-screen py-8 space-y-8">
        
        {/* Cabeçalho principal */}
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🔧</div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {maintenanceInfo.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {maintenanceInfo.description}
            </p>
          </div>
        </div>

        {/* Status e progresso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Status da Manutenção
            </CardTitle>
            <CardDescription>
              Acompanhe o progresso em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Progresso geral */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm text-muted-foreground">{maintenanceInfo.progress}%</span>
              </div>
              <Progress value={maintenanceInfo.progress} className="h-3" />
            </div>

            {/* Tempo estimado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">Início</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(maintenanceInfo.startTime).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">Tempo Restante</h3>
                <p className="text-xs text-muted-foreground">
                  {getTimeRemaining()}
                </p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">Previsão de Término</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(maintenanceInfo.estimatedEndTime).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Status dos componentes */}
            <div>
              <h3 className="font-semibold mb-3">Status dos Componentes</h3>
              <div className="space-y-2">
                {maintenanceInfo.components.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(component.status)}
                      <span className="font-medium text-sm">{component.name}</span>
                    </div>
                    <Badge className={getStatusColor(component.status)}>
                      {component.status === 'completed' && 'Concluído'}
                      {component.status === 'in-progress' && 'Em andamento'}
                      {component.status === 'pending' && 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atualizações em tempo real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Atualizações em Tempo Real
            </CardTitle>
            <CardDescription>
              Últimas informações sobre o progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceInfo.updates.map((update, index) => (
                <div key={index} className="flex gap-3 p-3 border rounded-lg">
                  {getUpdateIcon(update.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{update.time}</span>
                    </div>
                    <p className="text-sm">{update.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notificações por email */}
        {!isSubscribed ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Receba Notificações
              </CardTitle>
              <CardDescription>
                Seja notificado quando a manutenção for concluída
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubscription} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit">
                    <Bell className="mr-2 h-4 w-4" />
                    Notificar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Você receberá um email assim que a plataforma estiver disponível novamente.
                </p>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Inscrição confirmada!</AlertTitle>
            <AlertDescription>
              Você será notificado por email quando a manutenção for concluída.
            </AlertDescription>
          </Alert>
        )}

        {/* Informações adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Durante a manutenção */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Durante a Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Atualização de segurança dos servidores</li>
                <li>• Otimização do banco de dados</li>
                <li>• Implementação de novas funcionalidades</li>
                <li>• Backup completo dos dados</li>
                <li>• Testes de performance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Melhorias esperadas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Melhorias Esperadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ⚡ Performance 30% mais rápida</li>
                <li>• 🔒 Segurança aprimorada</li>
                <li>• 📊 Novos relatórios disponíveis</li>
                <li>• 🎨 Interface atualizada</li>
                <li>• 📱 Melhor experiência mobile</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Redes sociais e contato */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Mantenha-se Conectado</CardTitle>
            <CardDescription className="text-center">
              Acompanhe atualizações em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Rodapé */}
        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>
            Última atualização: {currentTime.toLocaleTimeString('pt-BR')}
          </p>
          <p>
            Esta página é atualizada automaticamente. 
            <Button variant="link" className="p-0 h-auto text-sm ml-1" onClick={() => window.location.reload()}>
              Recarregar manualmente
            </Button>
          </p>
          <p>
            Em caso de emergência, entre em contato: 
            <a href="mailto:suporte@classcheck.com" className="text-primary hover:underline ml-1">
              suporte@classcheck.com
            </a>
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
