
import React, { memo } from 'react';
import { EdgeProps, getSmoothStepPath } from '@xyflow/react';

// Custom edge with fixed length
const FixedEdge = ({ 
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
  data,
  ...props 
}: EdgeProps & { data?: { fixedLength?: boolean; length?: number } }) => {
  // Default length if not specified
  const fixedLength = data?.fixedLength || false;
  const length = data?.length || 100;
  
  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;
  
  // If fixed length is enabled, adjust the target position
  if (fixedLength) {
    // Calculate the direction vector from source to target
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    
    // Normalize the vector
    const distance = Math.sqrt(dx * dx + dy * dy);
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;
    
    // Calculate the new target position using the fixed length
    adjustedTargetX = sourceX + normalizedDx * length;
    adjustedTargetY = sourceY + normalizedDy * length;
  }
  
  // Use getSmoothStepPath for the edge path with floating effect
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition,
    curvature: 0.3 // Increased curvature for floating effect
  });
  
  return (
    <>
      {/* Draw a smooth step edge with fixed length and floating appearance */}
      <path
        id={id}
        className="react-flow__edge-path fixed-edge-path"
        d={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2
        }}
      />
    </>
  );
};

export default memo(FixedEdge);
