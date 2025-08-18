import * as React from "react"
import { Input, type InputProps } from "@/components/ui/enhanced-input"

// 🎭 TIPOS DE MÁSCARAS
export type MaskPattern = 
  | "cpf"           // 000.000.000-00
  | "cnpj"          // 00.000.000/0000-00
  | "phone"         // (00) 00000-0000
  | "cep"           // 00000-000
  | "date"          // 00/00/0000
  | "time"          // 00:00
  | "datetime"      // 00/00/0000 00:00
  | "currency"      // R$ 0.000,00
  | "percentage"    // 00,00%
  | "custom"        // Padrão customizado

// 🛠️ FUNÇÕES DE FORMATAÇÃO
const formatters = {
  cpf: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  },

  cnpj: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 14)
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  },

  phone: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)
    if (numbers.length <= 10) {
      // Telefone fixo: (00) 0000-0000
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
    } else {
      // Celular: (00) 00000-0000
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    }
  },

  cep: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 8)
    return numbers.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
  },

  date: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 8)
    return numbers
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d{1,4})$/, '$1/$2')
  },

  time: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 4)
    return numbers.replace(/(\d{2})(\d{1,2})$/, '$1:$2')
  },

  datetime: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 12)
    let formatted = numbers
      .replace(/(\d{2})(\d)/, '$1/$2')      // DD/
      .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')  // DD/MM/
      .replace(/(\d{2})\/(\d{2})\/(\d{4})(\d)/, '$1/$2/$3 $4')  // DD/MM/YYYY 
      .replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2})(\d)/, '$1/$2/$3 $4:$5') // DD/MM/YYYY HH:
    return formatted
  },

  currency: (value: string): string => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return 'R$ 0,00'
    
    // Converte para centavos
    const cents = parseInt(numbers)
    const reais = cents / 100
    
    return `R$ ${reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  },

  percentage: (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 5) // Max 999.99%
    if (!numbers) return ''
    
    const num = parseInt(numbers)
    if (numbers.length <= 2) {
      return `${num}%`
    } else {
      const decimal = num / 100
      return `${decimal.toFixed(2).replace('.', ',')}%`
    }
  },

  custom: (value: string): string => value
}

// 🧹 FUNÇÕES DE LIMPEZA (para obter valor sem máscara)
const cleaners = {
  cpf: (value: string): string => value.replace(/\D/g, ''),
  cnpj: (value: string): string => value.replace(/\D/g, ''),
  phone: (value: string): string => value.replace(/\D/g, ''),
  cep: (value: string): string => value.replace(/\D/g, ''),
  date: (value: string): string => value.replace(/\D/g, ''),
  time: (value: string): string => value.replace(/\D/g, ''),
  datetime: (value: string): string => value.replace(/\D/g, ''),
  currency: (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    return numbers ? (parseInt(numbers) / 100).toString() : '0'
  },
  percentage: (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return '0'
    if (numbers.length <= 2) {
      return numbers
    } else {
      return (parseInt(numbers) / 100).toString()
    }
  },
  custom: (value: string): string => value
}

// ✅ VALIDADORES
const validators = {
  cpf: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length !== 11) return false
    
    // Verifica sequências iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false
    
    // Validação do CPF
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(numbers[9])) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    return remainder === parseInt(numbers[10])
  },

  cnpj: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length !== 14) return false
    
    // Verifica sequências iguais
    if (/^(\d)\1{13}$/.test(numbers)) return false
    
    // Validação do CNPJ
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers[i]) * weights1[i]
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder
    
    if (digit1 !== parseInt(numbers[12])) return false
    
    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers[i]) * weights2[i]
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder
    
    return digit2 === parseInt(numbers[13])
  },

  phone: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    return numbers.length >= 10 && numbers.length <= 11
  },

  cep: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    return numbers.length === 8
  },

  date: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length !== 8) return false
    
    const day = parseInt(numbers.slice(0, 2))
    const month = parseInt(numbers.slice(2, 4))
    const year = parseInt(numbers.slice(4, 8))
    
    if (day < 1 || day > 31) return false
    if (month < 1 || month > 12) return false
    if (year < 1900 || year > 2100) return false
    
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day
  },

  time: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length !== 4) return false
    
    const hours = parseInt(numbers.slice(0, 2))
    const minutes = parseInt(numbers.slice(2, 4))
    
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
  },

  datetime: (value: string): boolean => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length !== 12) return false
    
    const dateValid = validators.date(numbers.slice(0, 8))
    const timeValid = validators.time(numbers.slice(8, 12))
    
    return dateValid && timeValid
  },

  currency: (value: string): boolean => {
    const cleaned = cleaners.currency(value)
    const num = parseFloat(cleaned)
    return !isNaN(num) && num >= 0
  },

  percentage: (value: string): boolean => {
    const cleaned = cleaners.percentage(value)
    const num = parseFloat(cleaned)
    return !isNaN(num) && num >= 0 && num <= 100
  },

  custom: (): boolean => true
}

// 🎯 PROPS DO MASKED INPUT
export interface MaskedInputProps extends Omit<InputProps, 'onChange' | 'value'> {
  /**
   * Tipo de máscara
   */
  mask: MaskPattern
  /**
   * Padrão customizado (quando mask="custom")
   * Exemplo: "000.000.000-00"
   */
  customPattern?: string
  /**
   * Valor do input (sempre string)
   */
  value?: string
  /**
   * Callback com valor formatado e limpo
   */
  onChange?: (formatted: string, cleaned: string) => void
  /**
   * Se deve validar automaticamente
   */
  autoValidate?: boolean
  /**
   * Callback de validação customizada
   */
  onValidate?: (isValid: boolean, value: string) => void
  /**
   * Se deve mostrar indicador de validação
   */
  showValidation?: boolean
}

// 🎭 MASKED INPUT COMPONENT
const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      mask,
      customPattern,
      value = '',
      onChange,
      autoValidate = true,
      onValidate,
      showValidation = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value)
    const [isValid, setIsValid] = React.useState<boolean | null>(null)

    // Formatar valor baseado na máscara
    const formatValue = (rawValue: string): string => {
      if (mask === 'custom' && customPattern) {
        // Implementação simples de máscara customizada
        const numbers = rawValue.replace(/\D/g, '')
        let formatted = ''
        let numberIndex = 0
        
        for (let i = 0; i < customPattern.length && numberIndex < numbers.length; i++) {
          if (customPattern[i] === '0') {
            formatted += numbers[numberIndex]
            numberIndex++
          } else {
            formatted += customPattern[i]
          }
        }
        return formatted
      }
      
      return formatters[mask]?.(rawValue) || rawValue
    }

    // Limpar valor
    const cleanValue = (formattedValue: string): string => {
      if (mask === 'custom') {
        return formattedValue.replace(/\D/g, '')
      }
      return cleaners[mask]?.(formattedValue) || formattedValue
    }

    // Validar valor
    const validateValue = (cleanedValue: string): boolean => {
      if (mask === 'custom') return true
      return validators[mask]?.(cleanedValue) || false
    }

    // Handle mudança de valor
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const formatted = formatValue(rawValue)
      const cleaned = cleanValue(formatted)
      
      setInternalValue(formatted)
      
      // Validação
      if (autoValidate && cleaned.length > 0) {
        const valid = validateValue(cleaned)
        setIsValid(valid)
        onValidate?.(valid, cleaned)
      } else {
        setIsValid(null)
      }
      
      onChange?.(formatted, cleaned)
    }

    // Determinar estado de validação
    const getValidationState = () => {
      if (!showValidation || isValid === null) return props.validationState
      return isValid ? 'success' : 'error'
    }

    return (
      <Input
        {...props}
        ref={ref}
        value={internalValue}
        onChange={handleChange}
        validationState={getValidationState()}
      />
    )
  }
)
MaskedInput.displayName = "MaskedInput"

// 🎯 COMPONENTES ESPECÍFICOS
export const CPFInput = React.forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => (
    <MaskedInput 
      {...props} 
      ref={ref} 
      mask="cpf"
      label={props.label || "CPF"}
      placeholder={props.placeholder || "000.000.000-00"}
    />
  )
)
CPFInput.displayName = "CPFInput"

export const CNPJInput = React.forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => (
    <MaskedInput 
      {...props} 
      ref={ref} 
      mask="cnpj"
      label={props.label || "CNPJ"}
      placeholder={props.placeholder || "00.000.000/0000-00"}
    />
  )
)
CNPJInput.displayName = "CNPJInput"

export const PhoneMaskInput = React.forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => (
    <MaskedInput 
      {...props} 
      ref={ref} 
      mask="phone"
      label={props.label || "Telefone"}
      placeholder={props.placeholder || "(00) 00000-0000"}
    />
  )
)
PhoneMaskInput.displayName = "PhoneMaskInput"

export const CEPInput = React.forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => (
    <MaskedInput 
      {...props} 
      ref={ref} 
      mask="cep"
      label={props.label || "CEP"}
      placeholder={props.placeholder || "00000-000"}
    />
  )
)
CEPInput.displayName = "CEPInput"

export const DateMaskInput = React.forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => (
    <MaskedInput 
      {...props} 
      ref={ref} 
      mask="date"
      label={props.label || "Data"}
      placeholder={props.placeholder || "DD/MM/AAAA"}
    />
  )
)
DateMaskInput.displayName = "DateMaskInput"

export const CurrencyInput = React.forwardRef<HTMLInputElement, Omit<MaskedInputProps, 'mask'>>(
  (props, ref) => (
    <MaskedInput 
      {...props} 
      ref={ref} 
      mask="currency"
      label={props.label || "Valor"}
      placeholder={props.placeholder || "R$ 0,00"}
    />
  )
)
CurrencyInput.displayName = "CurrencyInput"

// 📤 EXPORTS
export {
  MaskedInput,
  formatters,
  cleaners,
  validators
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // Máscara automática
 * <MaskedInput
 *   mask="cpf"
 *   label="CPF"
 *   onChange={(formatted, cleaned) => {
 *     console.log('Formatado:', formatted) // 000.000.000-00
 *     console.log('Limpo:', cleaned) // 00000000000
 *   }}
 * />
 * 
 * // Componentes específicos
 * <CPFInput 
 *   onChange={(formatted, cleaned) => setCpf(cleaned)}
 *   autoValidate
 *   showValidation
 * />
 * 
 * <PhoneMaskInput 
 *   onChange={(formatted, cleaned) => setPhone(cleaned)}
 * />
 * 
 * <CurrencyInput 
 *   onChange={(formatted, cleaned) => setValue(parseFloat(cleaned))}
 * />
 * 
 * // Máscara customizada
 * <MaskedInput
 *   mask="custom"
 *   customPattern="000-000"
 *   label="Código"
 *   onChange={(formatted, cleaned) => setCode(cleaned)}
 * />
 * 
 * // Com validação customizada
 * <MaskedInput
 *   mask="cpf"
 *   autoValidate
 *   onValidate={(isValid, value) => {
 *     if (!isValid && value.length === 11) {
 *       console.log('CPF inválido!')
 *     }
 *   }}
 * />
 */
