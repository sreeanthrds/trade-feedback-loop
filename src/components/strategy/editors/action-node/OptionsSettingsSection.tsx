
import React from 'react';
import { RadioGroupField, SelectField, InputField } from '../shared';

interface OptionDetailsType {
  expiry?: string;
  strikeType?: 'ATM' | 'ITM1' | 'ITM2' | 'ITM3' | 'ITM4' | 'ITM5' | 'OTM1' | 'OTM2' | 'OTM3' | 'OTM4' | 'OTM5' | 'premium';
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
    { value: 'ITM1', label: 'In The Money 1 Strike (ITM1)' },
    { value: 'ITM2', label: 'In The Money 2 Strikes (ITM2)' },
    { value: 'ITM3', label: 'In The Money 3 Strikes (ITM3)' },
    { value: 'ITM4', label: 'In The Money 4 Strikes (ITM4)' },
    { value: 'ITM5', label: 'In The Money 5 Strikes (ITM5)' },
    { value: 'OTM1', label: 'Out The Money 1 Strike (OTM1)' },
    { value: 'OTM2', label: 'Out The Money 2 Strikes (OTM2)' },
    { value: 'OTM3', label: 'Out The Money 3 Strikes (OTM3)' },
    { value: 'OTM4', label: 'Out The Money 4 Strikes (OTM4)' },
    { value: 'OTM5', label: 'Out The Money 5 Strikes (OTM5)' },
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
