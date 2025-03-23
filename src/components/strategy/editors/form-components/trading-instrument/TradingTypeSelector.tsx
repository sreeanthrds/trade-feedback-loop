
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TradingInstrumentData } from './types';

interface TradingTypeSelectorProps {
  value: string;
  onChange: (value: 'stock' | 'futures' | 'options') => void;
}

const TradingTypeSelector: React.FC<TradingTypeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <Label className="text-sm font-medium">Trading Instrument Type</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as 'stock' | 'futures' | 'options')}
        className="flex flex-col space-y-1 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="stock" id="trading-stock" />
          <Label htmlFor="trading-stock" className="text-sm cursor-pointer">Stock</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="futures" id="trading-futures" />
          <Label htmlFor="trading-futures" className="text-sm cursor-pointer">Futures</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="options" id="trading-options" />
          <Label htmlFor="trading-options" className="text-sm cursor-pointer">Options</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default TradingTypeSelector;
