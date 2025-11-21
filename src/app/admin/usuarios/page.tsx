'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  UserPlus,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Usuario {
  id: number
  nome: string
  email: string
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN'
  ativo: boolean
  avatar: string | null
  materia: string | null
  createdAt: string
  totalTurmas: number
}

export default function AdminUsuariosPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [materias, setMaterias] = useState<{ id: number; nome: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null)
  
  const [showNovaMateria, setShowNovaMateria] = useState(false)
  const [novaMateriaNome, setNovaMateriaNome] = useState('')
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'ALUNO' as 'ALUNO' | 'PROFESSOR' | 'ADMIN',
    materia: '',
    ativo: true,
  })

  // Buscar usuários
  async function fetchUsuarios() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/usuarios')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários')
      }

      const data = await response.json()
      setUsuarios(data.usuarios || [])
      setFilteredUsuarios(data.usuarios || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  // Buscar matérias
  async function fetchMaterias() {
    try {
      const response = await fetch('/api/admin/materias?ativas=true')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar matérias')
      }

      const data = await response.json()
      setMaterias(data.materias || [])
    } catch (err) {
      console.error('Erro ao carregar matérias:', err)
    }
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsuarios()
      fetchMaterias()
    }
  }, [session])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...usuarios]

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro de role
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }

    // Filtro de status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(u => 
        statusFilter === 'ATIVO' ? u.ativo : !u.ativo
      )
    }

    setFilteredUsuarios(filtered)
  }, [searchTerm, roleFilter, statusFilter, usuarios])

  // Abrir dialog para criar
  function handleCreate() {
    setEditingUser(null)
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'ALUNO',
      materia: '',
      ativo: true,
    })
    setShowNovaMateria(false)
    setNovaMateriaNome('')
    setDialogOpen(true)
  }

  // Abrir dialog para editar
  function handleEdit(usuario: Usuario) {
    setEditingUser(usuario)
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: '', // Não preenche senha na edição
      role: usuario.role,
      materia: usuario.materia || '',
      ativo: usuario.ativo,
    })
    setShowNovaMateria(false)
    setNovaMateriaNome('')
    setDialogOpen(true)
  }

  // Criar nova matéria rapidamente
  async function handleCriarNovaMateria() {
    if (!novaMateriaNome.trim()) {
      toast.error('Digite o nome da matéria')
      return
    }

    try {
      const response = await fetch('/api/admin/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novaMateriaNome.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao criar matéria')
      }

      toast.success('Matéria criada com sucesso!')
      
      // Atualizar lista de matérias e selecionar a nova
      await fetchMaterias()
      setFormData({ ...formData, materia: novaMateriaNome.trim() })
      setShowNovaMateria(false)
      setNovaMateriaNome('')

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar matéria')
    }
  }

  // Salvar (criar ou editar)
  async function handleSave() {
    try {
      const url = editingUser 
        ? `/api/admin/usuarios/${editingUser.id}`
        : '/api/admin/usuarios'
      
      const method = editingUser ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao salvar usuário')
      }

      toast.success(editingUser 
        ? 'Usuário atualizado com sucesso!'
        : 'Novo usuário criado com sucesso!'
      )

      setDialogOpen(false)
      fetchUsuarios()

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar usuário')
    }
  }

  // Confirmar exclusão
  function confirmDelete(usuario: Usuario) {
    setUserToDelete(usuario)
    setDeleteDialogOpen(true)
  }

  // Deletar usuário
  async function handleDelete() {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/admin/usuarios/${userToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao deletar usuário')
      }

      toast.success('Usuário desativado com sucesso!')

      setDeleteDialogOpen(false)
      setUserToDelete(null)
      fetchUsuarios()

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao deletar usuário')
    }
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Acesso negado. Apenas administradores podem acessar esta página.
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <Breadcrumbs items={[
        { label: "Dashboard", href: "/dashboard" },
          { label: "Gerenciar Usuários" }
        ]} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os usuários do sistema
            </p>
          </div>
          <Button onClick={handleCreate}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuarios.filter(u => u.role === 'ALUNO').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuarios.filter(u => u.role === 'PROFESSOR').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuarios.filter(u => u.ativo).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os roles</SelectItem>
                  <SelectItem value="ALUNO">Alunos</SelectItem>
                  <SelectItem value="PROFESSOR">Professores</SelectItem>
                  <SelectItem value="ADMIN">Administradores</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ATIVO">Ativos</SelectItem>
                  <SelectItem value="INATIVO">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant={
                          usuario.role === 'ADMIN' ? 'destructive' : 
                          usuario.role === 'PROFESSOR' ? 'default' : 
                          'secondary'
                        }>
                          {usuario.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{usuario.materia || '-'}</TableCell>
                      <TableCell>{usuario.totalTurmas}</TableCell>
                      <TableCell>
                        {usuario.ativo ? (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(usuario.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(usuario)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => confirmDelete(usuario)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Desativar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog Criar/Editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? 'Edite as informações do usuário abaixo.' 
                  : 'Preencha os dados do novo usuário.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="senha">
                  Senha {editingUser && '(deixe em branco para não alterar)'}
                </Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder={editingUser ? 'Nova senha (opcional)' : 'Senha'}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALUNO">Aluno</SelectItem>
                    <SelectItem value="PROFESSOR">Professor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'PROFESSOR' && (
                <div className="space-y-2">
                  <Label htmlFor="materia">Matéria</Label>
                  
                  {!showNovaMateria ? (
                    <>
                      <Select
                        value={formData.materia}
                        onValueChange={(value) => {
                          if (value === '__nova__') {
                            setShowNovaMateria(true)
                          } else {
                            setFormData({ ...formData, materia: value })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma matéria" />
                        </SelectTrigger>
                        <SelectContent>
                          {materias.map((materia) => (
                            <SelectItem key={materia.id} value={materia.nome}>
                              {materia.nome}
                            </SelectItem>
                          ))}
                          <SelectItem value="__nova__" className="text-primary">
                            <div className="flex items-center">
                              <Plus className="h-4 w-4 mr-2" />
                              Cadastrar nova matéria
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {materias.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Nenhuma matéria cadastrada. Clique para cadastrar a primeira.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nome da nova matéria"
                          value={novaMateriaNome}
                          onChange={(e) => setNovaMateriaNome(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleCriarNovaMateria()
                            }
                          }}
                        />
                        <Button 
                          size="sm" 
                          onClick={handleCriarNovaMateria}
                          disabled={!novaMateriaNome.trim()}
                        >
                          Criar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setShowNovaMateria(false)
                            setNovaMateriaNome('')
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Digite o nome e pressione Enter ou clique em Criar
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="ativo">Usuário ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Confirmar Exclusão */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Desativação</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja desativar o usuário <strong>{userToDelete?.nome}</strong>?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Desativar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
