
import React, { useMemo } from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Memoize the button edge component
const MemoizedButtonEdge = React.memo(ButtonEdge);

/**
 * Creates edge types with the provided delete edge callback
 * This function should be used with useMemo
 */
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  // Create a memoized wrapper component for ButtonEdge
  const ButtonEdgeWithCallback = React.memo((props: any) => (
    <MemoizedButtonEdge {...props} onDelete={onDeleteEdge} />
  ));
  
  // Return a stable edge types object
  return {
    default: ButtonEdgeWithCallback
  };
};

export { createEdgeTypes };
