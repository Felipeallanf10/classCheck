import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle } from "lucide-react"

// ✨ TEXTAREA VARIANTS
const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
  {
    variants: {
      size: {
        sm: "min-h-[60px] px-2 py-1 text-xs",
        default: "min-h-[80px] px-3 py-2",
        lg: "min-h-[120px] px-4 py-3 text-base"
      },
      variant: {
        default: "border-neutral-200 focus-visible:border-primary-300",
        error: "border-danger-300 focus-visible:border-danger-500 focus-visible:ring-danger-200",
        success: "border-success-300 focus-visible:border-success-500 focus-visible:ring-success-200",
        warning: "border-warning-300 focus-visible:border-warning-500 focus-visible:ring-warning-200"
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y", 
        horizontal: "resize-x",
        both: "resize"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      resize: "vertical"
    }
  }
)

// 🎯 TYPES
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  /**
   * Label do campo
   */
  label?: string
  /**
   * Texto de ajuda/descrição
   */
  helperText?: string
  /**
   * Mensagem de erro
   */
  errorMessage?: string
  /**
   * Se deve mostrar contador de caracteres
   */
  showCharacterCount?: boolean
  /**
   * Se é obrigatório (adiciona *)
   */
  required?: boolean
  /**
   * Se está carregando
   */
  loading?: boolean
  /**
   * Estado de validação
   */
  validationState?: "error" | "success" | "warning" | "default"
  /**
   * Auto-expand baseado no conteúdo
   */
  autoExpand?: boolean
  /**
   * Altura máxima para auto-expand (em pixels)
   */
  maxExpandHeight?: number
}

// 🎪 TEXTAREA MELHORADO
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      size,
      variant,
      resize,
      label,
      helperText,
      errorMessage,
      showCharacterCount,
      required,
      loading,
      validationState,
      autoExpand,
      maxExpandHeight = 400,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const finalRef = ref || textareaRef

    // Determina variante baseada no estado
    const finalVariant = validationState || variant || "default"
    const hasError = finalVariant === "error" || !!errorMessage
    const hasSuccess = finalVariant === "success"
    const hasWarning = finalVariant === "warning"

    // Auto-expand functionality
    const adjustHeight = React.useCallback(() => {
      const textarea = typeof finalRef === 'object' && finalRef?.current
      if (autoExpand && textarea) {
        textarea.style.height = 'auto'
        const newHeight = Math.min(textarea.scrollHeight, maxExpandHeight)
        textarea.style.height = `${newHeight}px`
      }
    }, [autoExpand, maxExpandHeight, finalRef])

    // Adjust height on value change
    React.useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e)
      if (autoExpand) {
        adjustHeight()
      }
    }

    // Status icon
    const getStatusIcon = () => {
      if (loading) {
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      }
      if (hasError) return <AlertCircle className="h-4 w-4 text-danger-500" />
      if (hasSuccess) return <CheckCircle className="h-4 w-4 text-success-500" />
      return null
    }

    const statusIcon = getStatusIcon()

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-between">
            <span>
              {label}
              {required && <span className="text-danger-500 ml-1">*</span>}
            </span>
            {statusIcon && (
              <span className="ml-2">
                {statusIcon}
              </span>
            )}
          </label>
        )}

        {/* Textarea */}
        <textarea
          className={cn(
            textareaVariants({ size, variant: finalVariant, resize }),
            {
              "resize-none": autoExpand, // Disable manual resize if auto-expand is on
            },
            className
          )}
          ref={finalRef}
          disabled={loading}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          {...props}
        />

        {/* Helper/Error Text & Character Count */}
        {(helperText || errorMessage || showCharacterCount) && (
          <div className="flex items-start justify-between">
            {/* Helper Text */}
            {(helperText || errorMessage) && (
              <p className={cn(
                "text-xs",
                {
                  "text-danger-600": hasError,
                  "text-success-600": hasSuccess && !hasError,
                  "text-warning-600": hasWarning && !hasError && !hasSuccess,
                  "text-muted-foreground": !hasError && !hasSuccess && !hasWarning
                }
              )}>
                {errorMessage || helperText}
              </p>
            )}

            {/* Character Count */}
            {showCharacterCount && maxLength && (
              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                {typeof value === 'string' ? value.length : 0}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// 💬 COMENTÁRIO TEXTAREA
export interface ComentarioTextareaProps extends Omit<TextareaProps, 'label' | 'placeholder'> {
  /**
   * Se deve mostrar contador de palavras também
   */
  showWordCount?: boolean
}

const ComentarioTextarea = React.forwardRef<HTMLTextAreaElement, ComentarioTextareaProps>(
  ({ showWordCount, showCharacterCount = true, ...props }, ref) => {
    const getWordCount = (text: string): number => {
      return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    }

    const wordCount = typeof props.value === 'string' ? getWordCount(props.value) : 0

    return (
      <div className="space-y-2">
        <Textarea
          {...props}
          ref={ref}
          label="Comentário"
          placeholder="Escreva seu comentário sobre a aula..."
          showCharacterCount={false} // Controlamos aqui
          helperText={props.helperText || "Compartilhe sua experiência e ajude outros estudantes"}
        />

        {/* Custom counters */}
        {(showCharacterCount || showWordCount) && (
          <div className="flex justify-end space-x-4 text-xs text-muted-foreground">
            {showWordCount && (
              <span>{wordCount} palavras</span>
            )}
            {showCharacterCount && props.maxLength && (
              <span>
                {typeof props.value === 'string' ? props.value.length : 0}/{props.maxLength} caracteres
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)
ComentarioTextarea.displayName = "ComentarioTextarea"

// 📝 FEEDBACK TEXTAREA (para avaliações)
export interface FeedbackTextareaProps extends Omit<TextareaProps, 'label'> {
  /**
   * Tipo de feedback
   */
  feedbackType?: "positivo" | "negativo" | "sugestao" | "geral"
}

const FeedbackTextarea = React.forwardRef<HTMLTextAreaElement, FeedbackTextareaProps>(
  ({ feedbackType = "geral", ...props }, ref) => {
    const feedbackConfig = {
      positivo: {
        label: "O que você mais gostou?",
        placeholder: "Descreva os pontos positivos da aula...",
        helperText: "Destaque o que funcionou bem"
      },
      negativo: {
        label: "O que pode melhorar?",
        placeholder: "Descreva o que pode ser melhorado...",
        helperText: "Seja construtivo em suas observações"
      },
      sugestao: {
        label: "Sugestões",
        placeholder: "Suas sugestões para próximas aulas...",
        helperText: "Compartilhe ideias para tornar as aulas ainda melhores"
      },
      geral: {
        label: "Feedback",
        placeholder: "Escreva seu feedback sobre a aula...",
        helperText: "Sua opinião é importante para melhorarmos"
      }
    }

    const config = feedbackConfig[feedbackType]

    return (
      <Textarea
        {...props}
        ref={ref}
        label={config.label}
        placeholder={props.placeholder || config.placeholder}
        helperText={props.helperText || config.helperText}
        autoExpand
        maxExpandHeight={200}
        showCharacterCount
        maxLength={props.maxLength || 500}
      />
    )
  }
)
FeedbackTextarea.displayName = "FeedbackTextarea"

// 📤 EXPORTS
export {
  Textarea,
  ComentarioTextarea,
  FeedbackTextarea,
  textareaVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Textarea básico
 * <Textarea 
 *   label="Descrição" 
 *   placeholder="Digite a descrição..."
 *   showCharacterCount
 *   maxLength={500}
 * />
 * 
 * // Auto-expand
 * <Textarea
 *   label="Comentário"
 *   autoExpand
 *   maxExpandHeight={300}
 *   placeholder="Escreva seu comentário..."
 * />
 * 
 * // Com erro
 * <Textarea
 *   label="Campo obrigatório"
 *   errorMessage="Este campo é obrigatório"
 *   validationState="error"
 * />
 * 
 * // Comentário com contadores
 * <ComentarioTextarea
 *   showWordCount
 *   showCharacterCount
 *   maxLength={1000}
 * />
 * 
 * // Feedback específico
 * <FeedbackTextarea 
 *   feedbackType="positivo"
 *   maxLength={300}
 * />
 * 
 * <FeedbackTextarea 
 *   feedbackType="sugestao"
 *   maxLength={500}
 * />
 */
