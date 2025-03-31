
import React from 'react';

export interface LoadingProps {
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

/**
 * HOC that adds loading state capabilities to any component
 */
export function withLoadingState<P>(Component: React.ComponentType<P>) {
  const WithLoadingState = (props: P & LoadingProps) => {
    const { isLoading, loadingComponent, ...componentProps } = props;

    if (isLoading) {
      return loadingComponent || (
        <div className="animate-pulse w-full h-8 bg-muted rounded-md"></div>
      );
    }

    return <Component {...(componentProps as P)} />;
  };

  WithLoadingState.displayName = `withLoadingState(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithLoadingState;
}

export default withLoadingState;
