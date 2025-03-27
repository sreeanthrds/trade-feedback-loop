
import React from 'react';
import { Separator } from '@/components/ui/separator';
import OptionsSettingsSection from '../OptionsSettingsSection';
import { NodeData } from '../types';

type OptionDetailsType = NonNullable<NodeData['optionDetails']>;

interface OptionsSettingsPanelProps {
  optionDetails?: OptionDetailsType;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const OptionsSettingsPanel: React.FC<OptionsSettingsPanelProps> = ({
  optionDetails,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
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
