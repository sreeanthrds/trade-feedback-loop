
import React from 'react';
import { InfoBox } from '../shared';

const EndNodeInfoContent: React.FC = () => {
  return (
    <InfoBox>
      <p className="mb-2">
        The End Node represents the final state of your strategy. Any path that reaches this node will terminate.
      </p>
      <p>
        Use multiple End nodes to represent different outcomes or exit conditions.
      </p>
    </InfoBox>
  );
};

export default EndNodeInfoContent;
