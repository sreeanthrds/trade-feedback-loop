
import React, { ErrorInfo, Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ConditionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error in condition builder:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md flex flex-col items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive mb-2" />
          <h3 className="text-sm font-medium mb-1">Something went wrong</h3>
          <p className="text-xs text-muted-foreground mb-2 text-center">
            There was an error rendering this condition
          </p>
          {this.props.onReset && (
            <Button variant="outline" size="sm" onClick={this.props.onReset}>
              Reset Condition
            </Button>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ConditionErrorBoundary;
