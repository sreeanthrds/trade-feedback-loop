
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useRef, useMemo } from "react"

export function Toaster() {
  const { toasts } = useToast()
  const renderedToastsRef = useRef(new Set<string>())
  
  // Memoize the rendered toasts to prevent unnecessary re-renders
  const renderedToasts = useMemo(() => {
    const newRenderedToasts = new Set<string>(renderedToastsRef.current)
    return newRenderedToasts
  }, [])
  
  // Reset the rendered toasts set when toasts change
  useEffect(() => {
    // We don't want to recreate the Set every time, just clear and add new ids
    renderedToastsRef.current.clear()
    
    // This should only run when the toasts array changes
    return () => {
      // No cleanup needed
    }
  }, [toasts.length])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Skip rendering if we've already rendered this toast
        if (renderedToasts.has(id)) {
          return null
        }
        
        // Track that we've rendered this toast
        renderedToasts.add(id)
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
