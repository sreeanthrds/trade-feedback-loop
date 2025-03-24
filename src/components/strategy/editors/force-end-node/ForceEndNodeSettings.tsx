
import React from 'react';
import { SwitchField, InputField, InfoBox } from '../shared';

interface ForceEndNodeSettingsProps {
  closeAll: boolean;
  message: string;
  onCloseAllChange: (checked: boolean) => void;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ForceEndNodeSettings: React.FC<ForceEndNodeSettingsProps> = ({
  closeAll,
  message,
  onCloseAllChange,
  onMessageChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <SwitchField 
          label="Close all open positions"
          id="close-all" 
          checked={closeAll}
          onCheckedChange={onCloseAllChange}
          orientation="horizontal"
        />
        
        <InputField
          label="End Message"
          id="end-message"
          value={message}
          onChange={onMessageChange}
          placeholder="Message to display when strategy ends"
          orientation="horizontal"
        />
      </div>
      
      <InfoBox type="warning" title="Force End Node">
        <p>
          This node forces an immediate end to strategy execution. 
          All open positions will be closed, and no further nodes will be processed.
        </p>
      </InfoBox>
    </div>
  );
};

export default ForceEndNodeSettings;
