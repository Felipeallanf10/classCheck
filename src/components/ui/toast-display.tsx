import * as React from "react"
import { createPortal } from "react-dom"
import { useToast } from "@/hooks/use-toast"
import { Toast, ToastContainer } from "@/components/ui/toast"

// 🎪 TOAST DISPLAY COMPONENT
export interface ToastDisplayProps {
  /**
   * Posição dos toasts
   */
  position?: 
    | "top-left" 
    | "top-center" 
    | "top-right"
    | "bottom-left" 
    | "bottom-center" 
    | "bottom-right"
  /**
   * Se deve usar portal (render fora da árvore de componentes)
   */
  usePortal?: boolean
  /**
   * Elemento container (quando usePortal = true)
   */
  portalContainer?: HTMLElement
}

export function ToastDisplay({
  position = "top-right",
  usePortal = true,
  portalContainer
}: ToastDisplayProps) {
  const { toasts, removeToast } = useToast()
  const [mounted, setMounted] = React.useState(false)

  // Aguarda mounting para evitar hidratation mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const content = (
    <ToastContainer position={position}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContainer>
  )

  // Não renderiza no servidor ou antes do mount
  if (!mounted) {
    return null
  }

  // Usa portal se especificado
  if (usePortal) {
    const container = portalContainer || document.body
    return createPortal(content, container)
  }

  return content
}

// 🎯 HOOK PARA AUTO-SETUP DO TOAST DISPLAY
export function useToastDisplay(
  options: ToastDisplayProps = {}
) {
  const { toasts } = useToast()
  
  // Auto-render do ToastDisplay
  React.useEffect(() => {
    if (toasts.length > 0) {
      // Toast display já deve estar renderizado no App
      // Este hook apenas monitora para debugging
      console.log(`[ToastDisplay] ${toasts.length} toast(s) ativos`)
    }
  }, [toasts])

  return {
    toastCount: toasts.length,
    hasToasts: toasts.length > 0
  }
}

/**
 * 📚 EXEMPLOS DE USO:
 * 
 * // 1. Setup básico no App
 * function App() {
 *   return (
 *     <ToastProvider>
 *       <YourAppContent />
 *       <ToastDisplay />
 *     </ToastProvider>
 *   )
 * }
 * 
 * // 2. Posição personalizada
 * <ToastDisplay position="bottom-center" />
 * 
 * // 3. Sem portal (inline)
 * <ToastDisplay usePortal={false} />
 * 
 * // 4. Portal em elemento específico
 * <ToastDisplay 
 *   usePortal={true} 
 *   portalContainer={document.getElementById('toast-container')} 
 * />
 * 
 * // 5. Hook para monitorar toasts
 * function SomeComponent() {
 *   const { toastCount, hasToasts } = useToastDisplay()
 *   
 *   return (
 *     <div>
 *       {hasToasts && <div>Mostrando {toastCount} notificações</div>}
 *     </div>
 *   )
 * }
 */
