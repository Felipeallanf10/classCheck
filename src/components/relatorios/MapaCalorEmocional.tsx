'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CalendarDays,
  Thermometer,
  Activity,
  Users,
  Clock,
  MapPin,
  Filter,
  Download,
  RefreshCw,
  Zap,
  Heart,
  Brain,
  TrendingUp
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MapaCalorEmocionalProps {
  turmaId?: string;
  periodo: 'semana' | 'mes' | 'trimestre';
  tipoVisualizacao: 'valencia' | 'arousal' | 'ambos';
}

interface CelulaCalor {
  dia: number;
  diaSemana: string;
  hora: number;
  valencia: number;
  arousal: number;
  intensidade: number;
  numeroRegistros: number;
  evento?: {
    tipo: 'aula' | 'intervalo' | 'atividade';
    descricao: string;
  };
}

interface PadraoDetectado {
  tipo: 'horario' | 'dia_semana' | 'periodo';
  descricao: string;
  confianca: number;
  impacto: 'positivo' | 'negativo' | 'neutro';
  recomendacao: string;
}

const MapaCalorEmocional: React.FC<MapaCalorEmocionalProps> = ({
  turmaId = 'turma-001',
  periodo = 'semana',
  tipoVisualizacao = 'valencia'
}) => {
  const [dadosCalor, setDadosCalor] = useState<CelulaCalor[]>([]);
  const [padroesDetectados, setPadroesDetectados] = useState<PadraoDetectado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroHorario, setFiltroHorario] = useState<'todos' | 'manha' | 'tarde'>('todos');
  const [animacao, setAnimacao] = useState(false);

  // Configurações do mapa de calor
  const horariosAula = [7, 8, 9, 10, 11, 13, 14, 15, 16, 17];
  const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const diasSemanaCompleto = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  // Gerar dados realistas para o mapa de calor
  useEffect(() => {
    const gerarDadosCalor = () => {
      const dados: CelulaCalor[] = [];
      const hoje = new Date();
      const diasPeriodo = periodo === 'semana' ? 5 : periodo === 'mes' ? 20 : 60;

      for (let dia = 0; dia < diasPeriodo; dia++) {
        const dataAtual = subDays(hoje, diasPeriodo - dia - 1);
        const diaSemana = dataAtual.getDay();
        
        // Pular finais de semana para dados escolares
        if (diaSemana === 0 || diaSemana === 6) continue;

        const nomeDia = diasSemanaCompleto[diaSemana - 1];

        for (const hora of horariosAula) {
          // Padrões baseados em horários reais
          let valenciaBase = 0;
          let arousalBase = 0;

          // Padrão manhã vs tarde
          if (hora <= 10) {
            valenciaBase = 0.1 + Math.random() * 0.3; // Manhã mais positiva
            arousalBase = 0.2 + Math.random() * 0.4; // Energia alta
          } else if (hora <= 12) {
            valenciaBase = 0.2 + Math.random() * 0.2; // Final da manhã
            arousalBase = 0.1 + Math.random() * 0.3;
          } else if (hora <= 15) {
            valenciaBase = -0.1 + Math.random() * 0.4; // Início da tarde
            arousalBase = -0.1 + Math.random() * 0.4;
          } else {
            valenciaBase = -0.2 + Math.random() * 0.3; // Final da tarde
            arousalBase = -0.2 + Math.random() * 0.2; // Energia baixa
          }

          // Padrão semanal (segunda pior, sexta melhor)
          const fatorSemanal = (diaSemana - 1) * 0.1 - 0.2;
          valenciaBase += fatorSemanal;

          // Eventos especiais
          let evento;
          if (hora === 10 && diaSemana === 3) {
            evento = { tipo: 'atividade' as const, descricao: 'Educação Física' };
            valenciaBase += 0.3;
            arousalBase += 0.4;
          } else if (hora === 14 && diaSemana === 5) {
            evento = { tipo: 'atividade' as const, descricao: 'Arte' };
            valenciaBase += 0.2;
          }

          // Normalizar valores
          const valencia = Math.max(-1, Math.min(1, valenciaBase));
          const arousal = Math.max(-1, Math.min(1, arousalBase));
          const intensidade = Math.sqrt(valencia * valencia + arousal * arousal);

          dados.push({
            dia,
            diaSemana: nomeDia,
            hora,
            valencia,
            arousal,
            intensidade,
            numeroRegistros: 20 + Math.floor(Math.random() * 10),
            evento
          });
        }
      }

      return dados;
    };

    const detectarPadroes = (dados: CelulaCalor[]): PadraoDetectado[] => {
      const padroes: PadraoDetectado[] = [];

      // Análise por horário
      const dadosPorHorario = horariosAula.map(hora => {
        const registros = dados.filter(d => d.hora === hora);
        const valenciaMedia = registros.reduce((acc, r) => acc + r.valencia, 0) / registros.length;
        return { hora, valenciaMedia, registros: registros.length };
      });

      const melhorHorario = dadosPorHorario.reduce((prev, curr) => 
        curr.valenciaMedia > prev.valenciaMedia ? curr : prev
      );
      const piorHorario = dadosPorHorario.reduce((prev, curr) => 
        curr.valenciaMedia < prev.valenciaMedia ? curr : prev
      );

      padroes.push({
        tipo: 'horario',
        descricao: `Melhor horário: ${melhorHorario.hora}h (${((melhorHorario.valenciaMedia + 1) * 50).toFixed(0)}% bem-estar)`,
        confianca: 0.85,
        impacto: 'positivo',
        recomendacao: 'Agendar atividades importantes neste horário'
      });

      padroes.push({
        tipo: 'horario',
        descricao: `Pior horário: ${piorHorario.hora}h (${((piorHorario.valenciaMedia + 1) * 50).toFixed(0)}% bem-estar)`,
        confianca: 0.82,
        impacto: 'negativo',
        recomendacao: 'Implementar estratégias de engajamento neste período'
      });

      // Análise por dia da semana
      const dadosPorDia = diasSemanaCompleto.map(dia => {
        const registros = dados.filter(d => d.diaSemana === dia);
        const valenciaMedia = registros.reduce((acc, r) => acc + r.valencia, 0) / registros.length;
        return { dia, valenciaMedia, registros: registros.length };
      });

      const melhorDia = dadosPorDia.reduce((prev, curr) => 
        curr.valenciaMedia > prev.valenciaMedia ? curr : prev
      );

      padroes.push({
        tipo: 'dia_semana',
        descricao: `${melhorDia.dia} é o dia com melhor bem-estar da semana`,
        confianca: 0.78,
        impacto: 'positivo',
        recomendacao: 'Aproveitar este dia para atividades desafiadoras'
      });

      // Padrão de energia ao longo do dia
      const energiaManha = dados.filter(d => d.hora <= 11).reduce((acc, d) => acc + d.arousal, 0) / dados.filter(d => d.hora <= 11).length;
      const energiaTarde = dados.filter(d => d.hora >= 13).reduce((acc, d) => acc + d.arousal, 0) / dados.filter(d => d.hora >= 13).length;

      if (energiaManha > energiaTarde + 0.2) {
        padroes.push({
          tipo: 'periodo',
          descricao: 'Energia significativamente maior no período da manhã',
          confianca: 0.88,
          impacto: 'neutro',
          recomendacao: 'Concentrar atividades que exigem mais energia pela manhã'
        });
      }

      return padroes;
    };

    setLoading(true);
    setTimeout(() => {
      const dados = gerarDadosCalor();
      setDadosCalor(dados);
      setPadroesDetectados(detectarPadroes(dados));
      setLoading(false);
      setAnimacao(true);
      setTimeout(() => setAnimacao(false), 1000);
    }, 800);
  }, [periodo]);

  // Filtrar dados por horário
  const dadosFiltrados = dadosCalor.filter(celula => {
    if (filtroHorario === 'manha') return celula.hora <= 11;
    if (filtroHorario === 'tarde') return celula.hora >= 13;
    return true;
  });

  // Calcular cor da célula baseada na valência/arousal
  const getCorCelula = (celula: CelulaCalor): string => {
    let valor: number;
    
    if (tipoVisualizacao === 'valencia') {
      valor = celula.valencia;
    } else if (tipoVisualizacao === 'arousal') {
      valor = celula.arousal;
    } else {
      valor = celula.intensidade;
    }

    // Normalizar valor para 0-1
    const valorNormalizado = (valor + 1) / 2;
    
    if (tipoVisualizacao === 'valencia') {
      // Vermelho para negativo, verde para positivo
      if (valor < -0.3) return 'bg-red-500';
      if (valor < -0.1) return 'bg-red-300';
      if (valor < 0.1) return 'bg-gray-200';
      if (valor < 0.3) return 'bg-green-300';
      return 'bg-green-500';
    } else if (tipoVisualizacao === 'arousal') {
      // Azul para baixa energia, laranja para alta energia
      if (valor < -0.3) return 'bg-blue-500';
      if (valor < -0.1) return 'bg-blue-300';
      if (valor < 0.1) return 'bg-gray-200';
      if (valor < 0.3) return 'bg-orange-300';
      return 'bg-orange-500';
    } else {
      // Intensidade - gradiente de cinza para colorido
      if (valorNormalizado < 0.2) return 'bg-gray-200';
      if (valorNormalizado < 0.4) return 'bg-purple-200';
      if (valorNormalizado < 0.6) return 'bg-purple-400';
      if (valorNormalizado < 0.8) return 'bg-purple-600';
      return 'bg-purple-800';
    }
  };

  const getCorTexto = (celula: CelulaCalor): string => {
    const cor = getCorCelula(celula);
    return cor.includes('500') || cor.includes('600') || cor.includes('800') ? 'text-white' : 'text-gray-800';
  };

  const formatarValor = (celula: CelulaCalor): string => {
    let valor: number;
    
    if (tipoVisualizacao === 'valencia') {
      valor = celula.valencia;
    } else if (tipoVisualizacao === 'arousal') {
      valor = celula.arousal;
    } else {
      valor = celula.intensidade;
    }

    return ((valor + 1) * 50).toFixed(0);
  };

  // Agrupar dados por dia e hora para o mapa
  const dadosAgrupados = () => {
    const grupos: { [key: string]: CelulaCalor[] } = {};
    
    dadosFiltrados.forEach(celula => {
      const chave = `${celula.dia}-${celula.hora}`;
      if (!grupos[chave]) grupos[chave] = [];
      grupos[chave].push(celula);
    });

    return grupos;
  };

  // Calcular estatísticas resumo
  const calcularEstatisticas = () => {
    if (dadosFiltrados.length === 0) return null;

    const valenciaMedia = dadosFiltrados.reduce((acc, d) => acc + d.valencia, 0) / dadosFiltrados.length;
    const arousalMedio = dadosFiltrados.reduce((acc, d) => acc + d.arousal, 0) / dadosFiltrados.length;
    const intensidadeMedia = dadosFiltrados.reduce((acc, d) => acc + d.intensidade, 0) / dadosFiltrados.length;

    const melhorMomento = dadosFiltrados.reduce((prev, curr) => 
      curr.valencia > prev.valencia ? curr : prev
    );

    const piorMomento = dadosFiltrados.reduce((prev, curr) => 
      curr.valencia < prev.valencia ? curr : prev
    );

    return {
      valenciaMedia,
      arousalMedio,
      intensidadeMedia,
      melhorMomento,
      piorMomento,
      totalRegistros: dadosFiltrados.reduce((acc, d) => acc + d.numeroRegistros, 0)
    };
  };

  const estatisticas = calcularEstatisticas();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Mapa de Calor Emocional
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualização temporal de {tipoVisualizacao === 'valencia' ? 'bem-estar' : 
                                    tipoVisualizacao === 'arousal' ? 'energia' : 'intensidade emocional'} - {periodo}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filtroHorario} onValueChange={(value: any) => setFiltroHorario(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="manha">Manhã</SelectItem>
              <SelectItem value="tarde">Tarde</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => setAnimacao(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas Resumo */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bem-estar Médio</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {((estatisticas.valenciaMedia + 1) * 50).toFixed(0)}%
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Energia Média</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {((estatisticas.arousalMedio + 1) * 50).toFixed(0)}%
                  </p>
                </div>
                <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Melhor Momento</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {estatisticas.melhorMomento.diaSemana}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {estatisticas.melhorMomento.hora}h - {((estatisticas.melhorMomento.valencia + 1) * 50).toFixed(0)}%
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Registros</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {estatisticas.totalRegistros.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium dark:text-gray-200">Legenda:</span>
              <div className="flex items-center space-x-2">
                {tipoVisualizacao === 'valencia' ? (
                  <>
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Baixo bem-estar</span>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Neutro</span>
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Alto bem-estar</span>
                  </>
                ) : tipoVisualizacao === 'arousal' ? (
                  <>
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Baixa energia</span>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Neutra</span>
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Alta energia</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Baixa intensidade</span>
                    <div className="w-4 h-4 bg-purple-400 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Média</span>
                    <div className="w-4 h-4 bg-purple-800 rounded"></div>
                    <span className="text-xs dark:text-gray-300">Alta intensidade</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Horários de aula: 7h-17h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa de Calor Principal */}
      <Card>
        <CardHeader>
          <CardTitle>
            Mapa de Calor - {tipoVisualizacao === 'valencia' ? 'Bem-estar' : 
                             tipoVisualizacao === 'arousal' ? 'Energia' : 'Intensidade Emocional'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Cabeçalho dos horários */}
              <div className="grid grid-cols-11 gap-1 mb-2">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 p-2"></div>
                {horariosAula.map(hora => (
                  <div key={hora} className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center p-2">
                    {hora}h
                  </div>
                ))}
              </div>

              {/* Linhas do mapa */}
              {Array.from(new Set(dadosFiltrados.map(d => d.dia))).sort().map(dia => (
                <div key={dia} className="grid grid-cols-11 gap-1 mb-1">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 p-2 flex items-center">
                    {dadosFiltrados.find(d => d.dia === dia)?.diaSemana || `Dia ${dia + 1}`}
                  </div>
                  
                  {horariosAula.map(hora => {
                    const celula = dadosFiltrados.find(d => d.dia === dia && d.hora === hora);
                    
                    if (!celula) {
                      return (
                        <div key={hora} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"></div>
                      );
                    }

                    return (
                      <div
                        key={hora}
                        className={`
                          aspect-square rounded border border-gray-300 flex items-center justify-center text-xs font-medium cursor-pointer
                          ${getCorCelula(celula)} ${getCorTexto(celula)}
                          ${animacao ? 'animate-pulse' : ''}
                          hover:scale-105 transition-all duration-200
                        `}
                        title={`${celula.diaSemana} ${hora}h: ${formatarValor(celula)}% | ${celula.numeroRegistros} registros${celula.evento ? ` | ${celula.evento.descricao}` : ''}`}
                      >
                        {formatarValor(celula)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análises e Padrões */}
      <Tabs defaultValue="padroes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="padroes">Padrões Detectados</TabsTrigger>
          <TabsTrigger value="eventos">Eventos Especiais</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="padroes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {padroesDetectados.map((padrao, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        padrao.impacto === 'positivo' ? 'default' :
                        padrao.impacto === 'negativo' ? 'destructive' : 'secondary'
                      }>
                        {padrao.tipo.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(padrao.confianca * 100).toFixed(0)}% confiança
                      </span>
                    </div>
                    {padrao.tipo === 'horario' && <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
                    {padrao.tipo === 'dia_semana' && <CalendarDays className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
                    {padrao.tipo === 'periodo' && <Activity className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
                  </div>
                  
                  <p className="text-sm font-medium mb-2 dark:text-gray-100">{padrao.descricao}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">{padrao.recomendacao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos com Impacto Emocional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dadosFiltrados
                  .filter(d => d.evento)
                  .map((celula, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                        <div>
                          <p className="font-medium dark:text-gray-100">{celula.evento?.descricao}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {celula.diaSemana} às {celula.hora}h
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium dark:text-gray-100">
                          {formatarValor(celula)}% bem-estar
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {celula.numeroRegistros} registros
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Insights Horários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Brain className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <span className="font-semibold text-green-800 dark:text-green-300">Pico de Bem-estar</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Melhor período detectado entre 9h-10h com consistência de 85%
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Thermometer className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                      <span className="font-semibold text-orange-800 dark:text-orange-300">Declínio Vespertino</span>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                      Queda gradual de energia observada após 15h - considerar intervalos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações Baseadas em Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm dark:text-gray-300">
                      <strong>Aulas importantes:</strong> Agendar entre 9h-11h para máximo engajamento
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-sm dark:text-gray-300">
                      <strong>Atividades dinâmicas:</strong> Implementar após 13h para reativar energia
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-sm dark:text-gray-300">
                      <strong>Momentos de reflexão:</strong> Finais de semana mostram padrão de estabilização
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MapaCalorEmocional;
