'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, UserCog, Search, GraduationCap, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  materia: string | null;
  ativo: boolean;
  createdAt: string;
};

export default function GerenciarRolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroRole, setFiltroRole] = useState<string>('todos');
  const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null);
  const [novoRole, setNovoRole] = useState<string>('');
  const [novaMateria, setNovaMateria] = useState('');

  // Verificar se é admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'ADMIN') {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      router.push('/dashboard');
    }
  }, [session, status, router, toast]);

  // Carregar usuários
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filtroRole !== 'todos') {
        params.append('role', filtroRole);
      }
      
      if (busca) {
        params.append('busca', busca);
      }
      
      const response = await fetch(`/api/admin/gerenciar-roles?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizarRole = async (usuarioId: number) => {
    if (!novoRole) {
      toast.error('Selecione um novo role');
      return;
    }

    if (novoRole === 'PROFESSOR' && !novaMateria) {
      toast.error('Matéria é obrigatória para professores');
      return;
    }

    try {
      const response = await fetch('/api/admin/gerenciar-roles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId,
          novoRole,
          materia: novoRole === 'PROFESSOR' ? novaMateria : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Role atualizado com sucesso');
        setUsuarioEditando(null);
        setNovoRole('');
        setNovaMateria('');
        carregarUsuarios();
      } else {
        toast.error(data.error || 'Erro ao atualizar role');
      }
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast.error('Erro ao atualizar role');
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      ALUNO: <Badge variant="secondary"><Users className="w-3 h-3 mr-1" />Aluno</Badge>,
      PROFESSOR: <Badge variant="default"><GraduationCap className="w-3 h-3 mr-1" />Professor</Badge>,
      ADMIN: <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>,
    };
    return badges[role as keyof typeof badges] || badges.ALUNO;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-6 h-6" />
            Gerenciar Roles de Usuários
          </CardTitle>
          <CardDescription>
            Promova usuários para Professor ou Admin
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="busca">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="busca"
                  placeholder="Nome ou email..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtroRole">Filtrar por Role</Label>
              <Select value={filtroRole} onValueChange={setFiltroRole}>
                <SelectTrigger id="filtroRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ALUNO">Alunos</SelectItem>
                  <SelectItem value="PROFESSOR">Professores</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={carregarUsuarios} className="w-full md:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>

          {/* Alert informativo */}
          <Alert>
            <AlertDescription>
              ℹ️ <strong>Regras:</strong> Novos usuários são sempre criados como <strong>ALUNO</strong>. 
              Apenas ADMINs podem promover usuários para PROFESSOR ou ADMIN.
            </AlertDescription>
          </Alert>

          {/* Lista de usuários */}
          <div className="space-y-4">
            {usuarios.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum usuário encontrado</p>
            ) : (
              usuarios.map((usuario) => (
                <Card key={usuario.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{usuario.nome}</h3>
                        {getRoleBadge(usuario.role)}
                      </div>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                      {usuario.materia && (
                        <p className="text-sm text-gray-500 mt-1">
                          Matéria: {usuario.materia}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Cadastrado em: {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    {usuarioEditando === usuario.id ? (
                      <div className="flex flex-col gap-2 min-w-[250px]">
                        <Select value={novoRole} onValueChange={setNovoRole}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione novo role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALUNO">Aluno</SelectItem>
                            <SelectItem value="PROFESSOR">Professor</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>

                        {novoRole === 'PROFESSOR' && (
                          <Input
                            placeholder="Matéria (ex: Matemática)"
                            value={novaMateria}
                            onChange={(e) => setNovaMateria(e.target.value)}
                          />
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAtualizarRole(usuario.id)}
                            className="flex-1"
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUsuarioEditando(null);
                              setNovoRole('');
                              setNovaMateria('');
                            }}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUsuarioEditando(usuario.id);
                          setNovoRole(usuario.role);
                          setNovaMateria(usuario.materia || '');
                        }}
                      >
                        <UserCog className="w-4 h-4 mr-2" />
                        Alterar Role
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
