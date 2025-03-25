
import React, { useMemo } from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Memoize the button edge component
const MemoizedButtonEdge = React.memo(ButtonEdge);

// Create a properly typed wrapper component
const ButtonEdgeWrapper = React.memo((props: any) => {
  const { onDelete, ...rest } = props;
  
  return <MemoizedButtonEdge {...rest} onDelete={onDelete} />;
});

// Create a function to generate edgeTypes with the provided delete edge callback
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  // Return a stable edge types object
  return {
    default: (props) => <ButtonEdgeWrapper {...props} onDelete={onDeleteEdge} />
  };
};

export { createEdgeTypes };
