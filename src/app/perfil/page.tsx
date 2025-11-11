'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Key, 
  BookOpen,
  AlertCircle,
  Save,
  Camera,
  Shield
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Usuario {
  id: number
  nome: string
  email: string
  avatar: string | null
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN'
  materia: string | null
  ativo: boolean
  createdAt: string
}

const ROLE_LABELS = {
  ALUNO: 'Aluno',
  PROFESSOR: 'Professor',
  ADMIN: 'Administrador'
}

const ROLE_COLORS = {
  ALUNO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  PROFESSOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

export default function PerfilPage() {
  const { data: session } = useSession()
  const { toast: toastHelpers } = useToast()
  
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    materia: '',
    avatar: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  })

  const [alterandoSenha, setAlterandoSenha] = useState(false)

  useEffect(() => {
    fetchPerfil()
  }, [])

  async function fetchPerfil() {
    try {
      setLoading(true)
      const response = await fetch('/api/perfil')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar perfil')
      }

      const data = await response.json()
      setUsuario(data)
      setFormData({
        nome: data.nome,
        email: data.email,
        materia: data.materia || '',
        avatar: data.avatar || '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      // Validações
      if (alterandoSenha) {
        if (!formData.senhaAtual) {
          toastHelpers.error('Informe a senha atual')
          setSaving(false)
          return
        }
        
        if (!formData.novaSenha || formData.novaSenha.length < 6) {
          toastHelpers.error('A nova senha deve ter pelo menos 6 caracteres')
          setSaving(false)
          return
        }

        if (formData.novaSenha !== formData.confirmarSenha) {
          toastHelpers.error('As senhas não conferem')
          setSaving(false)
          return
        }
      }

      const updateData: any = {
        nome: formData.nome,
        email: formData.email,
        avatar: formData.avatar || null,
      }

      if (usuario?.role === 'PROFESSOR') {
        updateData.materia = formData.materia
      }

      if (alterandoSenha) {
        updateData.senhaAtual = formData.senhaAtual
        updateData.novaSenha = formData.novaSenha
      }

      const response = await fetch('/api/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao atualizar perfil')
      }

      toastHelpers.success('Perfil atualizado com sucesso!')
      setUsuario(data)
      setAlterandoSenha(false)
      setFormData(prev => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
      }))
    } catch (err) {
      toastHelpers.error(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  function getInitials(nome: string) {
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Breadcrumbs items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Perfil" }
        ]} />
        
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <Breadcrumbs items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Perfil" }
        ]} />
        
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!usuario) return null

  return (
    <div className="space-y-6 p-4">
      <Breadcrumbs items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Meu Perfil" }
      ]} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header do Perfil */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={usuario.avatar || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(usuario.nome)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => {
                    const url = prompt('Cole a URL da imagem:', formData.avatar)
                    if (url !== null) {
                      setFormData(prev => ({ ...prev, avatar: url }))
                    }
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{usuario.nome}</h1>
                  <Badge className={ROLE_COLORS[usuario.role]}>
                    {ROLE_LABELS[usuario.role]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{usuario.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Membro desde {format(new Date(usuario.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Edição */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dados Básicos */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    <User className="inline h-4 w-4 mr-2" />
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Matéria (apenas para professores) */}
              {usuario.role === 'PROFESSOR' && (
                <div className="space-y-2">
                  <Label htmlFor="materia">
                    <BookOpen className="inline h-4 w-4 mr-2" />
                    Matéria/Disciplina
                  </Label>
                  <Input
                    id="materia"
                    value={formData.materia}
                    onChange={(e) => setFormData(prev => ({ ...prev, materia: e.target.value }))}
                    placeholder="Ex: Matemática, Português, etc."
                  />
                </div>
              )}

              <Separator />

              {/* Seção de Senha */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Alterar Senha
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Mantenha sua conta segura
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAlterandoSenha(!alterandoSenha)}
                  >
                    {alterandoSenha ? 'Cancelar' : 'Alterar'}
                  </Button>
                </div>

                {alterandoSenha && (
                  <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="senhaAtual">Senha Atual</Label>
                      <Input
                        id="senhaAtual"
                        type="password"
                        value={formData.senhaAtual}
                        onChange={(e) => setFormData(prev => ({ ...prev, senhaAtual: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="novaSenha">Nova Senha</Label>
                      <Input
                        id="novaSenha"
                        type="password"
                        value={formData.novaSenha}
                        onChange={(e) => setFormData(prev => ({ ...prev, novaSenha: e.target.value }))}
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                      <Input
                        id="confirmarSenha"
                        type="password"
                        value={formData.confirmarSenha}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                        minLength={6}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Informações de Segurança (apenas Admin) */}
              {usuario.role === 'ADMIN' && (
                <>
                  <Separator />
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Você tem permissões de <strong>Administrador</strong>. 
                      Tenha cuidado ao compartilhar suas credenciais.
                    </AlertDescription>
                  </Alert>
                </>
              )}

              {/* Botão Salvar */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchPerfil}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
