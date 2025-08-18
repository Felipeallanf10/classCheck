import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Star, 
  Heart, 
  Users, 
  Clock, 
  MapPin, 
  BookOpen,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreVertical,
  TrendingUp,
  Award,
  Bookmark
} from "lucide-react"

// ✨ AULA CARD VARIANTS
const aulaCardVariants = cva(
  "group relative overflow-hidden transition-all duration-200 hover:shadow-lg",
  {
    variants: {
      size: {
        compact: "p-4",
        default: "p-6", 
        expanded: "p-8"
      },
      variant: {
        default: "border-neutral-200 hover:border-primary-300",
        featured: "border-primary-300 bg-primary-50 dark:bg-primary-950",
        trending: "border-warning-300 bg-warning-50 dark:bg-warning-950"
      },
      status: {
        available: "opacity-100",
        full: "opacity-75",
        cancelled: "opacity-50"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default", 
      status: "available"
    }
  }
)

// 🎯 TYPES
export interface AulaData {
  id: string
  titulo: string
  descricao?: string
  professor: {
    nome: string
    avatar?: string
    especialidade?: string
  }
  categoria: string
  nivel: "Iniciante" | "Intermediário" | "Avançado"
  duracao: number // em minutos
  dataHora: Date
  local?: string
  modalidade: "presencial" | "online" | "hibrido"
  preco?: number
  avaliacaoMedia?: number
  totalAvaliacoes?: number
  vagas?: {
    total: number
    ocupadas: number
  }
  tags?: string[]
  isFavorito?: boolean
  isInscrito?: boolean
  thumbnail?: string
}

export interface AulaCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aulaCardVariants> {
  /**
   * Dados da aula
   */
  aula: AulaData
  /**
   * Se deve mostrar ações (favoritar, compartilhar, etc)
   */
  showActions?: boolean
  /**
   * Se deve mostrar informações detalhadas
   */
  showDetails?: boolean
  /**
   * Se é clicável
   */
  clickable?: boolean
  /**
   * Callback ao clicar no card
   */
  onCardClick?: (aula: AulaData) => void
  /**
   * Callback ao favoritar
   */
  onFavorite?: (aulaId: string, isFavorito: boolean) => void
  /**
   * Callback ao se inscrever
   */
  onEnroll?: (aulaId: string) => void
  /**
   * Callback ao compartilhar
   */
  onShare?: (aula: AulaData) => void
}

// 🎪 AULA CARD COMPONENT
const AulaCard = React.forwardRef<HTMLDivElement, AulaCardProps>(
  (
    {
      className,
      aula,
      size,
      variant,
      status,
      showActions = true,
      showDetails = true,
      clickable = true,
      onCardClick,
      onFavorite,
      onEnroll,
      onShare,
      ...props
    },
    ref
  ) => {
    // Status badges
    const getStatusBadge = () => {
      if (aula.vagas && aula.vagas.ocupadas >= aula.vagas.total) {
        return <Badge variant="destructive">Lotado</Badge>
      }
      if (aula.dataHora < new Date()) {
        return <Badge variant="secondary">Realizada</Badge>
      }
      if (variant === "featured") {
        return <Badge variant="default" className="bg-primary-500">Destaque</Badge>
      }
      if (variant === "trending") {
        return <Badge variant="default" className="bg-warning-500">Em Alta</Badge>
      }
      return null
    }

    // Nível color
    const getNivelColor = (nivel: string) => {
      switch (nivel) {
        case "Iniciante": return "bg-success-100 text-success-700"
        case "Intermediário": return "bg-warning-100 text-warning-700"
        case "Avançado": return "bg-danger-100 text-danger-700"
        default: return "bg-neutral-100 text-neutral-700"
      }
    }

    // Ocupação das vagas
    const ocupacaoPercentual = aula.vagas 
      ? (aula.vagas.ocupadas / aula.vagas.total) * 100 
      : 0

    return (
      <Card
        ref={ref}
        className={cn(
          aulaCardVariants({ size, variant, status }),
          {
            "cursor-pointer": clickable,
            "hover:scale-[1.02]": clickable
          },
          className
        )}
        onClick={clickable ? () => onCardClick?.(aula) : undefined}
        {...props}
      >
        {/* Header com thumbnail e status */}
        <CardHeader className="relative p-0">
          {/* Thumbnail */}
          {aula.thumbnail && (
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <img 
                src={aula.thumbnail} 
                alt={aula.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Status badge */}
              <div className="absolute top-3 right-3">
                {getStatusBadge()}
              </div>

              {/* Favorite button */}
              {showActions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFavorite?.(aula.id, !aula.isFavorito)
                  }}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Heart 
                    className={cn("h-4 w-4", {
                      "fill-red-500 text-red-500": aula.isFavorito,
                      "text-white": !aula.isFavorito
                    })} 
                  />
                </button>
              )}

              {/* Professor no overlay */}
              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={aula.professor.avatar} />
                  <AvatarFallback className="text-xs">
                    {aula.professor.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <p className="text-sm font-medium">{aula.professor.nome}</p>
                  {aula.professor.especialidade && (
                    <p className="text-xs opacity-90">{aula.professor.especialidade}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Header sem thumbnail */}
          {!aula.thumbnail && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={aula.professor.avatar} />
                  <AvatarFallback>
                    {aula.professor.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{aula.professor.nome}</h4>
                  {aula.professor.especialidade && (
                    <p className="text-sm text-muted-foreground">{aula.professor.especialidade}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusBadge()}
                {showActions && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onFavorite?.(aula.id, !aula.isFavorito)
                    }}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <Heart 
                      className={cn("h-4 w-4", {
                        "fill-red-500 text-red-500": aula.isFavorito,
                        "text-muted-foreground": !aula.isFavorito
                      })} 
                    />
                  </button>
                )}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className={cn("space-y-4", {
          "pt-6": !aula.thumbnail,
          "pt-4": aula.thumbnail
        })}>
          {/* Título e descrição */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg leading-tight">{aula.titulo}</h3>
              {showActions && (
                <button className="p-1 rounded hover:bg-neutral-100 transition-colors">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            {aula.descricao && showDetails && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {aula.descricao}
              </p>
            )}
          </div>

          {/* Informações principais */}
          <div className="space-y-3">
            {/* Categoria e nível */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                {aula.categoria}
              </Badge>
              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getNivelColor(aula.nivel))}>
                {aula.nivel}
              </span>
            </div>

            {/* Data, hora e duração */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{aula.dataHora.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{aula.duracao}min</span>
              </div>
            </div>

            {/* Local/Modalidade */}
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {aula.modalidade === "online" ? "Online" : 
                 aula.modalidade === "hibrido" ? "Híbrido" : 
                 aula.local || "Presencial"}
              </span>
            </div>

            {/* Avaliação */}
            {aula.avaliacaoMedia && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{aula.avaliacaoMedia.toFixed(1)}</span>
                </div>
                {aula.totalAvaliacoes && (
                  <span className="text-xs text-muted-foreground">
                    ({aula.totalAvaliacoes} avaliações)
                  </span>
                )}
              </div>
            )}

            {/* Vagas */}
            {aula.vagas && showDetails && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vagas</span>
                  <span className="font-medium">
                    {aula.vagas.ocupadas}/{aula.vagas.total}
                  </span>
                </div>
                <Progress value={ocupacaoPercentual} className="h-2" />
              </div>
            )}

            {/* Tags */}
            {aula.tags && aula.tags.length > 0 && showDetails && (
              <div className="flex flex-wrap gap-1">
                {aula.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {aula.tags.length > 3 && (
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                    +{aula.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer com preço e ações */}
          <div className="flex items-center justify-between pt-4 border-t">
            {/* Preço */}
            <div>
              {aula.preco ? (
                <span className="text-lg font-bold text-primary-600">
                  R$ {aula.preco.toFixed(2)}
                </span>
              ) : (
                <span className="text-lg font-bold text-success-600">Gratuita</span>
              )}
            </div>

            {/* Ações */}
            {showActions && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onShare?.(aula)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEnroll?.(aula.id)
                  }}
                  disabled={aula.vagas ? aula.vagas.ocupadas >= aula.vagas.total : false}
                >
                  {aula.isInscrito ? "Inscrito" : "Inscrever-se"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
AulaCard.displayName = "AulaCard"

// 🎓 AULA CARD COMPACTO (para listas)
export interface AulaCardCompactProps extends Omit<AulaCardProps, 'size' | 'showDetails'> {}

const AulaCardCompact = React.forwardRef<HTMLDivElement, AulaCardCompactProps>(
  ({ aula, ...props }, ref) => {
    return (
      <AulaCard 
        {...props}
        ref={ref}
        aula={aula}
        size="compact"
        showDetails={false}
      />
    )
  }
)
AulaCardCompact.displayName = "AulaCardCompact"

// 🌟 AULA CARD FEATURED (para destaques)
export interface AulaCardFeaturedProps extends Omit<AulaCardProps, 'variant' | 'size'> {}

const AulaCardFeatured = React.forwardRef<HTMLDivElement, AulaCardFeaturedProps>(
  ({ aula, ...props }, ref) => {
    return (
      <AulaCard 
        {...props}
        ref={ref}
        aula={aula}
        variant="featured"
        size="expanded"
      />
    )
  }
)
AulaCardFeatured.displayName = "AulaCardFeatured"

// 📤 EXPORTS
export {
  AulaCard,
  AulaCardCompact,
  AulaCardFeatured,
  aulaCardVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Card básico
 * <AulaCard 
 *   aula={aulaData}
 *   onCardClick={(aula) => router.push(`/aulas/${aula.id}`)}
 *   onFavorite={(id, isFav) => toggleFavorite(id, isFav)}
 *   onEnroll={(id) => enrollInClass(id)}
 * />
 * 
 * // Card compacto para listas
 * <AulaCardCompact 
 *   aula={aulaData}
 *   showActions={false}
 * />
 * 
 * // Card em destaque
 * <AulaCardFeatured 
 *   aula={aulaDestaque}
 *   onShare={(aula) => shareClass(aula)}
 * />
 * 
 * // Grid de aulas
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *   {aulas.map(aula => (
 *     <AulaCard key={aula.id} aula={aula} />
 *   ))}
 * </div>
 */
