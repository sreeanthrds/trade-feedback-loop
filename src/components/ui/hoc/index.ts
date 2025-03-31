
import React from 'react';

// Define common props for HOC components
export interface LabelProps {
  label?: string;
  hideLabel?: boolean;
  labelClassName?: string;
  description?: string;
}

export interface ValidationProps {
  isRequired?: boolean;
  error?: string;
  isValid?: boolean;
}

export interface LoadingProps {
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

export interface ErrorHandlingProps {
  errorContext?: string;
  handleError?: (error: Error, context?: string) => void;
  showToasts?: boolean;
  catchRenderErrors?: boolean;
}

// HOC to add label functionality
export function withLabel<P extends LabelProps>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const { label, hideLabel, labelClassName, description, ...rest } = props;
    
    if (hideLabel || !label) {
      return <Component {...rest as P} />;
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={labelClassName || "text-sm font-medium"}>
            {label}
            {props.isRequired && <span className="ml-1 text-destructive">*</span>}
          </label>
        </div>
        <Component {...rest as P} />
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    );
  };
}

// HOC to add validation functionality
export function withFormValidation<P extends ValidationProps>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const { isRequired, error, isValid, ...rest } = props;
    
    return (
      <>
        <Component {...rest as P} />
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </>
    );
  };
}

// HOC to add loading state
export function withLoadingState<P extends LoadingProps>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const { isLoading, loadingComponent, ...rest } = props;
    
    if (isLoading) {
      return loadingComponent || <div className="animate-pulse h-9 bg-muted rounded" />;
    }
    
    return <Component {...rest as P} />;
  };
}

// HOC to add error handling
export function withErrorHandling<P extends ErrorHandlingProps>(Component: React.ComponentType<P>) {
  return (props: P) => {
    const { errorContext, handleError, showToasts, catchRenderErrors, ...rest } = props;
    
    if (!catchRenderErrors) {
      return <Component {...rest as P} />;
    }
    
    try {
      return <Component {...rest as P} />;
    } catch (error) {
      if (handleError && error instanceof Error) {
        handleError(error, errorContext);
      }
      
      return <div className="text-destructive text-sm">An error occurred rendering this component</div>;
    }
  };
}

// Utility to compose multiple HOCs
export function composeHOC<P>(...hocs: Array<(Component: React.ComponentType<any>) => React.ComponentType<any>>) {
  return (Component: React.ComponentType<P>) => 
    hocs.reduceRight((enhanced, hoc) => hoc(enhanced), Component);
}
