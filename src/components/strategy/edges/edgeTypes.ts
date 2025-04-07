
import { EdgeTypes } from '@xyflow/react';
import ButtonEdge from './ButtonEdge';
import DashEdge from './DashEdge';
import FixedEdge from './FixedEdge';

// Export the type of the object returned by createEdgeTypes function
export type EdgeTypesObj = EdgeTypes;

// Create a function to generate edgeTypes with the provided callback
export const createEdgeTypes = (onDeleteEdge: (id: string) => void): EdgeTypes => {
  console.log('Creating edge types with delete handler:', !!onDeleteEdge);
  
  // Create properly memoized edge components
  const ButtonEdgeWrapper = (props: any) => {
    const { data, id, ...rest } = props;
    return <ButtonEdge {...rest} id={id} onDelete={onDeleteEdge} />;
  };
  
  const DashEdgeWrapper = (props: any) => {
    return <DashEdge {...props} />;
  };
  
  const FixedEdgeWrapper = (props: any) => {
    return <FixedEdge {...props} />;
  };
  
  return {
    default: ButtonEdgeWrapper,
    dashEdge: DashEdgeWrapper,
    fixedEdge: FixedEdgeWrapper
  };
};
