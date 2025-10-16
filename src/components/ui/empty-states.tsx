'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FileText, 
  Heart,
  Trophy,
  TrendingUp,
  MessageSquare,
  Star,
  AlertCircle,
  Search,
  Filter,
  Inbox
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  const router = useRouter()

  const handleAction = () => {
    if (action?.onClick) {
      action.onClick()
    } else if (action?.href) {
      router.push(action.href)
    }
  }

  const handleSecondaryAction = () => {
    if (secondaryAction?.onClick) {
      secondaryAction.onClick()
    } else if (secondaryAction?.href) {
      router.push(secondaryAction.href)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-muted/50 rounded-full p-6 mb-6">
        {icon || <Inbox className="h-12 w-12 text-muted-foreground" />}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={handleAction} size="lg">
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button onClick={handleSecondaryAction} variant="outline" size="lg">
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}

// Empty States Pré-configurados

export function NoAulasEmptyState() {
  return (
    <EmptyState
      icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
      title="Nenhuma aula encontrada"
      description="Não há aulas programadas para esta data. Tente selecionar outra data no calendário."
      action={{
        label: "Ver Todas as Aulas",
        href: "/aulas"
      }}
    />
  )
}

export function NoAvaliacoesEmptyState() {
  return (
    <EmptyState
      icon={<Heart className="h-12 w-12 text-muted-foreground" />}
      title="Você ainda não fez nenhuma avaliação"
      description="Que tal avaliar algumas aulas que você já assistiu? Suas avaliações ajudam professores a melhorar!"
      action={{
        label: "Avaliar Aulas",
        href: "/aulas"
      }}
      secondaryAction={{
        label: "Saber Mais",
        href: "/ajuda"
      }}
    />
  )
}

export function NoResultsEmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12 text-muted-foreground" />}
      title="Nenhum resultado encontrado"
      description="Tente ajustar seus filtros de busca ou limpar os filtros para ver todos os itens."
      action={{
        label: "Limpar Filtros",
        onClick: onClear
      }}
    />
  )
}

export function NoProfessoresEmptyState() {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12 text-muted-foreground" />}
      title="Nenhum professor encontrado"
      description="Não encontramos professores com esses critérios. Tente ajustar os filtros."
      action={{
        label: "Ver Todos os Professores",
        href: "/professores"
      }}
    />
  )
}

export function NoRelatorioDataEmptyState() {
  return (
    <EmptyState
      icon={<TrendingUp className="h-12 w-12 text-muted-foreground" />}
      title="Ainda não há dados suficientes"
      description="Continue avaliando suas aulas para gerar insights sobre sua jornada emocional de aprendizado."
      action={{
        label: "Avaliar Aulas",
        href: "/aulas"
      }}
      secondaryAction={{
        label: "Entender Como Funciona",
        href: "/ajuda"
      }}
    />
  )
}

export function NoAvaliacoesTurmaEmptyState() {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12 text-muted-foreground" />}
      title="Ainda não há avaliações para esta aula"
      description="Os alunos ainda não avaliaram esta aula. As avaliações aparecerão aqui assim que forem submetidas."
      secondaryAction={{
        label: "Voltar para Relatórios",
        href: "/relatorios"
      }}
    />
  )
}

export function ErrorEmptyState({ 
  title = "Algo deu errado", 
  description = "Não foi possível carregar os dados. Por favor, tente novamente.",
  onRetry 
}: { 
  title?: string
  description?: string
  onRetry?: () => void 
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      title={title}
      description={description}
      action={onRetry ? {
        label: "Tentar Novamente",
        onClick: onRetry
      } : undefined}
      secondaryAction={{
        label: "Voltar ao Início",
        href: "/dashboard"
      }}
    />
  )
}

// Empty State em Card (para seções de página)
export function CardEmptyState({ 
  icon, 
  title, 
  description,
  action,
  className = ""
}: EmptyStateProps & { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="py-12">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          action={action}
        />
      </CardContent>
    </Card>
  )
}
