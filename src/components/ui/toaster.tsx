
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useRef } from "react"

export function Toaster() {
  const { toasts } = useToast()
  const renderedToastsRef = useRef(new Set<string>())
  
  // Reset the rendered toasts set when toasts change
  useEffect(() => {
    const currentToastIds = new Set(toasts.map(toast => toast.id))
    
    // Remove toasts that are no longer in the list
    for (const id of renderedToastsRef.current) {
      if (!currentToastIds.has(id)) {
        renderedToastsRef.current.delete(id)
      }
    }
    
    // This should only run when the toasts array changes
    return () => {
      // No cleanup needed
    }
  }, [toasts])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Skip rendering if we've already rendered this toast
        if (renderedToastsRef.current.has(id)) {
          return null
        }
        
        // Track that we've rendered this toast
        renderedToastsRef.current.add(id)
        
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
