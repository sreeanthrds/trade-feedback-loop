
import { Node } from '@xyflow/react';
import { useExitNodeForm as useExitNodeFormImpl } from '../exit-node/useExitNodeForm';
import type { 
  ExitConditionType, 
  ExitOrderType, 
  ExitCondition, 
  ExitOrderConfig,
  ExitNodeData
} from '../exit-node/types';

// Re-export types for convenience
export type {
  ExitConditionType,
  ExitOrderType,
  ExitCondition,
  ExitOrderConfig,
  ExitNodeData
};

interface UseExitNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

// This is just a proxy to the implementation in exit-node/useExitNodeForm.ts
export const useExitNodeForm = ({ node, updateNodeData }: UseExitNodeFormProps) => {
  return useExitNodeFormImpl({ node, updateNodeData });
};
