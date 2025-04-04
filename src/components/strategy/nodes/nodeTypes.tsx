
import React from 'react';
import { Node } from '@xyflow/react';
import StartNode from './StartNode';
import SignalNode from './SignalNode';
import EntrySignalNode from './EntrySignalNode';
import ExitSignalNode from './ExitSignalNode';
import ActionNode from './ActionNode';
import EntryNode from './EntryNode';
import ExitNode from './ExitNode';
import ModifyNode from './ModifyNode';
import AlertNode from './AlertNode';
import EndNode from './EndNode';
import ForceEndNode from './ForceEndNode';
import RetryNode from './RetryNode';

export const createNodeTypes = (
  handleDeleteNode: (id: string) => void,
  handleAddNode: (type: string, parentNodeId?: string) => void,
  updateNodeData?: (id: string, data: any) => void
) => {
  return {
    startNode: (props: any) => <StartNode {...props} />,
    signalNode: (props: any) => <SignalNode {...props} />,
    entrySignalNode: (props: any) => <EntrySignalNode {...props} />,
    exitSignalNode: (props: any) => <ExitSignalNode {...props} />,
    actionNode: (props: any) => <ActionNode {...props} />,
    entryNode: (props: any) => <EntryNode {...props} />,
    exitNode: (props: any) => <ExitNode {...props} />,
    modifyNode: (props: any) => <ModifyNode {...props} />,
    alertNode: (props: any) => <AlertNode {...props} />,
    endNode: (props: any) => <EndNode {...props} />,
    forceEndNode: (props: any) => <ForceEndNode {...props} />,
    retryNode: (props: any) => <RetryNode {...props} />
  };
};
