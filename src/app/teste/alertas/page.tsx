/**
 * Página de Teste - AlertaPanel
 * Visualiza o painel de alertas com dados mockados
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertaPanel } from '@/components/avaliacoes/AlertaPanel';
import { AlertaCard } from '@/components/avaliacoes/AlertaCard';
import { AlertaDetalhesModal } from '@/components/avaliacoes/AlertaDetalhesModal';
import type { Alerta, TipoAlerta } from '@/types/alerta';
import type { NivelAlerta } from '@/types/sessao';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock de alertas para teste
const gerarAlertaMock = (
  id: number,
  tipo: TipoAlerta,
  nivel: NivelAlerta,
  status: 'ATIVO' | 'VISUALIZADO' | 'EM_ACOMPANHAMENTO' | 'RESOLVIDO',
  horasAtras: number
): Alerta => ({
  id: `alerta-${id}`,
  tipo,
  nivel,
  status,
  titulo: '',
  descricao: '',
  mensagem: '',
  recomendacoes: [],
  criadoEm: new Date(Date.now() - horasAtras * 60 * 60 * 1000),
  visualizadoEm: status !== 'ATIVO' ? new Date(Date.now() - (horasAtras - 0.5) * 60 * 60 * 1000) : undefined,
  sessaoId: 'sessao-123',
  usuarioId: 'user-456',
  metadados: {
    theta: Math.random() * 4 - 2,
    confianca: 0.7 + Math.random() * 0.3,
    tempoResposta: Math.floor(Math.random() * 120) + 30,
  },
});

const alertasMock: Alerta[] = [
  {
    ...gerarAlertaMock(1, 'RISCO_EVASAO', 'VERMELHO', 'ATIVO', 2),
    titulo: 'Risco de Evasão Detectado',
    descricao: 'Padrões de comportamento indicam alto risco de abandono',
    mensagem: 'O aluno apresentou baixo engajamento nas últimas 3 avaliações, com tempo de resposta crescente e taxa de conclusão decrescente. Recomenda-se intervenção imediata.',
    recomendacoes: [
      'Agendar conversa individual urgente',
      'Verificar situação pessoal e familiar',
      'Avaliar possíveis dificuldades financeiras',
      'Oferecer suporte psicológico se necessário',
    ],
  },
  {
    ...gerarAlertaMock(2, 'ANSIEDADE_AVALIATIVA', 'LARANJA', 'ATIVO', 1),
    titulo: 'Sinais de Ansiedade Avaliativa',
    descricao: 'Respostas indicam estresse durante a avaliação',
    mensagem: 'Tempo excessivo em perguntas simples, padrão de respostas inseguras, e inconsistências sugerem ansiedade moderada.',
    recomendacoes: [
      'Considerar formatos alternativos de avaliação',
      'Oferecer ambiente mais acolhedor',
      'Fornecer feedback encorajador',
      'Sugerir técnicas de relaxamento',
    ],
  },
  {
    ...gerarAlertaMock(3, 'FADIGA_COGNITIVA', 'AMARELO', 'VISUALIZADO', 3),
    titulo: 'Fadiga Cognitiva Detectada',
    descricao: 'Sinais de cansaço mental durante avaliação',
    mensagem: 'Queda no desempenho após 15 minutos de avaliação. Tempo de resposta aumentou 40% na segunda metade.',
    recomendacoes: [
      'Recomendar pausas mais frequentes',
      'Dividir atividades em blocos menores',
      'Avaliar carga de trabalho total',
    ],
  },
  {
    ...gerarAlertaMock(4, 'BAIXO_ENGAJAMENTO', 'AMARELO', 'EM_ACOMPANHAMENTO', 24),
    titulo: 'Baixo Engajamento nas Atividades',
    descricao: 'Participação abaixo do esperado',
    mensagem: 'Respostas superficiais e tempo mínimo investido nas questões discursivas.',
    recomendacoes: [
      'Variar metodologias de ensino',
      'Propor atividades mais interativas',
      'Estabelecer metas pequenas',
    ],
  },
  {
    ...gerarAlertaMock(5, 'DIFICULDADE_APRENDIZAGEM', 'LARANJA', 'ATIVO', 0.5),
    titulo: 'Dificuldade de Aprendizagem',
    descricao: 'Padrão consistente de respostas incorretas',
    mensagem: 'Erros em conceitos fundamentais, mesmo após múltiplas tentativas. Theta IRT abaixo de -1.5.',
    recomendacoes: [
      'Revisar conteúdo com abordagem diferenciada',
      'Material de apoio adicional',
      'Considerar acompanhamento especializado',
    ],
  },
  {
    ...gerarAlertaMock(6, 'TEMPO_EXCESSIVO', 'AMARELO', 'VISUALIZADO', 4),
    titulo: 'Tempo de Resposta Excessivo',
    descricao: 'Demora acima da média esperada',
    mensagem: 'Média de 3 minutos por pergunta (esperado: 1 minuto).',
  },
  {
    ...gerarAlertaMock(7, 'INCONSISTENCIA_RESPOSTAS', 'LARANJA', 'ATIVO', 0.25),
    titulo: 'Inconsistências nas Respostas',
    descricao: 'Respostas contraditórias detectadas',
    mensagem: 'Padrões de resposta contradizem respostas anteriores na mesma dimensão.',
  },
  {
    ...gerarAlertaMock(8, 'PADRAO_ALEATORIO', 'VERMELHO', 'EM_ACOMPANHAMENTO', 6),
    titulo: 'Padrão Aleatório Detectado',
    descricao: 'Respostas sem padrão coerente',
    mensagem: 'Análise estatística sugere respostas aleatórias (p < 0.01).',
  },
  {
    ...gerarAlertaMock(9, 'ANSIEDADE_AVALIATIVA', 'VERDE', 'RESOLVIDO', 48),
    titulo: 'Ansiedade Leve (Resolvida)',
    descricao: 'Situação normalizada após intervenção',
    mensagem: 'Após conversa e adaptações, aluno completou avaliação com sucesso.',
  },
];

export default function TesteAlertaPanelPage() {
  const [alertaSelecionado, setAlertaSelecionado] = useState<Alerta | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenAlerta = (alerta: Alerta) => {
    setAlertaSelecionado(alerta);
    setModalOpen(true);
  };

  // Estatísticas
  const stats = {
    total: alertasMock.length,
    ativos: alertasMock.filter(a => a.status === 'ATIVO').length,
    vermelho: alertasMock.filter(a => a.nivel === 'VERMELHO').length,
    laranja: alertasMock.filter(a => a.nivel === 'LARANJA').length,
    amarelo: alertasMock.filter(a => a.nivel === 'AMARELO').length,
  };

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Teste: AlertaPanel</h1>
        <p className="text-muted-foreground">
          Visualize o sistema completo de alertas com dados mockados
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Alertas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.ativos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Vermelho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.vermelho}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Laranja</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.laranja}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Amarelo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.amarelo}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com diferentes visualizações */}
      <Tabs defaultValue="panel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="panel">Painel Completo</TabsTrigger>
          <TabsTrigger value="compact">Versão Compact</TabsTrigger>
          <TabsTrigger value="cards">Cards Individuais</TabsTrigger>
        </TabsList>

        {/* Painel Completo */}
        <TabsContent value="panel">
          <div className="text-sm text-muted-foreground mb-4">
            ⚠️ <strong>Nota:</strong> Este painel tentará buscar dados da API /api/alertas.
            Como estamos em modo teste, você verá um loading ou erro. Os cards abaixo usam dados mockados.
          </div>

          <AlertaPanel
            sessaoId="sessao-123"
            usuarioId="user-456"
            autoRefresh={false}
          />
        </TabsContent>

        {/* Versão Compact */}
        <TabsContent value="compact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compact Mode</CardTitle>
              <CardDescription>
                Ideal para sidebars, mobile, ou quando o espaço é limitado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                ⚠️ <strong>Nota:</strong> Tentará buscar da API. Veja os cards mockados abaixo.
              </div>
              <AlertaPanel
                compact
                maxAlertas={5}
                autoRefresh={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Individuais */}
        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cards Completos</CardTitle>
              <CardDescription>Visualização detalhada de cada alerta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alertasMock.slice(0, 4).map((alerta) => (
                <AlertaCard
                  key={alerta.id}
                  alerta={alerta}
                  onClick={() => handleOpenAlerta(alerta)}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cards Compactos</CardTitle>
              <CardDescription>Versão minimalista</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {alertasMock.slice(0, 6).map((alerta) => (
                <AlertaCard
                  key={alerta.id}
                  alerta={alerta}
                  onClick={() => handleOpenAlerta(alerta)}
                  compact
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lista de Todos os Alertas Mockados */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Alertas (Dados Mockados)</CardTitle>
          <CardDescription>
            {alertasMock.length} alertas de exemplo com diferentes tipos, níveis e status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertasMock.map((alerta) => (
              <AlertaCard
                key={alerta.id}
                alerta={alerta}
                onClick={() => handleOpenAlerta(alerta)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exemplos de Estados */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos por Tipo de Alerta</CardTitle>
          <CardDescription>
            Visualize como cada tipo de alerta é apresentado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alertasMock.slice(0, 8).map((alerta) => (
              <AlertaCard
                key={alerta.id}
                alerta={alerta}
                onClick={() => handleOpenAlerta(alerta)}
                showStatus={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <AlertaDetalhesModal
        alerta={alertaSelecionado}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
