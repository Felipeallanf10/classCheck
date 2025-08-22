'use client'

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function RatingStars({ 
  value = 0, 
  onChange, 
  readonly = false, 
  size = "md",
  className 
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState(0)
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0)
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (hoverValue || value) >= star
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={cn(
              "transition-all duration-200",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-200",
                isActive 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "fill-transparent text-gray-300 dark:text-gray-600",
                !readonly && "hover:text-yellow-300"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
