
import React from 'react';
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';

export const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  return {
    default: (props: any) => <ButtonEdge {...props} onDelete={onDeleteEdge} />
  };
};
