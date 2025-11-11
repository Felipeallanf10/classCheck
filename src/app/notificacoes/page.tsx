'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  BellOff,
  AlertCircle,
  CheckCheck,
  Info,
  AlertTriangle,
  Calendar,
  Award,
  BookOpen,
  Users,
  Trash2
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useToast } from '@/hooks/use-toast'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Notificacao {
  id: string
  tipo: 'INFO' | 'ALERTA' | 'AVISO' | 'SUCESSO'
  titulo: string
  mensagem: string
  lida: boolean
  criadoEm: string
  acao?: string | null
}

const TIPO_ICONS = {
  INFO: Info,
  ALERTA: AlertCircle,
  AVISO: AlertTriangle,
  SUCESSO: Award,
}

const TIPO_COLORS = {
  INFO: 'text-blue-500',
  ALERTA: 'text-red-500',
  AVISO: 'text-yellow-500',
  SUCESSO: 'text-green-500',
}

const TIPO_BG = {
  INFO: 'bg-blue-50 dark:bg-blue-950',
  ALERTA: 'bg-red-50 dark:bg-red-950',
  AVISO: 'bg-yellow-50 dark:bg-yellow-950',
  SUCESSO: 'bg-green-50 dark:bg-green-950',
}

export default function NotificacoesPage() {
  const { data: session } = useSession()
  const { toast: toastHelpers } = useToast()
  
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [naoLidas, setNaoLidas] = useState(0)
  const [filtro, setFiltro] = useState<'todas' | 'nao-lidas'>('todas')

  useEffect(() => {
    fetchNotificacoes()
  }, [filtro])

  async function fetchNotificacoes() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filtro === 'nao-lidas') {
        params.append('lida', 'false')
      }

      const response = await fetch(`/api/notificacoes?${params}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar notificações')
      }

      const data = await response.json()
      setNotificacoes(data.notificacoes)
      setNaoLidas(data.naoLidas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }

  async function marcarComoLida(notificacaoId: string) {
    try {
      const response = await fetch('/api/notificacoes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificacaoId }),
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar como lida')
      }

      // Atualizar lista local
      setNotificacoes(prev =>
        prev.map(n => n.id === notificacaoId ? { ...n, lida: true } : n)
      )
      setNaoLidas(prev => Math.max(0, prev - 1))
    } catch (err) {
      toastHelpers.error('Erro ao marcar notificação como lida')
    }
  }

  async function marcarTodasComoLidas() {
    try {
      const response = await fetch('/api/notificacoes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marcarTodasComoLidas: true }),
      })

      if (!response.ok) {
        throw new Error('Erro ao marcar todas como lidas')
      }

      toastHelpers.success('Todas as notificações foram marcadas como lidas')
      fetchNotificacoes()
    } catch (err) {
      toastHelpers.error('Erro ao marcar todas como lidas')
    }
  }

  function renderNotificacao(notificacao: Notificacao) {
    const Icon = TIPO_ICONS[notificacao.tipo]
    
    return (
      <Card 
        key={notificacao.id}
        className={`${!notificacao.lida ? 'border-l-4 border-l-primary' : ''} ${!notificacao.lida ? TIPO_BG[notificacao.tipo] : ''}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`mt-1 ${TIPO_COLORS[notificacao.tipo]}`}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {notificacao.titulo}
                    {!notificacao.lida && (
                      <Badge variant="secondary" className="text-xs">Nova</Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notificacao.mensagem}
                  </p>
                </div>

                {!notificacao.lida && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => marcarComoLida(notificacao.id)}
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notificacao.criadoEm), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Breadcrumbs items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Notificações" }
        ]} />
        
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <Breadcrumbs items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Notificações" }
        ]} />
        
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <Breadcrumbs items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notificações" }
      ]} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                  {naoLidas > 0 && (
                    <Badge variant="destructive">{naoLidas}</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Acompanhe suas atualizações e avisos importantes
                </CardDescription>
              </div>

              {naoLidas > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={marcarTodasComoLidas}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Filtros */}
        <Tabs value={filtro} onValueChange={(v) => setFiltro(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="todas">
              Todas ({notificacoes.length})
            </TabsTrigger>
            <TabsTrigger value="nao-lidas">
              Não Lidas ({naoLidas})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4 mt-6">
            {notificacoes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
                </CardContent>
              </Card>
            ) : (
              notificacoes.map(renderNotificacao)
            )}
          </TabsContent>

          <TabsContent value="nao-lidas" className="space-y-4 mt-6">
            {notificacoes.filter(n => !n.lida).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCheck className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-muted-foreground">Você está em dia!</p>
                  <p className="text-sm text-muted-foreground">Não há notificações não lidas</p>
                </CardContent>
              </Card>
            ) : (
              notificacoes.filter(n => !n.lida).map(renderNotificacao)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
