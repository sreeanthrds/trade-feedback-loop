
import { ReactNode } from 'react';
import { Node } from '@xyflow/react';
import StartNodeEditor from '../editors/StartNodeEditor';
import SignalNodeEditor from '../editors/SignalNodeEditor';
import ActionNodeEditor from '../editors/ActionNodeEditor';
import EndNodeEditor from '../editors/EndNodeEditor';
import ForceEndNodeEditor from '../editors/ForceEndNodeEditor';

// Define interface for editor components
interface NodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

type NodeEditorComponent = React.ComponentType<NodeEditorProps>;

/**
 * Returns the appropriate editor component for a given node type
 * @param nodeType The type of the node
 * @returns Editor component or null if not found
 */
export const getNodeEditor = (nodeType: string | undefined): NodeEditorComponent | null => {
  if (!nodeType) return null;
  
  const editorMap: Record<string, NodeEditorComponent> = {
    'startNode': StartNodeEditor,
    'signalNode': SignalNodeEditor,
    'actionNode': ActionNodeEditor,
    'endNode': EndNodeEditor,
    'forceEndNode': ForceEndNodeEditor,
  };
  
  return editorMap[nodeType] || null;
};

/**
 * Gets a human-readable title for a node type
 * @param nodeType The type of the node
 * @returns A user-friendly title
 */
export const getNodeTitle = (nodeType: string | undefined): string => {
  if (!nodeType) return 'Node Settings';
  
  const titleMap: Record<string, string> = {
    'startNode': 'Start Node',
    'signalNode': 'Signal Node',
    'actionNode': 'Action Node',
    'endNode': 'End Node',
    'forceEndNode': 'Force End Node',
  };
  
  return titleMap[nodeType] || 'Node Settings';
};
