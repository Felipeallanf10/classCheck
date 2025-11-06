/**
 * AlertaDetalhesModal - Modal com detalhes completos do alerta
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Alerta } from '@/types/alerta';
import { getAlertaColor } from '@/lib/progresso-utils';
import {
  getAlertaIcon,
  getAlertaTitulo,
  formatarDataRelativa,
  getStatusColors,
  getStatusLabel,
  getRecomendacoesPadrao,
} from '@/lib/alerta-utils';
import {
  useMarcarAlertaVisualizado,
  useAtualizarStatusAlerta,
  useBuscarAjuda,
} from '@/hooks/useAlertas';
import {
  CheckCircle2,
  Clock,
  Eye,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AlertaDetalhesModalProps {
  alerta: Alerta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertaDetalhesModal({
  alerta,
  open,
  onOpenChange,
}: AlertaDetalhesModalProps) {
  const [mensagemAjuda, setMensagemAjuda] = useState('');
  const [showAjudaForm, setShowAjudaForm] = useState(false);

  const marcarVisualizado = useMarcarAlertaVisualizado();
  const atualizarStatus = useAtualizarStatusAlerta();
  const buscarAjuda = useBuscarAjuda();

  // Marca como visualizado ao abrir
  useEffect(() => {
    if (open && alerta && alerta.status === 'ATIVO') {
      marcarVisualizado.mutate(alerta.id, {
        onSuccess: () => {
          toast.success('Alerta visualizado');
        },
      });
    }
  }, [open, alerta]);

  if (!alerta) return null;

  const Icon = getAlertaIcon(alerta.tipo);
  const alertaColors = getAlertaColor(alerta.nivel);
  const statusColors = getStatusColors(alerta.status);
  const titulo = alerta.titulo || getAlertaTitulo(alerta.tipo);
  const recomendacoes =
    alerta.recomendacoes?.length > 0
      ? alerta.recomendacoes
      : getRecomendacoesPadrao(alerta.tipo);

  const handleAtualizarStatus = (novoStatus: string) => {
    atualizarStatus.mutate(
      { alertaId: alerta.id, status: novoStatus },
      {
        onSuccess: () => {
          toast.success('Status atualizado');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Erro ao atualizar status');
        },
      }
    );
  };

  const handleBuscarAjuda = () => {
    if (!mensagemAjuda.trim() && showAjudaForm) {
      toast.error('Digite uma mensagem');
      return;
    }

    buscarAjuda.mutate(
      {
        alertaId: alerta.id,
        mensagem: mensagemAjuda.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Solicitação de ajuda enviada com sucesso!');
          setShowAjudaForm(false);
          setMensagemAjuda('');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Erro ao solicitar ajuda');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'p-3 rounded-lg',
                alertaColors.bg,
                alertaColors.text
              )}
            >
              <Icon className="h-6 w-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{titulo}</DialogTitle>
              <DialogDescription className="text-base">
                {alerta.descricao}
              </DialogDescription>

              <div className="flex items-center gap-2 mt-3">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    statusColors.bg,
                    statusColors.text,
                    statusColors.border
                  )}
                >
                  {getStatusLabel(alerta.status)}
                </Badge>

                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    alertaColors.bg,
                    alertaColors.text,
                    alertaColors.border
                  )}
                >
                  {alerta.nivel}
                </Badge>

                <span className="text-xs text-muted-foreground">
                  {formatarDataRelativa(alerta.criadoEm)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mensagem */}
          {alerta.mensagem && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Detalhes</h4>
              </div>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {alerta.mensagem}
              </p>
            </div>
          )}

          {/* Metadados IRT */}
          {alerta.metadados && Object.keys(alerta.metadados).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Informações Técnicas</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {alerta.metadados.theta !== undefined && (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-xs text-muted-foreground">Theta</div>
                    <div className="font-semibold">
                      {alerta.metadados.theta.toFixed(2)}
                    </div>
                  </div>
                )}

                {alerta.metadados.confianca !== undefined && (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-xs text-muted-foreground">
                      Confiança
                    </div>
                    <div className="font-semibold">
                      {(alerta.metadados.confianca * 100).toFixed(0)}%
                    </div>
                  </div>
                )}

                {alerta.metadados.tempoResposta !== undefined && (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-xs text-muted-foreground">
                      Tempo Médio
                    </div>
                    <div className="font-semibold">
                      {alerta.metadados.tempoResposta}s
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Recomendações */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <h4 className="font-semibold text-sm">Recomendações</h4>
            </div>

            <ul className="space-y-2">
              {recomendacoes.map((recomendacao, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{recomendacao}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulário de Ajuda */}
          {showAjudaForm && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Solicitar Ajuda</h4>
              </div>

              <Textarea
                placeholder="Descreva a situação ou adicione observações (opcional)"
                value={mensagemAjuda}
                onChange={(e) => setMensagemAjuda(e.target.value)}
                rows={3}
                className="resize-none"
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleBuscarAjuda}
                  disabled={buscarAjuda.isPending}
                >
                  {buscarAjuda.isPending && (
                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  )}
                  Enviar Solicitação
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAjudaForm(false);
                    setMensagemAjuda('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">Linha do Tempo</h4>
            </div>

            <div className="space-y-2 pl-4 border-l-2">
              <div className="text-sm">
                <span className="font-medium">Criado:</span>{' '}
                <span className="text-muted-foreground">
                  {new Date(alerta.criadoEm).toLocaleString('pt-BR')}
                </span>
              </div>

              {alerta.visualizadoEm && (
                <div className="text-sm">
                  <span className="font-medium">Visualizado:</span>{' '}
                  <span className="text-muted-foreground">
                    {new Date(alerta.visualizadoEm).toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {!showAjudaForm && (
            <Button
              variant="outline"
              onClick={() => setShowAjudaForm(true)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Buscar Ajuda
            </Button>
          )}

          {alerta.status !== 'EM_ACOMPANHAMENTO' && (
            <Button
              variant="outline"
              onClick={() => handleAtualizarStatus('EM_ACOMPANHAMENTO')}
              disabled={atualizarStatus.isPending}
            >
              Marcar em Acompanhamento
            </Button>
          )}

          {alerta.status !== 'RESOLVIDO' && (
            <Button
              onClick={() => handleAtualizarStatus('RESOLVIDO')}
              disabled={atualizarStatus.isPending}
              className="gap-2"
            >
              {atualizarStatus.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Marcar como Resolvido
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
