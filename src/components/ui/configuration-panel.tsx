import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  User,
  Mail,
  Lock,
  Palette,
  Monitor,
  Smartphone,
  Volume2,
  VolumeX,
  Camera,
  Mic,
  MicOff,
  CameraOff,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react"

// 🎯 COMPONENTS INTERNOS
const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, checked = false, onCheckedChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
})
Switch.displayName = "Switch"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
})
Label.displayName = "Label"

// 🎯 TYPES
export interface UserPreferences {
  // Appearance
  theme: "light" | "dark" | "system"
  language: "pt-BR" | "en-US" | "es-ES"
  fontSize: "small" | "medium" | "large"
  colorScheme: "default" | "blue" | "green" | "purple"
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  classReminders: boolean
  evaluationAlerts: boolean
  marketingEmails: boolean
  weeklyDigest: boolean
  
  // Privacy
  profileVisibility: "public" | "private" | "students"
  showEmail: boolean
  showPhone: boolean
  allowDirectMessages: boolean
  
  // Media
  autoplayVideos: boolean
  videoQuality: "auto" | "720p" | "1080p"
  microphoneEnabled: boolean
  cameraEnabled: boolean
  soundEffects: boolean
  
  // Teaching (for professors)
  autoApproveStudents?: boolean
  requireEvaluationApproval?: boolean
  enableRecording?: boolean
  maxStudentsPerClass?: number
}

export interface SystemSettings {
  // Platform
  maintenanceMode: boolean
  registrationOpen: boolean
  featureFlags: {
    beta_features: boolean
    analytics_v2: boolean
    ai_assistant: boolean
    video_calls: boolean
  }
  
  // Security
  passwordPolicy: {
    minLength: number
    requireNumbers: boolean
    requireSymbols: boolean
    requireUppercase: boolean
  }
  sessionTimeout: number
  twoFactorRequired: boolean
  
  // Content
  maxFileSize: number
  allowedFileTypes: string[]
  autoModeration: boolean
  contentWarnings: boolean
}

export interface ConfigurationPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Tipo de configuração
   */
  type: "user" | "system"
  /**
   * Preferências do usuário
   */
  userPreferences?: UserPreferences
  /**
   * Configurações do sistema (admin)
   */
  systemSettings?: SystemSettings
  /**
   * Se está salvando
   */
  saving?: boolean
  /**
   * Callback para salvar preferências
   */
  onSave?: (preferences: UserPreferences | SystemSettings) => void
  /**
   * Callback para reset
   */
  onReset?: () => void
  /**
   * Callback para exportar configurações
   */
  onExport?: () => void
  /**
   * Callback para importar configurações
   */
  onImport?: (file: File) => void
}

// ⚙️ CONFIGURATION PANEL
const ConfigurationPanel = React.forwardRef<HTMLDivElement, ConfigurationPanelProps>(
  (
    {
      className,
      type,
      userPreferences,
      systemSettings,
      saving = false,
      onSave,
      onReset,
      onExport,
      onImport,
      ...props
    },
    ref
  ) => {
    const [preferences, setPreferences] = React.useState<UserPreferences>(
      userPreferences || {
        theme: "system",
        language: "pt-BR",
        fontSize: "medium",
        colorScheme: "default",
        emailNotifications: true,
        pushNotifications: true,
        classReminders: true,
        evaluationAlerts: true,
        marketingEmails: false,
        weeklyDigest: true,
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        allowDirectMessages: true,
        autoplayVideos: true,
        videoQuality: "auto",
        microphoneEnabled: true,
        cameraEnabled: true,
        soundEffects: true,
      }
    )

    const [settings, setSettings] = React.useState<SystemSettings>(
      systemSettings || {
        maintenanceMode: false,
        registrationOpen: true,
        featureFlags: {
          beta_features: false,
          analytics_v2: true,
          ai_assistant: false,
          video_calls: true,
        },
        passwordPolicy: {
          minLength: 8,
          requireNumbers: true,
          requireSymbols: false,
          requireUppercase: true,
        },
        sessionTimeout: 30,
        twoFactorRequired: false,
        maxFileSize: 10,
        allowedFileTypes: ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "png", "mp4"],
        autoModeration: true,
        contentWarnings: true,
      }
    )

    const [showPassword, setShowPassword] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleSave = () => {
      if (type === "user") {
        onSave?.(preferences)
      } else {
        onSave?.(settings)
      }
    }

    const handleImportClick = () => {
      fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onImport?.(file)
      }
    }

    if (type === "user") {
      return (
        <div ref={ref} className={cn("space-y-6", className)} {...props}>
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Configurações</h2>
              <p className="text-muted-foreground">Personalize sua experiência no ClassCheck</p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Aparência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value: "light" | "dark" | "system") =>
                      setPreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Claro</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Escuro</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Monitor className="h-4 w-4" />
                          <span>Sistema</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value: "pt-BR" | "en-US" | "es-ES") =>
                      setPreferences({ ...preferences, language: value })
                    }
                  >
                    <SelectTrigger>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tamanho da Fonte</Label>
                  <Select
                    value={preferences.fontSize}
                    onValueChange={(value: "small" | "medium" | "large") =>
                      setPreferences({ ...preferences, fontSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequena</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Esquema de Cores</Label>
                  <Select
                    value={preferences.colorScheme}
                    onValueChange={(value: "default" | "blue" | "green" | "purple") =>
                      setPreferences({ ...preferences, colorScheme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Padrão</SelectItem>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="purple">Roxo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "emailNotifications", label: "Notificações por Email", icon: Mail },
                  { key: "pushNotifications", label: "Notificações Push", icon: Smartphone },
                  { key: "classReminders", label: "Lembretes de Aulas", icon: Bell },
                  { key: "evaluationAlerts", label: "Alertas de Avaliação", icon: Bell },
                  { key: "marketingEmails", label: "Emails Promocionais", icon: Mail },
                  { key: "weeklyDigest", label: "Resumo Semanal", icon: Mail },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <Label>{label}</Label>
                    </div>
                    <Switch
                      checked={preferences[key as keyof UserPreferences] as boolean}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visibilidade do Perfil</Label>
                <Select
                  value={preferences.profileVisibility}
                  onValueChange={(value: "public" | "private" | "students") =>
                    setPreferences({ ...preferences, profileVisibility: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público</SelectItem>
                    <SelectItem value="students">Apenas Alunos</SelectItem>
                    <SelectItem value="private">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "showEmail", label: "Mostrar Email" },
                  { key: "showPhone", label: "Mostrar Telefone" },
                  { key: "allowDirectMessages", label: "Permitir Mensagens Diretas" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label>{label}</Label>
                    <Switch
                      checked={preferences[key as keyof UserPreferences] as boolean}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Mídia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Qualidade de Vídeo</Label>
                <Select
                  value={preferences.videoQuality}
                  onValueChange={(value: "auto" | "720p" | "1080p") =>
                    setPreferences({ ...preferences, videoQuality: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automática</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "autoplayVideos", label: "Reprodução Automática", icon: Camera },
                  { key: "microphoneEnabled", label: "Microfone Habilitado", icon: Mic },
                  { key: "cameraEnabled", label: "Câmera Habilitada", icon: Camera },
                  { key: "soundEffects", label: "Efeitos Sonoros", icon: Volume2 },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <Label>{label}</Label>
                    </div>
                    <Switch
                      checked={preferences[key as keyof UserPreferences] as boolean}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // System Settings (Admin)
    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
            <p className="text-muted-foreground">Configurações administrativas da plataforma</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Plataforma</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Desabilita o acesso à plataforma
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Registro Aberto</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite novos cadastros
                  </p>
                </div>
                <Switch
                  checked={settings.registrationOpen}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, registrationOpen: checked })
                  }
                />
              </div>
            </div>

            {/* Feature Flags */}
            <div className="space-y-2">
              <Label>Funcionalidades Experimentais</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(settings.featureFlags).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="text-sm capitalize">
                      {key.replace(/_/g, " ")}
                    </Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          featureFlags: { ...settings.featureFlags, [key]: checked },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Comprimento Mínimo da Senha</Label>
                <Input
                  type="number"
                  value={settings.passwordPolicy.minLength}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        minLength: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Timeout de Sessão (minutos)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    setSettings({ ...settings, sessionTimeout: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "requireNumbers", label: "Exigir Números" },
                { key: "requireSymbols", label: "Exigir Símbolos" },
                { key: "requireUppercase", label: "Exigir Maiúsculas" },
                { key: "twoFactorRequired", label: "2FA Obrigatório" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <Label>{label}</Label>
                  <Switch
                    checked={
                      key === "twoFactorRequired"
                        ? settings[key]
                        : Boolean(settings.passwordPolicy[key as keyof typeof settings.passwordPolicy])
                    }
                    onCheckedChange={(checked) => {
                      if (key === "twoFactorRequired") {
                        setSettings({ ...settings, [key]: checked })
                      } else {
                        setSettings({
                          ...settings,
                          passwordPolicy: {
                            ...settings.passwordPolicy,
                            [key]: checked,
                          },
                        })
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Gestão de Conteúdo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tamanho Máximo de Arquivo (MB)</Label>
                <Input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) =>
                    setSettings({ ...settings, maxFileSize: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Tipos de Arquivo Permitidos</Label>
                <Input
                  value={settings.allowedFileTypes.join(", ")}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      allowedFileTypes: e.target.value.split(", ").map(t => t.trim()),
                    })
                  }
                  placeholder="pdf, doc, jpg, png..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Moderação Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Filtra conteúdo inapropriado
                  </p>
                </div>
                <Switch
                  checked={settings.autoModeration}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoModeration: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Avisos de Conteúdo</Label>
                  <p className="text-sm text-muted-foreground">
                    Mostra alertas para conteúdo sensível
                  </p>
                </div>
                <Switch
                  checked={settings.contentWarnings}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, contentWarnings: checked })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)
ConfigurationPanel.displayName = "ConfigurationPanel"

// 📤 EXPORTS
export {
  ConfigurationPanel
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Configurações do usuário
 * <ConfigurationPanel
 *   type="user"
 *   userPreferences={{
 *     theme: "dark",
 *     language: "pt-BR",
 *     emailNotifications: true,
 *     // ... outras preferências
 *   }}
 *   onSave={(preferences) => console.log('Saving:', preferences)}
 *   onReset={() => console.log('Resetting...')}
 * />
 * 
 * // Configurações do sistema (admin)
 * <ConfigurationPanel
 *   type="system"
 *   systemSettings={{
 *     maintenanceMode: false,
 *     registrationOpen: true,
 *     // ... outras configurações
 *   }}
 *   onSave={(settings) => console.log('Saving:', settings)}
 *   onExport={() => console.log('Exporting...')}
 *   onImport={(file) => console.log('Importing:', file.name)}
 * />
 */
