
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import FieldTooltip from '../../../shared/FieldTooltip';

interface PositionIdSelectorProps {
  vpi: string;
  updateVPI: (value: string) => void;
  vpiOptions: string[];
}

const PositionIdSelector: React.FC<PositionIdSelectorProps> = ({
  vpi,
  updateVPI,
  vpiOptions
}) => {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <Label htmlFor="position-vpi" className="text-xs">Position ID</Label>
        <FieldTooltip content="Select a specific position by its unique identifier (VPI). Each position has a unique ID." />
      </div>
      <Select
        value={vpi || '_any'}
        onValueChange={updateVPI}
      >
        <SelectTrigger 
          id="position-vpi" 
          className="h-8 text-xs"
        >
          <SelectValue placeholder="Select Position ID" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_any">
            <div className="flex items-center gap-1">
              All Positions
              <FieldTooltip content="Apply this condition to all positions in the strategy" />
            </div>
          </SelectItem>
          {vpiOptions.map(vpi => (
            <SelectItem key={vpi} value={vpi}>
              {vpi}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PositionIdSelector;
