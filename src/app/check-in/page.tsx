'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { QuestionarioIniciar } from '@/components/avaliacoes/QuestionarioIniciar';
import { HistoricoTab } from '@/components/avaliacao/HistoricoTab';
import { AnaliseTab } from '@/components/avaliacao/AnaliseTab';
import { ClipboardCheck, History, BarChart3 } from 'lucide-react';

export default function CheckInPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <PageHeader
          title="Check-in Diário"
          description="Como você está se sentindo hoje? Registre seu estado emocional"
        />

        <Tabs defaultValue="nova" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="nova" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Avaliação</span>
              <span className="sm:hidden">Nova</span>
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
              <span className="sm:hidden">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="analise" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Análise</span>
              <span className="sm:hidden">Análise</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nova">
            <QuestionarioIniciar
              questionarioId="questionario-checkin-diario"
              contexto={{ tipo: 'CHECK_IN' }}
              titulo="Check-in Diário"
              descricao="Responda algumas perguntas rápidas sobre como você está se sentindo hoje"
            />
          </TabsContent>

          <TabsContent value="historico">
            <HistoricoTab />
          </TabsContent>

          <TabsContent value="analise">
            <AnaliseTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
