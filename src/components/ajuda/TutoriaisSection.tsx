'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PlayCircle, 
  FileText, 
  BookOpen,
  Star,
  Clock
} from 'lucide-react';

// Dados simulados de tutoriais
const tutoriais = [
  {
    id: 1,
    titulo: 'Primeiros Passos no ClassCheck',
    descricao: 'Aprenda a navegar pela plataforma e configure seu perfil',
    tipo: 'video',
    duracao: '5 min',
    nivel: 'iniciante',
    visualizacoes: 1234,
    rating: 4.8
  },
  {
    id: 2,
    titulo: 'Como Avaliar uma Aula',
    descricao: 'Tutorial completo sobre o sistema de avaliação',
    tipo: 'video',
    duracao: '3 min',
    nivel: 'iniciante',
    visualizacoes: 856,
    rating: 4.9
  },
  {
    id: 3,
    titulo: 'Entendendo o Questionário Socioemocional',
    descricao: 'Saiba mais sobre o modelo e como interpretar resultados',
    tipo: 'artigo',
    duracao: '8 min',
    nivel: 'intermediario',
    visualizacoes: 642,
    rating: 4.7
  },
  {
    id: 4,
    titulo: 'Gerando e Exportando Relatórios',
    descricao: 'Aprenda a criar relatórios personalizados e exportar dados',
    tipo: 'video',
    duracao: '6 min',
    nivel: 'intermediario',
    visualizacoes: 421,
    rating: 4.6
  },
  {
    id: 5,
    titulo: 'Interpretando Seus Insights Emocionais',
    descricao: 'Como usar os insights para melhorar seu bem-estar',
    tipo: 'artigo',
    duracao: '10 min',
    nivel: 'avancado',
    visualizacoes: 318,
    rating: 4.9
  },
  {
    id: 6,
    titulo: 'Configurações Avançadas de Privacidade',
    descricao: 'Controle total sobre seus dados e privacidade',
    tipo: 'artigo',
    duracao: '7 min',
    nivel: 'avancado',
    visualizacoes: 256,
    rating: 4.5
  }
];

export function TutoriaisSection() {
  const getTipoIcon = (tipo: string) => {
    return tipo === 'video' ? (
      <PlayCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
    ) : (
      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    );
  };

  const getNivelBadge = (nivel: string) => {
    const cores = {
      'iniciante': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'intermediario': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'avancado': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
    };

    return (
      <Badge className={cores[nivel as keyof typeof cores]}>
        {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle>Central de Tutoriais</CardTitle>
              <CardDescription className="text-blue-900 dark:text-blue-100">
                Aprenda a usar todos os recursos do ClassCheck
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tutoriais.length}</div>
            <p className="text-sm text-muted-foreground">Tutoriais</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tutoriais.filter(t => t.tipo === 'video').length}
            </div>
            <p className="text-sm text-muted-foreground">Vídeos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tutoriais.filter(t => t.tipo === 'artigo').length}
            </div>
            <p className="text-sm text-muted-foreground">Artigos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(tutoriais.reduce((acc, t) => acc + t.rating, 0) / tutoriais.length * 10) / 10}
            </div>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de tutoriais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tutoriais.map((tutorial) => (
          <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTipoIcon(tutorial.tipo)}
                    <span className="text-xs uppercase font-semibold text-muted-foreground">
                      {tutorial.tipo}
                    </span>
                  </div>
                  <CardTitle className="text-base mb-2">{tutorial.titulo}</CardTitle>
                  <CardDescription className="text-sm">
                    {tutorial.descricao}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Métricas */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {tutorial.duracao}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {tutorial.rating}
                  </div>
                  <div>
                    {tutorial.visualizacoes} views
                  </div>
                </div>

                {/* Nível */}
                <div>
                  {getNivelBadge(tutorial.nivel)}
                </div>

                {/* Botão de ação */}
                <Button className="w-full" variant="outline">
                  {tutorial.tipo === 'video' ? (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Assistir Tutorial
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Ler Artigo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sugestão de mais tutoriais */}
      <Card className="bg-gray-50 dark:bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-sm">Não encontrou o que procura?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Estamos sempre criando novos tutoriais. Sugira um tópico que você gostaria de aprender!
          </p>
          <Button variant="outline">
            Sugerir Tutorial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
