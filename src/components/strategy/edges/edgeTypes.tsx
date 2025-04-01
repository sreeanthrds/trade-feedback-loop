
import React from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

// Create a properly memoized button edge component
const MemoizedButtonEdge = React.memo(ButtonEdge);
MemoizedButtonEdge.displayName = 'MemoizedButtonEdge';

// Create a stable wrapper component that properly passes the onDelete prop
const ButtonEdgeWrapper = React.memo((props: any) => {
  const { data, id, onDelete, ...rest } = props;
  console.log('Edge props in wrapper:', { id, hasOnDelete: !!onDelete });
  return <MemoizedButtonEdge {...rest} id={id} onDelete={onDelete} />;
});
ButtonEdgeWrapper.displayName = 'ButtonEdgeWrapper';

// Create a function to generate edgeTypes with the provided callback
const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  console.log('Creating edge types with delete handler:', !!onDeleteEdge);
  return {
    default: (props) => <ButtonEdgeWrapper {...props} onDelete={onDeleteEdge} />
  };
};

export { createEdgeTypes };
