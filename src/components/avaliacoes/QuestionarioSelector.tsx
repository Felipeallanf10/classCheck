/**
 * Componente para listar e selecionar questionários
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestionarios } from '@/hooks/useQuestionarios';
import { QuestionarioCard } from './QuestionarioCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { QuestionarioFiltros, TipoQuestionario, CategoriaPergunta } from '@/types/questionario';
import { Search, Filter, AlertCircle, Sparkles, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionarioSelectorProps {
  usuarioId: number;
  onQuestionarioSelect?: (questionarioId: string, sessaoId: string) => void;
}

export function QuestionarioSelector({ usuarioId, onQuestionarioSelect }: QuestionarioSelectorProps) {
  const router = useRouter();
  const [filtros, setFiltros] = useState<QuestionarioFiltros>({
    ativo: true,
  });
  const [busca, setBusca] = useState('');
  const [iniciando, setIniciando] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuestionarios(filtros);

  // Filtrar por busca de texto
  const questionariosFiltrados = data?.questionarios.filter((q) => {
    if (!busca) return true;
    const searchLower = busca.toLowerCase();
    return (
      q.titulo.toLowerCase().includes(searchLower) ||
      q.descricao.toLowerCase().includes(searchLower) ||
      q.tipo.toLowerCase().includes(searchLower)
    );
  });

  const handleIniciarSessao = async (questionarioId: string) => {
    setIniciando(questionarioId);

    try {
      const response = await fetch('/api/sessoes/iniciar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionarioId,
          usuarioId,
          contexto: {
            origem: 'questionario-selector',
            dispositivo: 'desktop',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao iniciar sessão');
      }

      const data = await response.json();
      const sessaoId = data.sessao?.id || data.sessaoId;
      
      if (!sessaoId) {
        throw new Error('Sessão criada mas ID não retornado');
      }

      toast.success('Sessão iniciada com sucesso!');

      // Callback ou navegação
      if (onQuestionarioSelect) {
        onQuestionarioSelect(questionarioId, sessaoId);
      } else {
        router.push(`/avaliacoes/sessao/${sessaoId}`);
      }
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao iniciar sessão');
    } finally {
      setIniciando(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filtros e Busca</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca por texto */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="busca">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="busca"
                placeholder="Buscar por título ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro por tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={filtros.tipo || 'todos'}
              onValueChange={(value) =>
                setFiltros((prev) => ({
                  ...prev,
                  tipo: value === 'todos' ? undefined : (value as TipoQuestionario),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="WHO5">WHO-5</SelectItem>
                <SelectItem value="PHQ9">PHQ-9</SelectItem>
                <SelectItem value="GAD7">GAD-7</SelectItem>
                <SelectItem value="CIRCUMPLEX">Circumplex</SelectItem>
                <SelectItem value="PERSONALIZADO">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro adaptativo */}
          <div className="space-y-2">
            <Label>Modo</Label>
            <Select
              value={
                filtros.adaptativo === undefined
                  ? 'todos'
                  : filtros.adaptativo
                  ? 'adaptativo'
                  : 'padrao'
              }
              onValueChange={(value) =>
                setFiltros((prev) => ({
                  ...prev,
                  adaptativo:
                    value === 'todos'
                      ? undefined
                      : value === 'adaptativo',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="adaptativo">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Adaptativo
                  </div>
                </SelectItem>
                <SelectItem value="padrao">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Padrão
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Limpar filtros */}
        {(filtros.tipo || filtros.adaptativo !== undefined || busca) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFiltros({ ativo: true });
              setBusca('');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Estados de Loading/Error */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar questionários: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de Questionários */}
      {!isLoading && !error && questionariosFiltrados && (
        <>
          {questionariosFiltrados.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhum questionário encontrado com os filtros aplicados.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {questionariosFiltrados.length} questionário
                  {questionariosFiltrados.length !== 1 && 's'} encontrado
                  {questionariosFiltrados.length !== 1 && 's'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questionariosFiltrados.map((questionario) => (
                  <QuestionarioCard
                    key={questionario.id}
                    questionario={questionario}
                    onSelect={handleIniciarSessao}
                    isLoading={iniciando === questionario.id}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// Skeleton do Card
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
