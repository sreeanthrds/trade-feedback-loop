
import React from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeForm as ExitNodeFormComponent } from '../exit-node';

interface ExitNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

// This is now just a pass-through component that uses the micro-frontend
const ExitNodeForm: React.FC<ExitNodeFormProps> = ({ node, updateNodeData }) => {
  return <ExitNodeFormComponent node={node} updateNodeData={updateNodeData} />;
};

export default ExitNodeForm;
