
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="expiry">Expiry</Label>
        <Select
          value={optionDetails?.expiry || ''}
          onValueChange={onExpiryChange}
        >
          <SelectTrigger id="expiry">
            <SelectValue placeholder="Select expiry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="W0">Current Week (W0)</SelectItem>
            <SelectItem value="W1">Next Week (W1)</SelectItem>
            <SelectItem value="M0">Current Month (M0)</SelectItem>
            <SelectItem value="M1">Next Month (M1)</SelectItem>
            <SelectItem value="Q0">Current Quarter (Q0)</SelectItem>
            <SelectItem value="Q1">Next Quarter (Q1)</SelectItem>
            <SelectItem value="Y0">Current Year (Y0)</SelectItem>
            <SelectItem value="Y1">Next Year (Y1)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="strike-type">Strike Selection</Label>
        <Select
          value={optionDetails?.strikeType || ''}
          onValueChange={onStrikeTypeChange}
        >
          <SelectTrigger id="strike-type">
            <SelectValue placeholder="Select strike type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ATM">At The Money (ATM)</SelectItem>
            <SelectItem value="ITM">In The Money (ITM)</SelectItem>
            <SelectItem value="OTM">Out The Money (OTM)</SelectItem>
            <SelectItem value="premium">By Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {optionDetails?.strikeType === 'premium' && (
        <div className="space-y-2">
          <Label htmlFor="premium-value">Target Premium (₹)</Label>
          <Input
            id="premium-value"
            type="number"
            min="1"
            value={optionDetails?.strikeValue || ''}
            onChange={onStrikeValueChange}
            placeholder="Enter target premium"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Option Type</Label>
        <RadioGroup 
          value={optionDetails?.optionType || 'CE'}
          onValueChange={onOptionTypeChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="CE" id="ce" />
            <Label htmlFor="ce" className="cursor-pointer">Call (CE)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PE" id="pe" />
            <Label htmlFor="pe" className="cursor-pointer">Put (PE)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default OptionsSettingsSection;
