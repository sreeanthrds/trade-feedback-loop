
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UnderlyingTypeSelectorProps {
  value: string;
  onChange: (value: 'index' | 'indexFuture' | 'stock') => void;
}

const UnderlyingTypeSelector: React.FC<UnderlyingTypeSelectorProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <Label htmlFor="underlying-select" className="text-sm font-medium">Underlying Type</Label>
      <Select
        value={value || ''}
        onValueChange={(val) => onChange(val as 'index' | 'indexFuture' | 'stock')}
      >
        <SelectTrigger id="underlying-select" className="mt-1">
          <SelectValue placeholder="Select underlying type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="index">Index</SelectItem>
          <SelectItem value="indexFuture">Index Future</SelectItem>
          <SelectItem value="stock">Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UnderlyingTypeSelector;
