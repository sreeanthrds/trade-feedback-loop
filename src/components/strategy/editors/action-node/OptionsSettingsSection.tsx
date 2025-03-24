
import React from 'react';
import { RadioGroupField, SelectField, InputField } from '../shared';

interface OptionDetailsType {
  expiry?: string;
  strikeType?: 'ATM' | 'ITM' | 'OTM' | 'premium';
  strikeValue?: number;
  optionType?: 'CE' | 'PE';
}

interface OptionsSettingsSectionProps {
  optionDetails?: OptionDetailsType;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const OptionsSettingsSection: React.FC<OptionsSettingsSectionProps> = ({
  optionDetails,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
  const expiryOptions = [
    { value: 'W0', label: 'Current Week (W0)' },
    { value: 'W1', label: 'Next Week (W1)' },
    { value: 'W2', label: 'Week 2 (W2)' },
    { value: 'W3', label: 'Week 3 (W3)' },
    { value: 'W4', label: 'Week 4 (W4)' },
    { value: 'M0', label: 'Current Month (M0)' },
    { value: 'M1', label: 'Next Month (M1)' },
    { value: 'M2', label: 'Month 2 (M2)' },
    { value: 'Q0', label: 'Current Quarter (Q0)' },
    { value: 'Q1', label: 'Next Quarter (Q1)' },
    { value: 'Y0', label: 'Current Year (Y0)' },
    { value: 'Y1', label: 'Next Year (Y1)' }
  ];

  const strikeTypeOptions = [
    { value: 'ATM', label: 'At The Money (ATM)' },
    { value: 'ITM', label: 'In The Money (ITM)' },
    { value: 'OTM', label: 'Out The Money (OTM)' },
    { value: 'premium', label: 'By Premium' }
  ];

  return (
    <div className="space-y-4">
      <SelectField
        label="Expiry"
        id="expiry"
        value={optionDetails?.expiry || ''}
        onChange={onExpiryChange}
        options={expiryOptions}
      />
      
      <SelectField
        label="Strike Selection"
        id="strike-type"
        value={optionDetails?.strikeType || ''}
        onChange={onStrikeTypeChange}
        options={strikeTypeOptions}
      />
      
      {optionDetails?.strikeType === 'premium' && (
        <InputField
          label="Target Premium (₹)"
          id="premium-value"
          type="number"
          min={1}
          value={optionDetails?.strikeValue || ''}
          onChange={onStrikeValueChange}
          placeholder="Enter target premium"
        />
      )}
      
      <RadioGroupField
        label="Option Type"
        value={optionDetails?.optionType || 'CE'}
        onChange={onOptionTypeChange}
        options={[
          { value: 'CE', label: 'Call (CE)' },
          { value: 'PE', label: 'Put (PE)' }
        ]}
        layout="horizontal"
      />
    </div>
  );
};

export default OptionsSettingsSection;
