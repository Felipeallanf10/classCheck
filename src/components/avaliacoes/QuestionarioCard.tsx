/**
 * Card de Questionário Individual
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { QuestionarioResumo } from '@/types/questionario';
import {
  getQuestionarioIcon,
  getQuestionarioColor,
  getQuestionarioLabel,
  getCategoriaIcon,
  getCategoriaColor,
  formatarDuracao,
} from '@/lib/questionario-utils';
import { Clock, FileQuestion, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionarioCardProps {
  questionario: QuestionarioResumo;
  onSelect: (questionarioId: string) => void;
  isLoading?: boolean;
}

export function QuestionarioCard({ questionario, onSelect, isLoading }: QuestionarioCardProps) {
  const Icon = getQuestionarioIcon(questionario.tipo);
  const colorClass = getQuestionarioColor(questionario.tipo);
  
  // Suportar tanto _count quanto estatisticas
  const totalPerguntas = questionario._count?.perguntas || questionario.estatisticas?.totalPerguntas || 0;
  const totalSessoes = questionario._count?.sessoes || questionario.estatisticas?.sessoesRealizadas || 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className={cn('p-3 rounded-lg', colorClass)}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            {questionario.oficial && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Oficial
              </Badge>
            )}
            {questionario.adaptativo && (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Adaptativo
              </Badge>
            )}
          </div>
        </div>

        <div>
          <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
            {questionario.titulo}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {getQuestionarioLabel(questionario.tipo)}
          </p>
        </div>

        <CardDescription className="line-clamp-2 text-sm">
          {questionario.descricao}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Categorias */}
        {questionario.categorias.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {questionario.categorias.slice(0, 3).map((categoria) => {
              const CatIcon = getCategoriaIcon(categoria);
              const catColor = getCategoriaColor(categoria);
              
              return (
                <Badge
                  key={categoria}
                  variant="outline"
                  className="text-xs font-normal"
                >
                  <CatIcon className={cn('h-3 w-3 mr-1', catColor)} />
                  {categoria.replace('_', ' ')}
                </Badge>
              );
            })}
            {questionario.categorias.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{questionario.categorias.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Informações */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileQuestion className="h-4 w-4" />
            <span>{totalPerguntas} perguntas</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatarDuracao(questionario.duracaoEstimada)}</span>
          </div>
        </div>

        {/* Estatísticas */}
        {totalSessoes > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Realizado {totalSessoes} vez
              {totalSessoes !== 1 && 'es'}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onSelect(questionario.id)}
          disabled={isLoading}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          size="lg"
        >
          {isLoading ? 'Iniciando...' : 'Iniciar Avaliação'}
        </Button>
      </CardFooter>
    </Card>
  );
}
