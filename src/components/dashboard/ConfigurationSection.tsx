'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
  Save,
  RefreshCw,
  Mail,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react'

export function ConfigurationSection() {
  const [settings, setSettings] = useState({
    // Preferências pessoais
    nome: 'Professor Silva',
    email: 'professor.silva@escola.edu.br',
    telefone: '(11) 99999-9999',
    
    // Tema e aparência
    tema: 'system',
    idioma: 'pt-BR',
    compactMode: false,
    animacoes: true,
    
    // Notificações
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyEvaluations: true,
    notifyMood: true,
    notifyReports: false,
    
    // Privacidade
    profileVisible: true,
    shareAnalytics: false,
    allowTracking: false,
    
    // Sistema
    autoSave: true,
    sessionTimeout: '30',
    backupFrequency: 'weekly'
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Aqui viria a integração com a API
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Gerencie suas preferências e configurações da conta</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Perfil do Usuário */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarImage src="/perfil.jpg" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div className="flex-1 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Alterar Foto
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="nome" className="text-sm">Nome Completo</Label>
                <Input
                  id="nome"
                  value={settings.nome}
                  onChange={(e) => updateSetting('nome', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="telefone" className="text-sm">Telefone</Label>
                <Input
                  id="telefone"
                  value={settings.telefone}
                  onChange={(e) => updateSetting('telefone', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Principais */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Tema e Aparência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                Tema e Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tema" className="text-sm">Tema</Label>
                  <Select value={settings.tema} onValueChange={(value) => updateSetting('tema', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Escuro
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Sistema
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="idioma" className="text-sm">Idioma</Label>
                  <Select value={settings.idioma} onValueChange={(value) => updateSetting('idioma', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                      <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-sm font-medium">Modo Compacto</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Interface mais densa</p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label className="text-sm font-medium">Animações</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Transições e efeitos visuais</p>
                  </div>
                  <Switch
                    checked={settings.animacoes}
                    onCheckedChange={(checked) => updateSetting('animacoes', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">E-mail</span>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Push</span>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">SMS</span>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-sm sm:text-base">Tipos de Notificação</h4>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <Label>Avaliações</Label>
                    <p className="text-sm text-muted-foreground">Novas avaliações e respostas</p>
                  </div>
                  <Switch
                    checked={settings.notifyEvaluations}
                    onCheckedChange={(checked) => updateSetting('notifyEvaluations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Humor dos Alunos</Label>
                    <p className="text-sm text-muted-foreground">Registros de humor e alertas</p>
                  </div>
                  <Switch
                    checked={settings.notifyMood}
                    onCheckedChange={(checked) => updateSetting('notifyMood', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Relatórios</Label>
                    <p className="text-sm text-muted-foreground">Relatórios automáticos</p>
                  </div>
                  <Switch
                    checked={settings.notifyReports}
                    onCheckedChange={(checked) => updateSetting('notifyReports', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacidade e Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacidade e Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Perfil Público</Label>
                    <p className="text-sm text-muted-foreground">Outros podem ver seu perfil</p>
                  </div>
                  <Switch
                    checked={settings.profileVisible}
                    onCheckedChange={(checked) => updateSetting('profileVisible', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compartilhar Analytics</Label>
                    <p className="text-sm text-muted-foreground">Dados anônimos para melhorias</p>
                  </div>
                  <Switch
                    checked={settings.shareAnalytics}
                    onCheckedChange={(checked) => updateSetting('shareAnalytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rastreamento</Label>
                    <p className="text-sm text-muted-foreground">Cookies e análise de uso</p>
                  </div>
                  <Switch
                    checked={settings.allowTracking}
                    onCheckedChange={(checked) => updateSetting('allowTracking', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Alterar Senha</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Atualizar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-timeout">Timeout da Sessão</Label>
                  <Select value={settings.sessionTimeout} onValueChange={(value) => updateSetting('sessionTimeout', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="backup-frequency">Backup Automático</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="never">Desabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Salvamento Automático</Label>
                  <p className="text-sm text-muted-foreground">Salva alterações automaticamente</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status das configurações */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
                Sistema Online
              </Badge>
              <span className="text-xs sm:text-sm text-muted-foreground break-words">
                Última sincronização: {new Date().toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
              <span className="hidden sm:inline">Exportar Configurações</span>
              <span className="sm:hidden">Exportar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}