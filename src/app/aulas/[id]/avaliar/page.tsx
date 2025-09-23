<<<<<<< HEAD
'use client'

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AvaliacaoForm } from "@/components/avaliacao"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, User, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { type AvaliacaoFormData } from "@/lib/validations/avaliacao"
import { useToast } from "@/hooks/use-toast"

// Mock data para a aula baseado no ID
const getMockAula = (id: string) => {
  const aulas = {
    "1": {
      id: "1",
      titulo: "Geografia – Continentes",
      professor: "Prof. Ana Silva",
      disciplina: "Geografia",
      data: new Date("2025-08-20"),
      horario: "14:00 - 15:30",
      sala: "Sala 204",
      descricao: "Estudo detalhado dos continentes terrestres, suas características geográficas, climáticas e culturais. Análise dos aspectos físicos e humanos de cada continente.",
      objetivos: [
        "Identificar os continentes e suas características",
        "Compreender a diversidade geográfica mundial",
        "Analisar aspectos culturais e econômicos"
      ],
      status: "CONCLUIDA",
      jaAvaliada: false
    },
    "2": {
      id: "2",
      titulo: "História – Revolução Francesa",
      professor: "Prof. Lucas Mendes",
      disciplina: "História",
      data: new Date("2025-08-19"),
      horario: "10:00 - 11:30",
      sala: "Sala 301",
      descricao: "Análise dos eventos que levaram à Revolução Francesa, suas causas, desenvolvimento e consequências para a sociedade francesa e mundial.",
      objetivos: [
        "Compreender as causas da Revolução Francesa",
        "Analisar os principais eventos do período",
        "Avaliar o impacto histórico da revolução"
      ],
      status: "CONCLUIDA",
      jaAvaliada: false
    },
    "3": {
      id: "3",
      titulo: "Matemática – Porcentagem",
      professor: "Prof. Carla Santos",
      disciplina: "Matemática",
      data: new Date("2025-08-18"),
      horario: "08:00 - 09:30",
      sala: "Sala 102",
      descricao: "Conceitos fundamentais de porcentagem, cálculos percentuais, aplicações práticas em situações do cotidiano e resolução de problemas.",
      objetivos: [
        "Dominar o conceito de porcentagem",
        "Realizar cálculos percentuais",
        "Aplicar porcentagem em situações reais"
      ],
      status: "CONCLUIDA",
      jaAvaliada: true
    }
  }

  return aulas[id as keyof typeof aulas] || {
    id,
    titulo: "Aula não encontrada",
    professor: "Professor não definido",
    disciplina: "Disciplina não definida",
    data: new Date(),
    horario: "Horário não definido",
    sala: "Sala não definida",
    descricao: "Descrição não disponível.",
    objetivos: [],
    status: "AGENDADA",
    jaAvaliada: false
  }
}

export default function AvaliarAulaPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const aulaId = params.id as string
  const aula = getMockAula(aulaId)

  const handleSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular delay de envio para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Avaliação enviada:", {
        aulaId,
        aulaTitle: aula.titulo,
        ...data
      })
      
      toast.success({
        title: "Avaliação enviada com sucesso!",
        description: `Sua avaliação para "${aula.titulo}" foi registrada.`
      })
      
      // Simular redirecionamento após sucesso
      setTimeout(() => {
        router.push('/avaliacoes')
      }, 1500)
      
    } catch (error) {
      toast.error({
        title: "Erro ao enviar avaliação",
        description: "Tente novamente em alguns instantes."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONCLUIDA":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Concluída</Badge>
      case "EM_ANDAMENTO":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Em Andamento</Badge>
      case "AGENDADA":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Agendada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (aula.jaAvaliada) {
    return (
      <SidebarProvider>
        <SidebarInset>
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-emerald-900 dark:via-teal-900 dark:to-green-900">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {/* Header com botão voltar */}
              <div className="flex items-center gap-4 mb-8">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => router.back()}
                  className="gap-2 bg-white/70 hover:bg-white/90 backdrop-blur-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </div>

              {/* Card principal melhorado */}
              <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                {/* Header com gradiente */}
                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 p-8 text-white text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm mb-6">
                    <div className="text-4xl">✅</div>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Aula já avaliada!</h1>
                  <p className="text-emerald-100 text-lg">
                    Obrigado por compartilhar sua experiência
                  </p>
                </div>

                <CardContent className="p-8 text-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      {aula.titulo}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                      Sua avaliação para esta aula foi registrada com sucesso. Você pode visualizar 
                      ou gerenciar todas as suas avaliações na página de histórico.
                    </p>
                  </div>

                  {/* Informações da aula em cards pequenos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Professor</p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-300">{aula.professor}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Disciplina</p>
                          <p className="text-sm text-teal-600 dark:text-teal-300">{aula.disciplina}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botões de ação melhorados */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Button 
                      onClick={() => router.push('/avaliacoes')}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <span className="mr-2">📊</span>
                      Ver Avaliações
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/aulas')}
                      className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                      size="lg"
                    >
                      <span className="mr-2">📚</span>
                      Voltar às Aulas
                    </Button>
                  </div>

                  {/* Mensagem motivacional */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl mt-8">
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      "Sua opinião é valiosa e ajuda a melhorar a qualidade do ensino para todos!"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          {/* Header com gradiente e efeitos visuais */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="relative max-w-6xl mx-auto px-6 py-8">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => router.back()}
                  className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Avaliar Aula
                </h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  Compartilhe sua experiência e ajude a melhorar o ensino para todos
                </p>
              </div>
            </div>
            
            {/* Onda decorativa */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg className="w-full h-12 text-slate-50 dark:text-slate-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-8 -mt-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar com detalhes da aula */}
              <div className="lg:col-span-4 space-y-6">
                {/* Card da Aula - Design moderno */}
                <Card className="overflow-hidden shadow-xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold leading-tight">{aula.titulo}</h2>
                        <div className="flex items-center gap-3 text-blue-100">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">{aula.professor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs font-medium">{aula.disciplina}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    {/* Informações principais em grid moderno */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Data</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{format(aula.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Horário</p>
                          <p className="text-sm text-purple-700 dark:text-purple-300">{aula.horario}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Local</p>
                          <p className="text-sm text-indigo-700 dark:text-indigo-300">{aula.sala}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="pt-2">
                      {getStatusBadge(aula.status)}
                    </div>
                  </CardContent>
                </Card>

                {/* Descrição expandida */}
                <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3 text-slate-800 dark:text-slate-200">Sobre esta aula</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {aula.descricao}
                    </p>
                    
                    {aula.objetivos.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-slate-800 dark:text-slate-200">Objetivos de Aprendizagem</h4>
                        <ul className="space-y-2">
                          {aula.objetivos.map((objetivo, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">{objetivo}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Formulário de avaliação */}
              <div className="lg:col-span-8 md:col-span-7">
                <div className="sticky top-8">
                  <AvaliacaoForm
                    aulaTitle={aula.titulo}
                    onSubmit={handleSubmit}
                    isLoading={isSubmitting}
                    className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  />
                </div>
=======
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
>>>>>>> main
              </div>
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </SidebarInset>
    </SidebarProvider>
  )
=======
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
>>>>>>> main
}
