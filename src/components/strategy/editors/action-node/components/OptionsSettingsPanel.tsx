
import React from 'react';
import { Separator } from '@/components/ui/separator';
import OptionsSettingsSection from '../OptionsSettingsSection';
import { NodeData } from '../types';

type OptionDetailsType = NonNullable<NodeData['optionDetails']>;

interface OptionsSettingsPanelProps {
  hasOptionTrading?: boolean;
  optionDetails?: OptionDetailsType;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const OptionsSettingsPanel: React.FC<OptionsSettingsPanelProps> = ({
  hasOptionTrading = true,
  optionDetails,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
  // If option trading is not available, don't render the panel
  if (!hasOptionTrading) {
    return null;
  }

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
