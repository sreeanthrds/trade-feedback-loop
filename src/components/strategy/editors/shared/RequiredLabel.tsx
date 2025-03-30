
import React from 'react';
import { cn } from '@/lib/utils';

interface RequiredLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

const RequiredLabel: React.FC<RequiredLabelProps> = ({
  children,
  required = false,
  className
}) => {
  return (
    <label className={cn("text-xs font-medium flex items-center", className)}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
};

export default RequiredLabel;
