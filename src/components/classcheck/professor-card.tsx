import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  Users, 
  BookOpen,
  Award,
  MapPin,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  MoreVertical,
  TrendingUp,
  CheckCircle,
  ExternalLink
} from "lucide-react"

// ✨ PROFESSOR CARD VARIANTS
const professorCardVariants = cva(
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
        verified: "border-success-300 bg-success-50 dark:bg-success-950",
        featured: "border-primary-300 bg-primary-50 dark:bg-primary-950",
        popular: "border-warning-300 bg-warning-50 dark:bg-warning-950"
      },
      layout: {
        vertical: "flex-col",
        horizontal: "flex-row"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      layout: "vertical"
    }
  }
)

// 🎯 TYPES
export interface ProfessorData {
  id: string
  nome: string
  avatar?: string
  bio?: string
  especialidades: string[]
  experiencia?: number // anos
  formacao?: string[]
  local?: string
  avaliacaoMedia?: number
  totalAvaliacoes?: number
  totalAlunos?: number
  totalAulas?: number
  precoMedio?: number
  modalidades: ("presencial" | "online" | "hibrido")[]
  verificado?: boolean
  certificacoes?: string[]
  linguas?: string[]
  disponibilidade?: {
    dias: string[]
    horarios: string
  }
  redes?: {
    linkedin?: string
    instagram?: string
    website?: string
  }
  isFollowing?: boolean
  isFavorito?: boolean
  badge?: "novo" | "popular" | "top-rated" | "expert"
}

export interface ProfessorCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof professorCardVariants> {
  /**
   * Dados do professor
   */
  professor: ProfessorData
  /**
   * Se deve mostrar ações (seguir, favoritar, etc)
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
  onCardClick?: (professor: ProfessorData) => void
  /**
   * Callback ao seguir
   */
  onFollow?: (professorId: string, isFollowing: boolean) => void
  /**
   * Callback ao favoritar
   */
  onFavorite?: (professorId: string, isFavorito: boolean) => void
  /**
   * Callback ao enviar mensagem
   */
  onMessage?: (professorId: string) => void
  /**
   * Callback ao compartilhar
   */
  onShare?: (professor: ProfessorData) => void
  /**
   * Callback ao ver perfil
   */
  onViewProfile?: (professorId: string) => void
}

// 🎪 PROFESSOR CARD COMPONENT
const ProfessorCard = React.forwardRef<HTMLDivElement, ProfessorCardProps>(
  (
    {
      className,
      professor,
      size,
      variant,
      layout,
      showActions = true,
      showDetails = true,
      clickable = true,
      onCardClick,
      onFollow,
      onFavorite,
      onMessage,
      onShare,
      onViewProfile,
      ...props
    },
    ref
  ) => {
    // Badge do professor
    const getBadge = () => {
      if (professor.verificado) {
        return <Badge variant="default" className="bg-success-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verificado
        </Badge>
      }
      
      switch (professor.badge) {
        case "novo":
          return <Badge variant="secondary">Novo</Badge>
        case "popular":
          return <Badge variant="default" className="bg-warning-500">Popular</Badge>
        case "top-rated":
          return <Badge variant="default" className="bg-primary-500">Top Rated</Badge>
        case "expert":
          return <Badge variant="default" className="bg-purple-500">Expert</Badge>
        default:
          return null
      }
    }

    // Status da disponibilidade
    const getAvailabilityStatus = () => {
      // Simples: se tem disponibilidade, está disponível
      return professor.disponibilidade ? "Disponível" : "Consultar"
    }

    return (
      <Card
        ref={ref}
        className={cn(
          professorCardVariants({ size, variant, layout }),
          {
            "cursor-pointer": clickable,
            "hover:scale-[1.02]": clickable && layout === "vertical"
          },
          className
        )}
        onClick={clickable ? () => onCardClick?.(professor) : undefined}
        {...props}
      >
        {layout === "vertical" ? (
          // Layout Vertical
          <>
            <CardHeader className="relative text-center pb-4">
              {/* Actions no topo */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {getBadge()}
                {showActions && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onFavorite?.(professor.id, !professor.isFavorito)
                    }}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <Heart 
                      className={cn("h-4 w-4", {
                        "fill-red-500 text-red-500": professor.isFavorito,
                        "text-muted-foreground": !professor.isFavorito
                      })} 
                    />
                  </button>
                )}
              </div>

              {/* Avatar */}
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 mx-auto border-4 border-white shadow-lg">
                  <AvatarImage src={professor.avatar} />
                  <AvatarFallback className="text-xl">
                    {professor.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status online indicator */}
                <div className="absolute bottom-2 right-2 h-6 w-6 bg-success-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Nome e especialidade principal */}
              <div className="space-y-1 mt-4">
                <h3 className="font-semibold text-lg">{professor.nome}</h3>
                {professor.especialidades.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {professor.especialidades[0]}
                  </p>
                )}
                {professor.experiencia && (
                  <p className="text-xs text-muted-foreground">
                    {professor.experiencia} anos de experiência
                  </p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Bio */}
              {professor.bio && showDetails && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {professor.bio}
                </p>
              )}

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4 text-center">
                {/* Avaliação */}
                {professor.avaliacaoMedia && (
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{professor.avaliacaoMedia.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {professor.totalAvaliacoes || 0} avaliações
                    </p>
                  </div>
                )}

                {/* Alunos */}
                {professor.totalAlunos && (
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="h-4 w-4 text-primary-600" />
                      <span className="font-semibold">{professor.totalAlunos}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">alunos</p>
                  </div>
                )}

                {/* Aulas */}
                {professor.totalAulas && (
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <BookOpen className="h-4 w-4 text-success-600" />
                      <span className="font-semibold">{professor.totalAulas}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">aulas</p>
                  </div>
                )}

                {/* Preço médio */}
                {professor.precoMedio && (
                  <div>
                    <div className="flex items-center justify-center space-x-1">
                      <span className="font-semibold">R$ {professor.precoMedio}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">preço médio</p>
                  </div>
                )}
              </div>

              {/* Especialidades */}
              {professor.especialidades.length > 1 && showDetails && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Especialidades</p>
                  <div className="flex flex-wrap gap-1">
                    {professor.especialidades.slice(0, 3).map((esp, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                      >
                        {esp}
                      </span>
                    ))}
                    {professor.especialidades.length > 3 && (
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                        +{professor.especialidades.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Modalidades */}
              {professor.modalidades.length > 0 && showDetails && (
                <div className="flex justify-center space-x-2">
                  {professor.modalidades.includes("presencial") && (
                    <Badge variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      Presencial
                    </Badge>
                  )}
                  {professor.modalidades.includes("online") && (
                    <Badge variant="outline" className="text-xs">Online</Badge>
                  )}
                  {professor.modalidades.includes("hibrido") && (
                    <Badge variant="outline" className="text-xs">Híbrido</Badge>
                  )}
                </div>
              )}

              {/* Disponibilidade */}
              {professor.disponibilidade && showDetails && (
                <div className="text-center">
                  <p className="text-sm font-medium text-success-600">
                    {getAvailabilityStatus()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {professor.disponibilidade.horarios}
                  </p>
                </div>
              )}

              {/* Actions */}
              {showActions && (
                <div className="flex space-x-2">
                  <Button
                    variant={professor.isFollowing ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onFollow?.(professor.id, !professor.isFollowing)
                    }}
                  >
                    {professor.isFollowing ? "Seguindo" : "Seguir"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMessage?.(professor.id)
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onShare?.(professor)
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Ver perfil completo */}
              {clickable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewProfile?.(professor.id)
                  }}
                >
                  Ver perfil completo
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              )}
            </CardContent>
          </>
        ) : (
          // Layout Horizontal
          <>
            <CardContent className="flex items-center space-x-4 p-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                  <AvatarImage src={professor.avatar} />
                  <AvatarFallback className="text-lg">
                    {professor.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Status indicator */}
                <div className="absolute bottom-0 right-0 h-4 w-4 bg-success-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg truncate">{professor.nome}</h3>
                    {professor.especialidades.length > 0 && (
                      <p className="text-sm text-muted-foreground truncate">
                        {professor.especialidades[0]}
                      </p>
                    )}
                    
                    {/* Avaliação inline */}
                    {professor.avaliacaoMedia && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{professor.avaliacaoMedia.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({professor.totalAvaliacoes || 0})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {getBadge()}
                    {showActions && (
                      <Button
                        variant={professor.isFollowing ? "secondary" : "default"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onFollow?.(professor.id, !professor.isFollowing)
                        }}
                      >
                        {professor.isFollowing ? "Seguindo" : "Seguir"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats inline */}
                {showDetails && (
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    {professor.totalAlunos && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{professor.totalAlunos} alunos</span>
                      </div>
                    )}
                    {professor.totalAulas && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{professor.totalAulas} aulas</span>
                      </div>
                    )}
                    {professor.precoMedio && (
                      <span className="font-medium">R$ {professor.precoMedio}</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    )
  }
)
ProfessorCard.displayName = "ProfessorCard"

// 🎓 PROFESSOR CARD COMPACTO
export interface ProfessorCardCompactProps extends Omit<ProfessorCardProps, 'size' | 'showDetails' | 'layout'> {}

const ProfessorCardCompact = React.forwardRef<HTMLDivElement, ProfessorCardCompactProps>(
  ({ professor, ...props }, ref) => {
    return (
      <ProfessorCard 
        {...props}
        ref={ref}
        professor={professor}
        size="compact"
        layout="horizontal"
        showDetails={false}
      />
    )
  }
)
ProfessorCardCompact.displayName = "ProfessorCardCompact"

// 📤 EXPORTS
export {
  ProfessorCard,
  ProfessorCardCompact,
  professorCardVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Card básico vertical
 * <ProfessorCard 
 *   professor={professorData}
 *   onCardClick={(prof) => router.push(`/professores/${prof.id}`)}
 *   onFollow={(id, following) => toggleFollow(id, following)}
 *   onMessage={(id) => openChat(id)}
 * />
 * 
 * // Card horizontal compacto
 * <ProfessorCardCompact 
 *   professor={professorData}
 *   showActions={false}
 * />
 * 
 * // Grid de professores
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 *   {professores.map(professor => (
 *     <ProfessorCard key={professor.id} professor={professor} />
 *   ))}
 * </div>
 * 
 * // Lista horizontal
 * <div className="space-y-4">
 *   {professores.map(professor => (
 *     <ProfessorCard 
 *       key={professor.id} 
 *       professor={professor}
 *       layout="horizontal"
 *     />
 *   ))}
 * </div>
 */
