
import React from 'react';
import { Position } from '../types';
import OptionsSettingsSection from '../OptionsSettingsSection';

interface OptionsSettingsPanelProps {
  position: Position;
  hasOptionTrading?: boolean;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const OptionsSettingsPanel: React.FC<OptionsSettingsPanelProps> = ({
  position,
  hasOptionTrading = true,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
  // If options trading is not enabled, don't render the panel
  if (hasOptionTrading === false) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Options Settings</h3>
      
      <OptionsSettingsSection 
        position={position}
        onExpiryChange={onExpiryChange}
        onStrikeTypeChange={onStrikeTypeChange}
        onStrikeValueChange={onStrikeValueChange}
        onOptionTypeChange={onOptionTypeChange}
      />
    </div>
  );
};

export default OptionsSettingsPanel;
