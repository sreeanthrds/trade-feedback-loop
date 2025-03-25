
import React from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Memoize the button edge component
const MemoizedButtonEdge = React.memo(ButtonEdge);

// Create a memoized edge component factory outside of any component
const createEdgeComponent = React.memo((onDeleteEdge: (id: string) => void) => {
  // This function is only created once and then memoized
  const EdgeComponent = React.memo((props: any) => (
    <MemoizedButtonEdge {...props} onDelete={onDeleteEdge} />
  ));
  return EdgeComponent;
});

// Create edge types once outside of any component
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  // Get the memoized edge component
  const EdgeComponent = createEdgeComponent(onDeleteEdge);
  
  // Return a stable edge types object
  return {
    default: EdgeComponent
  };
};

export { createEdgeTypes };
