
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LabelProps } from './types';

/**
 * HOC that adds a label to any component
 */
export function withLabel<P>(Component: React.ComponentType<P>) {
  const WithLabel = (props: P & LabelProps) => {
    const { 
      label, 
      hideLabel, 
      labelClassName, 
      description, 
      isRequired, 
      ...componentProps 
    } = props;

    if (hideLabel || !label) {
      return <Component {...(componentProps as unknown as P)} />;
    }

    return (
      <div className="space-y-1.5 w-full">
        {label && !hideLabel && (
          <Label 
            className={cn("text-sm", labelClassName)}
          >
            {label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <Component {...(componentProps as unknown as P)} />
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    );
  };

  WithLabel.displayName = `withLabel(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithLabel;
}

export default withLabel;
