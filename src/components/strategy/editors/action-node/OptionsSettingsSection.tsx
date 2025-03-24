
import React, { useState, useEffect } from 'react';
import { RadioGroupField, SelectField, InputField } from '../shared';

interface OptionDetailsType {
  expiry?: string;
  strikeType?: 'ATM' | 'ITM1' | 'ITM2' | 'ITM3' | 'ITM4' | 'ITM5' | 'ITM6' | 'ITM7' | 'ITM8' | 'ITM9' | 'ITM10' | 'ITM11' | 'ITM12' | 'ITM13' | 'ITM14' | 'ITM15' | 'OTM1' | 'OTM2' | 'OTM3' | 'OTM4' | 'OTM5' | 'OTM6' | 'OTM7' | 'OTM8' | 'OTM9' | 'OTM10' | 'OTM11' | 'OTM12' | 'OTM13' | 'OTM14' | 'OTM15' | 'premium';
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
  const [strikeCategory, setStrikeCategory] = useState<'ATM' | 'ITM' | 'OTM' | 'premium'>('ATM');
  const [strikeDistance, setStrikeDistance] = useState<string>('');
  // Initialize with a default premium value of 100
  const [premiumValue, setPremiumValue] = useState<number>(
    optionDetails?.strikeType === 'premium' && optionDetails?.strikeValue 
    ? optionDetails.strikeValue 
    : 100
  );

  // When component mounts or optionDetails changes, set the initial strike category and distance
  useEffect(() => {
    if (optionDetails?.strikeType) {
      if (optionDetails.strikeType === 'ATM' || optionDetails.strikeType === 'premium') {
        setStrikeCategory(optionDetails.strikeType);
        setStrikeDistance('');
      } else if (optionDetails.strikeType.startsWith('ITM')) {
        setStrikeCategory('ITM');
        setStrikeDistance(optionDetails.strikeType);
      } else if (optionDetails.strikeType.startsWith('OTM')) {
        setStrikeCategory('OTM');
        setStrikeDistance(optionDetails.strikeType);
      }
    }
  }, [optionDetails?.strikeType]);

  // Handle changes to the strike category
  const handleStrikeCategoryChange = (value: string) => {
    setStrikeCategory(value as any);
    
    if (value === 'ATM') {
      // For ATM, directly update the strike type
      onStrikeTypeChange(value);
      setStrikeDistance('');
    } else if (value === 'premium') {
      // For premium, set the default premium value if not already set
      onStrikeTypeChange(value);
      if (!optionDetails?.strikeValue) {
        onStrikeValueChange({ target: { value: premiumValue.toString() } } as React.ChangeEvent<HTMLInputElement>);
      }
      setStrikeDistance('');
    } else if (value === 'ITM' || value === 'OTM') {
      // For ITM or OTM, set default to level 1 if not already set
      const newStrikeType = `${value}1`;
      onStrikeTypeChange(newStrikeType);
      setStrikeDistance(newStrikeType);
    }
  };

  // Handle changes to the strike distance
  const handleStrikeDistanceChange = (value: string) => {
    setStrikeDistance(value);
    onStrikeTypeChange(value);
  };

  // Handle premium value changes
  const handlePremiumValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setPremiumValue(value);
    onStrikeValueChange(e);
  };

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

  const strikeCategoryOptions = [
    { value: 'ATM', label: 'At The Money (ATM)' },
    { value: 'ITM', label: 'In The Money (ITM)' },
    { value: 'OTM', label: 'Out of The Money (OTM)' },
    { value: 'premium', label: 'Closest Premium' }
  ];

  // Generate options for ITM strike distances
  const generateStrikeDistanceOptions = () => {
    if (strikeCategory === 'ITM') {
      return Array.from({ length: 15 }, (_, i) => ({
        value: `ITM${i + 1}`,
        label: `${i + 1} Strike${i > 0 ? 's' : ''} ITM`
      }));
    } else if (strikeCategory === 'OTM') {
      return Array.from({ length: 15 }, (_, i) => ({
        value: `OTM${i + 1}`,
        label: `${i + 1} Strike${i > 0 ? 's' : ''} OTM`
      }));
    }
    return [];
  };

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
        id="strike-category"
        value={strikeCategory}
        onChange={handleStrikeCategoryChange}
        options={strikeCategoryOptions}
      />
      
      {(strikeCategory === 'ITM' || strikeCategory === 'OTM') && (
        <SelectField
          label={`${strikeCategory === 'ITM' ? 'ITM' : 'OTM'} Distance`}
          id="strike-distance"
          value={strikeDistance}
          onChange={handleStrikeDistanceChange}
          options={generateStrikeDistanceOptions()}
        />
      )}
      
      {strikeCategory === 'premium' && (
        <InputField
          label="Target Premium (₹)"
          id="premium-value"
          type="number"
          min={1}
          value={optionDetails?.strikeValue || premiumValue || 100}
          onChange={handlePremiumValueChange}
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
