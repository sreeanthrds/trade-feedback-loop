
import React, { useMemo } from 'react';
import { EdgeTypes, Edge } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Memoize the button edge component
const MemoizedButtonEdge = React.memo(ButtonEdge);

// Create a properly typed wrapper component
const ButtonEdgeWrapper = React.memo((props: any) => {
  const { onDelete, ...rest } = props;
  return <MemoizedButtonEdge {...rest} onDelete={onDelete} />;
});

/**
 * Creates edge types with the provided delete edge callback
 * This function should be used with useMemo
 */
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  // Return a stable edge types object
  return {
    default: ButtonEdgeWrapper
  };
};

export { createEdgeTypes };
