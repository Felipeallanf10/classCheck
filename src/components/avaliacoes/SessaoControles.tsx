/**
 * SessaoControles - Botões de controle da sessão (pausar, finalizar, voltar)
 */

'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Loader2, Pause, Play, CheckCircle2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAtualizarSessao } from '@/hooks/useSessao';
import { toast } from 'sonner';
import type { StatusSessao } from '@/types/sessao';

interface SessaoControlesProps {
  sessaoId: string;
  status: StatusSessao;
  podeRetomar?: boolean;
  disabled?: boolean;
}

export function SessaoControles({
  sessaoId,
  status,
  podeRetomar = true,
  disabled = false,
}: SessaoControlesProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'pausar' | 'finalizar' | null>(null);
  const atualizar = useAtualizarSessao();

  const handlePausar = () => {
    atualizar.mutate(
      { sessaoId, acao: 'pausar' },
      {
        onSuccess: () => {
          toast.success('Sessão pausada com sucesso');
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error(`Erro ao pausar sessão: ${error.message}`);
        },
      }
    );
  };

  const handleRetomar = () => {
    atualizar.mutate(
      { sessaoId, acao: 'retomar' },
      {
        onSuccess: () => {
          toast.success('Sessão retomada');
        },
        onError: (error) => {
          toast.error(`Erro ao retomar sessão: ${error.message}`);
        },
      }
    );
  };

  const handleFinalizar = () => {
    atualizar.mutate(
      { sessaoId, acao: 'finalizar' },
      {
        onSuccess: () => {
          toast.success('Avaliação finalizada!');
          setDialogOpen(false);
          // Redireciona para página de resultados
          router.push(`/avaliacoes/resultado/${sessaoId}`);
        },
        onError: (error) => {
          toast.error(`Erro ao finalizar sessão: ${error.message}`);
        },
      }
    );
  };

  const openDialog = (type: 'pausar' | 'finalizar') => {
    setDialogType(type);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Pausar/Retomar */}
        {status === 'EM_ANDAMENTO' && (
          <Button
            variant="outline"
            onClick={() => openDialog('pausar')}
            disabled={disabled || atualizar.isPending}
            className="gap-2"
          >
            {atualizar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
            Pausar
          </Button>
        )}

        {status === 'PAUSADA' && podeRetomar && (
          <Button
            variant="outline"
            onClick={handleRetomar}
            disabled={disabled || atualizar.isPending}
            className="gap-2"
          >
            {atualizar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Retomar
          </Button>
        )}

        {/* Finalizar */}
        {(status === 'EM_ANDAMENTO' || status === 'PAUSADA') && (
          <Button
            onClick={() => openDialog('finalizar')}
            disabled={disabled || atualizar.isPending}
            className="gap-2"
          >
            {atualizar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Finalizar Avaliação
          </Button>
        )}

        {/* Cancelar/Sair */}
        <Button
          variant="ghost"
          onClick={() => router.push('/avaliacoes/questionarios')}
          disabled={atualizar.isPending}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Sair
        </Button>
      </div>

      {/* Dialog de Confirmação */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogType === 'pausar' && 'Pausar Avaliação?'}
              {dialogType === 'finalizar' && 'Finalizar Avaliação?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogType === 'pausar' && (
                <>
                  Você pode retomar a avaliação mais tarde de onde parou.
                  Seu progresso será salvo.
                </>
              )}
              {dialogType === 'finalizar' && (
                <>
                  Tem certeza que deseja finalizar a avaliação?
                  Esta ação não pode ser desfeita e você não poderá mais responder perguntas.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={atualizar.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                if (dialogType === 'pausar') {
                  handlePausar();
                } else if (dialogType === 'finalizar') {
                  handleFinalizar();
                }
              }}
              disabled={atualizar.isPending}
            >
              {atualizar.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
