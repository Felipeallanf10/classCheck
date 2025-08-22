'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface AvaliacaoSkeletonProps {
  className?: string
  count?: number
}

export function AvaliacaoSkeleton({ className, count = 1 }: AvaliacaoSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={cn("h-full flex flex-col", className)}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1 min-w-0">
                {/* Título da aula */}
                <Skeleton className="h-5 w-3/4" />
                
                {/* Informações do professor e disciplina */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                </div>
              </div>
              
              {/* Badge de status */}
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            {/* Rating e Humor */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-8" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 rounded-full" />
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-6 w-6 rounded-full mx-auto" />
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50 mt-auto">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

// Skeleton para Stats Cards
export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            
            {/* Barra de progresso */}
            <div className="mt-3">
              <Skeleton className="w-full h-2 rounded-full" />
            </div>

            {/* Badge adicional */}
            <div className="mt-2">
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton para página de avaliações completa
export function AvaliacoesPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Stats Cards */}
      <StatsCardSkeleton />

      {/* Filtros */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-36" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Lista de avaliações */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AvaliacaoSkeleton count={6} />
      </div>
    </div>
  )
}
