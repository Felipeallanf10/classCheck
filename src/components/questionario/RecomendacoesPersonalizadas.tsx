'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  BookOpen, 
  PlayCircle, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { CircumplexPosition } from '@/lib/psychometrics/circumplex-model';

interface RecomendacoesPersonalizadasProps {
  estadoAtual: string;
  posicaoCircumplex: CircumplexPosition;
  confianca: number;
}

const RecomendacoesPersonalizadas: React.FC<RecomendacoesPersonalizadasProps> = ({
  estadoAtual,
  posicaoCircumplex,
  confianca
}) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<'imediatas' | 'desenvolvimento' | 'recursos'>('imediatas');

  // Gerar recomendações baseadas no estado emocional atual
  const gerarRecomendacoes = () => {
    const { valence, arousal } = posicaoCircumplex;
    
    // Determinar quadrante
    let quadrante = '';
    if (valence > 0 && arousal > 0) quadrante = 'entusiasmado';
    else if (valence > 0 && arousal < 0) quadrante = 'calmo';
    else if (valence < 0 && arousal < 0) quadrante = 'desanimado';
    else quadrante = 'agitado';

    const recomendacoes = {
      entusiasmado: {
        imediatas: [
          {
            titulo: 'Canalize sua energia positiva',
            descricao: 'Aproveite este momento de alta energia para tarefas desafiadoras ou criativas',
            icone: Activity,
            tipo: 'acao',
            tempo: '5-10 min'
          },
          {
            titulo: 'Compartilhe sua energia',
            descricao: 'Conecte-se com colegas ou amigos para maximizar o impacto positivo',
            icone: Users,
            tipo: 'social',
            tempo: '15-30 min'
          },
          {
            titulo: 'Documente este estado',
            descricao: 'Registre o que levou a este estado positivo para replicar no futuro',
            icone: BookOpen,
            tipo: 'reflexao',
            tempo: '5 min'
          }
        ],
        desenvolvimento: [
          {
            titulo: 'Técnicas de Manutenção da Energia Positiva',
            descricao: 'Aprenda estratégias para prolongar e aproveitar estados de alta energia positiva',
            evidencia: 'Baseado em Positive Psychology (Seligman, 2011)',
            recursos: ['Mindfulness ativo', 'Gratidão estruturada', 'Flow states']
          },
          {
            titulo: 'Inteligência Emocional Aplicada',
            descricao: 'Desenvolva habilidades para reconhecer e utilizar estados emocionais otimais',
            evidencia: 'Modelo de Goleman (1995) e Mayer & Salovey (1997)',
            recursos: ['Auto-awareness', 'Regulação emocional', 'Empatia social']
          }
        ],
        recursos: [
          { nome: 'Apps de Mindfulness', link: '#', tipo: 'app' },
          { nome: 'Livros sobre Flow', link: '#', tipo: 'livro' },
          { nome: 'Técnicas de Respiração', link: '#', tipo: 'exercicio' }
        ]
      },
      calmo: {
        imediatas: [
          {
            titulo: 'Aproveite a serenidade',
            descricao: 'Use este momento para reflexão profunda ou atividades contemplativas',
            icone: Brain,
            tipo: 'reflexao',
            tempo: '10-20 min'
          },
          {
            titulo: 'Planejamento estratégico',
            descricao: 'Estados calmos são ideais para tomar decisões importantes',
            icone: CheckCircle,
            tipo: 'planejamento',
            tempo: '15-30 min'
          },
          {
            titulo: 'Práticas de bem-estar',
            descricao: 'Implemente técnicas de relaxamento para manter este estado positivo',
            icone: Heart,
            tipo: 'bem-estar',
            tempo: '10-15 min'
          }
        ],
        desenvolvimento: [
          {
            titulo: 'Cultivo da Serenidade',
            descricao: 'Técnicas para desenvolver e acessar estados de calma quando necessário',
            evidencia: 'Baseado em Mindfulness-Based Stress Reduction (Kabat-Zinn)',
            recursos: ['Meditação guiada', 'Técnicas de respiração', 'Body scan']
          },
          {
            titulo: 'Tomada de Decisão Consciente',
            descricao: 'Aprenda a utilizar estados calmos para decisões mais sábias',
            evidencia: 'Teoria da Decisão Emocional (Damasio, 1994)',
            recursos: ['Análise ponderada', 'Intuição treinada', 'Reflexão estruturada']
          }
        ],
        recursos: [
          { nome: 'Guias de Meditação', link: '#', tipo: 'audio' },
          { nome: 'Exercícios de Respiração', link: '#', tipo: 'exercicio' },
          { nome: 'Journaling Reflexivo', link: '#', tipo: 'ferramenta' }
        ]
      },
      desanimado: {
        imediatas: [
          {
            titulo: 'Pequenas ações positivas',
            descricao: 'Comece com atividades simples que podem melhorar gradualmente seu estado',
            icone: PlayCircle,
            tipo: 'acao',
            tempo: '5-10 min'
          },
          {
            titulo: 'Busque conexão',
            descricao: 'Conecte-se com pessoas de confiança para apoio emocional',
            icone: Users,
            tipo: 'social',
            tempo: '15-30 min'
          },
          {
            titulo: 'Auto-compaixão',
            descricao: 'Pratique gentileza consigo mesmo - estados baixos são temporários',
            icone: Heart,
            tipo: 'bem-estar',
            tempo: '5-10 min'
          }
        ],
        desenvolvimento: [
          {
            titulo: 'Estratégias de Regulação Emocional',
            descricao: 'Técnicas científicas para navegar e transformar estados emocionais baixos',
            evidencia: 'Baseado em Terapia Cognitivo-Comportamental (Beck, 1976)',
            recursos: ['Reestruturação cognitiva', 'Ativação comportamental', 'Mindfulness compassivo']
          },
          {
            titulo: 'Construção de Resiliência',
            descricao: 'Desenvolva capacidades para lidar melhor com desafios emocionais',
            evidencia: 'Modelo de Resiliência de Bonanno (2004)',
            recursos: ['Flexibilidade cognitiva', 'Suporte social', 'Significado pessoal']
          }
        ],
        recursos: [
          { nome: 'Apps de Bem-estar Mental', link: '#', tipo: 'app' },
          { nome: 'Exercícios de Gratidão', link: '#', tipo: 'exercicio' },
          { nome: 'Suporte Profissional', link: '#', tipo: 'suporte' }
        ]
      },
      agitado: {
        imediatas: [
          {
            titulo: 'Técnicas de grounding',
            descricao: 'Use exercícios de ancoragem para reduzir a agitação e recuperar o foco',
            icone: Brain,
            tipo: 'regulacao',
            tempo: '5-10 min'
          },
          {
            titulo: 'Atividade física leve',
            descricao: 'Caminhe ou faça exercícios suaves para canalizar a energia excessiva',
            icone: Activity,
            tipo: 'fisica',
            tempo: '10-15 min'
          },
          {
            titulo: 'Respiração controlada',
            descricao: 'Pratique técnicas de respiração para acalmar o sistema nervoso',
            icone: Heart,
            tipo: 'respiracao',
            tempo: '3-5 min'
          }
        ],
        desenvolvimento: [
          {
            titulo: 'Manejo da Ansiedade',
            descricao: 'Técnicas comprovadas para lidar com estados de alta ativação negativa',
            evidencia: 'Baseado em Terapia de Aceitação e Compromisso (Hayes, 2004)',
            recursos: ['Aceitação psicológica', 'Defusão cognitiva', 'Valores pessoais']
          },
          {
            titulo: 'Regulação do Sistema Nervoso',
            descricao: 'Aprenda a modular respostas fisiológicas de estresse e agitação',
            evidencia: 'Teoria Polivagal (Porges, 2011)',
            recursos: ['Exercícios vagais', 'Técnicas de grounding', 'Respiração diafragmática']
          }
        ],
        recursos: [
          { nome: 'Apps de Ansiedade', link: '#', tipo: 'app' },
          { nome: 'Exercícios de Grounding', link: '#', tipo: 'exercicio' },
          { nome: 'Técnicas de Respiração', link: '#', tipo: 'audio' }
        ]
      }
    };

    return recomendacoes[quadrante as keyof typeof recomendacoes] || recomendacoes.calmo;
  };

  const recomendacoes = gerarRecomendacoes();

  // Renderizar ações imediatas
  const renderAcoesImediatas = () => (
    <div className="space-y-4">
      {recomendacoes.imediatas.map((acao, index) => {
        const Icon = acao.icone;
        return (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{acao.titulo}</h4>
                  <p className="text-sm text-gray-600 mt-1">{acao.descricao}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {acao.tipo}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {acao.tempo}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Renderizar desenvolvimento
  const renderDesenvolvimento = () => (
    <div className="space-y-4">
      {recomendacoes.desenvolvimento.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">{item.titulo}</h4>
            <p className="text-sm text-gray-600 mb-3">{item.descricao}</p>
            
            <div className="bg-blue-50 p-3 rounded-lg mb-3">
              <div className="text-xs text-blue-600 font-medium">Base Científica</div>
              <div className="text-sm text-blue-800">{item.evidencia}</div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Recursos Recomendados:</div>
              <div className="flex flex-wrap gap-1">
                {item.recursos.map((recurso, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {recurso}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Renderizar recursos
  const renderRecursos = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recomendacoes.recursos.map((recurso, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{recurso.nome}</h4>
                <Badge variant="secondary" className="text-xs mt-1">
                  {recurso.tipo}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Alerta sobre confiança */}
      {confianca < 0.7 && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            As recomendações são baseadas em uma confiança de {Math.round(confianca * 100)}%. 
            Para recomendações mais precisas, considere um questionário mais detalhado.
          </AlertDescription>
        </Alert>
      )}

      {/* Navegação das categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Personalizadas</CardTitle>
          <p className="text-sm text-gray-600">
            Baseadas no seu estado atual: <Badge>{estadoAtual}</Badge>
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex border-b mb-4">
            {[
              { id: 'imediatas', label: 'Ações Imediatas', icon: PlayCircle },
              { id: 'desenvolvimento', label: 'Desenvolvimento', icon: Brain },
              { id: 'recursos', label: 'Recursos', icon: BookOpen }
            ].map((categoria) => {
              const Icon = categoria.icon;
              return (
                <button
                  key={categoria.id}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    categoriaAtiva === categoria.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setCategoriaAtiva(categoria.id as any)}
                >
                  <Icon className="h-4 w-4" />
                  {categoria.label}
                </button>
              );
            })}
          </div>

          {/* Conteúdo baseado na categoria ativa */}
          {categoriaAtiva === 'imediatas' && renderAcoesImediatas()}
          {categoriaAtiva === 'desenvolvimento' && renderDesenvolvimento()}
          {categoriaAtiva === 'recursos' && renderRecursos()}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecomendacoesPersonalizadas;
