
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
  // Add a specific dependency array to avoid infinite loops
  useEffect(() => {
    // Create a new Set instead of clearing
    renderedToastsRef.current = new Set<string>()
    // This should only run when the toasts array length changes
  }, [toasts.length])

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
