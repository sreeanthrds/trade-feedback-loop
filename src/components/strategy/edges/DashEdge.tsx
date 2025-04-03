
import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

// Custom edge with dashed line styling and arrow marker
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
  
  // Define unique marker ID for this edge
  const markerId = `dashEdgeArrow-${id}`;
  
  return (
    <>
      {/* SVG defs for the arrow marker */}
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          className="arrow-marker"
        >
          <polygon points="0 0, 10 5, 0 10" />
        </marker>
      </defs>
      
      {/* Draw a bezier edge with dashed line and animation if needed */}
      <path
        id={id}
        className="react-flow__edge-path dashed-edge-path"
        d={edgePath}
        style={edgeStyle}
        strokeWidth={selected ? 3 : 2}
        markerEnd={`url(#${markerId})`}
      />
    </>
  );
};

export default memo(DashEdge);
