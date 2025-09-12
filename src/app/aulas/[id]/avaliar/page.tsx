'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AvaliacaoAula from '@/components/questionario/AvaliacaoAula';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';

export default function AvaliarAulaPage() {
  const params = useParams();
  const router = useRouter();
  const aulaId = params.id as string;
  
  // Estados para dados da aula
  const [aula, setAula] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados da aula
  useEffect(() => {
    async function carregarAula() {
      try {
        setIsLoading(true);
        
        // Simular carregamento de dados da aula
        // Na implementação real, isso seria uma chamada à API
        setTimeout(() => {
          setAula({
            id: aulaId,
            titulo: 'Introdução ao React e TypeScript',
            professor: {
              id: '1',
              nome: 'Prof. João Silva',
              email: 'joao.silva@universidade.edu'
            },
            disciplina: 'Desenvolvimento Web',
            data: new Date().toISOString(),
            horarioInicio: '14:00',
            horarioFim: '16:00',
            duracao: 120,
            participantesEsperados: 25,
            descricao: 'Aula introdutória sobre conceitos fundamentais do React e TypeScript para desenvolvimento de aplicações web modernas.',
            objetivos: [
              'Compreender os conceitos básicos do React',
              'Aprender a configurar um projeto com TypeScript',
              'Desenvolver componentes funcionais',
              'Implementar hooks básicos'
            ]
          });
          setIsLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Erro ao carregar dados da aula');
        setIsLoading(false);
      }
    }

    if (aulaId) {
      carregarAula();
    }
  }, [aulaId]);

  // Manipular conclusão da avaliação
  const handleAvaliacaoCompleta = async (resultado: any) => {
    try {
      console.log('Avaliação completa:', resultado);
      
      // Aqui salvaria os resultados no banco de dados
      // await fetch('/api/avaliacoes-aula', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(resultado)
      // });
      
      // Redirecionar para página de sucesso ou voltar
      router.push(`/aulas/${aulaId}?avaliacao=concluida`);
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    }
  };

  // Estados de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando dados da aula...</p>
        </div>
      </div>
    );
  }

  if (error || !aula) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Erro</h2>
            <p className="text-gray-600 mb-4">{error || 'Aula não encontrada'}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Avaliação da Aula</h1>
                <p className="text-sm text-gray-600">{aula.titulo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações da aula */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações da Aula</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600">Professor</div>
                  <div className="font-medium">{aula.professor.nome}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm text-gray-600">Data</div>
                  <div className="font-medium">
                    {new Date(aula.data).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600">Horário</div>
                  <div className="font-medium">
                    {aula.horarioInicio} - {aula.horarioFim}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-500 rounded"></div>
                <div>
                  <div className="text-sm text-gray-600">Disciplina</div>
                  <div className="font-medium">{aula.disciplina}</div>
                </div>
              </div>
            </div>
            
            {aula.descricao && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-sm text-gray-700">{aula.descricao}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Componente de avaliação */}
      <AvaliacaoAula
        aulaId={aula.id}
        professorId={aula.professor.id}
        tituloAula={aula.titulo}
        duracao={aula.duracao}
        participantes={aula.participantesEsperados}
        onAvaliacaoCompleta={handleAvaliacaoCompleta}
      />
    </div>
  );
}
