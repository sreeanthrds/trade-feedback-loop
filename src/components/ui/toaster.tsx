
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
  const renderedToastsRef = useRef(new Set())
  
  // Clear the rendered toasts set when toasts change
  useEffect(() => {
    renderedToastsRef.current = new Set()
  }, [toasts.length])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Skip rendering if we've already rendered this toast in this cycle
        if (renderedToastsRef.current.has(id)) {
          return null
        }
        
        // Add this toast to the rendered set
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
