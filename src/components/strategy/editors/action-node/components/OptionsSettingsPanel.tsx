
import React from 'react';
import { Separator } from '@/components/ui/separator';
import OptionsSettingsSection from '../OptionsSettingsSection';
import { Position } from '../types';

interface OptionsSettingsPanelProps {
  hasOptionTrading: boolean;
  position: Position;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const OptionsSettingsPanel: React.FC<OptionsSettingsPanelProps> = ({
  hasOptionTrading,
  position,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
  if (!hasOptionTrading) return null;
  
  return (
    <>
      <Separator className="my-4" />
      <h3 className="text-sm font-medium">Options Settings</h3>
      <OptionsSettingsSection 
        position={position}
        onExpiryChange={onExpiryChange}
        onStrikeTypeChange={onStrikeTypeChange}
        onStrikeValueChange={onStrikeValueChange}
        onOptionTypeChange={onOptionTypeChange}
      />
    </>
  );
};

export default OptionsSettingsPanel;
