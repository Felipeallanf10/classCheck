'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

// Mapear URLs para nomes amigáveis
const pathToLabel: Record<string, string> = {
  'dashboard': 'Início',
  'aulas': 'Aulas',
  'avaliacoes': 'Avaliações', // Mantido para compatibilidade (redirect)
  'minhas-avaliacoes': 'Minhas Avaliações',
  'professores': 'Professores',
  'avaliar': 'Avaliar',
  'sucesso': 'Concluído',
  'relatorios': 'Relatórios',
  'turma': 'Turma',
  'aula': 'Aula',
  'socioemocional': 'Avaliação Socioemocional',
  'didatica': 'Avaliação Didática',
  'concluida': 'Concluída',
  'check-in': 'Check-in Diário',
  'meu-estado-emocional': 'Minha Jornada Emocional',
  'professor': 'Professor',
  'avaliacao-aula': 'Avaliação', // Mantido para compatibilidade (páginas antigas)
  'gamificacao': 'Gamificação',
  'insights': 'Insights',
  'eventos': 'Eventos',
  'ajuda': 'Ajuda',
  'contato': 'Contato',
  'sobre': 'Sobre',
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Se items foi passado manualmente, usa ele
  if (items && items.length > 0) {
    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`}>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Início</span>
        </Link>
        
        {items.map((item, index) => (
          <Fragment key={index}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-foreground font-medium flex items-center gap-1">
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </Fragment>
        ))}
      </nav>
    )
  }

  // Gerar breadcrumbs automaticamente baseado na URL
  const segments = pathname.split('/').filter(Boolean)
  
  // Se está na home, não mostrar breadcrumbs
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
    return null
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm flex-wrap ${className}`}>
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Início</span>
      </Link>
      
      {segments.map((segment, index) => {
        // Construir path até este segmento
        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        
        // Tentar obter label amigável, senão usar o próprio segmento
        const label = pathToLabel[segment] || segment
        
        // Pular IDs numéricos na visualização
        const isNumericId = /^\d+$/.test(segment)
        if (isNumericId && !isLast) {
          return null
        }

        return (
          <Fragment key={href}>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {isLast ? (
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}

// Componente wrapper com espaçamento padrão
export function BreadcrumbsContainer({ children, items, className = '' }: { children?: React.ReactNode, items?: BreadcrumbItem[], className?: string }) {
  return (
    <div className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumbs items={items} />
        {children}
      </div>
    </div>
  )
}
