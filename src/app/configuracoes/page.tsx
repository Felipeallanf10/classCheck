'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { AppLoading } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  Shield, 
  Mail, 
  Smartphone,
  Database,
  Users,
  Settings,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface ConfiguracoesUsuario {
  // Notificações
  notificacoesEmail: boolean
  notificacoesPush: boolean
  notificacoesAlertas: boolean
  notificacoesAvaliacoes: boolean
  
  // Aparência
  temaEscuro: boolean
  idioma: string
  
  // Privacidade (apenas ALUNO)
  perfilPublico?: boolean
  compartilharProgresso?: boolean
  
  // Sistema (apenas ADMIN)
  manutencaoAtiva?: boolean
  backupAutomatico?: boolean
  logDetalhado?: boolean
}

export default function ConfiguracoesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<ConfiguracoesUsuario>({
    notificacoesEmail: true,
    notificacoesPush: true,
    notificacoesAlertas: true,
    notificacoesAvaliacoes: true,
    temaEscuro: false,
    idioma: 'pt-BR',
    perfilPublico: true,
    compartilharProgresso: true,
    manutencaoAtiva: false,
    backupAutomatico: true,
    logDetalhado: false,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      // Carregar configurações salvas (simulado - você pode criar uma API depois)
      const configSalva = localStorage.getItem('configuracoes')
      if (configSalva) {
        setConfig(JSON.parse(configSalva))
      }
      setLoading(false)
    }
  }, [status, router])

  const handleSalvar = () => {
    setSaving(true)
    
    // Salvar no localStorage (você pode criar uma API para salvar no banco depois)
    localStorage.setItem('configuracoes', JSON.stringify(config))
    
    setTimeout(() => {
      setSaving(false)
      toast.success('Configurações salvas com sucesso!')
    }, 500)
  }

  if (loading || status === 'loading') {
    return <AppLoading />
  }

  const userRole = session?.user?.role

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumbs
            items={[
              { label: 'Configurações', href: '/configuracoes' },
            ]}
          />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Configurações</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie suas preferências e configurações do sistema
              </p>
            </div>

            {/* Notificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Notificações por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesEmail}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, notificacoesEmail: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Notificações Push
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações no navegador
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesPush}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, notificacoesPush: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Alertas Socioemocionais
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre alertas de bem-estar
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesAlertas}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, notificacoesAlertas: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Avaliações
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre novas avaliações disponíveis
                    </p>
                  </div>
                  <Switch
                    checked={config.notificacoesAvaliacoes}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, notificacoesAvaliacoes: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Aparência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tema Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Ativar modo escuro da interface
                    </p>
                  </div>
                  <Switch
                    checked={config.temaEscuro}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, temaEscuro: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Idioma
                  </Label>
                  <Select
                    value={config.idioma}
                    onValueChange={(value) =>
                      setConfig({ ...config, idioma: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Privacidade (apenas ALUNO) */}
            {userRole === 'ALUNO' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Privacidade
                  </CardTitle>
                  <CardDescription>
                    Controle o compartilhamento dos seus dados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Perfil Público</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros vejam seu perfil
                      </p>
                    </div>
                    <Switch
                      checked={config.perfilPublico}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, perfilPublico: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compartilhar Progresso</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que professores vejam seu progresso detalhado
                      </p>
                    </div>
                    <Switch
                      checked={config.compartilharProgresso}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, compartilharProgresso: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Configurações do Sistema (apenas ADMIN) */}
            {userRole === 'ADMIN' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sistema
                  </CardTitle>
                  <CardDescription>
                    Configurações avançadas do sistema (apenas administradores)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Estas configurações afetam todos os usuários do sistema. Use com cuidado.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Modo Manutenção
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Bloquear acesso temporário ao sistema
                      </p>
                    </div>
                    <Switch
                      checked={config.manutencaoAtiva}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, manutencaoAtiva: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Backup Automático
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Fazer backup diário do banco de dados
                      </p>
                    </div>
                    <Switch
                      checked={config.backupAutomatico}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, backupAutomatico: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Logs Detalhados</Label>
                      <p className="text-sm text-muted-foreground">
                        Registrar logs detalhados de todas as ações
                      </p>
                    </div>
                    <Switch
                      checked={config.logDetalhado}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, logDetalhado: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Configurações do Professor (apenas PROFESSOR) */}
            {userRole === 'PROFESSOR' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Preferências do Professor
                  </CardTitle>
                  <CardDescription>
                    Configurações específicas para professores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificar sobre Novos Alunos</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificação quando um aluno entrar na turma
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Risco Alto</Label>
                      <p className="text-sm text-muted-foreground">
                        Ser notificado imediatamente sobre alertas de alto risco
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSalvar}
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
