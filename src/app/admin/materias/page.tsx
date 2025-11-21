'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  BookOpen,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useToast } from '@/hooks/use-toast'

interface Materia {
  id: number
  nome: string
  descricao: string | null
  ativa: boolean
  createdAt: string
}

export default function AdminMateriasPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [materiaToDelete, setMateriaToDelete] = useState<Materia | null>(null)
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ativa: true,
  })

  // Buscar matérias
  async function fetchMaterias() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/materias')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar matérias')
      }

      const data = await response.json()
      setMaterias(data.materias || [])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao carregar matérias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchMaterias()
    }
  }, [session])

  // Abrir dialog para criar
  function handleCreate() {
    setEditingMateria(null)
    setFormData({
      nome: '',
      descricao: '',
      ativa: true,
    })
    setDialogOpen(true)
  }

  // Abrir dialog para editar
  function handleEdit(materia: Materia) {
    setEditingMateria(materia)
    setFormData({
      nome: materia.nome,
      descricao: materia.descricao || '',
      ativa: materia.ativa,
    })
    setDialogOpen(true)
  }

  // Salvar (criar ou editar)
  async function handleSave() {
    try {
      if (!formData.nome.trim()) {
        toast.error('Nome da matéria é obrigatório')
        return
      }

      const url = editingMateria 
        ? `/api/admin/materias/${editingMateria.id}`
        : '/api/admin/materias'
      
      const method = editingMateria ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao salvar matéria')
      }

      toast.success(editingMateria 
        ? 'Matéria atualizada com sucesso!'
        : 'Nova matéria criada com sucesso!'
      )

      setDialogOpen(false)
      fetchMaterias()

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar matéria')
    }
  }

  // Confirmar exclusão
  function confirmDelete(materia: Materia) {
    setMateriaToDelete(materia)
    setDeleteDialogOpen(true)
  }

  // Deletar matéria
  async function handleDelete() {
    if (!materiaToDelete) return

    try {
      const response = await fetch(`/api/admin/materias/${materiaToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao deletar matéria')
      }

      toast.success('Matéria desativada com sucesso!')

      setDeleteDialogOpen(false)
      setMateriaToDelete(null)
      fetchMaterias()

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao deletar matéria')
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

  return (
    <div className="space-y-6 p-4">
      <Breadcrumbs items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Gerenciar Matérias" }
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Matérias</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todas as matérias disponíveis para os professores
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Matéria
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Matérias</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materias.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materias.filter(m => m.ativa).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materias.filter(m => !m.ativa).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : materias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhuma matéria cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                materias.map((materia) => (
                  <TableRow key={materia.id}>
                    <TableCell className="font-medium">{materia.nome}</TableCell>
                    <TableCell>{materia.descricao || '-'}</TableCell>
                    <TableCell>
                      {materia.ativa ? (
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
                          <DropdownMenuItem onClick={() => handleEdit(materia)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => confirmDelete(materia)}
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
              {editingMateria ? 'Editar Matéria' : 'Nova Matéria'}
            </DialogTitle>
            <DialogDescription>
              {editingMateria 
                ? 'Edite as informações da matéria abaixo.' 
                : 'Preencha os dados da nova matéria.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome da Matéria *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Matemática"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição breve da matéria"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativa"
                checked={formData.ativa}
                onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="ativa">Matéria ativa</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingMateria ? 'Salvar Alterações' : 'Criar Matéria'}
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
              Tem certeza que deseja desativar a matéria <strong>{materiaToDelete?.nome}</strong>?
              Ela ficará indisponível para novos cadastros de professores.
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
