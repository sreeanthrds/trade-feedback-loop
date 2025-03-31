
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

export interface ErrorHandlingProps {
  /** Custom error handler function */
  handleError?: (error: Error) => void;
  /** Context name for error logging */
  errorContext?: string;
  /** Whether to automatically show toast notifications */
  showToasts?: boolean;
  /** Whether to automatically catch and handle render errors */
  catchRenderErrors?: boolean;
}

/**
 * HOC that adds error handling capabilities to any component
 */
export function withErrorHandling<P>(Component: React.ComponentType<P>) {
  const WithErrorHandling = (props: P & ErrorHandlingProps) => {
    const { 
      handleError: customErrorHandler, 
      errorContext = 'component', 
      showToasts = true,
      catchRenderErrors = false,
      ...componentProps 
    } = props;
    
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // Reset error state when props change
    useEffect(() => {
      if (hasError) {
        setHasError(false);
        setErrorMessage(null);
      }
    }, [componentProps]);
    
    // Central error handler
    const handleError = (error: Error) => {
      console.error(`Error in ${errorContext}:`, error);
      
      setHasError(true);
      setErrorMessage(error.message || 'An unexpected error occurred');
      
      // Show toast if enabled
      if (showToasts) {
        toast({
          title: "Error",
          description: error.message || 'An unexpected error occurred',
          variant: "destructive"
        });
      }
      
      // Call custom error handler if provided
      if (customErrorHandler && typeof customErrorHandler === 'function') {
        customErrorHandler(error);
      }
    };
    
    // Handle render errors if enabled
    if (catchRenderErrors && hasError) {
      return (
        <div className="p-4 border border-destructive rounded-md bg-destructive/10">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h4 className="font-medium text-destructive">Something went wrong</h4>
          </div>
          {errorMessage && <p className="text-sm text-muted-foreground">{errorMessage}</p>}
        </div>
      );
    }
    
    // Try/catch only works for non-async code
    // For async errors, components should use the provided error handler
    try {
      return <Component {...(componentProps as unknown as P)} handleError={handleError} />;
    } catch (error) {
      if (catchRenderErrors) {
        handleError(error instanceof Error ? error : new Error(String(error)));
        return (
          <div className="p-4 border border-destructive rounded-md bg-destructive/10">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h4 className="font-medium text-destructive">Render Error</h4>
            </div>
            {errorMessage && <p className="text-sm text-muted-foreground">{errorMessage}</p>}
          </div>
        );
      } else {
        // Re-throw if not catching render errors
        throw error;
      }
    }
  };

  WithErrorHandling.displayName = `withErrorHandling(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithErrorHandling;
}

export default withErrorHandling;
