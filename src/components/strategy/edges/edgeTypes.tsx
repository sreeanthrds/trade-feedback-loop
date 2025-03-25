
import React, { memo } from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Create edge types once outside of any component
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  return {
    default: memo((props: any) => <ButtonEdge {...props} onDelete={onDeleteEdge} />)
  };
};

export { createEdgeTypes };
