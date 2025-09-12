'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Trophy, 
  Star, 
  Gift,
  X,
  Check,
  Crown,
  Zap,
  Heart,
  Target,
  Award,
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface Notificacao {
  id: string;
  tipo: 'conquista' | 'nivel' | 'missao' | 'desafio' | 'ranking' | 'social' | 'sistema';
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  cor: string;
  recompensas?: Recompensa[];
  timestamp: Date;
  lida: boolean;
  importante: boolean;
  acao?: {
    label: string;
    callback: () => void;
  };
}

interface Recompensa {
  tipo: 'pontos' | 'badge' | 'titulo' | 'item';
  valor: string | number;
  icone: React.ReactNode;
}

interface ConfiguracaoNotificacao {
  conquistas: boolean;
  niveis: boolean;
  missoes: boolean;
  desafios: boolean;
  ranking: boolean;
  social: boolean;
  sistema: boolean;
  som: boolean;
  popup: boolean;
  email: boolean;
}

const SistemaNotificacoes: React.FC = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoNotificacao>({
    conquistas: true,
    niveis: true,
    missoes: true,
    desafios: true,
    ranking: true,
    social: true,
    sistema: false,
    som: true,
    popup: true,
    email: false
  });
  const [filtro, setFiltro] = useState<'todas' | 'nao-lidas' | 'importantes'>('nao-lidas');
  const [mostrarConfiguracoes, setMostrarConfiguracoes] = useState(false);

  useEffect(() => {
    // Simulando notificações
    const notificacoesData: Notificacao[] = [
      {
        id: 'notif-1',
        tipo: 'conquista',
        titulo: 'Nova Conquista Desbloqueada!',
        descricao: 'Parabéns! Você desbloqueou a conquista "Sequência Dourada" por manter 30 dias consecutivos.',
        icone: <Trophy className="h-6 w-6" />,
        cor: 'bg-yellow-500',
        recompensas: [
          { tipo: 'pontos', valor: 100, icone: <Star className="h-4 w-4" /> },
          { tipo: 'badge', valor: 'Sequência Dourada', icone: <Award className="h-4 w-4" /> }
        ],
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        lida: false,
        importante: true,
        acao: {
          label: 'Ver Conquista',
          callback: () => console.log('Abrir conquista')
        }
      },
      {
        id: 'notif-2',
        tipo: 'nivel',
        titulo: 'Subiu de Nível!',
        descricao: 'Incrível! Você alcançou o Nível 15 e desbloqueou novas funcionalidades.',
        icone: <Crown className="h-6 w-6" />,
        cor: 'bg-purple-500',
        recompensas: [
          { tipo: 'pontos', valor: 200, icone: <Star className="h-4 w-4" /> },
          { tipo: 'titulo', valor: 'Expert Emocional', icone: <Crown className="h-4 w-4" /> }
        ],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lida: false,
        importante: true
      },
      {
        id: 'notif-3',
        tipo: 'missao',
        titulo: 'Missão Concluída',
        descricao: 'Você completou a missão "Colaborador Exemplar" com sucesso!',
        icone: <Target className="h-6 w-6" />,
        cor: 'bg-green-500',
        recompensas: [
          { tipo: 'pontos', valor: 75, icone: <Star className="h-4 w-4" /> }
        ],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        lida: true,
        importante: false
      },
      {
        id: 'notif-4',
        tipo: 'ranking',
        titulo: 'Posição no Ranking',
        descricao: 'Parabéns! Você subiu para a 3ª posição no ranking geral.',
        icone: <TrendingUp className="h-6 w-6" />,
        cor: 'bg-blue-500',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        lida: true,
        importante: false
      },
      {
        id: 'notif-5',
        tipo: 'desafio',
        titulo: 'Novo Desafio Disponível',
        descricao: 'O desafio "Jornada da Empatia" começará em breve. Inscreva-se agora!',
        icone: <Zap className="h-6 w-6" />,
        cor: 'bg-orange-500',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        lida: false,
        importante: false,
        acao: {
          label: 'Participar',
          callback: () => console.log('Participar do desafio')
        }
      },
      {
        id: 'notif-6',
        tipo: 'social',
        titulo: 'Feedback Recebido',
        descricao: 'Ana Silva deixou um feedback positivo sobre sua participação.',
        icone: <Heart className="h-6 w-6" />,
        cor: 'bg-pink-500',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lida: true,
        importante: false
      },
      {
        id: 'notif-7',
        tipo: 'sistema',
        titulo: 'Atualização do Sistema',
        descricao: 'Novas funcionalidades foram adicionadas ao sistema de gamificação.',
        icone: <Sparkles className="h-6 w-6" />,
        cor: 'bg-indigo-500',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lida: true,
        importante: false
      }
    ];

    setNotificacoes(notificacoesData);
  }, []);

  const marcarComoLida = (notifId: string) => {
    setNotificacoes(notificacoes.map(notif => 
      notif.id === notifId ? { ...notif, lida: true } : notif
    ));
  };

  const removerNotificacao = (notifId: string) => {
    setNotificacoes(notificacoes.filter(notif => notif.id !== notifId));
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(notificacoes.map(notif => ({ ...notif, lida: true })));
  };

  const formatarTempo = (timestamp: Date) => {
    const agora = new Date();
    const diferenca = agora.getTime() - timestamp.getTime();
    const minutos = Math.floor(diferenca / (1000 * 60));
    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

    if (dias > 0) return `${dias}d atrás`;
    if (horas > 0) return `${horas}h atrás`;
    if (minutos > 0) return `${minutos}min atrás`;
    return 'Agora';
  };

  const notificacoesFiltradas = notificacoes.filter(notif => {
    switch (filtro) {
      case 'nao-lidas': return !notif.lida;
      case 'importantes': return notif.importante;
      default: return true;
    }
  });

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // Componente de Notificação Popup (para demonstração)
  const NotificacaoPopup: React.FC<{ notificacao: Notificacao; onClose: () => void }> = ({ notificacao, onClose }) => (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right">
      <Card className={`border-l-4 shadow-lg ${notificacao.cor.replace('bg-', 'border-l-')}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${notificacao.cor} bg-opacity-20`}>
              <div className={`${notificacao.cor.replace('bg-', 'text-')}`}>
                {notificacao.icone}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{notificacao.titulo}</h4>
              <p className="text-xs text-gray-600 mt-1">{notificacao.descricao}</p>
              
              {notificacao.recompensas && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {notificacao.recompensas.map((recompensa, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <span className="mr-1">{recompensa.icone}</span>
                      {typeof recompensa.valor === 'number' ? `+${recompensa.valor}` : recompensa.valor}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {notificacao.acao && (
            <Button size="sm" className="w-full mt-3" onClick={notificacao.acao.callback}>
              {notificacao.acao.label}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Notificações</h1>
            {naoLidas > 0 && (
              <Badge className="bg-red-500 text-white">
                {naoLidas}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {naoLidas > 0 && (
            <Button variant="outline" size="sm" onClick={marcarTodasComoLidas}>
              <Check className="h-4 w-4 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMostrarConfiguracoes(!mostrarConfiguracoes)}
          >
            Configurações
          </Button>
        </div>
      </div>

      {/* Configurações */}
      {mostrarConfiguracoes && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3">Tipos de Notificação</h4>
                <div className="space-y-2">
                  {Object.entries({
                    conquistas: 'Conquistas e Badges',
                    niveis: 'Subida de Nível',
                    missoes: 'Missões',
                    desafios: 'Desafios',
                    ranking: 'Mudanças no Ranking',
                    social: 'Interações Sociais',
                    sistema: 'Atualizações do Sistema'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <input 
                        type="checkbox" 
                        checked={configuracoes[key as keyof ConfiguracaoNotificacao] as boolean}
                        onChange={(e) => setConfiguracoes({
                          ...configuracoes,
                          [key]: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Métodos de Notificação</h4>
                <div className="space-y-2">
                  {Object.entries({
                    som: 'Som',
                    popup: 'Popup na Tela',
                    email: 'Email'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm">{label}</span>
                      <input 
                        type="checkbox" 
                        checked={configuracoes[key as keyof ConfiguracaoNotificacao] as boolean}
                        onChange={(e) => setConfiguracoes({
                          ...configuracoes,
                          [key]: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex space-x-2">
        <Button 
          variant={filtro === 'todas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFiltro('todas')}
        >
          Todas ({notificacoes.length})
        </Button>
        <Button 
          variant={filtro === 'nao-lidas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFiltro('nao-lidas')}
        >
          Não Lidas ({naoLidas})
        </Button>
        <Button 
          variant={filtro === 'importantes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFiltro('importantes')}
        >
          Importantes ({notificacoes.filter(n => n.importante).length})
        </Button>
      </div>

      {/* Lista de Notificações */}
      <div className="space-y-3">
        {notificacoesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-gray-500">
                {filtro === 'nao-lidas' 
                  ? 'Você está em dia com suas notificações!' 
                  : 'Não há notificações para exibir.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          notificacoesFiltradas.map((notificacao) => (
            <Card 
              key={notificacao.id}
              className={`transition-all hover:shadow-md ${
                !notificacao.lida ? 'border-l-4 ' + notificacao.cor.replace('bg-', 'border-l-') : ''
              } ${notificacao.importante ? 'ring-2 ring-yellow-200' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${notificacao.cor} bg-opacity-20 shrink-0`}>
                    <div className={`${notificacao.cor.replace('bg-', 'text-')}`}>
                      {notificacao.icone}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{notificacao.titulo}</h3>
                        {notificacao.importante && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs mb-1">
                            Importante
                          </Badge>
                        )}
                        <p className="text-gray-600 text-sm mt-1">{notificacao.descricao}</p>
                        
                        {notificacao.recompensas && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {notificacao.recompensas.map((recompensa, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <span className="mr-1">{recompensa.icone}</span>
                                {typeof recompensa.valor === 'number' ? `+${recompensa.valor}` : recompensa.valor}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-xs text-gray-500">
                          {formatarTempo(notificacao.timestamp)}
                        </span>
                        
                        {!notificacao.lida && (
                          <button 
                            onClick={() => marcarComoLida(notificacao.id)}
                            className="text-gray-400 hover:text-green-600"
                            title="Marcar como lida"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => removerNotificacao(notificacao.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Remover notificação"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {notificacao.acao && (
                      <Button 
                        size="sm" 
                        className="mt-3"
                        onClick={notificacao.acao.callback}
                      >
                        {notificacao.acao.label}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SistemaNotificacoes;
