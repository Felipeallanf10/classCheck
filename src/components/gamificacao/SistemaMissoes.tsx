'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Clock, 
  Calendar,
  Star,
  Trophy,
  Zap,
  CheckCircle,
  Play,
  Users,
  BookOpen,
  Heart,
  TrendingUp,
  Award,
  Gift,
  Timer
} from 'lucide-react';

interface Missao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'diaria' | 'semanal' | 'mensal' | 'especial' | 'desafio';
  categoria: 'participacao' | 'desempenho' | 'social' | 'aprendizado' | 'bem-estar';
  dificuldade: 'facil' | 'medio' | 'dificil' | 'expert';
  objetivos: ObjetivoMissao[];
  recompensas: Recompensa[];
  tempoLimite?: Date;
  ativa: boolean;
  concluida: boolean;
  progresso: number;
  progressoMaximo: number;
  icone: React.ReactNode;
  cor: string;
}

interface ObjetivoMissao {
  id: string;
  descricao: string;
  concluido: boolean;
  progresso: number;
  meta: number;
}

interface Recompensa {
  tipo: 'pontos' | 'badge' | 'titulo' | 'item';
  valor: string | number;
  descricao: string;
}

interface DesafioEspecial {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  participantes: number;
  maxParticipantes: number;
  premios: Recompensa[];
  requisitos: string[];
  ativo: boolean;
}

const SistemaMissoes: React.FC = () => {
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [desafiosEspeciais, setDesafiosEspeciais] = useState<DesafioEspecial[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('ativas');

  useEffect(() => {
    // Simulando dados de missões
    const missoesData: Missao[] = [
      {
        id: 'missao-diaria-1',
        titulo: 'Início Positivo',
        descricao: 'Complete sua avaliação matinal e mantenha um humor positivo',
        tipo: 'diaria',
        categoria: 'bem-estar',
        dificuldade: 'facil',
        objetivos: [
          {
            id: 'obj-1',
            descricao: 'Fazer avaliação matinal',
            concluido: true,
            progresso: 1,
            meta: 1
          },
          {
            id: 'obj-2',
            descricao: 'Registrar humor positivo (≥7)',
            concluido: false,
            progresso: 0,
            meta: 1
          }
        ],
        recompensas: [
          { tipo: 'pontos', valor: 25, descricao: '25 pontos de experiência' },
          { tipo: 'badge', valor: 'morning-warrior', descricao: 'Badge Guerreiro Matinal' }
        ],
        tempoLimite: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 horas
        ativa: true,
        concluida: false,
        progresso: 1,
        progressoMaximo: 2,
        icone: <Target className="h-5 w-5" />,
        cor: 'bg-blue-500'
      },
      {
        id: 'missao-semanal-1',
        titulo: 'Consistência Total',
        descricao: 'Participe de todas as avaliações durante 7 dias consecutivos',
        tipo: 'semanal',
        categoria: 'participacao',
        dificuldade: 'medio',
        objetivos: [
          {
            id: 'obj-3',
            descricao: 'Completar avaliações diárias',
            concluido: false,
            progresso: 4,
            meta: 7
          },
          {
            id: 'obj-4',
            descricao: 'Manter streak sem falhas',
            concluido: false,
            progresso: 4,
            meta: 7
          }
        ],
        recompensas: [
          { tipo: 'pontos', valor: 100, descricao: '100 pontos de experiência' },
          { tipo: 'titulo', valor: 'Dedicado', descricao: 'Título: O Dedicado' },
          { tipo: 'badge', valor: 'consistency-master', descricao: 'Badge Mestre da Consistência' }
        ],
        tempoLimite: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        ativa: true,
        concluida: false,
        progresso: 4,
        progressoMaximo: 7,
        icone: <Calendar className="h-5 w-5" />,
        cor: 'bg-green-500'
      },
      {
        id: 'missao-mensal-1',
        titulo: 'Evolução Emocional',
        descricao: 'Demonstre crescimento consistente em todas as dimensões emocionais',
        tipo: 'mensal',
        categoria: 'desempenho',
        dificuldade: 'dificil',
        objetivos: [
          {
            id: 'obj-5',
            descricao: 'Melhorar pontuação em Autoconhecimento',
            concluido: true,
            progresso: 15,
            meta: 15
          },
          {
            id: 'obj-6',
            descricao: 'Melhorar pontuação em Autorregulação',
            concluido: false,
            progresso: 8,
            meta: 15
          },
          {
            id: 'obj-7',
            descricao: 'Melhorar pontuação em Empatia',
            concluido: false,
            progresso: 12,
            meta: 15
          }
        ],
        recompensas: [
          { tipo: 'pontos', valor: 250, descricao: '250 pontos de experiência' },
          { tipo: 'titulo', valor: 'Evoluído', descricao: 'Título: Emocionalmente Evoluído' },
          { tipo: 'item', valor: 'golden-frame', descricao: 'Moldura Dourada para Perfil' }
        ],
        tempoLimite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
        ativa: true,
        concluida: false,
        progresso: 35,
        progressoMaximo: 45,
        icone: <Heart className="h-5 w-5" />,
        cor: 'bg-purple-500'
      },
      {
        id: 'missao-social-1',
        titulo: 'Colaborador Exemplar',
        descricao: 'Ajude outros estudantes e contribua para a comunidade',
        tipo: 'semanal',
        categoria: 'social',
        dificuldade: 'medio',
        objetivos: [
          {
            id: 'obj-8',
            descricao: 'Dar feedback positivo para colegas',
            concluido: false,
            progresso: 2,
            meta: 5
          },
          {
            id: 'obj-9',
            descricao: 'Participar de discussões em grupo',
            concluido: true,
            progresso: 3,
            meta: 3
          }
        ],
        recompensas: [
          { tipo: 'pontos', valor: 75, descricao: '75 pontos de experiência' },
          { tipo: 'badge', valor: 'team-player', descricao: 'Badge Jogador de Equipe' }
        ],
        ativa: true,
        concluida: false,
        progresso: 5,
        progressoMaximo: 8,
        icone: <Users className="h-5 w-5" />,
        cor: 'bg-orange-500'
      },
      {
        id: 'missao-especial-1',
        titulo: 'Mestre do Conhecimento',
        descricao: 'Complete todos os módulos de aprendizado disponíveis',
        tipo: 'especial',
        categoria: 'aprendizado',
        dificuldade: 'expert',
        objetivos: [
          {
            id: 'obj-10',
            descricao: 'Completar módulo de Inteligência Emocional',
            concluido: true,
            progresso: 1,
            meta: 1
          },
          {
            id: 'obj-11',
            descricao: 'Completar módulo de Comunicação',
            concluido: false,
            progresso: 0,
            meta: 1
          },
          {
            id: 'obj-12',
            descricao: 'Completar módulo de Liderança',
            concluido: false,
            progresso: 0,
            meta: 1
          }
        ],
        recompensas: [
          { tipo: 'pontos', valor: 500, descricao: '500 pontos de experiência' },
          { tipo: 'titulo', valor: 'Mestre', descricao: 'Título: Mestre do Conhecimento' },
          { tipo: 'item', valor: 'scholar-crown', descricao: 'Coroa de Estudioso' }
        ],
        ativa: true,
        concluida: false,
        progresso: 1,
        progressoMaximo: 3,
        icone: <BookOpen className="h-5 w-5" />,
        cor: 'bg-indigo-500'
      }
    ];

    // Simulando desafios especiais
    const desafiosData: DesafioEspecial[] = [
      {
        id: 'desafio-1',
        nome: 'Olimpíada do Bem-Estar',
        descricao: 'Competição mensal para ver quem consegue manter o melhor equilíbrio emocional',
        dataInicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dataFim: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        participantes: 127,
        maxParticipantes: 200,
        premios: [
          { tipo: 'pontos', valor: 1000, descricao: '1º Lugar: 1000 pontos' },
          { tipo: 'titulo', valor: 'Campeão', descricao: '1º Lugar: Título Campeão' },
          { tipo: 'pontos', valor: 500, descricao: '2º-5º Lugar: 500 pontos' },
          { tipo: 'badge', valor: 'olympic-medal', descricao: 'Top 10: Badge Medalhista' }
        ],
        requisitos: [
          'Participar por pelo menos 15 dias',
          'Manter pontuação média ≥ 7',
          'Completar pelo menos 3 missões semanais'
        ],
        ativo: true
      },
      {
        id: 'desafio-2',
        nome: 'Jornada da Empatia',
        descricao: 'Desafio focado em desenvolver habilidades empáticas através de atividades colaborativas',
        dataInicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        dataFim: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        participantes: 0,
        maxParticipantes: 150,
        premios: [
          { tipo: 'titulo', valor: 'Empático', descricao: 'Título: Coração Empático' },
          { tipo: 'badge', valor: 'empathy-master', descricao: 'Badge Mestre da Empatia' },
          { tipo: 'item', valor: 'heart-aura', descricao: 'Aura de Coração' }
        ],
        requisitos: [
          'Completar avaliações de empatia',
          'Participar de atividades em grupo',
          'Dar feedback construtivo'
        ],
        ativo: false
      }
    ];

    setMissoes(missoesData);
    setDesafiosEspeciais(desafiosData);
  }, []);

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return 'bg-green-100 text-green-700';
      case 'medio': return 'bg-yellow-100 text-yellow-700';
      case 'dificil': return 'bg-orange-100 text-orange-700';
      case 'expert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'diaria': return <Clock className="h-4 w-4" />;
      case 'semanal': return <Calendar className="h-4 w-4" />;
      case 'mensal': return <TrendingUp className="h-4 w-4" />;
      case 'especial': return <Star className="h-4 w-4" />;
      case 'desafio': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTempoRestante = (tempoLimite?: Date) => {
    if (!tempoLimite) return null;
    
    const agora = new Date();
    const diferenca = tempoLimite.getTime() - agora.getTime();
    
    if (diferenca <= 0) return 'Expirado';
    
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) return `${dias}d ${horas % 24}h restantes`;
    return `${horas}h restantes`;
  };

  const missoesFiltradas = missoes.filter(missao => {
    const tipoMatch = filtroTipo === 'todas' || missao.tipo === filtroTipo;
    const statusMatch = filtroStatus === 'todas' || 
      (filtroStatus === 'ativas' && missao.ativa && !missao.concluida) ||
      (filtroStatus === 'concluidas' && missao.concluida) ||
      (filtroStatus === 'expiradas' && !missao.ativa);
    
    return tipoMatch && statusMatch;
  });

  const iniciarMissao = (missaoId: string) => {
    setMissoes(missoes.map(missao => 
      missao.id === missaoId ? { ...missao, ativa: true } : missao
    ));
  };

  const participarDesafio = (desafioId: string) => {
    setDesafiosEspeciais(desafios => 
      desafios.map(desafio => 
        desafio.id === desafioId 
          ? { ...desafio, participantes: desafio.participantes + 1 }
          : desafio
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{missoes.filter(m => m.ativa).length}</p>
                <p className="text-sm text-gray-600">Missões Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{missoes.filter(m => m.concluida).length}</p>
                <p className="text-sm text-gray-600">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{desafiosEspeciais.filter(d => d.ativo).length}</p>
                <p className="text-sm text-gray-600">Desafios Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(
                    missoes.filter(m => m.ativa).reduce((acc, m) => acc + (m.progresso / m.progressoMaximo), 0) / 
                    missoes.filter(m => m.ativa).length * 100
                  )}%
                </p>
                <p className="text-sm text-gray-600">Progresso Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="missoes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="missoes">Missões</TabsTrigger>
          <TabsTrigger value="desafios">Desafios Especiais</TabsTrigger>
        </TabsList>

        <TabsContent value="missoes" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo:</label>
                  <select 
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="ml-2 px-3 py-1 border rounded-md"
                  >
                    <option value="todas">Todas</option>
                    <option value="diaria">Diárias</option>
                    <option value="semanal">Semanais</option>
                    <option value="mensal">Mensais</option>
                    <option value="especial">Especiais</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Status:</label>
                  <select 
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="ml-2 px-3 py-1 border rounded-md"
                  >
                    <option value="ativas">Ativas</option>
                    <option value="concluidas">Concluídas</option>
                    <option value="todas">Todas</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Missões */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {missoesFiltradas.map((missao) => (
              <Card key={missao.id} className={`border-l-4 ${missao.cor}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${missao.cor} bg-opacity-20`}>
                        {missao.icone}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{missao.titulo}</CardTitle>
                        <p className="text-sm text-gray-600">{missao.descricao}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-1">
                        {getTipoIcon(missao.tipo)}
                        <Badge variant="outline" className="text-xs">
                          {missao.tipo}
                        </Badge>
                      </div>
                      <Badge className={getDificuldadeColor(missao.dificuldade)}>
                        {missao.dificuldade}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progresso Geral */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso Total</span>
                      <span>{missao.progresso}/{missao.progressoMaximo}</span>
                    </div>
                    <Progress value={(missao.progresso / missao.progressoMaximo) * 100} className="h-2" />
                  </div>

                  {/* Objetivos */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Objetivos:</h4>
                    <div className="space-y-2">
                      {missao.objetivos.map((objetivo) => (
                        <div key={objetivo.id} className="flex items-center space-x-2">
                          <CheckCircle 
                            className={`h-4 w-4 ${
                              objetivo.concluido ? 'text-green-500' : 'text-gray-300'
                            }`} 
                          />
                          <span className={`text-sm flex-1 ${
                            objetivo.concluido ? 'line-through text-gray-500' : ''
                          }`}>
                            {objetivo.descricao}
                          </span>
                          <span className="text-xs text-gray-500">
                            {objetivo.progresso}/{objetivo.meta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recompensas */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recompensas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {missao.recompensas.map((recompensa, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {typeof recompensa.valor === 'number' ? `${recompensa.valor} pts` : recompensa.descricao}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tempo Restante */}
                  {missao.tempoLimite && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Timer className="h-4 w-4 text-orange-500" />
                      <span className="text-orange-600 font-medium">
                        {getTempoRestante(missao.tempoLimite)}
                      </span>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex space-x-2">
                    {!missao.ativa && !missao.concluida && (
                      <Button 
                        size="sm" 
                        onClick={() => iniciarMissao(missao.id)}
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Iniciar
                      </Button>
                    )}
                    
                    {missao.concluida && (
                      <Badge className="flex-1 justify-center bg-green-100 text-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Concluída
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="desafios" className="space-y-6">
          {/* Desafios Especiais */}
          <div className="space-y-4">
            {desafiosEspeciais.map((desafio) => (
              <Card key={desafio.id} className="border-2 border-yellow-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        {desafio.nome}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{desafio.descricao}</p>
                    </div>
                    
                    <Badge className={desafio.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {desafio.ativo ? 'Ativo' : 'Em Breve'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Informações do Desafio */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Participantes</p>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(desafio.participantes / desafio.maxParticipantes) * 100} 
                          className="flex-1 h-2"
                        />
                        <span className="text-sm text-gray-600">
                          {desafio.participantes}/{desafio.maxParticipantes}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Início</p>
                      <p className="text-sm text-gray-600">
                        {desafio.dataInicio.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Fim</p>
                      <p className="text-sm text-gray-600">
                        {desafio.dataFim.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Requisitos */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Requisitos:</h4>
                    <ul className="space-y-1">
                      {desafio.requisitos.map((requisito, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span>{requisito}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prêmios */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <Gift className="h-4 w-4" />
                      Prêmios:
                    </h4>
                    <div className="space-y-1">
                      {desafio.premios.map((premio, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {premio.descricao}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Ação */}
                  {desafio.ativo && (
                    <Button 
                      onClick={() => participarDesafio(desafio.id)}
                      className="w-full"
                    >
                      Participar do Desafio
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SistemaMissoes;
