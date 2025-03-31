
import React from 'react';
import OperationSelector as BaseOperationSelector from '@/components/ui/form/OperationSelector';
import type { MathOperation } from '@/components/ui/form/OperationSelector';

interface OperationSelectorProps {
  operation: MathOperation;
  updateOperation: (value: string) => void;
  required?: boolean;
}

const OperationSelector: React.FC<OperationSelectorProps> = ({ 
  operation, 
  updateOperation,
  required = false
}) => {
  return (
    <div>
      <BaseOperationSelector
        value={operation}
        onValueChange={updateOperation}
        required={required}
      />
    </div>
  );
};

export default OperationSelector;
