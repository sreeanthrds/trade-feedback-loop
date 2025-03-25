
import React from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Create a single memoized edge types object
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  return {
    default: (props: any) => <ButtonEdge {...props} onDelete={onDeleteEdge} />
  };
};

export { createEdgeTypes };
