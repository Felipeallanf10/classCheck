'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  TrendingDown,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  SortDesc
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlertaUrgente {
  id: string;
  alunoId: string;
  alunoNome: string;
  tipo: 'risco_alto' | 'mudanca_brusca' | 'ausencia_prolongada' | 'declinio_consistente';
  prioridade: 'critica' | 'alta' | 'media';
  descricao: string;
  recomendacoes: string[];
  criadoEm: Date;
  status: 'pendente' | 'em_andamento' | 'resolvido';
  responsavel?: string;
  observacoes?: string;
}

interface AlertasUrgentesProps {
  turmaId: string;
  alertas: AlertaUrgente[];
}

const AlertasUrgentes: React.FC<AlertasUrgentesProps> = ({ 
  turmaId, 
  alertas 
}) => {
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'em_andamento' | 'resolvido'>('todos');
  const [filtroPrioridade, setFiltroPrioridade] = useState<'todos' | 'critica' | 'alta' | 'media'>('todos');
  const [alertaExpandido, setAlertaExpandido] = useState<string | null>(null);

  // Dados mockados para demonstração
  const alertasMock: AlertaUrgente[] = [
    {
      id: 'alerta-001',
      alunoId: 'aluno-002',
      alunoNome: 'Bruno Santos',
      tipo: 'risco_alto',
      prioridade: 'critica',
      descricao: 'Aluno apresenta estado emocional energizado-negativo com alta confiança (92%). Possível ansiedade ou irritabilidade.',
      recomendacoes: [
        'Conversa individual imediata',
        'Avaliação de fatores estressores',
        'Considerar encaminhamento ao psicólogo escolar',
        'Monitoramento diário por 1 semana'
      ],
      criadoEm: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pendente',
      responsavel: undefined
    },
    {
      id: 'alerta-002',
      alunoId: 'aluno-007',
      alunoNome: 'Gabriela Lima',
      tipo: 'declinio_consistente',
      prioridade: 'alta',
      descricao: 'Tendência de deterioração emocional observada nos últimos 5 dias. Valência caindo consistentemente.',
      recomendacoes: [
        'Investigar causas do declínio',
        'Conversa com responsáveis',
        'Atividades de suporte emocional',
        'Acompanhamento semanal'
      ],
      criadoEm: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'em_andamento',
      responsavel: 'Prof. Maria Silva',
      observacoes: 'Pai contatado. Questões familiares identificadas.'
    },
    {
      id: 'alerta-003',
      alunoId: 'aluno-005',
      alunoNome: 'Elena Costa',
      tipo: 'mudanca_brusca',
      prioridade: 'media',
      descricao: 'Mudança significativa do estado calmo-positivo para calmo-negativo em 24h.',
      recomendacoes: [
        'Observação próxima',
        'Verificar eventos recentes',
        'Oferecer suporte se necessário'
      ],
      criadoEm: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'pendente'
    },
    {
      id: 'alerta-004',
      alunoId: 'aluno-008',
      alunoNome: 'Hugo Pereira',
      tipo: 'ausencia_prolongada',
      prioridade: 'alta',
      descricao: 'Aluno não realiza avaliações há 3 dias. Última avaliação indicava estado negativo.',
      recomendacoes: [
        'Contato imediato com responsáveis',
        'Verificar frequência escolar',
        'Agendar reunião de acompanhamento'
      ],
      criadoEm: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'pendente'
    }
  ];

  const alertasFiltrados = alertasMock.filter(alerta => {
    const passaStatus = filtroStatus === 'todos' || alerta.status === filtroStatus;
    const passaPrioridade = filtroPrioridade === 'todos' || alerta.prioridade === filtroPrioridade;
    return passaStatus && passaPrioridade;
  });

  const getCorPrioridade = (prioridade: string) => {
    const cores = {
      critica: 'bg-red-100 text-red-800 border-red-300',
      alta: 'bg-orange-100 text-orange-800 border-orange-300',
      media: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return cores[prioridade as keyof typeof cores];
  };

  const getIconeTipo = (tipo: string) => {
    const icones = {
      risco_alto: <AlertTriangle className="h-5 w-5 text-red-600" />,
      mudanca_brusca: <TrendingDown className="h-5 w-5 text-orange-600" />,
      ausencia_prolongada: <Clock className="h-5 w-5 text-yellow-600" />,
      declinio_consistente: <TrendingDown className="h-5 w-5 text-red-500" />
    };
    return icones[tipo as keyof typeof icones];
  };

  const getNomeTipo = (tipo: string) => {
    const nomes = {
      risco_alto: 'Risco Alto',
      mudanca_brusca: 'Mudança Brusca',
      ausencia_prolongada: 'Ausência Prolongada',
      declinio_consistente: 'Declínio Consistente'
    };
    return nomes[tipo as keyof typeof nomes];
  };

  const getCorStatus = (status: string) => {
    const cores = {
      pendente: 'bg-gray-100 text-gray-800',
      em_andamento: 'bg-blue-100 text-blue-800',
      resolvido: 'bg-green-100 text-green-800'
    };
    return cores[status as keyof typeof cores];
  };

  const marcarComoResolvido = (alertaId: string) => {
    // Implementar lógica para marcar como resolvido
    console.log('Marcando alerta como resolvido:', alertaId);
  };

  const assumirResponsabilidade = (alertaId: string) => {
    // Implementar lógica para assumir responsabilidade
    console.log('Assumindo responsabilidade:', alertaId);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Alertas Urgentes</h3>
          <p className="text-gray-600">
            {alertasFiltrados.length} alerta{alertasFiltrados.length !== 1 ? 's' : ''} 
            {filtroStatus !== 'todos' && ` • ${filtroStatus.replace('_', ' ')}`}
            {filtroPrioridade !== 'todos' && ` • prioridade ${filtroPrioridade}`}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Status: {filtroStatus}
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc className="h-4 w-4 mr-2" />
            Prioridade: {filtroPrioridade}
          </Button>
        </div>
      </div>

      {/* Resumo por Prioridade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Crítica</p>
                <p className="text-2xl font-bold text-red-700">
                  {alertasMock.filter(a => a.prioridade === 'critica' && a.status !== 'resolvido').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Alta</p>
                <p className="text-2xl font-bold text-orange-700">
                  {alertasMock.filter(a => a.prioridade === 'alta' && a.status !== 'resolvido').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Média</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {alertasMock.filter(a => a.prioridade === 'media' && a.status !== 'resolvido').length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertasFiltrados.map((alerta) => (
          <Card key={alerta.id} className={`border-l-4 ${getCorPrioridade(alerta.prioridade).replace('bg-', 'border-').replace('-100', '-500')}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getIconeTipo(alerta.tipo)}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {alerta.alunoNome}
                      </h4>
                      <Badge className={getCorPrioridade(alerta.prioridade)}>
                        {alerta.prioridade}
                      </Badge>
                      <Badge variant="outline" className={getCorStatus(alerta.status)}>
                        {alerta.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary">
                        {getNomeTipo(alerta.tipo)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{alerta.descricao}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(alerta.criadoEm, {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </div>
                    {alerta.responsavel && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {alerta.responsavel}
                      </div>
                    )}
                  </div>

                  {alerta.observacoes && (
                    <Alert className="mt-3">
                      <AlertDescription className="text-sm">
                        <strong>Observações:</strong> {alerta.observacoes}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAlertaExpandido(
                      alertaExpandido === alerta.id ? null : alerta.id
                    )}
                  >
                    {alertaExpandido === alerta.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Seção Expandida */}
              {alertaExpandido === alerta.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Recomendações:
                    </h5>
                    <ul className="space-y-1">
                      {alerta.recomendacoes.map((recomendacao, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{recomendacao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {alerta.status === 'pendente' && (
                      <Button 
                        size="sm" 
                        onClick={() => assumirResponsabilidade(alerta.id)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Assumir Responsabilidade
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Conversar com Aluno
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contatar Responsáveis
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Encaminhar
                    </Button>
                    
                    {alerta.status !== 'resolvido' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => marcarComoResolvido(alerta.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Resolvido
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {alertasFiltrados.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum alerta encontrado
            </h3>
            <p className="text-gray-600">
              {filtroStatus === 'todos' && filtroPrioridade === 'todos' 
                ? 'Parabéns! Não há alertas urgentes no momento.'
                : 'Tente ajustar os filtros para ver outros alertas.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar Mensagem para Turma
            </Button>
            <Button variant="outline" className="justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Relatório para Coordenação
            </Button>
            <Button variant="outline" className="justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Agendar Reunião de Pais
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertasUrgentes;
