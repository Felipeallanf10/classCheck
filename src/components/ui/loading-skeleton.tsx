import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// ✨ SKELETON BASE
const skeletonVariants = cva(
  "animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded",
  {
    variants: {
      variant: {
        default: "bg-neutral-200 dark:bg-neutral-800",
        light: "bg-neutral-100 dark:bg-neutral-700",
        medium: "bg-neutral-300 dark:bg-neutral-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// 📄 SKELETON PARA TEXTOS
export interface TextSkeletonProps extends SkeletonProps {
  lines?: number
  spacing?: "sm" | "md" | "lg"
}

const TextSkeleton = React.forwardRef<HTMLDivElement, TextSkeletonProps>(
  ({ lines = 3, spacing = "md", className, ...props }, ref) => {
    const spaceClasses = {
      sm: "space-y-2",
      md: "space-y-3", 
      lg: "space-y-4"
    }

    return (
      <div ref={ref} className={cn(spaceClasses[spacing], className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4",
              i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
            )}
            {...props}
          />
        ))}
      </div>
    )
  }
)
TextSkeleton.displayName = "TextSkeleton"

// 🎴 SKELETON PARA CARDS
export interface CardSkeletonProps extends SkeletonProps {
  showAvatar?: boolean
  showImage?: boolean
  textLines?: number
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ showAvatar = false, showImage = false, textLines = 3, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950",
          className
        )}
        {...props}
      >
        {/* Header com avatar */}
        {showAvatar && (
          <div className="mb-4 flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        )}

        {/* Imagem */}
        {showImage && (
          <Skeleton className="mb-4 h-48 w-full rounded" />
        )}

        {/* Conteúdo de texto */}
        <TextSkeleton lines={textLines} />

        {/* Footer com botões */}
        <div className="mt-4 flex space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    )
  }
)
CardSkeleton.displayName = "CardSkeleton"

// 📋 SKELETON PARA LISTAS
export interface ListSkeletonProps extends SkeletonProps {
  items?: number
  showAvatar?: boolean
  showIcon?: boolean
}

const ListSkeleton = React.forwardRef<HTMLDivElement, ListSkeletonProps>(
  ({ items = 5, showAvatar = false, showIcon = false, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            {/* Avatar ou ícone */}
            {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
            {showIcon && <Skeleton className="h-6 w-6 rounded" />}
            
            {/* Conteúdo */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            
            {/* Action */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    )
  }
)
ListSkeleton.displayName = "ListSkeleton"

// 📊 SKELETON PARA TABELAS
export interface TableSkeletonProps extends SkeletonProps {
  rows?: number
  columns?: number
}

const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, columns = 4, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {/* Header */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className={cn(
                  "h-4",
                  colIndex === 0 ? "w-full" : "w-3/4"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }
)
TableSkeleton.displayName = "TableSkeleton"

// 📱 SKELETON PARA AULA CARD (específico do ClassCheck)
const AulaCardSkeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" /> {/* Nome da disciplina */}
            <Skeleton className="h-4 w-24" /> {/* Professor */}
          </div>
          <Skeleton className="h-6 w-6 rounded" /> {/* Ícone favorito */}
        </div>

        {/* Info */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-28" /> {/* Data/Hora */}
          <Skeleton className="h-4 w-20" /> {/* Sala */}
        </div>

        {/* Status */}
        <div className="mb-4">
          <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge status */}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Skeleton className="h-9 flex-1" /> {/* Botão avaliar */}
          <Skeleton className="h-9 w-9" /> {/* Botão mais opções */}
        </div>
      </div>
    )
  }
)
AulaCardSkeleton.displayName = "AulaCardSkeleton"

// 👨‍🏫 SKELETON PARA PROFESSOR CARD
const ProfessorCardSkeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950",
          className
        )}
        {...props}
      >
        {/* Avatar e nome */}
        <div className="mb-4 flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" /> {/* Nome */}
            <Skeleton className="h-4 w-24" /> {/* Disciplina */}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4 flex items-center space-x-2">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4" />
            ))}
          </div>
          <Skeleton className="h-4 w-16" /> {/* Texto rating */}
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="text-center">
            <Skeleton className="mx-auto h-6 w-8" />
            <Skeleton className="mt-1 h-3 w-16" />
          </div>
          <div className="text-center">
            <Skeleton className="mx-auto h-6 w-8" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
        </div>

        {/* Action */}
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }
)
ProfessorCardSkeleton.displayName = "ProfessorCardSkeleton"

// 📤 EXPORTS
export {
  Skeleton,
  TextSkeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  AulaCardSkeleton,
  ProfessorCardSkeleton,
  skeletonVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Skeleton básico
 * <Skeleton className="h-4 w-32" />
 * 
 * // Skeleton de texto
 * <TextSkeleton lines={3} />
 * 
 * // Skeleton de card
 * <CardSkeleton showAvatar showImage textLines={2} />
 * 
 * // Skeleton de lista
 * <ListSkeleton items={5} showAvatar />
 * 
 * // Skeletons específicos do ClassCheck
 * <AulaCardSkeleton />
 * <ProfessorCardSkeleton />
 */
