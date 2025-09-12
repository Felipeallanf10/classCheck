'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Star, 
  Trophy, 
  Award,
  Calendar,
  TrendingUp,
  Zap,
  Crown,
  Shield,
  Flame,
  Target,
  Heart,
  BookOpen,
  Users,
  Settings,
  Camera,
  Edit3
} from 'lucide-react';

interface PerfilUsuario {
  id: string;
  nome: string;
  email: string;
  avatar: string;
  titulo: string;
  nivel: number;
  experiencia: number;
  experienciaProximo: number;
  pontosTotal: number;
  ranking: number;
  classe: string;
  dataRegistro: Date;
  ultimoLogin: Date;
  streak: number;
  melhorSequencia: number;
  conquistasTotal: number;
  missoesConcluidas: number;
  participacaoMedia: number;
}

interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ReactNode;
  raridade: 'comum' | 'raro' | 'epico' | 'lendario';
  dataObtida: Date;
}

interface Estatistica {
  label: string;
  valor: string | number;
  icone: React.ReactNode;
  cor: string;
  descricao?: string;
}

interface AtividadeRecente {
  id: string;
  tipo: string;
  descricao: string;
  pontos: number;
  timestamp: Date;
}

const PerfilGamificado: React.FC = () => {
  const [perfil, setPerfil] = useState<PerfilUsuario>({
    id: 'user-1',
    nome: 'Maria Silva',
    email: 'maria.silva@email.com',
    avatar: '/api/placeholder/120/120',
    titulo: 'Mestre das Emoções',
    nivel: 15,
    experiencia: 3240,
    experienciaProximo: 3500,
    pontosTotal: 3240,
    ranking: 3,
    classe: 'Expert Emocional',
    dataRegistro: new Date('2024-01-15'),
    ultimoLogin: new Date(),
    streak: 32,
    melhorSequencia: 45,
    conquistasTotal: 18,
    missoesConcluidas: 24,
    participacaoMedia: 94
  });

  const [conquistasRecentes, setConquistasRecentes] = useState<Conquista[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    // Simulando conquistas recentes
    const conquistasData: Conquista[] = [
      {
        id: 'conquista-1',
        nome: 'Sequência Dourada',
        descricao: '30 dias consecutivos de participação',
        icone: <Flame className="h-6 w-6" />,
        raridade: 'epico',
        dataObtida: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'conquista-2',
        nome: 'Colaborador Exemplar',
        descricao: 'Ajudou 10 colegas com feedback',
        icone: <Users className="h-6 w-6" />,
        raridade: 'raro',
        dataObtida: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'conquista-3',
        nome: 'Estudioso Dedicado',
        descricao: 'Completou 50 atividades de aprendizado',
        icone: <BookOpen className="h-6 w-6" />,
        raridade: 'raro',
        dataObtida: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    // Simulando estatísticas do perfil
    const estatisticasData: Estatistica[] = [
      {
        label: 'Nível Atual',
        valor: perfil.nivel,
        icone: <Star className="h-5 w-5" />,
        cor: 'text-yellow-600',
        descricao: 'Nível baseado na experiência total'
      },
      {
        label: 'Ranking Geral',
        valor: `#${perfil.ranking}`,
        icone: <Trophy className="h-5 w-5" />,
        cor: 'text-purple-600',
        descricao: 'Posição no ranking global'
      },
      {
        label: 'Sequência Atual',
        valor: `${perfil.streak} dias`,
        icone: <Flame className="h-5 w-5" />,
        cor: 'text-orange-600',
        descricao: 'Dias consecutivos de participação'
      },
      {
        label: 'Participação',
        valor: `${perfil.participacaoMedia}%`,
        icone: <Target className="h-5 w-5" />,
        cor: 'text-green-600',
        descricao: 'Taxa de participação nas atividades'
      },
      {
        label: 'Conquistas',
        valor: perfil.conquistasTotal,
        icone: <Award className="h-5 w-5" />,
        cor: 'text-blue-600',
        descricao: 'Total de conquistas obtidas'
      },
      {
        label: 'Missões',
        valor: perfil.missoesConcluidas,
        icone: <Target className="h-5 w-5" />,
        cor: 'text-indigo-600',
        descricao: 'Missões completadas com sucesso'
      }
    ];

    // Simulando atividades recentes
    const atividadesData: AtividadeRecente[] = [
      {
        id: 'ativ-1',
        tipo: 'Avaliação',
        descricao: 'Completou avaliação socioemocional matinal',
        pontos: 25,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'ativ-2',
        tipo: 'Conquista',
        descricao: 'Desbloqueou "Sequência Dourada"',
        pontos: 100,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'ativ-3',
        tipo: 'Missão',
        descricao: 'Completou missão "Colaborador Exemplar"',
        pontos: 75,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'ativ-4',
        tipo: 'Participação',
        descricao: 'Participou de discussão em grupo',
        pontos: 15,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ];

    setConquistasRecentes(conquistasData);
    setEstatisticas(estatisticasData);
    setAtividadesRecentes(atividadesData);
  }, [perfil]);

  const getRaridadeColor = (raridade: string) => {
    switch (raridade) {
      case 'comum': return 'border-gray-300 bg-gray-50';
      case 'raro': return 'border-blue-400 bg-blue-50';
      case 'epico': return 'border-purple-500 bg-purple-50';
      case 'lendario': return 'border-yellow-500 bg-yellow-50 shadow-yellow-200 shadow-lg';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getClasseIcon = (classe: string) => {
    if (classe.includes('Expert')) return <Crown className="h-5 w-5 text-purple-600" />;
    if (classe.includes('Mestre')) return <Shield className="h-5 w-5 text-gold-600" />;
    return <Star className="h-5 w-5 text-blue-600" />;
  };

  const progressoNivel = (perfil.experiencia / perfil.experienciaProximo) * 100;
  const experienciaRestante = perfil.experienciaProximo - perfil.experiencia;
  const diasCadastrado = Math.floor((new Date().getTime() - perfil.dataRegistro.getTime()) / (1000 * 60 * 60 * 24));

  const formatarTempo = (timestamp: Date) => {
    const agora = new Date();
    const diferenca = agora.getTime() - timestamp.getTime();
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

    if (dias > 0) return `${dias}d atrás`;
    if (horas > 0) return `${horas}h atrás`;
    return 'Agora';
  };

  return (
    <div className="space-y-6">
      {/* Header do Perfil */}
      <Card className="relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10"></div>
        
        <CardContent className="relative p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar e Info Básica */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
                <button className="absolute -bottom-1 -right-1 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{perfil.nome}</h1>
                  <button 
                    onClick={() => setModoEdicao(!modoEdicao)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-700">
                    {perfil.titulo}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {getClasseIcon(perfil.classe)}
                    <span className="text-sm text-gray-600">{perfil.classe}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  Membro há {diasCadastrado} dias • Último acesso: {perfil.ultimoLogin.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Progresso do Nível */}
            <div className="flex-1 min-w-0">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">Nível {perfil.nivel}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {experienciaRestante} XP para próximo nível
                  </span>
                </div>
                
                <Progress value={progressoNivel} className="h-3 mb-2" />
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{perfil.experiencia} XP</span>
                  <span>{perfil.experienciaProximo} XP</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="estatisticas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="estatisticas" className="space-y-6">
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {estatisticas.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gray-100 ${stat.cor}`}>
                      {stat.icone}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.valor}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      {stat.descricao && (
                        <p className="text-xs text-gray-500 mt-1">{stat.descricao}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de Progresso Semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progresso dos Últimos 7 Dias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {[85, 92, 78, 95, 88, 91, 94].map((valor, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2">
                      <div 
                        className="bg-blue-200 rounded-full mx-auto" 
                        style={{ 
                          height: `${valor}px`, 
                          width: '20px',
                          minHeight: '20px'
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][index]}
                    </p>
                    <p className="text-xs font-medium">{valor}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conquistas" className="space-y-6">
          {/* Resumo de Conquistas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{perfil.conquistasTotal}</p>
                <p className="text-sm text-gray-600">Total</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-4 h-4 bg-blue-400 rounded mx-auto mb-2"></div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Raras</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-4 h-4 bg-purple-500 rounded mx-auto mb-2"></div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-gray-600">Épicas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-2"></div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Lendárias</p>
              </CardContent>
            </Card>
          </div>

          {/* Conquistas Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Conquistas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {conquistasRecentes.map((conquista) => (
                  <div 
                    key={conquista.id}
                    className={`p-4 rounded-lg border-2 ${getRaridadeColor(conquista.raridade)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-purple-600">
                        {conquista.icone}
                      </div>
                      <div>
                        <h3 className="font-semibold">{conquista.nome}</h3>
                        <p className="text-sm text-gray-600">{conquista.descricao}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {conquista.dataObtida.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atividades" className="space-y-6">
          {/* Atividades Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {atividadesRecentes.map((atividade) => (
                  <div 
                    key={atividade.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{atividade.tipo}</Badge>
                        <span className="font-medium">{atividade.descricao}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatarTempo(atividade.timestamp)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-600">+{atividade.pontos}</span>
                      <p className="text-xs text-gray-500">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          {/* Configurações do Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome de Exibição</label>
                <input 
                  type="text" 
                  value={perfil.nome}
                  onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!modoEdicao}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={perfil.email}
                  onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!modoEdicao}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Título Personalizado</label>
                <input 
                  type="text" 
                  value={perfil.titulo}
                  onChange={(e) => setPerfil({...perfil, titulo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!modoEdicao}
                />
              </div>

              {modoEdicao && (
                <div className="flex space-x-2">
                  <Button onClick={() => setModoEdicao(false)}>
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={() => setModoEdicao(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações de Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Perfil Público</p>
                  <p className="text-sm text-gray-600">Permitir que outros vejam seu perfil</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mostrar no Ranking</p>
                  <p className="text-sm text-gray-600">Aparecer nos leaderboards públicos</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações de Conquistas</p>
                  <p className="text-sm text-gray-600">Receber notificações de novas conquistas</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerfilGamificado;
