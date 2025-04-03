
import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

// Custom edge with dashed line styling
const DashEdge = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  source,
  target,
  style,
  selected,
  sourcePosition,
  targetPosition,
  animated,
  ...props 
}: EdgeProps) => {
  // Use getBezierPath for the edge path
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  
  const edgeStyle = {
    ...style,
    strokeDasharray: '5, 5', // Default dash pattern
    animation: animated ? 'dash 1s linear infinite' : 'none'
  };
  
  return (
    <>
      {/* Draw a bezier edge with dashed line and animation if needed */}
      <path
        id={id}
        className="react-flow__edge-path dashed-edge-path"
        d={edgePath}
        style={edgeStyle}
        strokeWidth={selected ? 3 : 2}
        markerEnd={props.markerEnd}
      />
    </>
  );
};

export default memo(DashEdge);
