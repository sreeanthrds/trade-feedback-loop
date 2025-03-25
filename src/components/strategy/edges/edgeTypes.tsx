
import React from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Create a properly memoized button edge component
const MemoizedButtonEdge = React.memo(ButtonEdge);
MemoizedButtonEdge.displayName = 'MemoizedButtonEdge';

// Create a stable wrapper component
const ButtonEdgeWrapper = React.memo((props: any) => {
  const { onDelete, ...rest } = props;
  return <MemoizedButtonEdge {...rest} onDelete={onDelete} />;
});
ButtonEdgeWrapper.displayName = 'ButtonEdgeWrapper';

// Create a function to generate edgeTypes with the provided callback
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  return {
    default: (props) => <ButtonEdgeWrapper {...props} onDelete={onDeleteEdge} />
  };
};

export { createEdgeTypes };
