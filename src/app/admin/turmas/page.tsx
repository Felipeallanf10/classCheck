'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  School, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Turma {
  id: number
  nome: string
  codigo: string
  ano: string
  periodo: 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL'
  ativa: boolean
  createdAt: string
  _count: {
    alunos: number
    professores: number
    aulas: number
  }
}

const PERIODOS = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite',
  INTEGRAL: 'Integral'
}

export default function AdminTurmasPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [filteredTurmas, setFilteredTurmas] = useState<Turma[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [periodoFilter, setPeriodoFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [turmaToDelete, setTurmaToDelete] = useState<Turma | null>(null)
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    ano: '',
    periodo: 'MANHA' as 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL',
    ativa: true,
  })

  // Buscar turmas
  async function fetchTurmas() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/turmas')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar turmas')
      }

      const data = await response.json()
      setTurmas(data.turmas || [])
      setFilteredTurmas(data.turmas || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar turmas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchTurmas()
    }
  }, [session])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...turmas]

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ano.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro de período
    if (periodoFilter !== 'ALL') {
      filtered = filtered.filter(t => t.periodo === periodoFilter)
    }

    // Filtro de status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(t => 
        statusFilter === 'ATIVA' ? t.ativa : !t.ativa
      )
    }

    setFilteredTurmas(filtered)
  }, [searchTerm, periodoFilter, statusFilter, turmas])

  // Abrir dialog para criar
  function handleCreate() {
    setEditingTurma(null)
    setFormData({
      nome: '',
      codigo: '',
      ano: new Date().getFullYear().toString(),
      periodo: 'MANHA',
      ativa: true,
    })
    setDialogOpen(true)
  }

  // Abrir dialog para editar
  function handleEdit(turma: Turma) {
    setEditingTurma(turma)
    setFormData({
      nome: turma.nome,
      codigo: turma.codigo,
      ano: turma.ano,
      periodo: turma.periodo,
      ativa: turma.ativa,
    })
    setDialogOpen(true)
  }

  // Salvar (criar ou editar)
  async function handleSave() {
    try {
      const url = editingTurma 
        ? `/api/admin/turmas/${editingTurma.id}`
        : '/api/admin/turmas'
      
      const method = editingTurma ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao salvar turma')
      }

      toast.success(editingTurma 
        ? 'Turma atualizada com sucesso!'
        : 'Nova turma criada com sucesso!'
      )

      setDialogOpen(false)
      fetchTurmas()

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar turma')
    }
  }

  // Confirmar exclusão
  function confirmDelete(turma: Turma) {
    setTurmaToDelete(turma)
    setDeleteDialogOpen(true)
  }

  // Deletar turma
  async function handleDelete() {
    if (!turmaToDelete) return

    try {
      const response = await fetch(`/api/admin/turmas/${turmaToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao deletar turma')
      }

      toast.success('Turma desativada com sucesso!')

      setDeleteDialogOpen(false)
      setTurmaToDelete(null)
      fetchTurmas()

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao deletar turma')
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
          { label: "Gerenciar Turmas" }
        ]} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Turmas</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todas as turmas do sistema
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{turmas.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {turmas.filter(t => t.ativa).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {turmas.reduce((acc, t) => acc + t._count.alunos, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {turmas.reduce((acc, t) => acc + t._count.aulas, 0)}
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
                  placeholder="Buscar por nome, código ou ano..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os períodos</SelectItem>
                  <SelectItem value="MANHA">Manhã</SelectItem>
                  <SelectItem value="TARDE">Tarde</SelectItem>
                  <SelectItem value="NOITE">Noite</SelectItem>
                  <SelectItem value="INTEGRAL">Integral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="ATIVA">Ativas</SelectItem>
                  <SelectItem value="INATIVA">Inativas</SelectItem>
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
                  <TableHead>Código</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Professores</TableHead>
                  <TableHead>Aulas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTurmas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma turma encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTurmas.map((turma) => (
                    <TableRow key={turma.id}>
                      <TableCell className="font-medium">{turma.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{turma.codigo}</Badge>
                      </TableCell>
                      <TableCell>{turma.ano}</TableCell>
                      <TableCell>{PERIODOS[turma.periodo]}</TableCell>
                      <TableCell>{turma._count.alunos}</TableCell>
                      <TableCell>{turma._count.professores}</TableCell>
                      <TableCell>{turma._count.aulas}</TableCell>
                      <TableCell>
                        {turma.ativa ? (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Ativa
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Inativa
                          </Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => handleEdit(turma)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => confirmDelete(turma)}
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
                {editingTurma ? 'Editar Turma' : 'Nova Turma'}
              </DialogTitle>
              <DialogDescription>
                {editingTurma 
                  ? 'Edite as informações da turma abaixo.' 
                  : 'Preencha os dados da nova turma.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: 3º Ano A"
                />
              </div>

              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: 3A"
                />
              </div>

              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  value={formData.ano}
                  onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                  placeholder="Ex: 2025"
                />
              </div>

              <div>
                <Label htmlFor="periodo">Período</Label>
                <Select
                  value={formData.periodo}
                  onValueChange={(value: any) => setFormData({ ...formData, periodo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANHA">Manhã</SelectItem>
                    <SelectItem value="TARDE">Tarde</SelectItem>
                    <SelectItem value="NOITE">Noite</SelectItem>
                    <SelectItem value="INTEGRAL">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativa"
                  checked={formData.ativa}
                  onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="ativa">Turma ativa</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingTurma ? 'Salvar Alterações' : 'Criar Turma'}
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
                Tem certeza que deseja desativar a turma <strong>{turmaToDelete?.nome}</strong>?
                <br />
                <span className="text-sm text-muted-foreground mt-2 block">
                  A turma possui {turmaToDelete?._count.alunos} alunos e {turmaToDelete?._count.aulas} aulas cadastradas.
                </span>
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
