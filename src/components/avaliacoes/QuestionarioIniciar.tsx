/**
 * QuestionarioIniciar
 * 
 * Componente para iniciar nova sessão de questionário adaptativo.
 * Após iniciar, redireciona para /avaliacoes/sessao/[id]
 * 
 * @example Check-in Diário
 * <QuestionarioIniciar 
 *   questionarioId="questionario-checkin-diario"
 *   contexto={{ tipo: 'CHECK_IN' }}
 * />
 * 
 * @example Avaliação de Aula
 * <QuestionarioIniciar 
 *   questionarioId="questionario-impacto-aula"
 *   contexto={{ tipo: 'AULA', aulaId: 42 }}
 * />
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type ContextoTipo = 'GERAL' | 'AULA' | 'CHECK_IN' | 'EVENTO';

interface Contexto {
  tipo?: ContextoTipo;
  aulaId?: number;
  eventoId?: string;
  metadata?: Record<string, any>;
}

interface QuestionarioIniciarProps {
  questionarioId: string;
  usuarioId?: number; // Opcional, se não fornecido pega da sessão
  contexto?: Contexto;
  titulo?: string;
  descricao?: string;
  onSessaoIniciada?: (sessaoId: string) => void;
  className?: string;
}

export function QuestionarioIniciar({
  questionarioId,
  usuarioId: usuarioIdProp,
  contexto = { tipo: 'GERAL' },
  titulo,
  descricao,
  onSessaoIniciada,
  className,
}: QuestionarioIniciarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isIniciando, setIsIniciando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Usa o usuarioId da prop ou pega da sessão
  const usuarioId = usuarioIdProp || (session?.user?.id ? parseInt(session.user.id) : undefined);

  const iniciarSessao = async () => {
    // Se não tem usuarioId prop e não está autenticado, mostra erro
    if (!usuarioIdProp && !session?.user?.id) {
      setErro('Usuário não autenticado');
      return;
    }

    setIsIniciando(true);
    setErro(null);

    try {
      const response = await fetch('/api/sessoes/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionarioId,
          ...(usuarioIdProp && { usuarioId: usuarioIdProp }), // Apenas envia se foi passado explicitamente
          contexto,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao iniciar sessão');
      }

      const data = await response.json();
      
      toast.success('Questionário iniciado!', {
        description: 'Você será redirecionado...',
      });

      // Callback opcional
      if (onSessaoIniciada) {
        onSessaoIniciada(data.sessao.id);
      }

      // Redirecionar para sessão ativa
      setTimeout(() => {
        router.push(`/avaliacoes/sessao/${data.sessao.id}`);
      }, 500);

    } catch (error) {
      console.error('[QuestionarioIniciar] Erro:', error);
      setErro(error instanceof Error ? error.message : 'Erro desconhecido');
      toast.error('Erro ao iniciar questionário');
    } finally {
      setIsIniciando(false);
    }
  };

  // Mapear tipo de contexto para badge
  const getBadgeContexto = (tipo?: ContextoTipo) => {
    const map = {
      GERAL: { label: 'Geral', variant: 'default' as const },
      CHECK_IN: { label: 'Check-in Diário', variant: 'secondary' as const },
      AULA: { label: 'Avaliação de Aula', variant: 'outline' as const },
      EVENTO: { label: 'Evento', variant: 'outline' as const },
    };
    return map[tipo || 'GERAL'];
  };

  const badge = getBadgeContexto(contexto.tipo);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {titulo || 'Novo Questionário'}
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              {descricao || 'Clique em "Iniciar" para começar o questionário adaptativo'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~2 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Adaptativo</span>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        {/* Botão Iniciar */}
        <Button
          onClick={iniciarSessao}
          disabled={isIniciando}
          className="w-full"
          size="lg"
        >
          {isIniciando ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Iniciando...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Iniciar Questionário
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
