
import React from 'react';
import { Separator } from '@/components/ui/separator';
import OptionsSettingsSection from '../OptionsSettingsSection';
import { NodeData } from '../types';

type OptionDetailsType = NonNullable<NodeData['optionDetails']>;

interface OptionsSettingsPanelProps {
  hasOptionTrading: boolean;
  optionDetails?: OptionDetailsType;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const OptionsSettingsPanel: React.FC<OptionsSettingsPanelProps> = ({
  hasOptionTrading,
  optionDetails,
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
        optionDetails={optionDetails}
        onExpiryChange={onExpiryChange}
        onStrikeTypeChange={onStrikeTypeChange}
        onStrikeValueChange={onStrikeValueChange}
        onOptionTypeChange={onOptionTypeChange}
      />
    </>
  );
};

export default OptionsSettingsPanel;
