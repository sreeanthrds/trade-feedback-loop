
import React from 'react';
import { Position } from '../types';
import OptionsSettingsSection from '../OptionsSettingsSection';

interface OptionsSettingsPanelProps {
  position: Position;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const OptionsSettingsPanel: React.FC<OptionsSettingsPanelProps> = ({
  position,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
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
