
import React from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Memoize the button edge component
const MemoizedButtonEdge = React.memo(ButtonEdge);

// Create edge types once outside of any component
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  return {
    default: React.memo((props: any) => <MemoizedButtonEdge {...props} onDelete={onDeleteEdge} />)
  };
};

export { createEdgeTypes };
