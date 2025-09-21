import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Search,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Lock,
  MapPin,
  Star
} from "lucide-react"

// ✨ INPUT VARIANTS
const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base"
      },
      variant: {
        default: "border-neutral-200 focus-visible:border-primary-300",
        error: "border-danger-300 focus-visible:border-danger-500 focus-visible:ring-danger-200",
        success: "border-success-300 focus-visible:border-success-500 focus-visible:ring-success-200",
        warning: "border-warning-300 focus-visible:border-warning-500 focus-visible:ring-warning-200"
      },
      disabled: {
        true: "bg-neutral-50 text-neutral-500 cursor-not-allowed",
        false: ""
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      disabled: false
    }
  }
)

// 🎯 TYPES
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "disabled">,
    VariantProps<typeof inputVariants> {
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
   * Ícone à esquerda
   */
  leftIcon?: React.ReactNode
  /**
   * Ícone à direita  
   */
  rightIcon?: React.ReactNode
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
}

// 🎪 INPUT MELHORADO  
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size,
      variant,
      disabled,
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      showCharacterCount,
      required,
      loading,
      validationState,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    // Determina variante baseada no estado
    const finalVariant = validationState || variant || "default"
    const hasError = finalVariant === "error" || !!errorMessage
    const hasSuccess = finalVariant === "success"
    const hasWarning = finalVariant === "warning"

    // Ícones de status
    const getStatusIcon = () => {
      if (loading) {
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      }
      if (hasError) return <AlertCircle className="h-4 w-4 text-danger-500" />
      if (hasSuccess) return <CheckCircle className="h-4 w-4 text-success-500" />
      return null
    }

    const statusIcon = getStatusIcon()
    const finalRightIcon = statusIcon || rightIcon

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            className={cn(
              inputVariants({ size, variant: finalVariant, disabled }),
              {
                "pl-10": leftIcon,
                "pr-10": finalRightIcon,
              },
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            maxLength={maxLength}
            value={value}
            {...props}
          />

          {/* Right Icon */}
          {finalRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {finalRightIcon}
            </div>
          )}
        </div>

        {/* Helper/Error Text */}
        {(helperText || errorMessage) && (
          <div className="flex items-start justify-between">
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
Input.displayName = "Input"

// 🔒 PASSWORD INPUT
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  /**
   * Se deve mostrar força da senha
   */
  showStrength?: boolean
  /**
   * Se deve mostrar requerimentos
   */
  showRequirements?: boolean
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength, showRequirements, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [strength, setStrength] = React.useState(0)

    // Calcula força da senha
    const calculateStrength = (password: string): number => {
      let score = 0
      if (password.length >= 8) score++
      if (/[a-z]/.test(password)) score++
      if (/[A-Z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^A-Za-z0-9]/.test(password)) score++
      return score
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (showStrength) {
        setStrength(calculateStrength(value))
      }
      props.onChange?.(e)
    }

    const strengthColors = ["bg-danger-500", "bg-danger-400", "bg-warning-500", "bg-warning-400", "bg-success-500"]
    const strengthLabels = ["Muito fraca", "Fraca", "Regular", "Boa", "Forte"]

    return (
      <div className="space-y-3">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          onChange={handleChange}
        />

        {/* Strength Indicator */}
        {showStrength && props.value && (
          <div className="space-y-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    strength >= level ? strengthColors[strength - 1] : "bg-neutral-200"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Força: {strengthLabels[strength - 1] || ""}
            </p>
          </div>
        )}

        {/* Requirements */}
        {showRequirements && (
          <div className="space-y-1">
            <p className="text-xs font-medium">A senha deve conter:</p>
            <ul className="text-xs space-y-1">
              <li className={cn("flex items-center space-x-2", {
                "text-success-600": typeof props.value === 'string' && props.value.length >= 8,
                "text-muted-foreground": !(typeof props.value === 'string' && props.value.length >= 8)
              })}>
                <CheckCircle className="h-3 w-3" />
                <span>Pelo menos 8 caracteres</span>
              </li>
              <li className={cn("flex items-center space-x-2", {
                "text-success-600": typeof props.value === 'string' && /[A-Z]/.test(props.value),
                "text-muted-foreground": !(typeof props.value === 'string' && /[A-Z]/.test(props.value))
              })}>
                <CheckCircle className="h-3 w-3" />
                <span>Uma letra maiúscula</span>
              </li>
              <li className={cn("flex items-center space-x-2", {
                "text-success-600": typeof props.value === 'string' && /[0-9]/.test(props.value),
                "text-muted-foreground": !(typeof props.value === 'string' && /[0-9]/.test(props.value))
              })}>
                <CheckCircle className="h-3 w-3" />
                <span>Um número</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// 🔍 SEARCH INPUT
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  /**
   * Callback quando busca
   */
  onSearch?: (value: string) => void
  /**
   * Se deve buscar em tempo real
   */
  liveSearch?: boolean
  /**
   * Delay para live search (ms)
   */
  searchDelay?: number
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, liveSearch, searchDelay = 300, ...props }, ref) => {
    const [searchValue, setSearchValue] = React.useState("")
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    const handleSearch = (value: string) => {
      if (onSearch) {
        onSearch(value)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      props.onChange?.(e)

      if (liveSearch && onSearch) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          handleSearch(value)
        }, searchDelay)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !liveSearch) {
        handleSearch(searchValue)
      }
      props.onKeyDown?.(e)
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        placeholder={props.placeholder || "Buscar..."}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// 📧 INPUTS ESPECÍFICOS
const EmailInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <Input
      {...props}
      ref={ref}
      type="email"
      leftIcon={<Mail className="h-4 w-4" />}
      placeholder={props.placeholder || "exemplo@email.com"}
    />
  )
)
EmailInput.displayName = "EmailInput"

const PhoneInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <Input
      {...props}
      ref={ref}
      type="tel"
      leftIcon={<Phone className="h-4 w-4" />}
      placeholder={props.placeholder || "(11) 99999-9999"}
    />
  )
)
PhoneInput.displayName = "PhoneInput"

const UserInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <Input
      {...props}
      ref={ref}
      type="text"
      leftIcon={<User className="h-4 w-4" />}
      placeholder={props.placeholder || "Nome de usuário"}
    />
  )
)
UserInput.displayName = "UserInput"

// 🎓 INPUTS ESPECÍFICOS DO CLASSCHECK
const AulaSearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => (
    <SearchInput
      {...props}
      ref={ref}
      placeholder={props.placeholder || "Buscar aulas..."}
      helperText={props.helperText || "Digite o nome da aula, professor ou matéria"}
    />
  )
)
AulaSearchInput.displayName = "AulaSearchInput"

const ProfessorSearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => (
    <SearchInput
      {...props}
      ref={ref}
      placeholder={props.placeholder || "Buscar professores..."}
      helperText={props.helperText || "Digite o nome do professor"}
    />
  )
)
ProfessorSearchInput.displayName = "ProfessorSearchInput"

const NotaInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <Input
      {...props}
      ref={ref}
      type="number"
      min="0"
      max="10"
      step="0.1"
      leftIcon={<Star className="h-4 w-4" />}
      placeholder={props.placeholder || "0.0"}
      helperText={props.helperText || "Nota de 0 a 10"}
    />
  )
)
NotaInput.displayName = "NotaInput"

// 📤 EXPORTS
export {
  Input,
  PasswordInput,
  SearchInput,
  EmailInput,
  PhoneInput,
  UserInput,
  AulaSearchInput,
  ProfessorSearchInput,
  NotaInput,
  inputVariants
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Input básico
 * <Input 
 *   label="Nome" 
 *   placeholder="Digite seu nome"
 *   required
 * />
 * 
 * // Input com ícones
 * <Input
 *   label="Email"
 *   leftIcon={<Mail />}
 *   rightIcon={<CheckCircle />}
 *   variant="success"
 * />
 * 
 * // Input com erro
 * <Input
 *   label="Campo obrigatório"
 *   errorMessage="Este campo é obrigatório"
 *   validationState="error"
 * />
 * 
 * // Password com força
 * <PasswordInput
 *   label="Senha"
 *   showStrength
 *   showRequirements
 * />
 * 
 * // Search com live search
 * <SearchInput
 *   label="Buscar"
 *   liveSearch
 *   onSearch={(value) => console.log(value)}
 * />
 * 
 * // Inputs específicos
 * <EmailInput label="Email" />
 * <PhoneInput label="Telefone" />
 * <AulaSearchInput onSearch={handleBuscarAula} />
 * <NotaInput label="Nota da aula" />
 */
