'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface DashboardSkeletonProps {
  className?: string
  tipo?: 'completo' | 'cards' | 'graficos' | 'tabelas' | 'calendario'
}

export function DashboardSkeleton({ className, tipo = 'completo' }: DashboardSkeletonProps) {
  if (tipo === 'cards') {
    return <CardsSkeletonComponent className={className} />
  }

  if (tipo === 'graficos') {
    return <GraficosSkeletonComponent className={className} />
  }

  if (tipo === 'tabelas') {
    return <TabelasSkeletonComponent className={className} />
  }

  if (tipo === 'calendario') {
    return <CalendarioSkeletonComponent className={className} />
  }

  return <DashboardCompletoSkeleton className={className} />
}

// Skeleton completo do dashboard
function DashboardCompletoSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Skeleton */}
        <div className="w-72 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Busca */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full" />
              </div>
              
              <Separator />
              
              {/* Filtros */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
              
              <Separator />
              
              {/* Filtros salvos */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <Skeleton className="h-3 w-3" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 space-y-6">
          {/* Tabs Skeleton */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="visao-geral" className="w-full">
                <div className="border-b px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TabsTrigger key={i} value={`tab-${i}`} disabled>
                        <Skeleton className="h-4 w-16" />
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="visao-geral" className="p-6 space-y-6">
                  {/* Cards de Estatísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-6 w-12" />
                          </div>
                          <Skeleton className="h-6 w-16 mb-1" />
                          <Skeleton className="h-8 w-20 mb-2" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-2 w-full mt-3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Gráficos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-5 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-64 w-full" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <Skeleton className="h-5 w-36" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-64 w-full" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabela */}
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-5 w-28" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Header da tabela */}
                        <div className="grid grid-cols-5 gap-4 pb-2 border-b">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                          ))}
                        </div>
                        
                        {/* Linhas da tabela */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="grid grid-cols-5 gap-4 py-2">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Skeleton key={j} className="h-4 w-full" />
                            ))}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Skeleton específico para cards
function CardsSkeletonComponent({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-8 w-16 mb-2" />
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton específico para gráficos
function GraficosSkeletonComponent({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded" />
            <div className="flex items-center justify-center mt-4 gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton específico para tabelas
function TabelasSkeletonComponent({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: 2 }).map((_, tableIndex) => (
        <Card key={tableIndex} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Header da tabela */}
              <div className="grid grid-cols-6 gap-4 pb-3 border-b">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3" />
                  </div>
                ))}
              </div>
              
              {/* Linhas da tabela */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4 py-3 border-b border-muted/30">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton específico para calendário
function CalendarioSkeletonComponent({ className }: { className?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Cabeçalho dos dias */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="text-center p-2">
                <Skeleton className="h-4 w-8 mx-auto" />
              </div>
            ))}
          </div>
          
          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="min-h-[100px] p-2 border rounded-lg space-y-1"
              >
                <Skeleton className="h-4 w-4" />
                {i % 3 === 0 && <Skeleton className="h-6 w-full" />}
                {i % 5 === 0 && <Skeleton className="h-6 w-full" />}
                {i % 7 === 0 && <Skeleton className="h-3 w-12" />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton para widgets individuais
export function WidgetSkeleton({ className, height = 'h-32' }: { className?: string; height?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className={cn("w-full rounded", height)} />
      </CardContent>
    </Card>
  )
}

// Skeleton para listas
export function ListaSkeleton({ 
  items = 5, 
  showAvatar = true, 
  showBadge = true,
  className 
}: { 
  items?: number
  showAvatar?: boolean
  showBadge?: boolean
  className?: string 
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3 flex-1">
            {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          {showBadge && <Skeleton className="h-6 w-16 rounded-full" />}
        </div>
      ))}
    </div>
  )
}

// Skeleton para formulários
export function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 pt-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}
