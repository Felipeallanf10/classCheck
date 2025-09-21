import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  MessageCircle,
  Flag,
  MoreVertical,
  Calendar,
  CheckCircle,
  Heart,
  Reply,
  Share2
} from "lucide-react"

// ✨ AVALIACAO CARD VARIANTS
const avaliacaoCardVariants = cva(
  "group relative overflow-hidden transition-all duration-200",
  {
    variants: {
      size: {
        compact: "p-4",
        default: "p-6", 
        expanded: "p-8"
      },
      variant: {
        default: "border-neutral-200 hover:border-neutral-300",
        highlighted: "border-primary-300 bg-primary-50 dark:bg-primary-950",
        verified: "border-success-300 bg-success-50 dark:bg-success-950",
        negative: "border-warning-300 bg-warning-50 dark:bg-warning-950"
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
export interface AvaliacaoData {
  id: string
  aluno: {
    nome: string
    avatar?: string
    nivel?: string // "Iniciante", "Intermediário", "Avançado"
    verificado?: boolean
  }
  aula: {
    id: string
    titulo: string
    professor: string
  }
  nota: number // 1-5
  titulo?: string
  comentario: string
  aspectos?: {
    didatica?: number
    clareza?: number
    organizacao?: number
    material?: number
    disponibilidade?: number
  }
  dataAvaliacao: Date
  likes: number
  dislikes: number
  respostas?: number
  tags?: string[]
  isLiked?: boolean
  isDisliked?: boolean
  isFavorited?: boolean
  isReported?: boolean
  resposta?: {
    professor: string
    data: Date
    texto: string
  }
  helpful?: boolean
  verificada?: boolean
}

export interface AvaliacaoCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avaliacaoCardVariants> {
  /**
   * Dados da avaliação
   */
  avaliacao: AvaliacaoData
  /**
   * Se deve mostrar ações (like, responder, etc)
   */
  showActions?: boolean
  /**
   * Se deve mostrar informações da aula
   */
  showAulaInfo?: boolean
  /**
   * Se deve mostrar aspectos detalhados
   */
  showAspectos?: boolean
  /**
   * Se é clicável
   */
  clickable?: boolean
  /**
   * Callback ao clicar no card
   */
  onCardClick?: (avaliacao: AvaliacaoData) => void
  /**
   * Callback ao dar like
   */
  onLike?: (avaliacaoId: string, isLiked: boolean) => void
  /**
   * Callback ao dar dislike
   */
  onDislike?: (avaliacaoId: string, isDisliked: boolean) => void
  /**
   * Callback ao responder
   */
  onReply?: (avaliacaoId: string) => void
  /**
   * Callback ao compartilhar
   */
  onShare?: (avaliacao: AvaliacaoData) => void
  /**
   * Callback ao reportar
   */
  onReport?: (avaliacaoId: string) => void
  /**
   * Callback ao favoritar
   */
  onFavorite?: (avaliacaoId: string, isFavorited: boolean) => void
}

// 🎪 AVALIACAO CARD COMPONENT
const AvaliacaoCard = React.forwardRef<HTMLDivElement, AvaliacaoCardProps>(
  (
    {
      className,
      avaliacao,
      size,
      variant,
      layout,
      showActions = true,
      showAulaInfo = true,
      showAspectos = false,
      clickable = false,
      onCardClick,
      onLike,
      onDislike,
      onReply,
      onShare,
      onReport,
      onFavorite,
      ...props
    },
    ref
  ) => {
    // Renderizar estrelas
    const renderStars = (rating: number, size: "sm" | "default" = "default") => {
      const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"
      
      return (
        <div className="flex items-center space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                starSize,
                star <= rating 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-neutral-300"
              )}
            />
          ))}
        </div>
      )
    }

    // Determinar variante baseada no contexto
    const getVariant = () => {
      if (avaliacao.verificada) return "verified"
      if (avaliacao.nota <= 2) return "negative"
      if (avaliacao.helpful) return "highlighted"
      return variant || "default"
    }

    // Badge de verificação/destaque
    const getBadge = () => {
      if (avaliacao.verificada) {
        return (
          <Badge variant="default" className="bg-success-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verificada
          </Badge>
        )
      }
      if (avaliacao.helpful) {
        return <Badge variant="secondary">Útil</Badge>
      }
      if (avaliacao.aluno.verificado) {
        return <Badge variant="outline">Aluno Verificado</Badge>
      }
      return null
    }

    return (
      <Card
        ref={ref}
        className={cn(
          avaliacaoCardVariants({ size, variant: getVariant(), layout }),
          {
            "cursor-pointer": clickable,
            "hover:shadow-md": clickable
          },
          className
        )}
        onClick={clickable ? () => onCardClick?.(avaliacao) : undefined}
        {...props}
      >
        {layout === "vertical" ? (
          // Layout Vertical
          <>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                {/* Info do aluno */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avaliacao.aluno.avatar} />
                    <AvatarFallback>
                      {avaliacao.aluno.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{avaliacao.aluno.nome}</h4>
                      {avaliacao.aluno.verificado && (
                        <CheckCircle className="h-4 w-4 text-success-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-1">
                      {/* Nota com estrelas */}
                      <div className="flex items-center space-x-1">
                        {renderStars(avaliacao.nota)}
                        <span className="text-sm font-medium ml-1">{avaliacao.nota}.0</span>
                      </div>
                      
                      {/* Data */}
                      <span className="text-xs text-muted-foreground">
                        {avaliacao.dataAvaliacao.toLocaleDateString()}
                      </span>
                    </div>

                    {/* Nível do aluno */}
                    {avaliacao.aluno.nivel && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {avaliacao.aluno.nivel}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Badges e ações */}
                <div className="flex items-center space-x-2">
                  {getBadge()}
                  {showActions && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onFavorite?.(avaliacao.id, !avaliacao.isFavorited)
                        }}
                        className="p-1 rounded hover:bg-neutral-100 transition-colors"
                      >
                        <Heart 
                          className={cn("h-4 w-4", {
                            "fill-red-500 text-red-500": avaliacao.isFavorited,
                            "text-muted-foreground": !avaliacao.isFavorited
                          })} 
                        />
                      </button>
                      
                      <button className="p-1 rounded hover:bg-neutral-100 transition-colors">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Info da aula */}
              {showAulaInfo && (
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3">
                  <p className="text-sm font-medium">{avaliacao.aula.titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    Por {avaliacao.aula.professor}
                  </p>
                </div>
              )}

              {/* Título da avaliação */}
              {avaliacao.titulo && (
                <h3 className="font-semibold text-lg">{avaliacao.titulo}</h3>
              )}

              {/* Comentário */}
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">{avaliacao.comentario}</p>
                
                {/* Tags */}
                {avaliacao.tags && avaliacao.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {avaliacao.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Aspectos detalhados */}
              {showAspectos && avaliacao.aspectos && (
                <div className="space-y-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                  <h4 className="text-sm font-medium">Aspectos Avaliados</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(avaliacao.aspectos).map(([aspecto, nota]) => (
                      <div key={aspecto} className="flex items-center justify-between">
                        <span className="text-xs capitalize">{aspecto}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(nota, "sm")}
                          <span className="text-xs font-medium">{nota}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resposta do professor */}
              {avaliacao.resposta && (
                <div className="bg-primary-50 dark:bg-primary-950 border-l-4 border-primary-500 rounded-r-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="default" className="bg-primary-500">Professor</Badge>
                    <span className="text-sm font-medium">{avaliacao.resposta.professor}</span>
                    <span className="text-xs text-muted-foreground">
                      {avaliacao.resposta.data.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{avaliacao.resposta.texto}</p>
                </div>
              )}

              {/* Ações */}
              {showActions && (
                <div className="flex items-center justify-between pt-4 border-t">
                  {/* Likes/Dislikes */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onLike?.(avaliacao.id, !avaliacao.isLiked)
                      }}
                      className={cn(
                        "flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors",
                        avaliacao.isLiked 
                          ? "bg-success-100 text-success-700" 
                          : "hover:bg-neutral-100"
                      )}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{avaliacao.likes}</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDislike?.(avaliacao.id, !avaliacao.isDisliked)
                      }}
                      className={cn(
                        "flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors",
                        avaliacao.isDisliked 
                          ? "bg-danger-100 text-danger-700" 
                          : "hover:bg-neutral-100"
                      )}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>{avaliacao.dislikes}</span>
                    </button>
                  </div>

                  {/* Outras ações */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onReply?.(avaliacao.id)
                      }}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Responder
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onShare?.(avaliacao)
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartilhar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onReport?.(avaliacao.id)
                      }}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          // Layout Horizontal
          <CardContent className="flex items-start space-x-4 p-4">
            {/* Avatar */}
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={avaliacao.aluno.avatar} />
              <AvatarFallback>
                {avaliacao.aluno.nome.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{avaliacao.aluno.nome}</h4>
                    {renderStars(avaliacao.nota, "sm")}
                    <span className="text-sm font-medium">{avaliacao.nota}.0</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {avaliacao.comentario}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>{avaliacao.dataAvaliacao.toLocaleDateString()}</span>
                    {showAulaInfo && (
                      <span>{avaliacao.aula.titulo}</span>
                    )}
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLike?.(avaliacao.id, !avaliacao.isLiked)}
                      className="flex items-center space-x-1 text-xs hover:bg-neutral-100 px-2 py-1 rounded"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{avaliacao.likes}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }
)
AvaliacaoCard.displayName = "AvaliacaoCard"

// 🎓 AVALIACAO CARD COMPACTO
export interface AvaliacaoCardCompactProps extends Omit<AvaliacaoCardProps, 'size' | 'showAspectos' | 'layout'> {}

const AvaliacaoCardCompact = React.forwardRef<HTMLDivElement, AvaliacaoCardCompactProps>(
  ({ avaliacao, ...props }, ref) => {
    return (
      <AvaliacaoCard 
        {...props}
        ref={ref}
        avaliacao={avaliacao}
        size="compact"
        layout="horizontal"
        showAspectos={false}
      />
    )
  }
)
AvaliacaoCardCompact.displayName = "AvaliacaoCardCompact"

// 📤 EXPORTS
export {
  AvaliacaoCard,
  AvaliacaoCardCompact,
  avaliacaoCardVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Card de avaliação completo
 * <AvaliacaoCard 
 *   avaliacao={avaliacaoData}
 *   showAspectos
 *   onLike={(id, liked) => handleLike(id, liked)}
 *   onReply={(id) => openReplyModal(id)}
 * />
 * 
 * // Card compacto para listas
 * <AvaliacaoCardCompact 
 *   avaliacao={avaliacaoData}
 *   showAulaInfo={false}
 * />
 * 
 * // Lista de avaliações
 * <div className="space-y-4">
 *   {avaliacoes.map(avaliacao => (
 *     <AvaliacaoCard 
 *       key={avaliacao.id} 
 *       avaliacao={avaliacao}
 *       showAspectos={false}
 *     />
 *   ))}
 * </div>
 * 
 * // Avaliações verificadas em destaque
 * <div className="grid grid-cols-1 gap-4">
 *   {avaliacoesVerificadas.map(avaliacao => (
 *     <AvaliacaoCard 
 *       key={avaliacao.id}
 *       avaliacao={avaliacao}
 *       variant="verified"
 *       showAspectos
 *     />
 *   ))}
 * </div>
 */
