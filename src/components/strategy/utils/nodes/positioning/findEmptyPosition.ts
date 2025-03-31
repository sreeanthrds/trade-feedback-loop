
import { Node } from '@xyflow/react';

/**
 * Finds an empty position on the canvas for a new node to avoid overlapping
 */
export const findEmptyPosition = (nodes: Node[], startX: number, startY: number): { x: number, y: number } => {
  // Default grid size - increase padding to ensure more space between nodes
  const gridSize = { width: 180, height: 100 };
  const padding = 40; // Increased padding between nodes
  const fullWidth = gridSize.width + padding;
  const fullHeight = gridSize.height + padding;
  
  // Start with the suggested position
  let position = { x: startX, y: startY };
  
  // Create a simple grid system for placing nodes
  const isPositionOccupied = (pos: { x: number, y: number }): boolean => {
    return nodes.some(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      
      // Check if the proposed position overlaps with this node
      // Use a larger overlap check area to ensure nodes are well separated
      return (
        pos.x < nodeX + fullWidth &&
        pos.x + fullWidth > nodeX &&
        pos.y < nodeY + fullHeight &&
        pos.y + fullHeight > nodeY
      );
    });
  };
  
  // If position is already occupied, find a new one
  if (isPositionOccupied(position)) {
    // Try positioning in different areas using a spiral pattern with more points
    const spiralPoints = [];
    const maxRadius = 8; // Increased maximum number of "rings" to check
    const angleStep = Math.PI / 6; // 30 degrees - more points per ring
    
    for (let radius = 1; radius <= maxRadius; radius++) {
      for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
        const x = startX + Math.cos(angle) * radius * fullWidth;
        const y = startY + Math.sin(angle) * radius * fullHeight;
        spiralPoints.push({ x, y });
      }
    }
    
    // Find the first non-occupied position
    const emptyPosition = spiralPoints.find(pos => !isPositionOccupied(pos));
    if (emptyPosition) {
      position = emptyPosition;
    } else {
      // If all positions are occupied, use a position far away
      position = { x: startX + fullWidth * maxRadius, y: startY };
    }
  }
  
  return position;
};
